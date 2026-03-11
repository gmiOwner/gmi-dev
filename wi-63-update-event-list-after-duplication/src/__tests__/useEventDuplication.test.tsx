// AUTO-GENERATED — Work Item: 63 | Standards applied: WI-63-HEADER, TESTING-JEST, REACT, TYPE_SCRIPT, AC-TRACEABILITY
// Review before merging. Do not remove this header until reviewed.

import * as React from 'react';
import { renderHook, act } from '@testing-library/react';
import type { Event, EventListQueryState } from '../types';
import { useEventDuplication } from '../hooks/useEventDuplication';

// Mock the API module
jest.mock('../api/events', () => ({
  duplicateEventApi: jest.fn(),
}));

import { duplicateEventApi } from '../api/events';

describe('useEventDuplication', () => {
  const query: EventListQueryState = { sortBy: 'name', sortDirection: 'asc' };
  const baseEvents: Event[] = [
    { id: '1', name: 'Alpha', createdAt: '2026-03-01T00:00:00.000Z' },
  ];

  it('updates state + shows success toast after duplication', async () => {
    // AC-1/AC-3/AC-4
    (duplicateEventApi as jest.Mock).mockResolvedValue({
      event: { id: '2', name: 'Beta', createdAt: '2026-03-02T00:00:00.000Z' },
    });

    let allEvents = baseEvents;
    const setAllEvents = (e: Event[]) => {
      allEvents = e;
    };

    const toasts: Array<{ variant: string; message: string }> = [];

    const { result } = renderHook(() =>
      useEventDuplication({
        allEvents,
        setAllEvents,
        query,
        onToast: (t) => toasts.push(t),
      })
    );

    await act(async () => {
      await result.current.duplicate('1');
    });

    expect(allEvents.map((e) => e.id)).toContain('2');
    expect(toasts.some((t) => t.variant === 'success')).toBe(true);
  });

  it('shows error toast on failure without throwing', async () => {
    // AC-5
    (duplicateEventApi as jest.Mock).mockRejectedValue(new Error('boom'));

    const toasts: Array<{ variant: string; message: string }> = [];

    const { result } = renderHook(() =>
      useEventDuplication({
        allEvents: baseEvents,
        setAllEvents: () => undefined,
        query,
        onToast: (t) => toasts.push(t),
      })
    );

    await act(async () => {
      await result.current.duplicate('1');
    });

    expect(toasts.some((t) => t.variant === 'error')).toBe(true);
  });
});
