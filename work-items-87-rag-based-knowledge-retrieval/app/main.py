# AUTO-GENERATED — Work Item: 87 | Standards applied: WI-87, CS-1, CS-3, CS-4, CS-6, CS-8, CS-9, API-VERSIONING, LOGGING-PII-REDACTION
# Review before merging. Do not remove this header until reviewed.

from __future__ import annotations

import logging
from typing import Any, Dict, List

from fastapi import Depends, FastAPI, HTTPException, Request
from pydantic import BaseModel, Field

from .config import get_settings
from .llm import MockDeterministicLlm
from .logging_utils import configure_logging, new_request_id
from .rag import run_rag
from .retrievers import Document, InMemoryRetriever
from .security import Principal, authenticate


settings = get_settings()
configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RAG Knowledge Retrieval POC",
    version="1.0.0",
    description="RAG API (POC). Versioned under /api/v1.",
)


@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or new_request_id()
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


class RagQueryRequest(BaseModel):
    query: str = Field(min_length=1, max_length=4000)


class Citation(BaseModel):
    id: str
    url: str
    snippet: str


class RagQueryResponse(BaseModel):
    answer: str
    citations: List[Citation]
    meta: Dict[str, Any]


def get_principal(request: Request) -> Principal:
    return authenticate(
        expected_api_key=settings.api_key,
        x_api_key=request.headers.get("X-API-Key"),
        x_role=request.headers.get("X-Role"),
    )


def get_retriever():
    docs = [
        Document(id="doc-1", url="https://kb.local/reset-password", text="To reset your password, go to Settings > Security and click Reset Password."),
        Document(id="doc-2", url="https://kb.local/mfa", text="Multi-factor authentication (MFA) can be enabled in Security settings."),
        Document(id="doc-3", url="https://kb.local/support", text="For account issues, contact support and include your org id."),
    ]
    return InMemoryRetriever(docs)


def get_llm():
    return MockDeterministicLlm()


@app.get("/api/v1/health")
async def health() -> dict:
    return {"status": "ok"}


@app.post("/api/v1/rag/query", response_model=RagQueryResponse)
async def rag_query(request: Request, body: RagQueryRequest, principal: Principal = Depends(get_principal)):
    try:
        result = await run_rag(
            request_id=request.state.request_id,
            user_role=principal.role,
            query=body.query,
            retriever=get_retriever(),
            llm=get_llm(),
            timeout_ms=settings.request_timeout_ms,
            k=3,
        )
        return result
    except TimeoutError:
        raise HTTPException(status_code=504, detail="Timeout")
