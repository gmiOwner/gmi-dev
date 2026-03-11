// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,TESTING-JEST,TESTING-SUPERTEST
// Review before merging. Do not remove this header until reviewed.

import request from 'supertest';
import { createApp } from '../../src/app';

describe('PATCH /api/promotion-events/:id', () => {
  test('401 when unauthenticated (AC-3)', async () => {
    const app = createApp();
    const res = await request(app).patch('/api/promotion-events/1').send({ name: 'X' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error.code', 'UNAUTHORIZED');
  });

  test('403 when authenticated but not authorized (AC-3)', async () => {
    const app = createApp();
    const res = await request(app)
      .patch('/api/promotion-events/1')
      .set('Authorization', 'Bearer role:user')
      .send({ name: 'X' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error.code', 'FORBIDDEN');
  });

  test('400 when payload has extraneous fields (AC-2)', async () => {
    const app = createApp();
    const res = await request(app)
      .patch('/api/promotion-events/1')
      .set('Authorization', 'Bearer role:admin')
      .send({ name: 'X', hackerField: 'nope' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error.code', 'VALIDATION_ERROR');
  });

  test('404 when event missing (AC-4)', async () => {
    const app = createApp();
    const res = await request(app)
      .patch('/api/promotion-events/missing')
      .set('Authorization', 'Bearer role:admin')
      .send({ name: 'X' });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error.code', 'NOT_FOUND');
  });

  test('200 returns updated object (AC-6)', async () => {
    const app = createApp();
    const res = await request(app)
      .patch('/api/promotion-events/1')
      .set('Authorization', 'Bearer role:marketing-manager')
      .send({ name: 'Spring Sale Extended' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', '1');
    expect(res.body).toHaveProperty('name', 'Spring Sale Extended');
    expect(res.body).toHaveProperty('updatedBy', 'test-marketing-manager');
    expect(res.body).toHaveProperty('updatedAt');
  });
});
