// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-SECURITY-LEAST-PRIVILEGE
// Review before merging. Do not remove this header until reviewed.

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';
import { PromotionEventController } from '../controllers/promotionEventController';
import { PromotionEventService } from '../services/promotionEventService';
import { InMemoryPromotionEventRepository } from '../repositories/inMemoryPromotionEventRepository';

// [ASSUMPTION: No DI container in repo; wire dependencies here]
const repo = new InMemoryPromotionEventRepository([
  {
    id: '1',
    name: 'Spring Sale',
    description: 'Initial seed event',
    startDate: new Date(Date.now() + 60_000).toISOString(),
    endDate: new Date(Date.now() + 3_600_000).toISOString(),
    status: 'scheduled',
    updatedBy: 'seed',
    updatedAt: new Date().toISOString()
  }
]);
const service = new PromotionEventService(repo);
const controller = new PromotionEventController(service);

export const promotionEventsRouter = Router();

// AC-1: Endpoint definition PATCH /api/promotion-events/{id}
// AC-3: AuthN required
// AC-3: AuthZ admin/marketing manager
promotionEventsRouter.patch(
  '/:id',
  authenticate,
  requireRole(['admin', 'marketing-manager']),
  controller.update
);

// AC-1: Support PUT as well
promotionEventsRouter.put(
  '/:id',
  authenticate,
  requireRole(['admin', 'marketing-manager']),
  controller.update
);
