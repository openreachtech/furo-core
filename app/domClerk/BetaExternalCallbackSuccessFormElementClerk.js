import BaseFormElementClerk from '../../lib/domClerks/BaseFormElementClerk.js'

/**
 * Clerk class of the form element for the beta external callback success.
 *
 * @extends {BaseFormElementClerk<BetaExternalCallbackSuccessFormValueHash>}
 */
export default class BetaExternalCallbackSuccessFormElementClerk extends BaseFormElementClerk {
  /** @override */
  static get rules () {
    /**
     * @type {Array<furo.FieldValidatorFactoryParams>}
     */
    return [
      // first
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it,
        field: 'first',
        message: 'first must be set',
      },

      // second
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it,
        field: 'second',
        message: 'second must be set',
      },
    ]
  }
}

/**
 * @typedef {{
 *   first: string
 *   second: string
 * }} BetaExternalCallbackSuccessFormValueHash
 */
