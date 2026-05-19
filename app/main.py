"""FastAPI application entrypoint.

Wires up middleware and exposes the public HTTP surface. Business logic lives
in the agent and database modules; this file stays thin on purpose.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Conversational Nigerian food recommendation agent.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "version": settings.app_version,
        "environment": settings.environment,
    }


@app.post("/recommend")
def recommend() -> dict:
    # TODO: wire to the LangGraph agent once the pipeline lands.
    return {"status": "coming soon"}


@app.post("/recommend/chat")
def recommend_chat() -> dict:
    # TODO: multi-turn conversational entrypoint backed by Redis session state.
    return {"status": "coming soon"}
