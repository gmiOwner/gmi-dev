// AUTO-GENERATED — Work Item: 63 | Standards applied: WI-63-HEADER, REACT, AC-TRACEABILITY, A11Y-BASIC
// Review before merging. Do not remove this header until reviewed.

import * as React from 'react';
import type { Event, EventId } from '../types';

export function EventList(props: {
  events: Event[];
  highlightedEventId?: EventId;
  onOpenEvent?: (id: EventId) => void;
}): React.ReactElement {
  return (
    <table aria-label="Events" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
          <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Created</th>
        </tr>
      </thead>
      <tbody>
        {props.events.map((e) => {
          const isHighlighted = props.highlightedEventId === e.id;
          return (
            <tr
              key={e.id}
              style={{
                background: isHighlighted ? '#fff7cc' : undefined,
                transition: 'background 400ms ease-in-out',
                cursor: props.onOpenEvent ? 'pointer' : 'default',
              }}
              // AC-4: optionally highlight new row
              onClick={props.onOpenEvent ? () => props.onOpenEvent?.(e.id) : undefined}
            >
              <td style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0' }}>
                {e.name}
              </td>
              <td style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0' }}>
                {new Date(e.createdAt).toLocaleString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
