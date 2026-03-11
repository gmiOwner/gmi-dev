// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-AUDIT-FIELDS
// Review before merging. Do not remove this header until reviewed.

import type { PromotionEvent } from '../domain/promotionEvent';

export interface PromotionEventRepository {
  getById(id: string): Promise<PromotionEvent | null>;
  update(event: PromotionEvent): Promise<PromotionEvent>;
}
