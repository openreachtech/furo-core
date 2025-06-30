import BaseFormElementClerk from '../../lib/domClerks/BaseFormElementClerk.js'

/**
 * Form element clerk of upload image form element.
 *
 * @extends {BaseFormElementClerk<UploadImageFormValueHash>}
 */
export default class UploadImageFormElementClerk extends BaseFormElementClerk {
  /** @override */
  static get rules () {
    /**
     * @type {Array<furo.FieldValidatorFactoryParams>}
     */
    return [
      // image
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it,
        field: 'image',
        message: 'require image file',
      },
    ]
  }
}

/**
 * @typedef {{
 *   image: File
 * }} UploadImageFormValueHash
 */
