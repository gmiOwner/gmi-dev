// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-SECURITY-LEAST-PRIVILEGE
// Review before merging. Do not remove this header until reviewed.

import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errors';
import type { Role } from '../types/auth';

function parseTestToken(token: string): { id: string; role: Role } | null {
  // [ASSUMPTION: In absence of repo auth conventions, use a minimal stub for local testing]
  // Accepts: "role:admin" | "role:marketing-manager" | "role:user"
  if (token.startsWith('role:')) {
    const role = token.slice('role:'.length) as Role;
    if (role === 'admin' || role === 'marketing-manager' || role === 'user') {
      return { id: `test-${role}`, role };
    }
  }
  return null;
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  // AC-3: Authenticated users only; 401 if missing/invalid
  const header = req.header('authorization');
  if (!header) {
    return next(new AppError({ status: 401, code: 'UNAUTHORIZED', message: 'Missing Authorization header' }));
  }

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError({ status: 401, code: 'UNAUTHORIZED', message: 'Invalid Authorization header' }));
  }

  const parsed = parseTestToken(token);
  if (!parsed) {
    return next(new AppError({ status: 401, code: 'UNAUTHORIZED', message: 'Invalid token' }));
  }

  req.user = parsed;
  return next();
}
