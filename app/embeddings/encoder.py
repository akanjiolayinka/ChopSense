"""Sentence-transformer wrapper used for business and query embeddings.

The model itself is held by a module-level singleton — loading the weights
once costs ~500 ms and we want to amortise that across every request.
"""

from __future__ import annotations

import logging
import time
from typing import Iterable, List, Optional, Sequence

from app.config import settings

LOGGER = logging.getLogger("chopsense.embeddings")

_encoder_singleton: Optional["RestaurantEncoder"] = None


def _inference_mode():
    """Disable gradient tracking when torch is available.

    Sentence-transformers can technically run forward passes without ``no_grad``,
    but enabling it cuts memory and latency by skipping autograd bookkeeping.
    """
    try:
        import torch
    except ImportError:
        from contextlib import nullcontext
        return nullcontext()
    return torch.no_grad()


class RestaurantEncoder:
    """Builds rich business text and embeds it (or queries) into 768-d vectors."""

    def __init__(self, model_name: Optional[str] = None, device: Optional[str] = None):
        self.model_name = model_name or settings.embedding_model
        self.embedding_dim = settings.embedding_dim
        self.device = device
        self._model = None

    def _load_model(self):
        if self._model is not None:
            return self._model

        # Imported lazily so the rest of the application — including the
        # tests that mock this class out — doesn't pay the heavy import cost.
        from sentence_transformers import SentenceTransformer

        started = time.time()
        LOGGER.info("Loading sentence transformer '%s'…", self.model_name)
        self._model = SentenceTransformer(self.model_name, device=self.device)
        LOGGER.info(
            "Loaded '%s' in %.2fs (embedding dim=%s)",
            self.model_name, time.time() - started, self.embedding_dim,
        )
        return self._model

    def build_business_text(self, business: dict) -> str:
        """Turn a business row into the descriptive sentence we embed.

        We embed a sentence — not just the name — because the bi-encoder gives
        much better semantic matches when the input describes what the spot is
        like in plain language.
        """
        name = (business.get("name") or "Unknown spot").strip()
        categories = (business.get("categories") or "").strip()
        city = (business.get("city") or "").strip()
        price = (business.get("price_range") or "").strip()
        rating = business.get("stars") or business.get("rating")
        review_count = business.get("review_count") or 0

        parts = [f"{name} is a"]
        if categories:
            parts.append(f"{categories.lower()} spot")
        else:
            parts.append("restaurant")
        if city:
            parts.append(f"in {city}")
        if price:
            parts.append(f"priced {price}")
        if rating is not None:
            try:
                parts.append(f"rated {float(rating):.1f} stars")
            except (TypeError, ValueError):
                pass
        if review_count:
            parts.append(f"from {int(review_count)} reviews")

        return " ".join(parts).strip().rstrip(".") + "."

    def embed_text(self, text: str) -> List[float]:
        model = self._load_model()
        try:
            with _inference_mode():
                vector = model.encode(text, normalize_embeddings=True)
        except Exception:
            LOGGER.exception("Failed to embed text")
            raise
        return [float(x) for x in vector]

    def embed_batch(self, texts: Sequence[str], batch_size: int = 32) -> List[List[float]]:
        model = self._load_model()
        if not texts:
            return []

        started = time.time()
        try:
            with _inference_mode():
                vectors = model.encode(
                    list(texts),
                    batch_size=batch_size,
                    normalize_embeddings=True,
                    show_progress_bar=False,
                )
        except Exception:
            LOGGER.exception("Failed to embed batch of %s texts", len(texts))
            raise

        elapsed = max(time.time() - started, 1e-6)
        LOGGER.info(
            "Embedded %s texts in %.2fs (%.0f texts/sec)",
            len(texts), elapsed, len(texts) / elapsed,
        )
        return [[float(x) for x in v] for v in vectors]

    def embed_businesses(self, businesses: Iterable[dict],
                         batch_size: int = 32) -> List[List[float]]:
        texts = [self.build_business_text(b) for b in businesses]
        return self.embed_batch(texts, batch_size=batch_size)


def get_encoder() -> RestaurantEncoder:
    """Return the process-wide singleton, constructing it on first call."""
    global _encoder_singleton
    if _encoder_singleton is None:
        _encoder_singleton = RestaurantEncoder()
    return _encoder_singleton


def reset_encoder() -> None:
    """Drop the cached encoder — used by tests that monkey-patch the class."""
    global _encoder_singleton
    _encoder_singleton = None
