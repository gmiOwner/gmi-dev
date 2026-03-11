// AUTO-GENERATED — Work Item: 89 | Standards applied: CS-3, CS-7
// Review before merging. Do not remove this header until reviewed.

// Central security/compliance settings for the document processing system.

// AC: Audit log retention >= 1 year.
export const retentionDays = 365;

// Data minimization notes (implementation-specific):
// - Prefer storing derived metadata over raw content when possible.
// - Store only necessary PII/PHI fields.
// - Provide deletion workflows tied to retention and legal holds.
// [ASSUMPTION: actual deletion jobs and legal hold mechanisms are implemented elsewhere.]
export const dataMinimization = {
  collectOnlyNecessary: true,
  supportDeletionWorkflows: true
};
