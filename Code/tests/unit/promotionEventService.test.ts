// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,TESTING-JEST
// Review before merging. Do not remove this header until reviewed.

import { PromotionEventService } from '../../src/services/promotionEventService';
import { InMemoryPromotionEventRepository } from '../../src/repositories/inMemoryPromotionEventRepository';

function seedEvent(overrides?: Partial<any>) {
  return {
    id: 'e1',
    name: 'Test',
    startDate: new Date(Date.now() + 60_000).toISOString(),
    endDate: new Date(Date.now() + 120_000).toISOString(),
    status: 'scheduled',
    updatedBy: 'seed',
    updatedAt: new Date().toISOString(),
    ...overrides
  };
}

describe('PromotionEventService.updatePromotionEvent', () => {
  test('returns 404 when event missing (AC-4)', async () => {
    const repo = new InMemoryPromotionEventRepository();
    const service = new PromotionEventService(repo);

    await expect(
      service.updatePromotionEvent({ id: 'missing', patch: { name: 'X' }, actorUserId: 'u1' })
    ).rejects.toMatchObject({ status: 404, code: 'NOT_FOUND' });
  });

  test('returns 409 when event is ended (AC-4)', async () => {
    const repo = new InMemoryPromotionEventRepository([seedEvent({ status: 'ended' })]);
    const service = new PromotionEventService(repo);

    await expect(
      service.updatePromotionEvent({ id: 'e1', patch: { name: 'X' }, actorUserId: 'u1' })
    ).rejects.toMatchObject({ status: 409, code: 'CONFLICT' });
  });

  test('updates fields and audit (AC-4)', async () => {
    const repo = new InMemoryPromotionEventRepository([seedEvent()]);
    const service = new PromotionEventService(repo);

    const updated = await service.updatePromotionEvent({
      id: 'e1',
      patch: { name: 'New Name' },
      actorUserId: 'actor-1'
    });

    expect(updated.name).toBe('New Name');
    expect(updated.updatedBy).toBe('actor-1');
    expect(Date.parse(updated.updatedAt)).not.toBeNaN();
  });

  test('returns 400 if partial update creates invalid date range (edge case)', async () => {
    const repo = new InMemoryPromotionEventRepository([
      seedEvent({ startDate: '2026-01-01T00:00:00.000Z', endDate: '2026-01-02T00:00:00.000Z' })
    ]);
    const service = new PromotionEventService(repo);

    await expect(
      service.updatePromotionEvent({
        id: 'e1',
        patch: { endDate: '2025-12-31T00:00:00.000Z' },
        actorUserId: 'u1'
      })
    ).rejects.toMatchObject({ status: 400, code: 'VALIDATION_ERROR' });
  });
});
