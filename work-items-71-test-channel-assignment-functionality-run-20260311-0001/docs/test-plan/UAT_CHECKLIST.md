# AUTO-GENERATED — Work Item: 71 | Standards applied: WI-71, DOC-UAT, A11Y, SEC-NO-PII
# Review before merging. Do not remove this header until reviewed.

# UAT Checklist — Channel Assignment

## Instructions
- Execute in staging (preferred) using test accounts only.
- Record results in `docs/test-results/TEST_RESULTS_TEMPLATE.md`.
- Log issues using `docs/test-results/ISSUE_TEMPLATE.md`.

## A. Core flows
1. Assign a channel to a user
   - Steps: Navigate to user profile → open "Assign channel" → select channel → confirm
   - Expected: success message; user profile shows channel; audit log entry created; notification sent (if applicable)

2. Reassign a user to a different channel (if supported)
   - Expected: previous channel removed/updated; new channel present; audit log entry includes before/after

3. Remove/unassign a channel
   - Expected: channel removed from UI; audit log entry created; notification behavior matches spec

4. Error messaging / feedback
   - Attempt invalid actions (e.g., invalid channel selection, user without permission)
   - Expected: clear, non-technical error; no partial UI state

## B. Bulk operations
5. Bulk assign a channel to multiple users
   - Expected: progress and result summary; partial failures reported clearly

## C. Concurrency / race conditions
6. Two admins attempt to assign the same channel to the same user simultaneously
   - Expected: idempotent success OR one conflict; no duplicate channel entry

7. One admin assigns while another unassigns
   - Expected: consistent final state; audit logs reflect actual outcome

## D. Accessibility (manual)
AC-3: Accessibility — keyboard navigation and screen reader compatibility

8. Keyboard navigation
   - Tab order logical
   - All interactive controls reachable
   - Focus visible
   - ESC closes modal (if modal used)

9. Screen reader checks
   - Buttons/inputs have accessible names
   - Form fields announce labels and errors
   - Live region announces success/error feedback (if toast)

10. Color/contrast
   - Error/success states not color-only
   - Contrast meets WCAG AA where applicable

## E. Severity gate
- No **critical/high** severity bugs open at completion.
