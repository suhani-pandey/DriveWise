/**
 * Enforces Feature-Sliced Design import rules.
 * Layers (high → low): app → widgets → features → entities → shared.
 * A layer may only import from layers below it. Slices in the same layer
 * may not import from each other.
 */
module.exports = {
  forbidden: [
    {
      name: 'fsd-no-upward-imports',
      severity: 'error',
      comment: 'A lower FSD layer must not import from a higher one.',
      from: { path: '^src/shared/' },
      to: { path: '^src/(entities|features|widgets|app)/' },
    },
    {
      name: 'entities-cannot-import-features',
      severity: 'error',
      from: { path: '^src/entities/' },
      to: { path: '^src/(features|widgets|app)/' },
    },
    {
      name: 'features-cannot-import-widgets-or-app',
      severity: 'error',
      from: { path: '^src/features/' },
      to: { path: '^src/(widgets|app)/' },
    },
    {
      name: 'widgets-cannot-import-app',
      severity: 'error',
      from: { path: '^src/widgets/' },
      to: { path: '^src/app/' },
    },
    {
      name: 'no-cross-feature-imports',
      severity: 'error',
      comment: 'Slices in the same FSD layer may not import from each other.',
      from: { path: '^src/features/([^/]+)/' },
      to: {
        path: '^src/features/([^/]+)/',
        pathNot: '^src/features/$1/',
      },
    },
    {
      name: 'no-cross-entity-imports',
      severity: 'error',
      from: { path: '^src/entities/([^/]+)/' },
      to: {
        path: '^src/entities/([^/]+)/',
        pathNot: '^src/entities/$1/',
      },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' },
  },
};
