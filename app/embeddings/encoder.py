"""Sentence-transformer and cross-encoder wrappers.

Loading the models is expensive, so callers should reuse the singletons
returned by these helpers rather than re-instantiating per request.
"""

# from sentence_transformers import SentenceTransformer, CrossEncoder


def get_embedder():
    # TODO: lazy-load and cache the bi-encoder for query/business embedding.
    return None


def get_reranker():
    # TODO: lazy-load and cache the cross-encoder for Stage 2 re-ranking.
    return None


def encode(texts):
    # TODO: return 768-dim embeddings for the given text(s).
    return []
