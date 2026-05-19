"""Centralised application settings loaded from the environment.

All configuration flows through this module so the rest of the codebase never
reads os.environ directly.
"""

from typing import List

from pydantic import Field
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
    debug: bool = False

    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: List[str] = Field(
        default_factory=lambda: ["http://localhost:3000", "http://localhost:5173"]
    )

    anthropic_api_key: str = ""
    llm_model: str = "claude-sonnet-4-20250514"
    llm_temperature: float = 0.4
    llm_max_tokens: int = 1024

    embedding_model: str = "sentence-transformers/all-mpnet-base-v2"
    embedding_dim: int = 768
    reranker_model: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"

    retrieval_top_k: int = 50
    rerank_top_n: int = 10

    database_url: str = "postgresql://chopsense:chopsense@db:5432/chopsense"
    redis_url: str = "redis://redis:6379/0"
    session_ttl_seconds: int = 3600

    enable_cultural_layer: bool = True
    enable_reasoning_trace: bool = True


settings = Settings()
