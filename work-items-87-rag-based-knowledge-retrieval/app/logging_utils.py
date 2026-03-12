# AUTO-GENERATED — Work Item: 87 | Standards applied: WI-87, CS-3, CS-5, LOGGING-PII-REDACTION, NO-RAW-QUERY-LOGGING
# Review before merging. Do not remove this header until reviewed.

from __future__ import annotations

import hashlib
import json
import logging
import os
import re
import time
import uuid
from typing import Any, Dict


_EMAIL_RE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.IGNORECASE)
_PHONE_RE = re.compile(r"\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b")


def redact_pii(value: str) -> str:
    value = _EMAIL_RE.sub("[REDACTED_EMAIL]", value)
    value = _PHONE_RE.sub("[REDACTED_PHONE]", value)
    return value


def hash_query(query: str) -> str:
    # CS-5: avoid logging raw query; log only a stable hash
    return hashlib.sha256(query.encode("utf-8")).hexdigest()


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: Dict[str, Any] = {
            "ts": int(time.time() * 1000),
            "level": record.levelname,
            "logger": record.name,
            "msg": redact_pii(str(record.getMessage())),
        }
        extra = getattr(record, "extra", None)
        if isinstance(extra, dict):
            # Ensure any string values are redacted
            for k, v in extra.items():
                payload[k] = redact_pii(v) if isinstance(v, str) else v
        return json.dumps(payload, separators=(",", "":"), sort_keys=True)


def configure_logging(level: str = "INFO") -> None:
    logger = logging.getLogger()
    logger.handlers.clear()
    logger.setLevel(getattr(logging, level.upper(), logging.INFO))

    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    logger.addHandler(handler)


def new_request_id() -> str:
    return str(uuid.uuid4())


def now_ms() -> int:
    return int(time.time() * 1000)


def log_audit(logger: logging.Logger, *, event: str, request_id: str, user_role: str, query_hash: str,
              retrieved_doc_ids: list[str], model_name: str, latency_ms: int) -> None:
    # CS-3: retrieval+generation audit trail
    logger.info(
        event,
        extra={
            "extra": {
                "event": event,
                "request_id": request_id,
                "user_role": user_role,
                "query_hash": query_hash,
                "retrieved_doc_ids": retrieved_doc_ids,
                "model_name": model_name,
                "latency_ms": latency_ms,
                "audit_retention_days": int(os.getenv("AUDIT_RETENTION_DAYS", "14")),
            }
        },
    )
