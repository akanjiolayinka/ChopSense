"""Stage 2 cross-encoder re-ranking.

Re-evaluates the candidates from Stage 1 as user-restaurant pairs to catch
context fit that bi-encoder retrieval misses.
"""


def rerank(state):
    # TODO: score (persona, candidate) pairs with the cross-encoder, keep top-N.
    return state
