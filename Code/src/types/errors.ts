// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-ERROR-FORMAT
// Review before merging. Do not remove this header until reviewed.

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  public readonly status: number;
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  constructor(params: { status: number; code: ErrorCode; message: string; details?: unknown }) {
    super(params.message);
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
  }
}

export function toErrorResponse(err: AppError) {
  // Stage 2 constraint: Standard JSON error format
  return {
    error: {
      code: err.code,
      message: err.message,
      ...(err.details !== undefined ? { details: err.details } : {})
    }
  };
}
