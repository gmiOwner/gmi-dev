// AUTO-GENERATED — Work Item: 63 | Standards applied: WI-63-HEADER, TYPE_SCRIPT, AC-TRACEABILITY
// Review before merging. Do not remove this header until reviewed.

export type EventId = string;

export interface Event {
  id: EventId;
  name: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  // Add additional fields as needed (owner, status, etc.)
}

export type SortDirection = 'asc' | 'desc';

export interface EventListQueryState {
  // Represent current UI filters/search/sort.
  // [ASSUMPTION: Existing UI already has a query state; adapt accordingly]
  searchText?: string;
  sortBy: keyof Event;
  sortDirection: SortDirection;
  // Example filter: include only events whose name contains text
  // Add real filters as needed
}

export interface DuplicateEventRequest {
  sourceEventId: EventId;
}

export interface DuplicateEventResponse {
  // AC-1: API returns new event or ID
  // [ASSUMPTION: API returns full new event]
  event: Event;
}
