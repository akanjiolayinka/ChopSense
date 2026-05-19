"""End-to-end data pipeline for the ChopSense restaurant catalogue.

Two acquisition modes are supported:

* ``huggingface``: pulls the ``yelp_review_full`` dataset from the Hub.
  That dataset only exposes review text + star rating, so users and
  businesses are synthesised deterministically from the row index.
* ``local``: streams the official Yelp Open Dataset JSON files line by
  line so multi-gigabyte inputs never have to fit in memory at once.

Both modes converge on three tidy DataFrames — reviews, businesses,
users — which are cleaned, filtered, and written out as Parquet ready
for the embedding step.
"""

from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import logging
import math
import os
import random
import sys
import time
import unicodedata
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Iterable, List, Optional, Tuple

import pandas as pd

LOGGER = logging.getLogger("chopsense.data")

RAW_DIR = Path("data/raw")
PROCESSED_DIR = Path("data/processed")
SAMPLE_DIR = PROCESSED_DIR / "sample"

MIN_USER_REVIEWS = 10
DEFAULT_SAMPLE_SIZE = 200

# Synthetic catalogue sizing for the HuggingFace path. Picked so each
# synthetic business and user accumulates a realistic review volume
# without producing absurdly long-tail distributions.
SYNTH_NUM_USERS = 5_000
SYNTH_NUM_BUSINESSES = 8_000

RESTAURANT_KEYWORDS = [
    "restaurant", "food", "cafe", "bar", "buka", "eatery", "grill",
    "kitchen", "dining", "bistro", "diner", "pizza", "burger", "sushi",
    "bakery", "dessert", "seafood", "steakhouse", "bbq",
]

# Pools used only when synthesising business metadata for the
# HuggingFace path. Real Yelp data already carries these fields.
SYNTH_CATEGORY_POOL = [
    "Restaurants, Nigerian",
    "Restaurants, Seafood",
    "Cafe, Coffee & Tea",
    "Bar, Lounge",
    "Buka, Local Food",
    "Grill, BBQ",
    "Pizza, Italian",
    "Burgers, American",
    "Sushi, Japanese",
    "Bakery, Desserts",
    "Steakhouse, Fine Dining",
    "Diner, Breakfast",
    "Bistro, European",
    "Fast Food",
    "Shopping, Retail",          # deliberate non-restaurant to exercise filtering
    "Auto Repair, Services",     # deliberate non-restaurant
]
SYNTH_CITY_POOL = [
    "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin City",
    "Kano", "Kaduna", "Enugu", "Uyo", "Calabar",
]
SYNTH_PRICE_RANGES = ["$", "$$", "$$$", "$$$$"]


@dataclass
class PipelineConfig:
    source: str = "huggingface"
    local_path: Path = RAW_DIR
    sample_size: int = DEFAULT_SAMPLE_SIZE
    min_user_reviews: int = MIN_USER_REVIEWS
    log_level: str = "INFO"


# ---------------------------------------------------------------------------
# Acquisition
# ---------------------------------------------------------------------------

def acquire_huggingface() -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Download yelp_review_full and synthesise users + businesses around it.

    The HuggingFace dataset only ships ``label`` + ``text``. We assign each
    review a stable synthetic ``user_id`` and ``business_id`` by hashing its
    row index, then aggregate to build the user and business tables. The
    hashing is deterministic so re-runs produce identical IDs.
    """
    try:
        from datasets import load_dataset
    except ImportError as exc:
        raise RuntimeError(
            "The 'datasets' package is required for --source huggingface. "
            "Install with: pip install datasets"
        ) from exc

    LOGGER.info("Loading yelp_review_full from HuggingFace…")
    started = time.time()
    dataset = load_dataset("yelp_review_full")

    frames = []
    for split_name, split in dataset.items():
        df = split.to_pandas()
        df["split"] = split_name
        frames.append(df)
    raw = pd.concat(frames, ignore_index=True)
    LOGGER.info("Downloaded %s reviews in %.1fs", len(raw), time.time() - started)

    raw["stars"] = raw["label"].astype(int) + 1
    raw["review_id"] = [f"r_{i}" for i in range(len(raw))]
    raw["user_id"] = [_synthetic_id("u", i, SYNTH_NUM_USERS) for i in range(len(raw))]
    raw["business_id"] = [_synthetic_id("b", i, SYNTH_NUM_BUSINESSES) for i in range(len(raw))]
    raw["date"] = _synthesise_dates(len(raw))

    reviews_df = raw[["review_id", "user_id", "business_id", "stars", "text", "date"]].copy()
    businesses_df = _synthesise_businesses(reviews_df)
    users_df = _aggregate_users(reviews_df)

    LOGGER.info(
        "Built raw frames: reviews=%s businesses=%s users=%s",
        len(reviews_df), len(businesses_df), len(users_df),
    )
    return reviews_df, businesses_df, users_df


def acquire_local(path: Path) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Stream the Yelp Open Dataset JSON files from ``path``.

    Yelp ships multi-gigabyte newline-delimited JSON. We iterate line by line
    so memory stays flat regardless of file size. Both ``.json`` and ``.json.gz``
    are accepted.
    """
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Local data path does not exist: {path}")

    review_path = _find_file(path, "review")
    business_path = _find_file(path, "business")
    user_path = _find_file(path, "user")

    LOGGER.info("Reading reviews from %s", review_path)
    reviews_df = _read_jsonl(
        review_path,
        columns=["review_id", "user_id", "business_id", "stars", "text", "date"],
    )

    LOGGER.info("Reading businesses from %s", business_path)
    businesses_df = _read_jsonl(
        business_path,
        columns=[
            "business_id", "name", "categories", "city", "state",
            "stars", "review_count", "attributes",
        ],
    )
    businesses_df["price_range"] = businesses_df.get("attributes", pd.Series(dtype=object)) \
        .apply(_extract_price_range)
    businesses_df.drop(columns=["attributes"], inplace=True, errors="ignore")

    LOGGER.info("Reading users from %s", user_path)
    users_df = _read_jsonl(
        user_path,
        columns=["user_id", "review_count", "average_stars"],
    )

    LOGGER.info(
        "Loaded raw frames: reviews=%s businesses=%s users=%s",
        len(reviews_df), len(businesses_df), len(users_df),
    )
    return reviews_df, businesses_df, users_df


def _find_file(directory: Path, kind: str) -> Path:
    candidates = list(directory.glob(f"*{kind}*.json*"))
    if not candidates:
        raise FileNotFoundError(
            f"No '{kind}' JSON file found in {directory}. "
            "Expected something like yelp_academic_dataset_review.json."
        )
    return candidates[0]


def _read_jsonl(path: Path, columns: List[str]) -> pd.DataFrame:
    opener = gzip.open if path.suffix == ".gz" else open
    rows: List[dict] = []
    with opener(path, "rt", encoding="utf-8") as handle:
        for line_no, line in enumerate(handle, start=1):
            line = line.strip()
            if not line:
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError as exc:
                LOGGER.warning("Skipping malformed line %s in %s: %s", line_no, path.name, exc)
                continue
            rows.append({col: record.get(col) for col in columns})
    return pd.DataFrame(rows, columns=columns)


def _extract_price_range(attributes) -> Optional[str]:
    if not isinstance(attributes, dict):
        return None
    price = attributes.get("RestaurantsPriceRange2")
    if price is None:
        return None
    try:
        return "$" * int(price)
    except (TypeError, ValueError):
        return None


def _synthetic_id(prefix: str, row_index: int, mod: int) -> str:
    digest = hashlib.md5(f"{prefix}:{row_index}".encode()).hexdigest()
    return f"{prefix}_{int(digest, 16) % mod}"


def _synthesise_dates(n: int) -> pd.Series:
    # Spread reviews across the last 5 years with a slight bias toward recent
    # months so the recency-weight curve has signal to work with.
    rng = random.Random(42)
    end = datetime.now(tz=timezone.utc)
    start = end - timedelta(days=5 * 365)
    span_seconds = (end - start).total_seconds()
    skewed = [rng.random() ** 0.7 for _ in range(n)]  # bias toward 1.0 (recent)
    dates = [start + timedelta(seconds=s * span_seconds) for s in skewed]
    return pd.to_datetime(dates, utc=True)


def _synthesise_businesses(reviews_df: pd.DataFrame) -> pd.DataFrame:
    rng = random.Random(7)
    aggregated = (
        reviews_df.groupby("business_id")
        .agg(stars=("stars", "mean"), review_count=("stars", "count"))
        .reset_index()
    )
    aggregated["name"] = [
        f"{rng.choice(SYNTH_CITY_POOL)} {rng.choice(['Kitchen', 'Bistro', 'Grill', 'Cafe', 'Eatery', 'Diner', 'Bar', 'House'])}"
        for _ in range(len(aggregated))
    ]
    aggregated["categories"] = [rng.choice(SYNTH_CATEGORY_POOL) for _ in range(len(aggregated))]
    aggregated["city"] = [rng.choice(SYNTH_CITY_POOL) for _ in range(len(aggregated))]
    aggregated["state"] = "NG"
    aggregated["price_range"] = [rng.choice(SYNTH_PRICE_RANGES) for _ in range(len(aggregated))]
    return aggregated[
        ["business_id", "name", "categories", "city", "state",
         "stars", "review_count", "price_range"]
    ]


def _aggregate_users(reviews_df: pd.DataFrame) -> pd.DataFrame:
    aggregated = (
        reviews_df.groupby("user_id")
        .agg(review_count=("stars", "count"), average_stars=("stars", "mean"))
        .reset_index()
    )
    return aggregated


# ---------------------------------------------------------------------------
# Cleaning
# ---------------------------------------------------------------------------

def clean_data(
    reviews_df: pd.DataFrame,
    businesses_df: pd.DataFrame,
    users_df: pd.DataFrame,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    LOGGER.info("Cleaning reviews (%s rows)…", len(reviews_df))
    reviews_df = reviews_df.copy()
    reviews_df["text"] = reviews_df["text"].astype(str).map(_normalise_text)
    reviews_df["stars"] = pd.to_numeric(reviews_df["stars"], errors="coerce").astype("Int64")
    reviews_df["date"] = pd.to_datetime(reviews_df["date"], utc=True, errors="coerce")
    reviews_df["word_count"] = reviews_df["text"].str.split().map(len)
    reviews_df["recency_weight"] = _recency_weight(reviews_df["date"])

    LOGGER.info("Cleaning businesses (%s rows)…", len(businesses_df))
    businesses_df = businesses_df.copy()
    businesses_df["categories"] = businesses_df["categories"].fillna("").astype(str)
    businesses_df["is_restaurant"] = businesses_df["categories"].map(is_restaurant)

    LOGGER.info("Cleaning users (%s rows)…", len(users_df))
    users_df = users_df.copy()
    users_df["average_stars"] = pd.to_numeric(users_df["average_stars"], errors="coerce")
    users_df["rating_strictness"] = users_df["average_stars"].map(_rating_strictness)

    return reviews_df, businesses_df, users_df


def _normalise_text(text: str) -> str:
    if text is None:
        return ""
    normalised = unicodedata.normalize("NFKC", text)
    return " ".join(normalised.split()).strip()


def _recency_weight(dates: pd.Series) -> pd.Series:
    # Reviews inside the last 6 months get full weight; older reviews decay
    # exponentially toward a floor of 0.3 so very old reviews still inform
    # the model rather than being silently discarded.
    if dates.isna().all():
        return pd.Series([1.0] * len(dates), index=dates.index)
    now = datetime.now(tz=timezone.utc)
    fresh_window_days = 180
    half_life_days = 365.0
    floor = 0.3

    def weight(ts):
        if pd.isna(ts):
            return floor
        age_days = max((now - ts.to_pydatetime()).days, 0)
        if age_days <= fresh_window_days:
            return 1.0
        decay = math.exp(-math.log(2) * (age_days - fresh_window_days) / half_life_days)
        return max(floor, decay)

    return dates.map(weight)


def _rating_strictness(average: float) -> str:
    if pd.isna(average):
        return "moderate"
    if average < 3.0:
        return "strict"
    if average > 4.0:
        return "generous"
    return "moderate"


def is_restaurant(categories: str) -> bool:
    if not categories:
        return False
    lowered = categories.lower()
    return any(keyword in lowered for keyword in RESTAURANT_KEYWORDS)


# ---------------------------------------------------------------------------
# Filtering
# ---------------------------------------------------------------------------

def filter_data(
    reviews_df: pd.DataFrame,
    businesses_df: pd.DataFrame,
    users_df: pd.DataFrame,
    min_user_reviews: int = MIN_USER_REVIEWS,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    LOGGER.info("Filtering pipeline starting with %s reviews", len(reviews_df))

    restaurants = businesses_df[businesses_df["is_restaurant"]].copy()
    LOGGER.info(
        "Restaurant filter: kept %s of %s businesses (-%s)",
        len(restaurants), len(businesses_df), len(businesses_df) - len(restaurants),
    )

    # Recompute review_count from the actual reviews frame rather than trusting
    # whatever was on the user metadata — Yelp's user.json sometimes drifts from
    # the review file, and the HuggingFace path has nothing to trust.
    actual_counts = reviews_df["user_id"].value_counts()
    users_df = users_df.copy()
    users_df["review_count"] = users_df["user_id"].map(actual_counts).fillna(0).astype(int)
    active_users = users_df[users_df["review_count"] >= min_user_reviews].copy()
    LOGGER.info(
        "Active-user filter (>=%s reviews): kept %s of %s users (-%s)",
        min_user_reviews, len(active_users), len(users_df), len(users_df) - len(active_users),
    )

    before = len(reviews_df)
    reviews_df = reviews_df[
        reviews_df["business_id"].isin(restaurants["business_id"])
        & reviews_df["user_id"].isin(active_users["user_id"])
    ]
    LOGGER.info(
        "Membership filter: kept %s of %s reviews (-%s)",
        len(reviews_df), before, before - len(reviews_df),
    )

    before = len(reviews_df)
    text_ok = reviews_df["text"].astype(str).str.strip().astype(bool)
    reviews_df = reviews_df[text_ok]
    LOGGER.info(
        "Empty-text filter: kept %s of %s reviews (-%s)",
        len(reviews_df), before, before - len(reviews_df),
    )

    before = len(reviews_df)
    reviews_df = reviews_df.drop_duplicates(subset=["user_id", "business_id"], keep="first")
    LOGGER.info(
        "Duplicate-pair filter: kept %s of %s reviews (-%s)",
        len(reviews_df), before, before - len(reviews_df),
    )

    before = len(reviews_df)
    reviews_df = reviews_df[(reviews_df["stars"] >= 1) & (reviews_df["stars"] <= 5)]
    LOGGER.info(
        "Star-range filter: kept %s of %s reviews (-%s)",
        len(reviews_df), before, before - len(reviews_df),
    )

    # Drop businesses and users that lost all their reviews so downstream
    # joins don't ship orphans.
    surviving_business_ids = set(reviews_df["business_id"].unique())
    surviving_user_ids = set(reviews_df["user_id"].unique())
    restaurants = restaurants[restaurants["business_id"].isin(surviving_business_ids)]
    active_users = active_users[active_users["user_id"].isin(surviving_user_ids)]

    LOGGER.info(
        "Filtering complete: reviews=%s businesses=%s users=%s",
        len(reviews_df), len(restaurants), len(active_users),
    )
    return reviews_df, restaurants, active_users


# ---------------------------------------------------------------------------
# Persistence
# ---------------------------------------------------------------------------

def save_outputs(
    reviews_df: pd.DataFrame,
    businesses_df: pd.DataFrame,
    users_df: pd.DataFrame,
    out_dir: Path = PROCESSED_DIR,
) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    paths = {
        "reviews.parquet": reviews_df,
        "businesses.parquet": businesses_df,
        "users.parquet": users_df,
    }
    for name, df in paths.items():
        full_path = out_dir / name
        df.to_parquet(full_path, index=False)
        size_mb = full_path.stat().st_size / (1024 * 1024)
        LOGGER.info("Saved %s — %s rows, %.2f MB", full_path, len(df), size_mb)


def generate_sample(
    reviews_df: pd.DataFrame,
    businesses_df: pd.DataFrame,
    users_df: pd.DataFrame,
    size: int = DEFAULT_SAMPLE_SIZE,
    out_dir: Path = SAMPLE_DIR,
) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    top_users = users_df.sort_values("review_count", ascending=False).head(size)
    sample_reviews = reviews_df[reviews_df["user_id"].isin(top_users["user_id"])]
    sample_businesses = businesses_df[
        businesses_df["business_id"].isin(sample_reviews["business_id"])
    ]

    outputs = {
        "sample_reviews.parquet": sample_reviews,
        "sample_businesses.parquet": sample_businesses,
        "sample_users.parquet": top_users,
    }
    for name, df in outputs.items():
        full_path = out_dir / name
        df.to_parquet(full_path, index=False)
        size_mb = full_path.stat().st_size / (1024 * 1024)
        LOGGER.info("Saved %s — %s rows, %.2f MB", full_path, len(df), size_mb)


# ---------------------------------------------------------------------------
# Stats
# ---------------------------------------------------------------------------

def compute_stats(processed_dir: Path = PROCESSED_DIR) -> dict:
    reviews_df = pd.read_parquet(processed_dir / "reviews.parquet")
    businesses_df = pd.read_parquet(processed_dir / "businesses.parquet")
    users_df = pd.read_parquet(processed_dir / "users.parquet")

    stats = {
        "users_total": len(users_df),
        "businesses_total": len(businesses_df),
        "reviews_total": len(reviews_df),
        "rating_distribution": reviews_df["stars"].value_counts().sort_index().to_dict(),
        "average_review_length_words": float(reviews_df["word_count"].mean()),
        "average_reviews_per_user": float(reviews_df.groupby("user_id").size().mean()),
        "top_business_categories": (
            businesses_df["categories"].value_counts().head(10).to_dict()
        ),
    }
    return stats


def print_stats(stats: dict) -> None:
    print()
    print("=" * 60)
    print("ChopSense data pipeline — statistics")
    print("=" * 60)
    print(f"Users:        {stats['users_total']:>10,}")
    print(f"Businesses:   {stats['businesses_total']:>10,}")
    print(f"Reviews:      {stats['reviews_total']:>10,}")
    print(f"Avg review length (words): {stats['average_review_length_words']:.1f}")
    print(f"Avg reviews per user:      {stats['average_reviews_per_user']:.1f}")
    print()
    print("Rating distribution:")
    for stars, count in stats["rating_distribution"].items():
        print(f"  {stars} stars: {count:,}")
    print()
    print("Top 10 business categories:")
    for category, count in stats["top_business_categories"].items():
        print(f"  {count:>6,}  {category}")
    print()


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def configure_logging(level: str = "INFO") -> None:
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s  %(levelname)-7s  %(name)s  %(message)s",
        stream=sys.stdout,
    )


def run_pipeline(config: PipelineConfig) -> None:
    if config.source == "huggingface":
        reviews_df, businesses_df, users_df = acquire_huggingface()
    elif config.source == "local":
        reviews_df, businesses_df, users_df = acquire_local(config.local_path)
    else:
        raise ValueError(f"Unknown source: {config.source}")

    reviews_df, businesses_df, users_df = clean_data(reviews_df, businesses_df, users_df)
    reviews_df, businesses_df, users_df = filter_data(
        reviews_df, businesses_df, users_df, min_user_reviews=config.min_user_reviews
    )
    save_outputs(reviews_df, businesses_df, users_df)
    generate_sample(reviews_df, businesses_df, users_df, size=config.sample_size)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="ChopSense data pipeline.")
    parser.add_argument("--source", choices=["huggingface", "local"], default="huggingface")
    parser.add_argument("--path", default=str(RAW_DIR), help="Local raw data directory")
    parser.add_argument("--process", action="store_true",
                        help="Clean + filter + save (assumes raw frames already acquired)")
    parser.add_argument("--sample", action="store_true", help="Generate the sample subset")
    parser.add_argument("--size", type=int, default=DEFAULT_SAMPLE_SIZE,
                        help="Number of top users to include in the sample")
    parser.add_argument("--all", action="store_true",
                        help="Run acquire → clean → filter → save → sample")
    parser.add_argument("--stats", action="store_true",
                        help="Print statistics from the processed outputs")
    parser.add_argument("--min-user-reviews", type=int, default=MIN_USER_REVIEWS)
    parser.add_argument("--log-level", default="INFO")
    return parser


def main(argv: Optional[List[str]] = None) -> int:
    args = build_parser().parse_args(argv)
    configure_logging(args.log_level)

    config = PipelineConfig(
        source=args.source,
        local_path=Path(args.path),
        sample_size=args.size,
        min_user_reviews=args.min_user_reviews,
        log_level=args.log_level,
    )

    started = time.time()
    try:
        if args.stats:
            print_stats(compute_stats())
            return 0

        if args.all or (not args.process and not args.sample):
            run_pipeline(config)
        elif args.process:
            # Process expects already-saved raw frames in PROCESSED_DIR — we
            # re-read, clean, filter, and re-save. Useful when iterating on
            # cleaning rules without re-downloading.
            reviews_df = pd.read_parquet(PROCESSED_DIR / "reviews.parquet")
            businesses_df = pd.read_parquet(PROCESSED_DIR / "businesses.parquet")
            users_df = pd.read_parquet(PROCESSED_DIR / "users.parquet")
            reviews_df, businesses_df, users_df = clean_data(reviews_df, businesses_df, users_df)
            reviews_df, businesses_df, users_df = filter_data(
                reviews_df, businesses_df, users_df, min_user_reviews=config.min_user_reviews
            )
            save_outputs(reviews_df, businesses_df, users_df)

        if args.sample and not args.all:
            reviews_df = pd.read_parquet(PROCESSED_DIR / "reviews.parquet")
            businesses_df = pd.read_parquet(PROCESSED_DIR / "businesses.parquet")
            users_df = pd.read_parquet(PROCESSED_DIR / "users.parquet")
            generate_sample(reviews_df, businesses_df, users_df, size=config.sample_size)

    except Exception:
        LOGGER.exception("Pipeline failed")
        return 1

    LOGGER.info("Pipeline finished in %.1fs", time.time() - started)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
