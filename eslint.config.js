import {
  default as openreachtechConfig,
  coreRuleOptionHash,
} from '@openreachtech/eslint-config'

/**
 * ESLint Config
 *
 * @type {Array<import('eslint').Linter.Config>}
 */
export default [
  ...openreachtechConfig,

  {
    files: [
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
    ],
    rules: {
      'no-param-reassign': [
        'error',
        {
          props: true, // false
          ignorePropertyModificationsFor: [ // []
            'element', // Allow reassignment for HTML element.
          ],
          ignorePropertyModificationsForRegex: [],
        },
      ],
    },
  },

  {
    files: [
      'tests/__tests__/lib/client/graphql/BaseGraphqlCapsule.js',
      'tests/__tests__/lib/client/graphql/BaseGraphqlLauncher.js',
    ],
    rules: {
      'id-denylist': [
        'error',
        ...coreRuleOptionHash['id-denylist']
          .spreadOptions
          .filter(it => it !== 'data'), // Allow `data` as GraphQL response property.
      ],
    },
  },
]
