import BaseFormElementClerk from '../../lib/domClerks/BaseFormElementClerk.js'

/**
 * Clerk class of sign-up form element.
 *
 * @extends {BaseFormElementClerk<typeof SignUpFormElementClerk, SignUpFormValueHash, SchemaVariableHash>}
 */
export default class SignUpFormElementClerk extends BaseFormElementClerk {
  /** @override */
  static get rules () {
    /**
     * @type {Array<furo.FieldValidatorFactoryParams>}
     */
    return [
      // email
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) =>
          !it || /^[^@]+@[^@]+\.[^@]+$/u.test(it),
        field: 'email',
        message: 'email must be valid',
      },

      // username
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it,
        field: 'username',
        message: 'username must be set',
      },
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => /^\w+$/u.test(it),
        field: 'username',
        message: 'username must be alphanumeric',
      },

      // firstName
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it,
        field: 'firstName',
        message: 'firstName must be set',
      },

      // lastName
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it,
        field: 'lastName',
        message: 'lastName must be set',
      },

      // password
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => {
          if (!it) {
            return true
          }

          return it.length >= 1
            && it.length <= 16
        },
        field: 'password',
        message: 'password must be set with at least 1 character and no more than 16 characters',
      },

      // password-confirmation
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => {
          if (!it) {
            return true
          }

          return it === valueHash.password
        },
        field: 'password-confirmation',
        message: 'please re-enter password for confirmation',
      },
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => {
          if (!it) {
            return true
          }

          return it === valueHash.password
        },
        field: 'password-confirmation',
        message: 'passwords do not match',
      },
    ]
  }
}

/**
 * @typedef {{
 *   email: string
 *   username: string
 *   firstName: string
 *   lastName: string
 *   password: string
 *   'password-confirmation': string
 * }} SignUpFormValueHash
 */

/**
 * @typedef {{
 *   email?: string
 *   username?: string
 *   firstName?: string
 *   lastName?: string
 *   password?: string
 * }} SchemaVariableHash
 */
