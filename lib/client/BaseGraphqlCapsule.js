/**
 * enum: Launch aborted reason.
 *
 * @enum {symbol}
 */
export const LAUNCH_ABORTED_REASON = {
  NONE: Symbol('not aborted'),
  INVALID_VARIABLES: Symbol('aborted by invalid variables'),
  BEFORE_REQUEST_HOOK: Symbol('aborted by before request hook'),
  UNKNOWN: Symbol('aborted by unknown cause'),
}

/**
 * Base class for GraphQL capsule.
 *
 * @template D - Type of content (data).
 */
export default class BaseGraphqlCapsule {
  /**
   * Constructor.
   *
   * @param {BaseGraphqlCapsuleParams<*>} params
   */
  constructor ({
    rawResponse,
    payload,
    result,
    abortedReason,
  }) {
    this.rawResponse = rawResponse
    this.payload = payload
    this.result = result
    this.abortedReason = abortedReason
  }

  /**
   * Factory method.
   *
   * @template {furo.Payload<*>} P
   * @template {X extends CapsuleCtor<D> ? X : never} C, D, X
   * @param {BaseGraphqlCapsuleFactoryParams<P>} params - Parameters of factory method.
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static create ({
    rawResponse,
    payload,
    result,
    abortedReason = LAUNCH_ABORTED_REASON.NONE,
  }) {
    return /** @type {*} */ (
      new this({
        rawResponse,
        payload,
        result,
        abortedReason,
      })
    )
  }

  /**
   * Factory method to create as pending behavior.
   *
   * @template {CapsuleCtor<D>} C, D
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static createAsPending () {
    return this.create({
      rawResponse: null,
      payload: null,
      result: null,
    })
  }

  /**
   * Factory method to create as invalid variables error.
   *
   * @template {furo.Payload<*>} P
   * @template {CapsuleCtor<D>} C, D
   * @param {{
   *   payload: P
   * }} params - Parameters.
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static createAsInvalidVariablesError ({
    payload,
  }) {
    return this.create({
      rawResponse: null,
      payload,
      result: null,
      abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
    })
  }

  /**
   * Factory method to create as aborted by hooks.
   *
   * @template {furo.Payload<*>} P
   * @template {CapsuleCtor<D>} C, D
   * @param {{
   *   payload: P
   * }} params - Parameters.
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static createAsAbortedByHooks ({
    payload,
  }) {
    return this.create({
      rawResponse: null,
      payload,
      result: null,
      abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
    })
  }

  /**
   * Factory method to create as network error.
   *
   * @template {furo.Payload<*>} P
   * @template {CapsuleCtor<D>} C, D
   * @param {{
   *   payload: P
   * }} params - Parameters.
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static createAsNetworkError ({
    payload,
  }) {
    return this.create({
      rawResponse: null,
      payload,
      result: null,
    })
  }

  /**
   * Factory method to create as JSON parse error.
   *
   * @template {furo.Payload<*>} P
   * @template {CapsuleCtor<D>} C, D
   * @param {{
   *   rawResponse: Response
   *   payload: P
   * }} params - Parameters.
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static createAsJsonParseError ({
    rawResponse,
    payload,
  }) {
    return this.create({
      rawResponse,
      payload,
      result: null,
    })
  }

  /**
   * get: error code for unknown error.
   *
   * @returns {string} Error code.
   */
  static get unknownErrorCode () {
    return '190.X000.001'
  }

  /**
   * get: error code for invalid variables.
   *
   * @returns {string} Error code.
   */
  static get invalidVariablesErrorCode () {
    return '191.X000.001'
  }

  /**
   * get: error code for network error.
   *
   * @returns {string} Error code.
   */
  static get networkErrorCode () {
    return '192.X000.001'
  }

  /**
   * get: error code for JSON parse error.
   *
   * @returns {string} Error code.
   */
  static get jsonParseErrorCode () {
    return '192.X000.002'
  }

  /**
   * get: constructor of own class.
   *
   * @returns {furo.CapsuleCtor<D>} Constructor.
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }

  /**
   * get: Content as result.data
   *
   * @returns {D | null} Content.
   */
  get content () {
    return /** @type {D} */ (this.result?.data)
      ?? null
  }

  /**
   * get: Errors as result.errors
   *
   * @returns {Array<GraphqlResponseError>} Errors.
   */
  get errors () {
    return this.result?.errors
      ?? []
  }

  /**
   * Check to have content.
   *
   * @returns {boolean} true: has content.
   */
  hasContent () {
    return Boolean(this.content)
  }

  /**
   * Check to have error.
   *
   * @returns {BooleanLike} true: has error.
   */
  hasError () {
    return this.hasQueryError()
      || this.hasNetworkError()
      || this.hasJsonParseError()
  }

  /**
   * Check to be pending.
   *
   * @returns {BooleanLike} true: is pending (pre-fetching).
   */
  isPending () {
    return this.payload === null
  }

  /**
   * Check to have invalid variables error
   *
   * @returns {BooleanLike} true: has query error.
   */
  hasInvalidVariablesError () {
    if (!this.payload) {
      return false
    }

    return this.payload.isInvalidVariables()
  }

  /**
   * Check to have network error.
   *
   * @returns {BooleanLike} true: has network error.
   */
  hasNetworkError () {
    return this.rawResponse === null
  }

  /**
   * Check to have JSON parse error.
   *
   * @returns {BooleanLike} true: has JSON parse error.
   */
  hasJsonParseError () {
    return this.rawResponse
      && !this.result
  }

  /**
   * Check to have query error.
   *
   * @returns {BooleanLike} true: has query error.
   */
  hasQueryError () {
    return this.result
      ?.errors
      ?? false
  }

  /**
   * Get error message.
   *
   * @returns {string | null} Error message.
   */
  getErrorMessage () {
    if (this.isPending()) {
      return null
    }

    if (this.hasInvalidVariablesError()) {
      return this.Ctor.invalidVariablesErrorCode
    }

    if (this.hasNetworkError()) {
      return this.Ctor.networkErrorCode
    }

    if (this.hasJsonParseError()) {
      return this.Ctor.jsonParseErrorCode
    }

    if (!this.hasQueryError()) {
      return null
    }

    return this.extractErrors()
      .at(0)
      ?.message
      ?? this.Ctor.unknownErrorCode
  }

  /**
   * Extract errors from #result.
   *
   * @returns {Array<GraphqlResponseError>} Array of errors.
   */
  extractErrors () {
    return this.result
      ?.errors
      ?? []
  }

  /**
   * Extract content from #result.
   *
   * @returns {D | null} Content.
   */
  extractContent () {
    if (this.hasError()) {
      return null
    }

    return /** @type {*} */ (
      this.result?.data
      ?? null
    )
  }
}

/**
 * @typedef {typeof BaseGraphqlCapsule<D>} CapsuleCtor
 * @template D - Type of content (data).
 */

/**
 * @typedef {InstanceType<CapsuleCtor<D>>} Capsule
 * @template D - Type of content (data).
 */

/**
 * @typedef {{
 *   rawResponse: Response | null
 *   payload: P | null
 *   result: GraphqlResponse | null
 *   abortedReason: LAUNCH_ABORTED_REASON
 * }} BaseGraphqlCapsuleParams
 * @template {furo.Payload<*>} P
 */

/**
 * @typedef {{
 *   rawResponse: Response | null
 *   payload: P | null
 *   result: GraphqlResponse | null
 *   abortedReason?: LAUNCH_ABORTED_REASON
 * }} BaseGraphqlCapsuleFactoryParams
 * @template {furo.Payload<*>} P
 */

/**
 * @typedef {{
 *   data?: GraphqlResponseContent
 *   errors?: Array<GraphqlResponseError>
 * }} GraphqlResponse
 */

/**
 * @typedef {Record<string, any>} GraphqlResponseContent
 */

/**
 * @typedef {{
 *   message: string
 *   locations: Array<{
 *     line: number
 *     column: number
 *   }>
 *   path?: Array<string>
 * }} GraphqlResponseError
 */

/**
 * @typedef {*} BooleanLike
 */
