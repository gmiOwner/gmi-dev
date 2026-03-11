// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-SECURITY-LEAST-PRIVILEGE
// Review before merging. Do not remove this header until reviewed.

import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errors';
import type { Role } from '../types/auth';

export function requireRole(allowed: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    // AC-3: Role/permission checks; 403 on forbidden
    const role = req.user?.role;
    if (!role) {
      return next(new AppError({ status: 401, code: 'UNAUTHORIZED', message: 'Not authenticated' }));
    }

    if (!allowed.includes(role)) {
      return next(new AppError({ status: 403, code: 'FORBIDDEN', message: 'Insufficient permissions' }));
    }

    return next();
  };
}
