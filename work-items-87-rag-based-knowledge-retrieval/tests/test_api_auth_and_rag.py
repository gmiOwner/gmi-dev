# AUTO-GENERATED — Work Item: 87 | Standards applied: WI-87, CS-1, CS-6, CS-7, TESTING-PYTEST
# Review before merging. Do not remove this header until reviewed.

from __future__ import annotations

import os

import pytest
from httpx import AsyncClient

from app.main import app


@pytest.mark.anyio
async def test_auth_required_missing_api_key():
    os.environ["API_KEY"] = "dev-key"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.post("/api/v1/rag/query", json={"query": "reset password"}, headers={"X-Role": "user"})
    assert r.status_code == 401


@pytest.mark.anyio
async def test_rbac_required_missing_role():
    os.environ["API_KEY"] = "dev-key"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.post("/api/v1/rag/query", json={"query": "reset password"}, headers={"X-API-Key": "dev-key"})
    assert r.status_code == 403


@pytest.mark.anyio
async def test_rag_returns_answer_and_citations():
    os.environ["API_KEY"] = "dev-key"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.post("/api/v1/rag/query", json={"query": "How do I reset my password?"}, headers={"X-API-Key": "dev-key", "X-Role": "user"})
    assert r.status_code == 200
    data = r.json()
    assert "answer" in data and isinstance(data["answer"], str)
    assert "citations" in data and isinstance(data["citations"], list)
    assert len(data["citations"]) >= 1
    c0 = data["citations"][0]
    assert "id" in c0 and "url" in c0 and "snippet" in c0
    assert "meta" in data and "request_id" in data["meta"]
