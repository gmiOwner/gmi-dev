# AUTO-GENERATED — Work Item: 71 | Standards applied: WI-71, CI-PR, COV-90
# Review before merging. Do not remove this header until reviewed.

# CI Snippet (Example) — GitHub Actions

This is an example workflow to run unit/integration tests and fail PRs on test failure or insufficient coverage.

> Note: This file is documentation-only; copy into `.github/workflows/channel-assignment-tests.yml` as needed.

```yaml
name: Channel Assignment Tests

on:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install
        run: npm ci

      - name: Unit + Integration tests with coverage threshold
        run: npx jest -c jest.config.channelAssignment.js

      # Optional UI a11y smoke (requires app server + Playwright deps)
      # - name: Install Playwright
      #   run: npx playwright install --with-deps
      #
      # - name: Run a11y smoke
      #   run: npx playwright test tests/ui/channelAssignment.a11y.spec.ts
```

## If you use another CI system
- Ensure jobs run on PR
- Ensure coverage thresholds are enforced (`coverageThreshold` in Jest config)
- Ensure pipeline fails on any failing tests
