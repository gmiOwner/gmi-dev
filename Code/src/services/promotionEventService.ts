// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-AUDIT-FIELDS
// Review before merging. Do not remove this header until reviewed.

import type { PromotionEventRepository } from '../repositories/promotionEventRepository';
import type { UpdatePromotionEventInput } from '../validation/promotionEventSchemas';
import { AppError } from '../types/errors';
import type { PromotionEvent } from '../domain/promotionEvent';

export class PromotionEventService {
  constructor(private readonly repo: PromotionEventRepository) {}

  async updatePromotionEvent(params: {
    id: string;
    patch: UpdatePromotionEventInput;
    actorUserId: string;
  }): Promise<PromotionEvent> {
    const existing = await this.repo.getById(params.id);

    // AC-4: 404 if event missing
    if (!existing) {
      throw new AppError({ status: 404, code: 'NOT_FOUND', message: 'Promotion event not found' });
    }

    // AC-4: 409 if non-editable state (ended/locked)
    if (existing.status === 'ended' || existing.status === 'locked') {
      throw new AppError({
        status: 409,
        code: 'CONFLICT',
        message: 'Promotion event is not editable in its current state'
      });
    }

    // AC-4: persist changes; audit who/when
    const updated: PromotionEvent = {
      ...existing,
      ...params.patch,
      updatedBy: params.actorUserId,
      updatedAt: new Date().toISOString()
    };

    // Edge case: if only one date provided, ensure overall stored dates still make sense
    // (schema checks when both are present; this guards partial updates)
    const start = Date.parse(updated.startDate);
    const end = Date.parse(updated.endDate);
    if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
      throw new AppError({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid date range',
        details: { endDate: 'endDate must be after startDate' }
      });
    }

    return this.repo.update(updated);
  }
}
