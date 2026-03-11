// AUTO-GENERATED — Work Item: 63 | Standards applied: WI-63-HEADER, REACT, AC-TRACEABILITY
// Review before merging. Do not remove this header until reviewed.

import * as React from 'react';
import type { EventId } from '../types';

export function EventActions(props: {
  eventId: EventId;
  onDuplicate: (eventId: EventId) => Promise<void>;
  isDuplicating?: boolean;
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={() => props.onDuplicate(props.eventId)}
      disabled={props.isDuplicating}
      aria-busy={props.isDuplicating ? 'true' : 'false'}
    >
      {props.isDuplicating ? 'Duplicating…' : 'Duplicate'}
      {/* AC-4: show loading state during duplication */}
    </button>
  );
}
