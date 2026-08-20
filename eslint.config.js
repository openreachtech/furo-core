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
      'lib/client/restfulapi/BaseRestfulApiPayload.js',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...coreRuleOptionHash['no-restricted-syntax']
          .spreadOptions
          .filter(it => !it.selector.includes('[callee.property.name="sort"]')),
        {
          // Allow `URLSearchParams#sort()`
          selector: 'CallExpression[callee.type=MemberExpression][callee.property.name="sort"]'
            + ':not([callee.object.name=queryBuilder])', // `queryBuilder` is an instance of `URLSearchParams` in target files.
          message: 'Use Array#toSorted() instead of Array#sort()',
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
