// AUTO-GENERATED — Work Item: 63 | Standards applied: WI-63-HEADER, REACT, A11Y-BASIC
// Review before merging. Do not remove this header until reviewed.

import * as React from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export function Toast(props: {
  variant: ToastVariant;
  message: string;
  onDismiss?: () => void;
}): React.ReactElement {
  const role = props.variant === 'error' ? 'alert' : 'status';
  return (
    <div
      role={role}
      aria-live="polite"
      style={{
        padding: 12,
        border: '1px solid #ccc',
        borderRadius: 6,
        background:
          props.variant === 'success'
            ? '#eaffea'
            : props.variant === 'error'
              ? '#ffecec'
              : '#eef5ff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span>{props.message}</span>
        {props.onDismiss ? (
          <button type="button" onClick={props.onDismiss} aria-label="Dismiss">
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
