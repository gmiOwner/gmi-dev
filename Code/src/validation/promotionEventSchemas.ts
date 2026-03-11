// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-VALIDATION-CENTRALIZED
// Review before merging. Do not remove this header until reviewed.

import { z } from 'zod';

const isoDateTime = z
  .string()
  .datetime({ offset: true })
  .or(z.string().datetime()) // allow without offset for simplicity
  .describe('ISO8601 datetime');

export const updatePromotionEventSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    startDate: isoDateTime.optional(),
    endDate: isoDateTime.optional()
  })
  .strict() // AC-2: reject extraneous fields
  .superRefine((val, ctx) => {
    // AC-2: validates start/end date logic
    if (val.startDate && val.endDate) {
      const start = Date.parse(val.startDate);
      const end = Date.parse(val.endDate);
      if (Number.isNaN(start) || Number.isNaN(end)) return;
      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'endDate must be after startDate',
          path: ['endDate']
        });
      }
    }
  });

export type UpdatePromotionEventInput = z.infer<typeof updatePromotionEventSchema>;
