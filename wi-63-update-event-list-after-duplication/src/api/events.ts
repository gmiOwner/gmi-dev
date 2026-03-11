// AUTO-GENERATED — Work Item: 63 | Standards applied: WI-63-HEADER, NO-SECRETS, TYPE_SCRIPT, AC-TRACEABILITY
// Review before merging. Do not remove this header until reviewed.

import type { DuplicateEventRequest, DuplicateEventResponse } from '../types';

export async function duplicateEventApi(
  req: DuplicateEventRequest,
  signal?: AbortSignal
): Promise<DuplicateEventResponse> {
  // TODO: Replace with real API call.
  // Example (fetch):
  // const res = await fetch(`/api/events/${req.sourceEventId}/duplicate`, { method: 'POST', signal });
  // if (!res.ok) throw new Error('Duplicate failed');
  // return (await res.json()) as DuplicateEventResponse;

  // [ASSUMPTION: In this example, we throw to force integrators to wire it]
  throw new Error(
    'duplicateEventApi is a stub. Wire it to your backend/event duplication query.'
  );
}
