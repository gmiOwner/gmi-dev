# AUTO-GENERATED — Work Item: 87 | Standards applied: WI-87, CS-3, CS-4, CS-6, CS-9
# Review before merging. Do not remove this header until reviewed.

from __future__ import annotations

import asyncio
import logging

from .llm import LlmProvider
from .logging_utils import hash_query, log_audit, now_ms
from .retrievers import Retriever, RetrievedDoc


logger = logging.getLogger(__name__)


async def run_rag(
    *,
    request_id: str,
    user_role: str,
    query: str,
    retriever: Retriever,
    llm: LlmProvider,
    timeout_ms: int,
    k: int = 3,
) -> dict:
    start = now_ms()
    q_hash = hash_query(query)

    # AC: retrieval by query
    # CS-4: configurable timeout
    retrieved: list[RetrievedDoc] = await asyncio.wait_for(retriever.retrieve(query, k=k), timeout=timeout_ms / 1000)
    retrieval_ms = now_ms() - start

    log_audit(
        logger,
        event="rag_retrieval",
        request_id=request_id,
        user_role=user_role,
        query_hash=q_hash,
        retrieved_doc_ids=[d.id for d in retrieved],
        model_name="(n/a)",
        latency_ms=retrieval_ms,
    )

    # AC: generator uses retrieved docs
    gen_start = now_ms()
    llm_result = await asyncio.wait_for(llm.generate(query, retrieved), timeout=timeout_ms / 1000)
    gen_ms = now_ms() - gen_start

    log_audit(
        logger,
        event="rag_generation",
        request_id=request_id,
        user_role=user_role,
        query_hash=q_hash,
        retrieved_doc_ids=[d.id for d in retrieved],
        model_name=llm_result.model_name,
        latency_ms=gen_ms,
    )

    total_ms = now_ms() - start

    # AC / CS-6: outputs cite source documents
    return {
        "answer": llm_result.answer,
        "citations": [d.__dict__ for d in retrieved],
        "meta": {
            "request_id": request_id,
            "query_hash": q_hash,
            "model_name": llm_result.model_name,
            "latency_ms": total_ms,
        },
    }
