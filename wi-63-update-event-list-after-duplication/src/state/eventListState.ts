// AUTO-GENERATED — Work Item: 63 | Standards applied: WI-63-HEADER, TYPE_SCRIPT, AC-TRACEABILITY
// Review before merging. Do not remove this header until reviewed.

import type { Event, EventId, EventListQueryState } from '../types';

export function applyQueryState(events: Event[], query: EventListQueryState): Event[] {
  const filtered = events.filter((e) => {
    if (query.searchText && query.searchText.trim().length > 0) {
      const q = query.searchText.toLowerCase();
      return e.name.toLowerCase().includes(q);
    }
    return true;
  });

  const dir = query.sortDirection === 'asc' ? 1 : -1;
  const sortBy = query.sortBy;

  // AC-2: New event appears in correct position per existing sorting/filtering
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av === bv) return 0;
    // Basic string/date sorting; adapt for numbers/enums as needed.
    return String(av).localeCompare(String(bv)) * dir;
  });

  return sorted;
}

export function upsertEvent(events: Event[], newEvent: Event): Event[] {
  const idx = events.findIndex((e) => e.id === newEvent.id);
  if (idx === -1) return [newEvent, ...events];
  const next = [...events];
  next[idx] = newEvent;
  return next;
}

export function mergeDuplicatedEventIntoList(params: {
  currentAllEvents: Event[];
  query: EventListQueryState;
  duplicatedEvent: Event;
}): { nextAllEvents: Event[]; nextVisibleEvents: Event[]; newEventId: EventId } {
  const nextAllEvents = upsertEvent(params.currentAllEvents, params.duplicatedEvent);
  const nextVisibleEvents = applyQueryState(nextAllEvents, params.query);
  return { nextAllEvents, nextVisibleEvents, newEventId: params.duplicatedEvent.id };
}
