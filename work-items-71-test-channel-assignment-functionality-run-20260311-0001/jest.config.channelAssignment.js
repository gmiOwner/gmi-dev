// AUTO-GENERATED — Work Item: 71 | Standards applied: WI-71, COV-90, CI-PR
// Review before merging. Do not remove this header until reviewed.

/**
 * Repo-agnostic Jest config enforcing >= 90% line + branch coverage.
 *
 * [ASSUMPTION: You can run Jest in this repo. If using TS, add ts-jest or swc/jest transform.]
 */

module.exports = {
  testEnvironment: 'node',
  // Keep patterns broad so this can be dropped into many repos.
  testMatch: [
    '<rootDir>/tests/**/*.test.(js|jsx|ts|tsx)',
    '<rootDir>/tests/**/*.spec.(js|jsx|ts|tsx)'
  ],
  clearMocks: true,
  restoreMocks: true,
  // Collect coverage from the *assignment logic* module(s).
  // Update these to match your actual implementation paths.
  // AC-1: >=90% coverage for assignment logic
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/channelAssignment/**/*.(js|jsx|ts|tsx)',
    '!**/*.d.ts',
    '!**/__tests__/**',
    '!**/node_modules/**'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    // AC-1: enforce >=90% line+branch coverage
    global: {
      branches: 90,
      lines: 90
    }
  }
};
