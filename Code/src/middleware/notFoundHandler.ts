// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-ERROR-FORMAT
// Review before merging. Do not remove this header until reviewed.

import type { Request, Response } from 'express';

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
}
