# AUTO-GENERATED — Work Item: 87 | Standards applied: WI-87, CS-4, CS-5, SAFE-DEFAULTS
# Review before merging. Do not remove this header until reviewed.

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """App configuration via environment variables.

    [ASSUMPTION: .env loading is handled externally; FastAPI app reads from environment.]
    """

    model_config = SettingsConfigDict(env_prefix="", case_sensitive=False)

    app_env: str = "local"

    # AC / Constraint: Auth required
    api_key: str = ""  # must be set in env

    # Logging
    log_level: str = "INFO"
    log_store_raw_queries: bool = False  # CS-5: avoid raw queries by default

    # Timeouts / perf instrumentation
    request_timeout_ms: int = 2500  # CS-4

    # Backends
    retriever_backend: str = "in_memory"  # in_memory|azure|elastic
    llm_provider: str = "mock"  # mock

    # Simple retention controls (POC)
    audit_retention_days: int = 14  # CS-5


def get_settings() -> Settings:
    return Settings()
