-- Initial schema for the ChopSense restaurant catalogue, users, and reviews.
-- The pgvector extension powers semantic similarity search over businesses.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS businesses (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    category        TEXT,
    address         TEXT,
    city            TEXT,
    state           TEXT,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    price_range     SMALLINT,
    rating          REAL,
    review_count    INTEGER DEFAULT 0,
    description     TEXT,
    embedding       VECTOR(768),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id              TEXT PRIMARY KEY,
    display_name    TEXT,
    review_count    INTEGER DEFAULT 0,
    average_rating  REAL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id              TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id     TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    rating          SMALLINT NOT NULL,
    text            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reviews_user_idx ON reviews (user_id);
CREATE INDEX IF NOT EXISTS reviews_business_idx ON reviews (business_id);
CREATE INDEX IF NOT EXISTS businesses_city_idx ON businesses (city);

-- ivfflat ANN index for cosine similarity. `lists` should be tuned once the
-- catalogue is loaded; 100 is a reasonable starting point.
CREATE INDEX IF NOT EXISTS businesses_embedding_idx
    ON businesses
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
