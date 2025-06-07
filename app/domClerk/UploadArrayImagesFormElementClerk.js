import BaseFormElementClerk from '../../lib/domClerks/BaseFormElementClerk.js'

/**
 * Form element clerk of upload array images form element.
 *
 * @extends {BaseFormElementClerk<UploadArrayImagesFormValueHash>}
 */
export default class UploadArrayImagesFormElementClerk extends BaseFormElementClerk {
  /** @override */
  static get rules () {
    /**
     * @type {Array<furo.FieldValidatorFactoryParams>}
     */
    return [
      // images
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it.length > 0,
        field: 'images',
        message: 'At least one image file is required',
      },
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it.length <= 5,
        field: 'images',
        message: 'up to 5 files',
      },
    ]
  }
}

/**
 * @typedef {{
 *   images: Array<File>
 * }} UploadArrayImagesFormValueHash
 */
