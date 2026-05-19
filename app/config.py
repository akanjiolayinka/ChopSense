"""Centralised application settings loaded from the environment.

All configuration flows through this module so the rest of the codebase never
reads os.environ directly.
"""

from typing import List, Union

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "ChopSense"
    app_version: str = "1.0.0"
    environment: str = "development"
    log_level: str = "INFO"

    api_port: int = 8000
    frontend_port: int = 3000
    vite_api_base_url: str = "http://localhost:8000"
    cors_origins: Union[str, List[str]] = "http://localhost:3000"

    anthropic_api_key: str = ""
    openai_api_key: str = ""
    llm_model: str = "claude-sonnet-4-20250514"
    llm_temperature: float = 0.3
    llm_max_tokens: int = 1000

    embedding_model: str = "all-mpnet-base-v2"
    embedding_dim: int = 768
    reranker_model: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"

    retrieval_top_k: int = 50
    rerank_top_n: int = 10
    min_user_reviews: int = 10
    max_context_turns: int = 20
    enable_cultural_layer: bool = True
    enable_reasoning_trace: bool = True

    database_url: str = "postgresql://admin:admin@db:5432/chopsense"
    postgres_user: str = "admin"
    postgres_password: str = "admin"
    postgres_db: str = "chopsense"
    postgres_host: str = "db"
    postgres_port: int = 5432

    redis_url: str = "redis://redis:6379/0"
    redis_host: str = "redis"
    redis_port: int = 6379
    session_ttl_seconds: int = 3600

    leaflet_tile_url: str = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    google_maps_api_key: str = ""

    data_raw_dir: str = "./data/raw"
    data_processed_dir: str = "./data/processed"
    eval_output_dir: str = "./results"

    @field_validator("cors_origins", mode="after")
    @classmethod
    def split_cors_origins(cls, value):
        if isinstance(value, list):
            return value
        return [origin.strip() for origin in str(value).split(",") if origin.strip()]


settings = Settings()
