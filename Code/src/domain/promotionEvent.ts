// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-AUDIT-FIELDS
// Review before merging. Do not remove this header until reviewed.

export type PromotionEventStatus = 'draft' | 'scheduled' | 'active' | 'ended' | 'locked';

export interface PromotionEvent {
  id: string;
  name: string;
  description?: string;
  startDate: string; // ISO8601
  endDate: string; // ISO8601
  status: PromotionEventStatus;

  // Audit fields
  updatedBy: string;
  updatedAt: string; // ISO8601
}

export type EditablePromotionEventFields = Partial<
  Pick<PromotionEvent, 'name' | 'description' | 'startDate' | 'endDate'>
>;
