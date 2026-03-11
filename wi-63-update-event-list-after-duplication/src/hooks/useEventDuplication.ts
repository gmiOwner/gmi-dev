// AUTO-GENERATED — Work Item: 63 | Standards applied: WI-63-HEADER, REACT, TYPE_SCRIPT, AC-TRACEABILITY, TELEMETRY-BASIC, SECURE-ERROR-HANDLING
// Review before merging. Do not remove this header until reviewed.

import * as React from 'react';
import type { Event, EventId, EventListQueryState } from '../types';
import { duplicateEventApi } from '../api/events';
import { mergeDuplicatedEventIntoList } from '../state/eventListState';
import { telemetry, toSafeErrorProps } from '../telemetry/telemetry';

export interface UseEventDuplicationParams {
  // Source of truth for ALL events (unfiltered), so we can re-apply sort/filter.
  allEvents: Event[];
  setAllEvents: (events: Event[]) => void;

  // Visible events are derived from query, but many apps keep it in state.
  setVisibleEvents?: (events: Event[]) => void;

  query: EventListQueryState;

  // Optional UI hooks
  onToast?: (toast: { variant: 'success' | 'error' | 'info'; message: string }) => void;
  onHighlightEvent?: (eventId: EventId) => void;
}

export function useEventDuplication(params: UseEventDuplicationParams) {
  const [isDuplicating, setIsDuplicating] = React.useState(false);

  const duplicate = React.useCallback(
    async (sourceEventId: EventId) => {
      setIsDuplicating(true);
      params.onToast?.({ variant: 'info', message: 'Duplicating event…' });
      telemetry.track('event_duplicate_started', { sourceEventId });

      try {
        const resp = await duplicateEventApi({ sourceEventId });
        telemetry.track('event_duplicate_succeeded', {
          sourceEventId,
          newEventId: resp.event.id,
        });

        // AC-1: After successfully duplicating an event, event list UI updates automatically
        // AC-2: New event appears in correct position per existing sorting/filtering
        const merged = mergeDuplicatedEventIntoList({
          currentAllEvents: params.allEvents,
          query: params.query,
          duplicatedEvent: resp.event,
        });

        params.setAllEvents(merged.nextAllEvents);
        params.setVisibleEvents?.(merged.nextVisibleEvents);
        telemetry.track('event_list_updated_after_duplicate_succeeded', {
          newEventId: merged.newEventId,
        });

        // AC-3: No manual refresh required (implicit by state update)
        // AC-4: Appropriate feedback after duplication
        params.onToast?.({ variant: 'success', message: 'Event duplicated.' });
        params.onHighlightEvent?.(merged.newEventId);
      } catch (err) {
        telemetry.track('event_duplicate_failed', {
          sourceEventId,
          ...toSafeErrorProps(err),
        });
        telemetry.track('event_list_updated_after_duplicate_failed', {
          sourceEventId,
          reason: 'duplicate_api_failed',
        });

        // AC-5: Errors handled gracefully
        params.onToast?.({
          variant: 'error',
          message: 'Could not duplicate the event. Please try again.',
        });
      } finally {
        setIsDuplicating(false);
      }
    },
    [
      params,
      // [ASSUMPTION: Host app ensures stable references or wraps in useMemo]
    ]
  );

  return { duplicate, isDuplicating };
}
