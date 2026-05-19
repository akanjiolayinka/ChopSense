"""PostgreSQL + pgvector access.

Owns the async connection pool and exposes the queries the retrieval node uses
for combined structured filtering and vector similarity search.
"""

# import asyncpg


async def get_pool():
    # TODO: lazily build and cache an asyncpg pool against settings.database_url.
    return None


async def search_businesses(query_vector, filters, limit):
    # TODO: run the ivfflat ANN query with the given structured filters.
    return []
