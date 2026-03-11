// AUTO-GENERATED — Work Item: 89 | Standards applied: CS-3
// Review before merging. Do not remove this header until reviewed.

import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export type AuditEvent = {
  ts: string;
  actor: { id: string; roles: string[] };
  action: string;
  resource: { type: string; id?: string };
  outcome: 'ALLOW' | 'DENY' | 'ERROR';
  metadata?: Record<string, unknown>;
};

export interface AuditLogger {
  log(event: AuditEvent): void;
}

// Tamper-evident JSONL: each line includes prevHash + hash(linePayload)
// AC: Audit logs tamper-evident + retention handled elsewhere (config/storage lifecycle).
export class FileHashChainedAuditLogger implements AuditLogger {
  constructor(private readonly filePath: string) {}

  log(event: AuditEvent): void {
    const dir = dirname(this.filePath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const prevHash = this.getLastHashSafe();
    const payload = { ...event, prevHash };
    const payloadStr = JSON.stringify(payload);
    const hash = sha256(payloadStr);

    const line = JSON.stringify({ ...payload, hash }) + '\n';
    appendFileSync(this.filePath, line, { encoding: 'utf8', mode: 0o600 });
  }

  private getLastHashSafe(): string | null {
    try {
      if (!existsSync(this.filePath)) return null;
      const content = readFileSync(this.filePath, 'utf8').trim();
      if (!content) return null;
      const lastLine = content.split(/\n/).pop();
      if (!lastLine) return null;
      const parsed = JSON.parse(lastLine) as { hash?: string };
      return parsed.hash ?? null;
    } catch {
      // If corrupted/unreadable, we intentionally break chain by returning null.
      // Consumers should alert on chain breaks.
      return null;
    }
  }
}

function sha256(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}
