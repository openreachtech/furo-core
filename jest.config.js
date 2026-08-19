export default {
  collectCoverage: false,
  moduleFileExtensions: [
    'js',
    'json',
  ],
  moduleNameMapper: {
    '^(@.*)$': '<rootDir>/node_modules/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  setupFiles: [
    '<rootDir>/tests/setup.js',
  ],
  setupFilesAfterEnv: [
    '@openreachtech/jest-deep-containing/lib/setup-expect-deepContaining.js',
    '<rootDir>/tests/setup-after-env.js',
  ],
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [
      'node',
      'node-addons',
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@openreachtech/(jest-deep-containing|mentsu-gene-chain-splicer))',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
}
