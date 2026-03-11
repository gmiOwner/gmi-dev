// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-VALIDATION-CENTRALIZED,STAGE2-ERROR-FORMAT
// Review before merging. Do not remove this header until reviewed.

import type { Request, Response, NextFunction } from 'express';
import { updatePromotionEventSchema } from '../validation/promotionEventSchemas';
import { AppError } from '../types/errors';
import type { PromotionEventService } from '../services/promotionEventService';

export class PromotionEventController {
  constructor(private readonly service: PromotionEventService) {}

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        // AC-6: 400 validation details
        throw new AppError({ status: 400, code: 'VALIDATION_ERROR', message: 'Missing id parameter' });
      }

      const parsed = updatePromotionEventSchema.safeParse(req.body);
      if (!parsed.success) {
        // AC-2: input validation; reject extraneous fields (via .strict())
        // AC-6: 400 validation details
        throw new AppError({
          status: 400,
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: parsed.error.flatten()
        });
      }

      // AC-2: required fields
      // [ASSUMPTION: PATCH allows partial updates; require at least one editable field]
      const hasAnyField = Object.keys(parsed.data).length > 0;
      if (!hasAnyField) {
        throw new AppError({
          status: 400,
          code: 'VALIDATION_ERROR',
          message: 'At least one field must be provided'
        });
      }

      const actor = req.user;
      if (!actor) {
        // Should be handled by authenticate middleware, but keep defensive
        throw new AppError({ status: 401, code: 'UNAUTHORIZED', message: 'Not authenticated' });
      }

      const updated = await this.service.updatePromotionEvent({
        id,
        patch: parsed.data,
        actorUserId: actor.id
      });

      // AC-6: 200 updated object
      return res.status(200).json(updated);
    } catch (err) {
      return next(err);
    }
  };
}
