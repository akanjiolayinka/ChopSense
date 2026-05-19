"""Stage 1 candidate retrieval using pgvector approximate nearest neighbour.

This node turns the user's persona into a natural-language query, embeds it,
runs a filtered cosine-similarity search, and hangs the resulting candidates
off the agent state. Re-ranking happens in the next node.
"""

from __future__ import annotations

import logging
import time
from typing import Any, Dict, List, Optional

from app.agent.state import AgentState, RestaurantCandidate, UserPersona
from app.config import settings
from app.db.postgres import similarity_search
from app.embeddings.encoder import get_encoder

LOGGER = logging.getLogger("chopsense.agent.retrieve")


def build_query_text(persona: UserPersona) -> str:
    """Compose a sentence that captures what the user is asking for.

    The bi-encoder works best on full natural-language input, so we stitch
    the persona fields into one sentence rather than feeding it raw fields.
    """
    parts: List[str] = []
    if persona.mood:
        parts.append(f"I'm in the mood for {persona.mood}")
    if persona.occasion:
        parts.append(f"for a {persona.occasion}")
    if persona.cuisine_preferences:
        parts.append("craving " + ", ".join(persona.cuisine_preferences))
    if persona.location:
        parts.append(f"in {persona.location}")
    elif persona.city:
        parts.append(f"in {persona.city}")
    if persona.group_size:
        parts.append(f"for a group of {persona.group_size}")
    if persona.budget_ngn:
        parts.append(f"with a budget of around {persona.budget_ngn} naira")
    if persona.dietary_restrictions:
        parts.append("dietary needs: " + ", ".join(persona.dietary_restrictions))
    if not parts and persona.raw_message:
        return persona.raw_message

    return ". ".join(parts) + "."


def build_filters(persona: UserPersona) -> Dict[str, Any]:
    filters: Dict[str, Any] = {}
    if persona.city:
        filters["city"] = persona.city
    if persona.price_range:
        filters["price_range"] = persona.price_range
    return filters


async def retrieve(state: AgentState,
                   top_k: Optional[int] = None) -> AgentState:
    top_k = top_k or settings.retrieval_top_k
    query = build_query_text(state.user_persona)
    filters = build_filters(state.user_persona)

    LOGGER.info(
        "Retrieving candidates (top_k=%s, filters=%s, query=%r)",
        top_k, filters, query,
    )

    encoder = get_encoder()
    embedding = encoder.embed_text(query)

    started = time.time()
    rows = await similarity_search(embedding, top_k=top_k, filters=filters)
    LOGGER.info("Retrieved %s candidates in %.2fs", len(rows), time.time() - started)

    state.candidates = [_row_to_candidate(row) for row in rows]
    return state


def _row_to_candidate(row: Dict[str, Any]) -> RestaurantCandidate:
    price_range = row.get("price_range")
    if isinstance(price_range, int):
        price_range = "$" * price_range
    return RestaurantCandidate(
        business_id=str(row.get("id") or row.get("business_id")),
        name=row.get("name") or "Unknown",
        categories=row.get("category") or row.get("categories"),
        city=row.get("city"),
        state=row.get("state"),
        address=row.get("address"),
        latitude=row.get("latitude"),
        longitude=row.get("longitude"),
        price_range=price_range,
        rating=row.get("rating"),
        review_count=row.get("review_count"),
        description=row.get("description"),
        similarity_score=float(row.get("similarity") or 0.0),
    )
