"""Tests for the data pipeline, embeddings, postgres layer, and retrieval node."""

from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import numpy as np
import pandas as pd
import pytest

from app.agent import nodes
from app.agent.nodes import retrieve as retrieve_module
from app.agent.state import AgentState, RestaurantCandidate, UserPersona
from app.db import postgres
from app.embeddings import encoder as encoder_module
from data import pipeline


# ---------------------------------------------------------------------------
# Step 2 — pipeline tests (kept from the previous step)
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Step 3 — embeddings, postgres, and retrieval node
# ---------------------------------------------------------------------------

class _FakeSentenceModel:
    """Stand-in for SentenceTransformer that produces deterministic vectors."""

    def __init__(self, *args, **kwargs):
        self.dim = 768

    def encode(self, inputs, **kwargs):
        if isinstance(inputs, str):
            return self._encode_one(inputs)
        return np.stack([self._encode_one(text) for text in inputs])

    def _encode_one(self, text):
        rng = np.random.default_rng(abs(hash(text)) % (2**32))
        return rng.standard_normal(self.dim).astype(np.float32)


@pytest.fixture
def fake_encoder(monkeypatch):
    encoder_module.reset_encoder()
    monkeypatch.setattr(
        encoder_module.RestaurantEncoder,
        "_load_model",
        lambda self: _FakeSentenceModel(),
    )
    yield encoder_module.get_encoder()
    encoder_module.reset_encoder()


def test_build_business_text_rich_format(fake_encoder):
    text = fake_encoder.build_business_text({
        "name": "Mama Cass",
        "categories": "Restaurants, Nigerian",
        "city": "Lagos",
        "price_range": "$$",
        "stars": 4.3,
        "review_count": 412,
    })
    # The embedded sentence must mention every meaningful field — that's the
    # whole point of building rich text rather than just embedding the name.
    for needle in ["Mama Cass", "nigerian", "Lagos", "$$", "4.3", "412"]:
        assert needle in text


def test_embed_text_returns_768_floats(fake_encoder):
    vector = fake_encoder.embed_text("affordable Nigerian food Lekki")
    assert isinstance(vector, list)
    assert len(vector) == 768
    assert all(isinstance(x, float) for x in vector)


def test_embed_batch_returns_one_vector_per_text(fake_encoder):
    vectors = fake_encoder.embed_batch([
        "spicy suya",
        "smoothie bar",
        "rooftop seafood",
    ])
    assert len(vectors) == 3
    assert all(len(v) == 768 for v in vectors)


def test_user_persona_accepts_partial_data():
    persona = UserPersona(raw_message="somewhere chill in Lekki")
    assert persona.cuisine_preferences == []
    assert persona.location is None


def test_restaurant_candidate_defaults():
    candidate = RestaurantCandidate(business_id="b1", name="X")
    assert candidate.similarity_score == 0.0
    assert candidate.rerank_score is None
    assert candidate.why_picked is None


def test_agent_state_round_trips_personas():
    state = AgentState(
        session_id="s1",
        user_persona=UserPersona(location="Lekki", city="Lagos", group_size=2),
    )
    assert state.is_cold_start is True
    assert state.user_persona.group_size == 2
    assert state.candidates == []


@pytest.mark.asyncio
async def test_similarity_search_uses_parameterised_vector_and_filters():
    fake_conn = MagicMock()
    fake_conn.fetch = AsyncMock(return_value=[
        {"id": "b1", "name": "Mama Cass", "category": "Nigerian", "city": "Lagos",
         "state": "NG", "address": None, "latitude": None, "longitude": None,
         "price_range": 2, "rating": 4.3, "review_count": 412,
         "description": "warm jollof", "similarity": 0.91},
    ])

    class _AcquireCM:
        async def __aenter__(self_inner): return fake_conn
        async def __aexit__(self_inner, *exc): return False

    fake_pool = MagicMock()
    fake_pool.acquire = MagicMock(return_value=_AcquireCM())

    rows = await postgres.similarity_search(
        [0.1] * 768,
        top_k=5,
        filters={"city": "Lagos", "min_rating": 4.0, "unknown_filter": "ignored"},
        pool=fake_pool,
    )

    assert len(rows) == 1
    assert rows[0]["name"] == "Mama Cass"

    fake_conn.fetch.assert_awaited_once()
    sql, *params = fake_conn.fetch.call_args.args
    # Filters must hit the WHERE clause, not be appended after ORDER BY.
    assert "WHERE" in sql
    assert "city ILIKE" in sql
    assert "rating >=" in sql
    # The vector and limit must be passed as parameters, never string-formatted.
    assert "::vector" in sql
    assert sql.count("$") >= 3
    assert params[-1] == 5  # limit was the last param


@pytest.mark.asyncio
async def test_retrieve_node_populates_state_candidates(fake_encoder, monkeypatch):
    async def fake_search(query_embedding, top_k, filters=None, pool=None):
        assert len(query_embedding) == 768
        return [
            {"id": "b1", "name": "Mama Cass", "category": "Nigerian",
             "city": "Lagos", "price_range": 2, "rating": 4.3,
             "review_count": 412, "similarity": 0.91},
            {"id": "b2", "name": "Bukka Hut", "category": "Nigerian",
             "city": "Lagos", "price_range": 1, "rating": 4.0,
             "review_count": 200, "similarity": 0.83},
        ]

    monkeypatch.setattr(retrieve_module, "similarity_search", fake_search)

    state = AgentState(
        session_id="s1",
        user_persona=UserPersona(
            city="Lagos",
            mood="very hungry, want something filling",
            budget_ngn=3000,
            cuisine_preferences=["Nigerian"],
        ),
    )

    result = await retrieve_module.retrieve(state, top_k=2)

    assert len(result.candidates) == 2
    assert result.candidates[0].business_id == "b1"
    assert result.candidates[0].price_range == "$$"
    assert result.candidates[0].similarity_score == pytest.approx(0.91)
