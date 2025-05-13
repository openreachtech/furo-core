import FieldValidator from './FieldValidator.js'

/**
 * Field validation result.
 */
export default class ValueHashValidator {
  /**
   * Constructor of ValueHashValidator
   *
   * @param {ValueHashValidatorParams} params - Parameters.
   */
  constructor ({
    valueHash,
    validators,
  }) {
    this.valueHash = valueHash
    this.validators = validators
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof ValueHashValidator ? X : never} T, X
   * @param {ValueHashValidatorFactoryParams} params - Parameters.
   * @returns {InstanceType<T>} An instance of this class.
   * @this {T}
   */
  static create ({
    valueHash,
    rules,
  }) {
    const validators = rules.map(
      it =>
        FieldValidator.create(it)
    )

    return /** @type {InstanceType<T>} */ (
      new this({
        valueHash,
        validators,
      })
    )
  }

  /**
   * Is valid valueHash.
   *
   * @returns {boolean} true: valid.
   */
  isValid () {
    const fieldNames = this.extractFieldNames()

    /**
     * @type {Array<{
     *   field: string
     *   validators: Array<furo.FieldValidator>
     * }>} Entries.
     */
    const entries = fieldNames.map(field => ({
      field,
      validators: this.extractValidators({
        field,
      }),
    }))

    return entries
      .flatMap(({
        field,
        validators,
      }) =>
        validators.every(it =>
          it.isValid({
            target: this.valueHash[field],
            variables: this.valueHash,
          })
        )
      )
      .every(it => it)
  }

  /**
   * Is invalid valueHash.
   *
   * @returns {boolean} true: invalid.
   */
  isInvalid () {
    return !this.isValid()
  }

  /**
   * Generate validation hash.
   *
   * @returns {ValidatorHashType} Validation hash.
   * @public
   */
  generateValidationHash () {
    return {
      valid: this.generateIsValidHash(),
      invalid: this.generateIsInvalidHash(),
      messages: this.generateAllMessagesHash(),
      message: this.generateOneMessageHash(),
    }
  }

  /**
   * Generate isValid hash.
   *
   * @returns {Record<string, boolean>} Validation result.
   */
  generateIsValidHash () {
    const fieldNames = this.extractFieldNames()

    return Object.fromEntries(
      fieldNames.map(field => [
        field,
        this.isValidField({
          field,
        }),
      ])
    )
  }

  /**
   * Generate isInvalid hash.
   *
   * @returns {Record<string, boolean>} Validation result.
   */
  generateIsInvalidHash () {
    const fieldNames = this.extractFieldNames()

    return Object.fromEntries(
      fieldNames.map(field => [
        field,
        this.isInvalidField({
          field,
        }),
      ])
    )
  }

  /**
   * Generate all messages hash.
   *
   * @returns {Record<string, Array<string>>} Validation result.
   */
  generateAllMessagesHash () {
    const fieldNames = this.extractFieldNames()

    return Object.fromEntries(
      fieldNames.map(field => [
        field,
        this.getAllMessages({
          field,
        }),
      ])
    )
  }

  /**
   * Generate one message hash.
   *
   * @returns {Record<string, string | null>} Validation result.
   */
  generateOneMessageHash () {
    const fieldNames = this.extractFieldNames()

    return Object.fromEntries(
      fieldNames.map(field => [
        field,
        this.getOneMessage({
          field,
        }),
      ])
    )
  }

  /**
   * Is valid field.
   *
   * @param {{
   *   field: string
   * }} params - Parameters.
   * @returns {boolean} true: valid.
   */
  isValidField ({
    field,
  }) {
    const validators = this.extractValidators({
      field,
    })

    return validators
      .every(it =>
        it.isValid({
          target: this.valueHash[field],
          variables: this.valueHash,
        })
      )
  }

  /**
   * Is invalid field.
   *
   * @param {{
   *   field: string
   * }} params - Parameters.
   * @returns {boolean} true: invalid.
   */
  isInvalidField ({
    field,
  }) {
    return !this.isValidField({
      field,
    })
  }

  /**
   * Extract field names.
   *
   * @returns {Array<string>} Field names.
   */
  extractFieldNames () {
    return Object.keys(this.valueHash)
  }

  /**
   * Extract validators.
   *
   * @param {{
   *   field: string
   * }} params - Parameters.
   * @returns {Array<furo.FieldValidator>} Validators.
   */
  extractValidators ({
    field,
  }) {
    return this.validators
      .filter(it =>
        it.accepts({
          field,
        })
      )
  }

  /**
   * Get all messages by field.
   *
   * @param {{
   *   field: string
   * }} params - Parameters.
   * @returns {Array<string>} Error messages.
   */
  getAllMessages ({
    field,
  }) {
    const validators = this.extractValidators({
      field,
    })

    return validators
      .filter(it =>
        it.isInvalid({
          target: this.valueHash[field],
          variables: this.valueHash,
        })
      )
      .map(it =>
        it.getMessage()
      )
      .filter(it =>
        it !== null
      )
  }

  /**
   * Get one message by field.
   *
   * @param {{
   *   field: string
   * }} params - Parameters.
   * @returns {string | null} Error message.
   */
  getOneMessage ({
    field,
  }) {
    return this.getAllMessages({
      field,
    })
      .at(0)
      ?? null
  }
}

/**
 * @typedef {{
 *   valueHash: Record<string, any>
 *   validators: Array<furo.FieldValidator>
 * }} ValueHashValidatorParams
 */

/**
 * @typedef {{
 *   valueHash: Record<string, any>
 *   rules: Array<furo.FieldValidatorParams>
 * }} ValueHashValidatorFactoryParams
 */

/**
 * @typedef {{
 *   valid: Record<string, boolean>
 *   invalid: Record<string, boolean>
 *   messages: Record<string, Array<string>>
 *   message: Record<string, string | null>
 * }} ValidatorHashType
 */
