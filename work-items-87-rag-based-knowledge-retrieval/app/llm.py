# AUTO-GENERATED — Work Item: 87 | Standards applied: WI-87, CS-6, CS-9
# Review before merging. Do not remove this header until reviewed.

from __future__ import annotations

import abc
import asyncio
from dataclasses import dataclass
from typing import List

from .retrievers import RetrievedDoc


@dataclass(frozen=True)
class LlmResult:
    answer: str
    model_name: str


class LlmProvider(abc.---redacted-sensitive-value (PoC3)---):
    @abc.abstractmethod
    async def generate(self, query: str, context_docs: List[RetrievedDoc]) -> LlmResult:
        raise NotImplementedError


class MockDeterministicLlm(LlmProvider):
    """Deterministic provider for tests/POC.

    Produces an answer derived from the context, without external calls.
    """

    def __init__(self, model_name: str = "mock-llm-1"):
        self._model_name = model_name

    async def generate(self, query: str, context_docs: List[RetrievedDoc]) -> LlmResult:
        await asyncio.sleep(0)
        titles = ", ".join([d.id for d in context_docs])
        answer = (
            f"Answer (deterministic) based on {len(context_docs)} docs [{titles}]. "
            f"Query intent: {query[:80]}"
        )
        return LlmResult(answer=answer, model_name=self._model_name)
