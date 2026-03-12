# AUTO-GENERATED — Work Item: 87 | Standards applied: WI-87, CS-5, LOGGING-PII-REDACTION, TESTING-PYTEST
# Review before merging. Do not remove this header until reviewed.

from __future__ import annotations

from app.logging_utils import hash_query, redact_pii


def test_redact_pii_email_and_phone():
    s = "Contact me at test@example.com or +1 (415) 555-1212"
    red = redact_pii(s)
    assert "test@example.com" not in red
    assert "415" not in red
    assert "[REDACTED_EMAIL]" in red
    assert "[REDACTED_PHONE]" in red


def test_hash_query_no_raw_query():
    q = "My email is a@b.com"
    h = hash_query(q)
    assert isinstance(h, str)
    assert len(h) == 64
    assert q not in h
