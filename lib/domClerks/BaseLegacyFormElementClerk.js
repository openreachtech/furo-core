import FormControlElementClerk from './FormControlElementClerk.js'
import VariablesValidator from '../validator/ValueHashValidator.js'

/**
 * Base class of form element clerk.
 *
 * @template T
 * @template {FormValueHashType} FV - Form value hash.
 * @template {Record<string, *>} SV - Schema variable hash.
 */
export default class BaseLegacyFormElementClerk {
  /**
   * Constructor of BaseLegacyFormElementClerk.
   *
   * @param {BaseLegacyFormElementClerkParams} params
   */
  constructor ({
    formElement,
  }) {
    this.formElement = formElement
  }

  /**
   * Factory method of BaseLegacyFormElementClerk.
   *
   * @template {FormValueHashType} FV - Form value hash.
   * @template {Record<string, *>} SV - Schema variable hash.
   * @template {X extends FormElementClerkCtor<T, FV, SV> ? X : never} T, X
   * @param {BaseLegacyFormElementClerkFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    formElement,
  }) {
    return /** @type {*} */ (
      new this({
        formElement,
      })
    )
  }

  /**
   * get: Rules of the field validator.
   *
   * @abstract
   * @returns {Array<furo.FieldValidatorFactoryParams>} Array of arguments to create an instance of FieldValidator.
   */
  static get rules () {
    return []
  }

  /**
   * get: Constructor from instance.
   *
   * @template {FormElementClerkCtor<*, *, *>} T
   * @returns {T} Constructor of the instance.
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }

  /**
   * get: All control elements of the form.
   *
   * @returns {Array<FormControlElementType>}
   */
  get controlElements () {
    return /** @type {Array<*>} */ (
      [...this.formElement.elements]
    )
  }

  /**
   * Generate validation hash.
   *
   * @returns {furo.ValidatorHashType} Validation result.
   * @public
   */
  generateValidationHash () {
    const validator = VariablesValidator.create({
      valueHash: this.extractValueHash(),
      rules: this.Ctor.rules,
    })

    return validator.generateValidationHash()
  }

  /**
   * Is valid.
   *
   * @returns {boolean} true: valid.
   */
  isValid () {
    const validationHash = this.generateValidationHash()

    return Object.values(validationHash.valid)
      .every(it => it)
  }

  /**
   * Is invalid.
   *
   * @returns {boolean} true: invalid.
   */
  isInvalid () {
    return !this.isValid()
  }

  /**
   * Extract value hash from the form element.
   *
   * @returns {FV} Hash of form control value.
   */
  extractValueHash () {
    const controlHash = this.extractControlElements()

    return /** @type {*} */ (
      Object.fromEntries(
        Object.entries(controlHash)
          .map(([name, control]) => [
            name,
            FormControlElementClerk.create({
              control,
            })
              .extractFormControlValue(),
          ])
      )
    )
  }

  /**
   * Extract control elements by object hash.
   *
   * @returns {Record<string, FormControlElementHash>} Hash of form control elements.
   */
  extractControlElements () {
    const names = this.extractNames()

    return Object.fromEntries(
      names.map(it => [
        it,
        this.formElement[it],
      ])
    )
  }

  /**
   * Extract names of the control elements.
   *
   * @returns {Array<string>}
   */
  extractNames () {
    return /** @type {Array<*>} */ (
      [...new Set(
        this.controlElements
          .map(it => it.getAttribute('name'))
          .filter(it => it)
      )]
    )
  }
}

/**
 * @typedef {typeof BaseLegacyFormElementClerk<T, FV, SV>} FormElementClerkCtor
 * @template {typeof BaseLegacyFormElementClerk<T, FV, SV>} T
 * @template {FormValueHashType} FV - Form value hash.
 * @template {Record<string, *>} SV - Schema variable hash.
 */

/**
 * @typedef {InstanceType<FormElementClerkCtor<T, FV, SV>>} FormElementClerk
 * @template {FormElementClerkCtor<T, FV, SV>} T
 * @template {FormValueHashType} FV - Form value hash.
 * @template {Record<string, *>} SV - Schema variable hash.
 */

/**
 * @typedef {{
 *   formElement: HTMLFormElement
 * }} BaseLegacyFormElementClerkParams
 */

/**
 * @typedef {BaseLegacyFormElementClerkParams} BaseLegacyFormElementClerkFactoryParams
 */

/**
 * @typedef {FormControlElementType | RadioNodeList} FormControlElementHash
 */

/**
 * @typedef {HTMLButtonElement
 *   | HTMLInputElement
 *   | HTMLOptionElement
 *   | HTMLSelectElement
 *   | HTMLTextAreaElement
 * } FormControlElementType
 */

/**
 * @typedef {{
 *   [name: string]: furo.FormControlElementValueType
 * }} FormValueHashType
 */
