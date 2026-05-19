"""Tests for the data pipeline.

This file is named test_retrieval.py to match the project structure agreed
in Step 1; the actual pgvector retrieval tests will be added once that node
is implemented.
"""

from datetime import datetime, timezone

import pandas as pd
import pytest

from data import pipeline


def _mock_reviews(rows):
    return pd.DataFrame(rows)


def _mock_businesses(rows):
    df = pd.DataFrame(rows)
    df["categories"] = df["categories"].fillna("").astype(str)
    df["is_restaurant"] = df["categories"].map(pipeline.is_restaurant)
    return df


def _mock_users(rows):
    return pd.DataFrame(rows)


def test_filter_removes_users_with_fewer_than_min_reviews():
    reviews = _mock_reviews([
        {"review_id": f"r{i}", "user_id": "u_active", "business_id": "b1",
         "stars": 5, "text": "great"}
        for i in range(12)
    ] + [
        {"review_id": "r_low", "user_id": "u_low", "business_id": "b1",
         "stars": 4, "text": "ok"},
    ])
    businesses = _mock_businesses([
        {"business_id": "b1", "categories": "Restaurants, Nigerian"},
    ])
    users = _mock_users([
        {"user_id": "u_active", "review_count": 12, "average_stars": 5.0,
         "rating_strictness": "generous"},
        {"user_id": "u_low", "review_count": 1, "average_stars": 4.0,
         "rating_strictness": "moderate"},
    ])

    reviews_out, _, users_out = pipeline.filter_data(reviews, businesses, users,
                                                    min_user_reviews=10)

    assert "u_low" not in set(users_out["user_id"])
    assert "u_low" not in set(reviews_out["user_id"])
    assert (users_out["review_count"] >= 10).all()


def test_filter_removes_reviews_with_empty_text():
    reviews = _mock_reviews([
        {"review_id": "r1", "user_id": "u1", "business_id": "b1",
         "stars": 5, "text": "delicious jollof"},
        {"review_id": "r2", "user_id": "u1", "business_id": "b2",
         "stars": 3, "text": "   "},
        {"review_id": "r3", "user_id": "u1", "business_id": "b3",
         "stars": 4, "text": ""},
    ])
    businesses = _mock_businesses([
        {"business_id": "b1", "categories": "Restaurants"},
        {"business_id": "b2", "categories": "Restaurants"},
        {"business_id": "b3", "categories": "Restaurants"},
    ])
    users = _mock_users([{"user_id": "u1", "review_count": 50, "average_stars": 4.0,
                          "rating_strictness": "moderate"}])

    reviews_out, _, _ = pipeline.filter_data(reviews, businesses, users, min_user_reviews=1)

    assert set(reviews_out["review_id"]) == {"r1"}


def test_clean_computes_word_count():
    reviews = pd.DataFrame([
        {"review_id": "r1", "user_id": "u1", "business_id": "b1",
         "stars": 4, "text": "  jollof rice was amazing  ",
         "date": datetime(2024, 1, 1, tzinfo=timezone.utc)},
    ])
    businesses = pd.DataFrame([
        {"business_id": "b1", "name": "X", "categories": "Restaurants", "city": "Lagos",
         "state": "NG", "stars": 4.5, "review_count": 100, "price_range": "$$"}
    ])
    users = pd.DataFrame([
        {"user_id": "u1", "review_count": 5, "average_stars": 4.0}
    ])

    reviews_out, _, _ = pipeline.clean_data(reviews, businesses, users)

    assert reviews_out.loc[0, "word_count"] == 4


@pytest.mark.parametrize(
    "average,expected",
    [(2.4, "strict"), (3.5, "moderate"), (4.6, "generous")],
)
def test_clean_classifies_rating_strictness(average, expected):
    reviews = pd.DataFrame(columns=["review_id", "user_id", "business_id", "stars",
                                    "text", "date"])
    businesses = pd.DataFrame(columns=["business_id", "name", "categories", "city",
                                       "state", "stars", "review_count", "price_range"])
    users = pd.DataFrame([{"user_id": "u1", "review_count": 10, "average_stars": average}])

    _, _, users_out = pipeline.clean_data(reviews, businesses, users)

    assert users_out.loc[0, "rating_strictness"] == expected


def test_clean_marks_restaurants_by_category():
    businesses = pd.DataFrame([
        {"business_id": "b1", "categories": "Restaurants, Nigerian", "name": "A",
         "city": "Lagos", "state": "NG", "stars": 4.0, "review_count": 10,
         "price_range": "$$"},
        {"business_id": "b2", "categories": "Pizza, Italian", "name": "B",
         "city": "Lagos", "state": "NG", "stars": 4.0, "review_count": 10,
         "price_range": "$"},
    ])
    reviews = pd.DataFrame(columns=["review_id", "user_id", "business_id", "stars",
                                    "text", "date"])
    users = pd.DataFrame(columns=["user_id", "review_count", "average_stars"])

    _, businesses_out, _ = pipeline.clean_data(reviews, businesses, users)

    assert businesses_out.set_index("business_id").loc["b1", "is_restaurant"]
    assert businesses_out.set_index("business_id").loc["b2", "is_restaurant"]


def test_is_restaurant_false_for_non_food_categories():
    assert pipeline.is_restaurant("Shopping, Retail") is False
    assert pipeline.is_restaurant("Auto Repair, Services") is False
    assert pipeline.is_restaurant("") is False


def test_sample_generator_returns_requested_user_count(tmp_path):
    reviews = pd.DataFrame([
        {"review_id": f"r{i}", "user_id": f"u{i % 5}", "business_id": f"b{i % 3}",
         "stars": (i % 5) + 1, "text": "ok", "word_count": 1, "recency_weight": 1.0,
         "date": pd.Timestamp("2024-01-01", tz="UTC")}
        for i in range(50)
    ])
    businesses = pd.DataFrame([
        {"business_id": f"b{i}", "name": f"Spot {i}", "categories": "Restaurants",
         "city": "Lagos", "state": "NG", "stars": 4.0, "review_count": 10,
         "price_range": "$$", "is_restaurant": True}
        for i in range(3)
    ])
    users = pd.DataFrame([
        {"user_id": f"u{i}", "review_count": 10 + i, "average_stars": 4.0,
         "rating_strictness": "moderate"}
        for i in range(5)
    ])

    pipeline.generate_sample(reviews, businesses, users, size=3, out_dir=tmp_path)

    sample_users = pd.read_parquet(tmp_path / "sample_users.parquet")
    sample_reviews = pd.read_parquet(tmp_path / "sample_reviews.parquet")
    assert len(sample_users) == 3
    assert set(sample_reviews["user_id"]).issubset(set(sample_users["user_id"]))
