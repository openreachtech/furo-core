import BaseFormElementClerk from '../../lib/domClerks/BaseFormElementClerk.js'

/**
 * Form element clerk of upload deep property images form element.
 *
 * @extends {BaseFormElementClerk<UploadDeepPropertyImagesFormValueHash>}
 */
export default class UploadDeepPropertyImagesFormElementClerk extends BaseFormElementClerk {
  /** @override */
  static get rules () {
    /**
     * @type {Array<furo.FieldValidatorFactoryParams>}
     */
    return [
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it?.length > 0,
        field: 'nickname',
        message: 'Nickname is required',
      },
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it?.length > 0,
        field: 'bio',
        message: 'Bio is required',
      },
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it,
        field: 'avatarImage',
        message: 'Avatar image is required',
      },
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it?.length > 0,
        field: 'themeColor',
        message: 'Theme color is required',
      },
      {
        /** @type {furo.ValidationRule} */
        ok: (it, valueHash) => it,
        field: 'coverImage',
        message: 'Cover image is required',
      },
    ]
  }
}

/**
 * @typedef {{
 *   nickname: string
 *   bio: string
 *   avatarImage: File
 *   themeColor: string
 *   coverImage: File
 * }} UploadDeepPropertyImagesFormValueHash
 */
