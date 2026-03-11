// AUTO-GENERATED — Work Item: 71 | Standards applied: WI-71, TEST-AAA, TEST-GWT, SEC-NO-PII
// Review before merging. Do not remove this header until reviewed.

/**
 * Integration test template for channel assignment API.
 *
 * Uses Supertest-style requests. If your server uses a different framework,
 * adapt by spinning up a test server and using its HTTP client.
 *
 * Scenarios covered:
 * - Works with user management & notifications (mock)
 * - Data consistency across boundaries (user profile, audit logs)
 * - Bulk assignments
 * - Concurrent updates
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');

// Update to your app export (Express example: module.exports = app)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require('../../../src/api/app');

// Update these imports to your real clients/services if you can spy on them.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const notificationsClient = require('../../../src/notifications/client');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const auditLogger = require('../../../src/audit/logger');

const FIXTURES = {
  users: {
    u1: { userId: 'user_001' },
    u2: { userId: 'user_002' },
    u3: { userId: 'user_003' }
  },
  channels: {
    alpha: { channelId: 'channel_alpha' }
  }
};

describe('Channel Assignment API (integration)', () => {
  beforeEach(() => {
    // Ensure no real external side effects
    jest.spyOn(notificationsClient, 'send').mockResolvedValue({ ok: true });
    jest.spyOn(auditLogger, 'write').mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should_assign_channel_and_write_audit_and_send_notification', async () => {
    // Given
    const channelId = FIXTURES.channels.alpha.channelId;
    const userId = FIXTURES.users.u1.userId;

    // When
    const res = await request(app)
      .post(`/api/channels/${encodeURIComponent(channelId)}/assign`)
      .send({ userId })
      .set('Content-Type', 'application/json');

    // Then
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    // AC-2: notifications invoked (mock)
    expect(notificationsClient.send).toHaveBeenCalled();

    // AC-2: audit log written
    expect(auditLogger.write).toHaveBeenCalledWith(
      expect.objectContaining({
        action: expect.stringMatching(/assign/i),
        userId,
        channelId
      })
    );
  });

  it('should_bulk_assign_and_keep_user_profile_consistent', async () => {
    // Given
    const channelId = FIXTURES.channels.alpha.channelId;
    const userIds = [FIXTURES.users.u1.userId, FIXTURES.users.u2.userId, FIXTURES.users.u3.userId];

    // When
    const res = await request(app)
      .post('/api/channels/bulk-assign')
      .send({ channelId, userIds })
      .set('Content-Type', 'application/json');

    // Then
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    // AC-2: bulk scenario
    // [ASSUMPTION: response includes summary]
    expect(res.body).toEqual(expect.objectContaining({
      assigned: expect.any(Array)
    }));

    // AC-2: cross-boundary consistency checks (user profile endpoints are placeholders)
    for (const userId of userIds) {
      const profileRes = await request(app)
        .get(`/api/users/${encodeURIComponent(userId)}`)
        .set('Accept', 'application/json');

      expect(profileRes.status).toBe(200);
      expect(profileRes.body).toEqual(
        expect.objectContaining({
          userId,
          channels: expect.arrayContaining([channelId])
        })
      );
    }
  });

  it('should_handle_concurrent_assign_requests_without_creating_duplicates', async () => {
    // Given
    const channelId = FIXTURES.channels.alpha.channelId;
    const userId = FIXTURES.users.u2.userId;

    // When
    // AC-2: concurrent updates
    const results = await Promise.all([
      request(app).post(`/api/channels/${encodeURIComponent(channelId)}/assign`).send({ userId }),
      request(app).post(`/api/channels/${encodeURIComponent(channelId)}/assign`).send({ userId }),
      request(app).post(`/api/channels/${encodeURIComponent(channelId)}/assign`).send({ userId })
    ]);

    // Then
    for (const r of results) {
      // Depending on your design, some may be 2xx (idempotent) or 409 (conflict).
      expect([200, 201, 204, 409]).toContain(r.status);
    }

    const profileRes = await request(app)
      .get(`/api/users/${encodeURIComponent(userId)}`)
      .set('Accept', 'application/json');

    expect(profileRes.status).toBe(200);
    const channels: string[] = profileRes.body.channels || [];
    const occurrences = channels.filter((c) => c === channelId).length;
    expect(occurrences).toBe(1);
  });

  it('should_write_audit_log_for_unassign_and_keep_consistency', async () => {
    // Given
    const channelId = FIXTURES.channels.alpha.channelId;
    const userId = FIXTURES.users.u3.userId;

    await request(app)
      .post(`/api/channels/${encodeURIComponent(channelId)}/assign`)
      .send({ userId });

    // When
    const res = await request(app)
      .post(`/api/channels/${encodeURIComponent(channelId)}/unassign`)
      .send({ userId });

    // Then
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    expect(auditLogger.write).toHaveBeenCalledWith(
      expect.objectContaining({
        action: expect.stringMatching(/unassign|remove/i),
        userId,
        channelId
      })
    );

    const profileRes = await request(app)
      .get(`/api/users/${encodeURIComponent(userId)}`)
      .set('Accept', 'application/json');

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.channels || []).not.toEqual(expect.arrayContaining([channelId]));
  });
});
