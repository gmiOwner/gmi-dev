// AUTO-GENERATED — Work Item: 63 | Standards applied: WI-63-HEADER, NO-SECRETS, TELEMETRY-BASIC, SECURE-ERROR-HANDLING
// Review before merging. Do not remove this header until reviewed.

export type TelemetryEventName =
  | 'event_duplicate_started'
  | 'event_duplicate_succeeded'
  | 'event_duplicate_failed'
  | 'event_list_updated_after_duplicate_succeeded'
  | 'event_list_updated_after_duplicate_failed';

export interface Telemetry {
  track: (name: TelemetryEventName, props?: Record<string, unknown>) => void;
}

// Default no-op telemetry to keep code safe in unknown host environments.
export const telemetry: Telemetry = {
  track: () => {
    // no-op
  },
};

export function toSafeErrorProps(err: unknown): Record<string, unknown> {
  // Secure error handling: avoid leaking stack traces or sensitive data to UI/logs.
  if (err instanceof Error) {
    return {
      message: err.message,
      name: err.name,
      // stack intentionally omitted
    };
  }
  return { message: 'unknown_error' };
}
