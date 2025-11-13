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
    languageOptions: {
      globals: {
        graphqlWs: 'readonly',
      },
    },
  },

  {
    rules: {
      'no-param-reassign': [
        'error',
        {
          props: true, // false
          ignorePropertyModificationsFor: [ // []
            'element',
          ],
          ignorePropertyModificationsForRegex: [],
        },
      ],
      'no-restricted-syntax': [
        'error',
        // There are 0 or more rest parameters in the array
        // string | { selector: string, message: string }

        // NOTE: It's ok to use Array#forEach if there's only one statement in the callback function.
        // {
        //   selector: 'CallExpression[callee.property.name=forEach]',
        //   message: 'Never use forEach method',
        // },
        ...coreRuleOptionHash['no-restricted-syntax'].spreadOptions
          .filter(
            it =>
              it.selector !== 'CallExpression[callee.property.name=forEach]'
          )
          .filter(it => true),

        {
          selector: 'CallExpression[callee.property.name=forEach]:has(* VariableDeclarator)',
          message: 'Do not use assignment inside Array#forEach()',
        },
      ],
    },
  },

  {
    files: [
      'tests/**/*.js',
    ],
    rules: {
      'max-classes-per-file': 'off',
    },
  },

  // Turn off some rules for specific files
  {
    // 🚨 Never add other files to this files.
    files: [
      'lib/client/restfulapi/BaseRestfulApiPayload.js',
    ],
    rules: {
      'eslint-comments/no-use': 'off',
      'eslint-comments/require-description': 'off',
    },
  },
]
