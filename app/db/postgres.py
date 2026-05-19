"""PostgreSQL + pgvector access layer.

Owns the asyncpg connection pool and exposes the queries the retrieval node
and embedding script rely on. Vectors are always serialised as pgvector
literals (``'[0.1,0.2,...]'``) because asyncpg has no native binding for the
``vector`` type without a custom codec.
"""

from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple

import asyncpg

from app.config import settings

LOGGER = logging.getLogger("chopsense.db")

_pool: Optional[asyncpg.Pool] = None

ALLOWED_CITY_PATTERN = None  # reserved for future sanitisation

# Keep WHERE-clause keys explicit so callers can't accidentally smuggle
# arbitrary SQL fragments into the filter map.
_FILTER_BUILDERS = {
    "city": lambda value, idx: (f"city ILIKE ${idx}", value),
    "price_range": lambda value, idx: (f"price_range = ${idx}", value),
    "min_rating": lambda value, idx: (f"rating >= ${idx}", float(value)),
    "state": lambda value, idx: (f"state = ${idx}", value),
}


async def init_pool(dsn: Optional[str] = None, min_size: int = 1, max_size: int = 10) -> asyncpg.Pool:
    global _pool
    if _pool is not None:
        return _pool

    dsn = dsn or settings.database_url
    LOGGER.info("Opening asyncpg pool against %s", _redact(dsn))
    try:
        _pool = await asyncpg.create_pool(dsn=dsn, min_size=min_size, max_size=max_size)
    except Exception:
        LOGGER.exception("Failed to create asyncpg pool")
        raise
    return _pool


async def close_pool() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None
        LOGGER.info("Closed asyncpg pool")


def _redact(dsn: str) -> str:
    # Strip passwords from any DSN we log.
    if "@" not in dsn:
        return dsn
    head, tail = dsn.split("@", 1)
    if ":" in head:
        scheme_user, _ = head.rsplit(":", 1)
        return f"{scheme_user}:***@{tail}"
    return dsn


def _vector_literal(vector: Sequence[float]) -> str:
    return "[" + ",".join(f"{float(x):.7f}" for x in vector) + "]"


async def ensure_schema(pool: Optional[asyncpg.Pool] = None,
                        migration_sql: Optional[str] = None) -> None:
    """Run the initial migration if the businesses table is missing.

    Idempotent — re-running on a populated database is a no-op.
    """
    pool = pool or await init_pool()
    if migration_sql is None:
        from pathlib import Path
        migration_path = Path(__file__).parent / "migrations" / "001_initial.sql"
        migration_sql = migration_path.read_text(encoding="utf-8")

    async with pool.acquire() as conn:
        exists = await conn.fetchval(
            "SELECT EXISTS (SELECT 1 FROM information_schema.tables "
            "WHERE table_name = 'businesses')"
        )
        if exists:
            LOGGER.debug("Schema already in place — skipping migration")
            return
        LOGGER.info("Applying 001_initial.sql")
        await conn.execute(migration_sql)


async def upsert_business(business: Dict[str, Any], embedding: Sequence[float],
                          pool: Optional[asyncpg.Pool] = None) -> None:
    pool = pool or await init_pool()
    async with pool.acquire() as conn:
        try:
            await conn.execute(_UPSERT_ONE_SQL, *_upsert_row(business, embedding))
        except Exception:
            LOGGER.exception("Upsert failed for business %s", business.get("business_id"))
            raise


async def upsert_businesses(businesses: Sequence[Dict[str, Any]],
                            embeddings: Sequence[Sequence[float]],
                            pool: Optional[asyncpg.Pool] = None) -> int:
    if len(businesses) != len(embeddings):
        raise ValueError("businesses and embeddings must be the same length")
    if not businesses:
        return 0

    pool = pool or await init_pool()
    rows = [_upsert_row(b, e) for b, e in zip(businesses, embeddings)]
    started = time.time()
    async with pool.acquire() as conn:
        async with conn.transaction():
            try:
                await conn.executemany(_UPSERT_ONE_SQL, rows)
            except Exception:
                LOGGER.exception("Batch upsert of %s businesses failed", len(rows))
                raise

    LOGGER.info("Upserted %s businesses in %.2fs", len(rows), time.time() - started)
    return len(rows)


async def get_business(business_id: str,
                       pool: Optional[asyncpg.Pool] = None) -> Optional[Dict[str, Any]]:
    pool = pool or await init_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, name, category, address, city, state, latitude, longitude, "
            "price_range, rating, review_count, description "
            "FROM businesses WHERE id = $1",
            business_id,
        )
    return dict(row) if row else None


async def count_businesses(pool: Optional[asyncpg.Pool] = None) -> int:
    pool = pool or await init_pool()
    async with pool.acquire() as conn:
        return await conn.fetchval(
            "SELECT COUNT(*) FROM businesses WHERE embedding IS NOT NULL"
        )


async def clear_businesses(pool: Optional[asyncpg.Pool] = None) -> int:
    pool = pool or await init_pool()
    async with pool.acquire() as conn:
        result = await conn.execute("DELETE FROM businesses")
    # asyncpg returns "DELETE <n>"
    return int(result.split()[-1]) if result else 0


async def similarity_search(
    query_embedding: Sequence[float],
    top_k: int = 50,
    filters: Optional[Dict[str, Any]] = None,
    pool: Optional[asyncpg.Pool] = None,
) -> List[Dict[str, Any]]:
    """Top-K cosine similarity search with structured filters applied first.

    The filters land in the WHERE clause so pgvector only ranks rows that
    already match the structural constraints — running ANN over the full
    catalogue and post-filtering is significantly less accurate.
    """
    pool = pool or await init_pool()

    where_clauses, params = _build_where_clauses(filters or {})
    vector_literal = _vector_literal(query_embedding)
    # Always pass the vector and limit as parameters too.
    vector_param_index = len(params) + 1
    limit_param_index = len(params) + 2
    params.extend([vector_literal, int(top_k)])

    where_sql = ""
    if where_clauses:
        where_sql = "WHERE " + " AND ".join(where_clauses)

    sql = (
        "SELECT id, name, category, address, city, state, latitude, longitude, "
        "price_range, rating, review_count, description, "
        f"1 - (embedding <=> ${vector_param_index}::vector) AS similarity "
        "FROM businesses "
        f"{where_sql} "
        f"ORDER BY embedding <=> ${vector_param_index}::vector "
        f"LIMIT ${limit_param_index}"
    )

    started = time.time()
    async with pool.acquire() as conn:
        try:
            rows = await conn.fetch(sql, *params)
        except Exception:
            LOGGER.exception("Similarity search failed (filters=%s)", filters)
            raise
    LOGGER.info(
        "Similarity search returned %s rows in %.2fs (top_k=%s, filters=%s)",
        len(rows), time.time() - started, top_k, filters,
    )
    return [dict(row) for row in rows]


def _build_where_clauses(filters: Dict[str, Any]) -> Tuple[List[str], List[Any]]:
    clauses: List[str] = []
    params: List[Any] = []
    for key, value in filters.items():
        if value in (None, "", []):
            continue
        builder = _FILTER_BUILDERS.get(key)
        if builder is None:
            LOGGER.warning("Ignoring unknown filter '%s'", key)
            continue
        sql_fragment, bound_value = builder(value, len(params) + 1)
        clauses.append(sql_fragment)
        params.append(bound_value)
    return clauses, params


def _upsert_row(business: Dict[str, Any], embedding: Sequence[float]) -> Tuple:
    return (
        str(business["business_id"]),
        business.get("name"),
        business.get("categories"),
        business.get("address"),
        business.get("city"),
        business.get("state"),
        _coerce_float(business.get("latitude")),
        _coerce_float(business.get("longitude")),
        _coerce_price(business.get("price_range")),
        _coerce_float(business.get("stars") or business.get("rating")),
        _coerce_int(business.get("review_count")),
        business.get("description") or business.get("categories"),
        _vector_literal(embedding),
    )


def _coerce_float(value) -> Optional[float]:
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _coerce_int(value) -> Optional[int]:
    if value is None or value == "":
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _coerce_price(value) -> Optional[int]:
    # Schema stores price_range as a SMALLINT (number of $ signs).
    if value is None or value == "":
        return None
    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return None
        if all(ch == "$" for ch in stripped):
            return len(stripped)
        try:
            return int(stripped)
        except ValueError:
            return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


_UPSERT_ONE_SQL = """
INSERT INTO businesses (
    id, name, category, address, city, state, latitude, longitude,
    price_range, rating, review_count, description, embedding, updated_at
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::vector, NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    price_range = EXCLUDED.price_range,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    description = EXCLUDED.description,
    embedding = EXCLUDED.embedding,
    updated_at = NOW();
"""
