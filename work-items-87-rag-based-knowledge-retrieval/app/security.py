# AUTO-GENERATED — Work Item: 87 | Standards applied: WI-87, CS-1, AUTHN-AUTHZ
# Review before merging. Do not remove this header until reviewed.

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

from fastapi import Header, HTTPException, status


Role = Literal["admin", "user"]


@dataclass(frozen=True)
class Principal:
    role: Role


def authenticate(
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
    x_role: str | None = Header(default=None, alias="X-Role"),
    *,
    expected_api_key: str,
) -> Principal:
    # AC: Access controls enforced
    # CS-1: All APIs implement authentication and authorization
    if not expected_api_key:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="API key not configured")

    if not x_api_key or x_api_key != expected_api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    role = (x_role or "").lower().strip()
    if role not in ("admin", "user"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    return Principal(role=role)
