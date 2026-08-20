import openreachtechConfig from '@openreachtech/eslint-config'

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
]
