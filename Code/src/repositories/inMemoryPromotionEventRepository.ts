// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-AUDIT-FIELDS
// Review before merging. Do not remove this header until reviewed.

import type { PromotionEvent } from '../domain/promotionEvent';
import type { PromotionEventRepository } from './promotionEventRepository';

export class InMemoryPromotionEventRepository implements PromotionEventRepository {
  private store = new Map<string, PromotionEvent>();

  constructor(seed?: PromotionEvent[]) {
    seed?.forEach((e) => this.store.set(e.id, e));
  }

  async getById(id: string): Promise<PromotionEvent | null> {
    return this.store.get(id) ?? null;
  }

  async update(event: PromotionEvent): Promise<PromotionEvent> {
    this.store.set(event.id, event);
    return event;
  }

  // Test helper
  seed(event: PromotionEvent) {
    this.store.set(event.id, event);
  }
}
