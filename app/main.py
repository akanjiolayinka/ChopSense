"""FastAPI application entrypoint.

Wires up middleware and exposes the public HTTP surface. Business logic lives
in the agent and database modules; this file stays thin on purpose.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException
import os

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

# Serve frontend
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str, request: Request):
        # Allow requests to API endpoints to fall through
        if full_path.startswith("api/") or full_path in ["health", "recommend", "recommend/chat"]:
            raise HTTPException(status_code=404, detail="Not Found")
            
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Fallback to index.html for SPA routing
        return FileResponse(os.path.join(frontend_dist, "index.html"))