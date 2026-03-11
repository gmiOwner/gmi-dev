// AUTO-GENERATED — Work Item: 89 | Standards applied: CS-1
// Review before merging. Do not remove this header until reviewed.

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

// AES-256-GCM helpers. Key must be 32 bytes (base64-encoded) provided via env.
// AC: Encrypt sensitive data at rest (AES-256+).

const ALGO = 'aes-256-gcm';

export type EncryptedBlob = {
  v: 1;
  alg: 'aes-256-gcm';
  iv_b64: string;
  ct_b64: string;
  tag_b64: string;
  aad_b64?: string;
};

export function encryptString(plaintext: string, opts?: { aad?: string }): EncryptedBlob {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);

  if (opts?.aad) cipher.setAAD(Buffer.from(opts.aad, 'utf8'));

  const ct = Buffer.concat([cipher.update(Buffer.from(plaintext, 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    v: 1,
    alg: 'aes-256-gcm',
    iv_b64: iv.toString('base64'),
    ct_b64: ct.toString('base64'),
    tag_b64: tag.toString('base64'),
    aad_b64: opts?.aad ? Buffer.from(opts.aad, 'utf8').toString('base64') : undefined
  };
}

export function decryptString(blob: EncryptedBlob): string {
  if (blob.alg !== 'aes-256-gcm' || blob.v !== 1) throw new Error('Unsupported blob');

  const key = getKey();
  const iv = Buffer.from(blob.iv_b64, 'base64');
  const ct = Buffer.from(blob.ct_b64, 'base64');
  const tag = Buffer.from(blob.tag_b64, 'base64');

  const decipher = createDecipheriv(ALGO, key, iv);
  if (blob.aad_b64) decipher.setAAD(Buffer.from(blob.aad_b64, 'base64'));
  decipher.setAuthTag(tag);

  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return pt.toString('utf8');
}

function getKey(): Buffer {
  const b64 = process.env.DATA_ENCRYPTION_KEY_B64;
  if (!b64) throw new Error('Missing env DATA_ENCRYPTION_KEY_B64');
  const key = Buffer.from(b64, 'base64');
  if (key.length !== 32) throw new Error('DATA_ENCRYPTION_KEY_B64 must decode to 32 bytes');
  return key;
}
