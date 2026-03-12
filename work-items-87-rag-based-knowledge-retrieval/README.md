# AUTO-GENERATED — Work Item: 87 | Standards applied: WI-87, CS-1..9, API-VERSIONING, AUTHN-AUTHZ, LOGGING-PII-REDACTION, NO-RAW-QUERY-LOGGING, TESTING-PYTEST
# Review before merging. Do not remove this header until reviewed.

# RAG-based Knowledge Retrieval (POC)

Minimal, self-contained **Python 3.11 + FastAPI** reference implementation for a Retrieval-Augmented Generation (RAG) API.

## Features
- Versioned API: **/api/v1**
- AuthN: **API key** via `X-API-Key` header
- AuthZ: **RBAC** via `X-Role: admin|user` header (POC)
- RAG endpoint returns **answer + citations** (doc id/url/snippet)
- Structured **JSON logs** with `request_id` and **PII redaction** (emails/phones)
- Audit trail fields: `request_id`, `user_role`, `query_hash`, `retrieved_doc_ids`, `model_name`, `latency_ms`
- Avoids storing raw queries by default (logs only `query_hash`)
- In-memory retriever + interface stubs for Azure Cognitive Search / Elastic
- Deterministic mock LLM provider
- Unit tests with `pytest`

## Local run

### 1) Requirements
- Python **3.11**

### 2) Install
```bash
cd work-items-87-rag-based-knowledge-retrieval
python -m venv .venv
source .venv/bin/activate
pip install -e .
```

### 3) Configure
Copy `.env.example` values into your environment (or a local `.env` if you use a loader). Example (macOS/Linux):
```bash
export APP_ENV=local
export API_KEY=dev-secret
export LOG_LEVEL=INFO
export REQUEST_TIMEOUT_MS=2500
export RETRIEVER_BACKEND=in_memory
export LLM_PROVIDER=mock
```

### 4) Run
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 5) Call API
```bash
curl -s http://localhost:8000/api/v1/rag/query \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: dev-secret' \
  -H 'X-Role: user' \
  -d '{"query":"How do I reset my password? email me at test@example.com"}' | jq
```

### OpenAPI / Docs
- OpenAPI JSON: `GET /openapi.json`
- Swagger UI: `GET /docs`

## Notes / Limitations (POC)
- RBAC is header-driven for demo purposes only.
- Encryption in transit is expected via HTTPS at the gateway / reverse proxy layer.
- "Encryption at rest" is not implemented for the in-memory store; external stores should enable it.
- Azure Cognitive Search / Elastic retrievers are stubs.
