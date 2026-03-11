<!-- AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,DOCS-RUNBOOK -->
<!-- Review before merging. Do not remove this header until reviewed. -->

# Promotion Events API (Work Item 54)

This folder contains a self-contained Node.js + Express + TypeScript implementation for:
- `PATCH /api/promotion-events/{id}` (also supports `PUT`)

## Run locally

```bash
cd Code
npm install
npm run dev
```

## Run tests

```bash
cd Code
npm test
```

### Auth in tests

Integration tests use a simple test token convention:
- `Authorization: Bearer role:admin` or `role:marketing-manager`

This is a **stub** to keep the work item self-contained. Replace with real JWT verification in production.
