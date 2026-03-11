// AUTO-GENERATED — Work Item: 63 | Standards applied: WI-63-HEADER, TESTING-JEST, TYPE_SCRIPT, AC-TRACEABILITY
// Review before merging. Do not remove this header until reviewed.

import { applyQueryState, mergeDuplicatedEventIntoList } from '../state/eventListState';
import type { Event, EventListQueryState } from '../types';

describe('eventListState', () => {
  const baseEvents: Event[] = [
    { id: '1', name: 'Alpha', createdAt: '2026-03-01T00:00:00.000Z' },
    { id: '2', name: 'Beta', createdAt: '2026-03-02T00:00:00.000Z' },
  ];

  it('applies search filter', () => {
    const query: EventListQueryState = {
      searchText: 'alp',
      sortBy: 'name',
      sortDirection: 'asc',
    };
    const visible = applyQueryState(baseEvents, query);
    expect(visible.map((e) => e.id)).toEqual(['1']);
  });

  it('merges duplicated event and preserves sorting', () => {
    // AC-2: correct position per existing sorting/filtering
    const query: EventListQueryState = {
      searchText: undefined,
      sortBy: 'name',
      sortDirection: 'asc',
    };
    const duplicated: Event = {
      id: '3',
      name: 'Aardvark',
      createdAt: '2026-03-03T00:00:00.000Z',
    };

    const merged = mergeDuplicatedEventIntoList({
      currentAllEvents: baseEvents,
      query,
      duplicatedEvent: duplicated,
    });

    expect(merged.nextAllEvents.find((e) => e.id === '3')).toBeTruthy();
    expect(merged.nextVisibleEvents.map((e) => e.id)).toEqual(['3', '1', '2']);
  });

  it('merged event may be filtered out when search does not match', () => {
    const query: EventListQueryState = {
      searchText: 'zzz',
      sortBy: 'name',
      sortDirection: 'asc',
    };
    const duplicated: Event = {
      id: '3',
      name: 'Gamma',
      createdAt: '2026-03-03T00:00:00.000Z',
    };

    const merged = mergeDuplicatedEventIntoList({
      currentAllEvents: baseEvents,
      query,
      duplicatedEvent: duplicated,
    });

    // Edge case: filtered list
    expect(merged.nextVisibleEvents).toHaveLength(0);
    expect(merged.nextAllEvents).toHaveLength(3);
  });
});
