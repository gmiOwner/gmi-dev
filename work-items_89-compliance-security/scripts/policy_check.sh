#!/usr/bin/env bash
# AUTO-GENERATED — Work Item: 89 | Standards applied: CS-3, CS-4, CS-7
# Review before merging. Do not remove this header until reviewed.

set -euo pipefail

ROOT="work-items_89-compliance-security"

required_files=(
  "$ROOT/docs/COMPLIANCE_SECURITY_BASELINE.md"
  "$ROOT/docs/INCIDENT_RESPONSE_PLAN.md"
  "$ROOT/security/config.ts"
  "$ROOT/security/audit_logger.ts"
  "$ROOT/security/crypto.ts"
  "$ROOT/security/rbac.ts"
)

missing=0
for f in "${required_files[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "Missing required file: $f"
    missing=1
  fi
done

if [[ "$missing" -ne 0 ]]; then
  echo "Policy check failed: required baseline files missing."
  exit 1
fi

# Validate retention setting placeholder exists and is >= 365
# AC: Audit logs retention >= 1 year
retention=$(grep -E "export const retentionDays\s*=\s*([0-9]+)" "$ROOT/security/config.ts" | sed -E 's/.*=\s*([0-9]+).*/\1/')

if [[ -z "${retention:-}" ]]; then
  echo "Policy check failed: retentionDays not found in $ROOT/security/config.ts"
  exit 1
fi

if (( retention < 365 )); then
  echo "Policy check failed: retentionDays must be >= 365; found ${retention}"
  exit 1
fi

echo "Policy check passed."
