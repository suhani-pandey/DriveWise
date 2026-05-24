/**
 * Enforces the architectural rule that protects long-term maintainability:
 *   - Features may not import from other features.
 *   - Shared/infrastructure code may not import from features.
 *
 * Run: `pnpm deps:check` (or `npm run deps:check`)
 */
module.exports = {
  forbidden: [
    {
      name: 'no-cross-feature-imports',
      severity: 'error',
      comment:
        'A feature module must not import from another feature module. ' +
        'If two features need to share, promote the code to src/shared/ ' +
        'or expose a Nest service via the owning module.',
      from: { path: '^src/modules/([^/]+)/' },
      to: {
        path: '^src/modules/([^/]+)/',
        pathNot: '^src/modules/$1/',
      },
    },
    {
      name: 'shared-cannot-depend-on-features',
      severity: 'error',
      comment: 'src/shared must remain feature-agnostic.',
      from: { path: '^src/shared/' },
      to: { path: '^src/modules/' },
    },
    {
      name: 'infrastructure-cannot-depend-on-features',
      severity: 'error',
      comment: 'src/infrastructure adapters must not import feature code.',
      from: { path: '^src/infrastructure/' },
      to: { path: '^src/modules/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' },
  },
};
