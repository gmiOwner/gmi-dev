// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,STAGE2-ERROR-FORMAT,SECURITY-HEADERS
// Review before merging. Do not remove this header until reviewed.

import express from 'express';
import helmet from 'helmet';
import { promotionEventsRouter } from './routes/promotionEventsRouter';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  // Security hardening defaults
  app.use(helmet());

  app.use(express.json({ limit: '1mb' }));

  app.use('/api/promotion-events', promotionEventsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
