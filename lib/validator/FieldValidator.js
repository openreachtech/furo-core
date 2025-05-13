/**
 * Field validator.
 */
export default class FieldValidator {
  /**
   * Constructor of FieldValidator
   *
   * @param {FieldValidatorParams} params - Parameters.
   */
  constructor ({
    field,
    ok,
    message = null,
  }) {
    this.field = field
    this.okFunction = ok
    this.message = message
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof FieldValidator ? X : never} T, X
   * @param {FieldValidatorFactoryParams} params - Parameters.
   * @returns {InstanceType<T>} An instance of this class.
   * @this {T}
   */
  static create (params) {
    return /** @type {InstanceType<T>} */ (
      new this(params)
    )
  }

  /**
   * Accepts for the field.
   *
   * @param {{
   *   field: string
   * }} args - Arguments.
   * @returns {boolean} true: Accepts, false: Rejects.
   */
  accepts ({
    field,
  }) {
    return this.field === field
  }

  /**
   * Rejects for the field.
   *
   * @param {{
   *   field: string
   * }} args - Arguments.
   * @returns {boolean} true: Rejects, false: Accepts.
   */
  rejects ({
    field,
  }) {
    return !this.accepts({ field })
  }

  /**
   * Is valid the target.
   *
   * @param {{
   *   target: any
   *   variables: object
   * }} args - Arguments.
   * @returns {boolean} true: valid, false: invalid.
   */
  isValid ({
    target,
    variables,
  }) {
    return this.okFunction(target, variables)
  }

  /**
   * Is invalid the target.
   *
   * @param {{
   *   target: any
   *   variables: object
   * }} args - Arguments.
   * @returns {boolean} true: invalid, false: valid.
   */
  isInvalid ({
    target,
    variables,
  }) {
    return !this.isValid({
      target,
      variables,
    })
  }

  /**
   * Get the message.
   *
   * @returns {string | null} Message.
   */
  getMessage () {
    return this.message
  }
}

/**
 * @typedef {typeof FieldValidator} FieldValidatorCtor
 */

/**
 * @typedef {{
 *   field: string
 *   ok: ValidationRule
 *   message?: string | null
 * }} FieldValidatorParams
 */

/**
 * @typedef {FieldValidatorParams} FieldValidatorFactoryParams
 */

/**
 * @typedef {(
 *   it: any,
 *   valueHash: {
 *     [field: string]: any
 *   }
 * ) => boolean | *} ValidationRule
 */
