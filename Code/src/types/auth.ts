// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-SECURITY-LEAST-PRIVILEGE
// Review before merging. Do not remove this header until reviewed.

export type Role = 'admin' | 'marketing-manager' | 'user';

export interface AuthUser {
  id: string;
  role: Role;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
