"""One-time offline script that embeds the business catalogue into pgvector.

Reads processed businesses from Parquet, filters to restaurants only, loads
the sentence transformer once, and upserts each business with its 768-d
embedding into PostgreSQL. Safe to re-run thanks to ``ON CONFLICT DO UPDATE``.

Usage::

    python -m scripts.embed_businesses
    python -m scripts.embed_businesses --limit 500
    python -m scripts.embed_businesses --verify
    python -m scripts.embed_businesses --clear
"""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
import time
from pathlib import Path
from typing import List, Sequence

import pandas as pd

from app.config import settings
from app.db.postgres import (
    clear_businesses,
    close_pool,
    count_businesses,
    ensure_schema,
    init_pool,
    upsert_businesses,
)
from app.embeddings.encoder import get_encoder

LOGGER = logging.getLogger("chopsense.embed")

DEFAULT_BUSINESSES_PATH = Path(settings.data_processed_dir) / "businesses.parquet"
BATCH_SIZE = 64
PROGRESS_INTERVAL = 100


def load_restaurant_businesses(path: Path, limit: int | None = None) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(
            f"Processed businesses Parquet not found at {path}. "
            "Run `python -m data.pipeline --all` first."
        )

    df = pd.read_parquet(path)
    if "is_restaurant" in df.columns:
        df = df[df["is_restaurant"].astype(bool)]
    LOGGER.info("Loaded %s restaurant businesses from %s", len(df), path)

    if limit is not None and limit > 0:
        df = df.head(limit)
        LOGGER.info("Limiting to first %s businesses for this run", len(df))
    return df.reset_index(drop=True)


async def embed_and_upsert(df: pd.DataFrame, batch_size: int = BATCH_SIZE) -> int:
    encoder = get_encoder()
    pool = await init_pool()
    await ensure_schema(pool)

    total = len(df)
    if total == 0:
        LOGGER.warning("No businesses to embed — exiting.")
        return 0

    done = 0
    started = time.time()
    for batch_start in range(0, total, batch_size):
        batch = df.iloc[batch_start:batch_start + batch_size]
        records = batch.to_dict(orient="records")
        embeddings = encoder.embed_batch(
            [encoder.build_business_text(r) for r in records]
        )
        await upsert_businesses(records, embeddings, pool=pool)
        done += len(records)

        if done % PROGRESS_INTERVAL == 0 or done == total or batch_start == 0:
            _log_progress(done, total, started)

    LOGGER.info("Embedded and upserted %s businesses in %.1fs",
                done, time.time() - started)
    return done


def _log_progress(done: int, total: int, started: float) -> None:
    elapsed = max(time.time() - started, 1e-6)
    rate = done / elapsed
    remaining = max(total - done, 0)
    eta = remaining / rate if rate > 0 else float("inf")
    LOGGER.info(
        "Progress: %s/%s done, %s remaining, %.1f businesses/sec, ETA %.1fs",
        done, total, remaining, rate, eta,
    )


async def verify(expected_min: int | None = None) -> int:
    await init_pool()
    count = await count_businesses()
    LOGGER.info("Database currently holds %s embedded businesses", count)
    if expected_min is not None and count < expected_min:
        LOGGER.warning("Expected at least %s embedded rows, found %s",
                       expected_min, count)
    return count


async def clear_and_reembed(df: pd.DataFrame) -> int:
    pool = await init_pool()
    await ensure_schema(pool)
    deleted = await clear_businesses(pool)
    LOGGER.info("Cleared %s existing business rows", deleted)
    return await embed_and_upsert(df)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Embed businesses into pgvector.")
    parser.add_argument("--path", default=str(DEFAULT_BUSINESSES_PATH),
                        help="Parquet file of processed businesses")
    parser.add_argument("--limit", type=int, default=None,
                        help="Embed only the first N businesses (for smoke tests)")
    parser.add_argument("--verify", action="store_true",
                        help="Print current embedded business count and exit")
    parser.add_argument("--clear", action="store_true",
                        help="Delete all business rows before re-embedding")
    parser.add_argument("--batch-size", type=int, default=BATCH_SIZE)
    parser.add_argument("--log-level", default="INFO")
    return parser


def configure_logging(level: str) -> None:
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s  %(levelname)-7s  %(name)s  %(message)s",
        stream=sys.stdout,
    )


async def _main(args) -> int:
    if args.verify:
        await verify()
        return 0

    df = load_restaurant_businesses(Path(args.path), limit=args.limit)
    if args.clear:
        await clear_and_reembed(df)
    else:
        await embed_and_upsert(df, batch_size=args.batch_size)

    await verify()
    return 0


def main(argv: List[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    configure_logging(args.log_level)
    try:
        return asyncio.run(_run(args))
    except KeyboardInterrupt:
        LOGGER.warning("Interrupted by user")
        return 130


async def _run(args) -> int:
    try:
        return await _main(args)
    finally:
        await close_pool()


if __name__ == "__main__":
    raise SystemExit(main())
