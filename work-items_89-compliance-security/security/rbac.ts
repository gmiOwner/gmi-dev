// AUTO-GENERATED — Work Item: 89 | Standards applied: CS-2
// Review before merging. Do not remove this header until reviewed.

export type Role = 'admin' | 'auditor' | 'operator' | 'user';
export type Permission =
  | 'documents:read'
  | 'documents:write'
  | 'documents:delete'
  | 'documents:export'
  | 'admin:manage_access'
  | 'audit:read';

export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'documents:read','documents:write','documents:delete','documents:export',
    'admin:manage_access','audit:read'
  ],
  auditor: ['documents:read', 'audit:read'],
  operator: ['documents:read','documents:write'],
  user: ['documents:read','documents:write']
};

export type Actor = { id: string; roles: Role[]; mfa?: boolean };

export function hasPermission(actor: Actor, required: Permission): boolean {
  const perms = new Set<Permission>();
  for (const r of actor.roles) (rolePermissions[r] ?? []).forEach(p => perms.add(p));
  return perms.has(required);
}

// Minimal middleware-like helper (framework-agnostic)
// AC: RBAC everywhere for sensitive operations.
export function requirePermission(required: Permission) {
  return (actor: Actor | null | undefined) => {
    if (!actor) return { ok: false as const, reason: 'UNAUTHENTICATED' };
    if (!hasPermission(actor, required)) return { ok: false as const, reason: 'FORBIDDEN' };
    return { ok: true as const };
  };
}

// Admin MFA enforcement helper.
// AC: MFA for admins/privileged.
export function requireAdminMfa(actor: Actor): { ok: true } | { ok: false; reason: string } {
  const isAdmin = actor.roles.includes('admin');
  if (!isAdmin) return { ok: true };
  if (!actor.mfa) return { ok: false, reason: 'MFA_REQUIRED' };
  return { ok: true };
}
