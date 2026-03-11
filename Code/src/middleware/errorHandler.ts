// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-ERROR-FORMAT,LOGGING-STRUCTURED
// Review before merging. Do not remove this header until reviewed.

import type { Request, Response, NextFunction } from 'express';
import { AppError, toErrorResponse } from '../types/errors';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    console.log(
      JSON.stringify({
        level: 'warn',
        msg: 'handled_error',
        path: req.path,
        method: req.method,
        status: err.status,
        code: err.code
      })
    );
    return res.status(err.status).json(toErrorResponse(err));
  }

  // AC-5: 500 generic
  console.log(
    JSON.stringify({
      level: 'error',
      msg: 'unhandled_error',
      path: req.path,
      method: req.method
    })
  );

  return res
    .status(500)
    .json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } });
}
