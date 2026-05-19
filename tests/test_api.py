"""Smoke tests for the public FastAPI surface.

These cover the scaffolded endpoints only — health, the placeholder recommend
routes, and CORS — so the pipeline can be filled in without re-litigating the
HTTP contract.
"""

from fastapi.testclient import TestClient

from app.main import app
from app.config import settings

client = TestClient(app)


def test_health_returns_expected_shape():
    response = client.get("/health")

    assert response.status_code == 200
    body = response.json()
    assert body == {
        "status": "ok",
        "version": settings.app_version,
        "environment": settings.environment,
    }


def test_recommend_placeholder():
    response = client.post("/recommend", json={})

    assert response.status_code == 200
    assert response.json() == {"status": "coming soon"}


def test_recommend_chat_placeholder():
    response = client.post("/recommend/chat", json={})

    assert response.status_code == 200
    assert response.json() == {"status": "coming soon"}


def test_cors_headers_present():
    origin = settings.cors_origins[0]
    response = client.options(
        "/health",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin
