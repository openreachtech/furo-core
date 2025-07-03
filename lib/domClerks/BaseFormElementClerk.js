import FormElementInspector from '../dom/FormElementInspector.js'
import VariablesValidator from '../validator/ValueHashValidator.js'

/**
 * Base class of form element clerk.
 *
 * @template {FormValueHashType} FV - Form value hash.
 */
export default class BaseFormElementClerk {
  /**
   * Constructor of BaseFormElementClerk.
   *
   * @param {BaseFormElementClerkParams} params
   */
  constructor ({
    formElement,
  }) {
    this.formElement = formElement
  }

  /**
   * Factory method of BaseFormElementClerk.
   *
   * @template {X extends FormElementClerkCtor<*> ? X : never} T, X
   * @param {BaseFormElementClerkFactoryParams} params - Parameters of factory method.
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
   * @template {FormElementClerkCtor<*>} T
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
   * @public
   */
  extractValueHash () {
    const inspector = this.createFormElementInspector()

    return /** @type {FV} */ (
      inspector.extractValueHash()
    )
  }

  /**
   * Create an instance of FormElementInspector.
   *
   * @returns {FormElementInspector} An instance of FormElementInspector.
   */
  createFormElementInspector () {
    return FormElementInspector.create({
      formElement: this.formElement,
    })
  }
}

/**
 * @typedef {typeof BaseFormElementClerk<FV>} FormElementClerkCtor
 * @template {FormValueHashType} FV - Form value hash.
 */

/**
 * @typedef {InstanceType<FormElementClerkCtor<FV>>} FormElementClerk
 * @template {FormValueHashType} FV - Form value hash.
 */

/**
 * @typedef {{
 *   formElement: HTMLFormElement
 * }} BaseFormElementClerkParams
 */

/**
 * @typedef {BaseFormElementClerkParams} BaseFormElementClerkFactoryParams
 */

/**
 * @typedef {FormControlElementType | RadioNodeList} FormControlElementHash
 */

/**
 * @typedef {HTMLButtonElement
 *   | HTMLInputElement
 *   | HTMLSelectElement
 *   | HTMLTextAreaElement
 * } FormControlElementType
 */

/**
 * @typedef {Record<string, *>} FormValueHashType
 */
