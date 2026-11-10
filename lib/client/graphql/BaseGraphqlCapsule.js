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
    responseParcel,
    payload,
    result,
    abortedReason,
  }) {
    this.responseParcel = responseParcel
    this.payload = payload
    this.result = result
    this.abortedReason = abortedReason
  }

  /**
   * Factory method.
   *
   * @template {GraphqlType.Payload<*>} P
   * @template {X extends CapsuleCtor<D> ? X : never} C, D, X
   * @param {BaseGraphqlCapsuleFactoryParams<P>} params - Parameters of factory method.
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static create ({
    responseParcel,
    payload,
    result,
    abortedReason = LAUNCH_ABORTED_REASON.NONE,
  }) {
    return /** @type {*} */ (
      new this({
        responseParcel,
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
      responseParcel: null,
      payload: null,
      result: null,
    })
  }

  /**
   * Factory method to create as invalid variables error.
   *
   * @template {GraphqlType.Payload<*>} P
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
      responseParcel: null,
      payload,
      result: null,
      abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
    })
  }

  /**
   * Factory method to create as aborted by hooks.
   *
   * @template {GraphqlType.Payload<*>} P
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
      responseParcel: null,
      payload,
      result: null,
      abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
    })
  }

  /**
   * Factory method to create as network error, which includes a timeout and an abortion.
   *
   * @template {GraphqlType.Payload<*>} P
   * @template {CapsuleCtor<D>} C, D
   * @param {{
   *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*>
   *   payload: P
   * }} params - Parameters.
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static createAsNetworkError ({
    responseParcel,
    payload,
  }) {
    return this.create({
      responseParcel,
      payload,
      result: null,
    })
  }

  /**
   * Factory method to create as JSON parse error.
   *
   * @template {GraphqlType.Payload<*>} P
   * @template {CapsuleCtor<D>} C, D
   * @param {{
   *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*>
   *   payload: P
   * }} params - Parameters.
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static createAsJsonParseError ({
    responseParcel,
    payload,
  }) {
    return this.create({
      responseParcel,
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
   * get: error code for abort error.
   *
   * @returns {string} Error code.
   */
  static get abortErrorCode () {
    return '192.X000.004'
  }

  /**
   * get: error code for timeout error.
   *
   * @returns {string} Error code.
   */
  static get timeoutErrorCode () {
    return '192.X000.003'
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
   * @returns {CapsuleCtor<D>} Constructor.
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
   * @returns {Array<GraphqlType.ResponseError>} Errors.
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
      || this.hasAbortError()
      || this.hasTimeoutError()
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
   * Check to have abort error.
   *
   * @returns {BooleanLike} true: has abort error.
   */
  hasAbortError () {
    if (this.responseParcel === null) {
      return false
    }

    return this.responseParcel.hasAbortError()
  }

  /**
   * Check to have timeout error.
   *
   * @returns {BooleanLike} true: has timeout error.
   */
  hasTimeoutError () {
    if (this.responseParcel === null) {
      return false
    }

    return this.responseParcel.hasTimeoutError()
  }

  /**
   * Check to have network error.
   *
   * Any failure of the fetcher other than an abortion and a timeout is a network error.
   *
   * @returns {BooleanLike} true: has network error.
   */
  hasNetworkError () {
    if (this.responseParcel === null) {
      return true
    }

    return this.responseParcel.hasError()
      && !this.hasAbortError()
      && !this.hasTimeoutError()
  }

  /**
   * Check to have JSON parse error.
   *
   * @returns {BooleanLike} true: has JSON parse error.
   */
  hasJsonParseError () {
    if (this.responseParcel === null) {
      return false
    }

    return this.responseParcel.response !== null
      && !this.result
  }

  /**
   * Check to have query error.
   *
   * @returns {BooleanLike} true: has query error.
   */
  hasQueryError () {
    /*
     * NOTE: Cannot use `this.errors` here.
     * Because `this.result.errors` returns [] via parsed result, it is not the correct approach.
     * `this.errors` always returns an Array, thus we cannot confirm whether `this.result.errors` exists or not.
     */
    return Boolean(
      this.result?.errors
    )
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

    if (this.hasAbortError()) {
      return this.Ctor.abortErrorCode
    }

    if (this.hasTimeoutError()) {
      return this.Ctor.timeoutErrorCode
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
   * @returns {Array<GraphqlType.ResponseError>} Array of errors.
   */
  extractErrors () {
    return this.errors
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

    return /** @type {*} */ (this.content)
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
 *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*> | null
 *   payload: P | null
 *   result: GraphqlResponse | null
 *   abortedReason: LAUNCH_ABORTED_REASON
 * }} BaseGraphqlCapsuleParams
 * @template {GraphqlType.Payload<*>} P
 */

/**
 * @typedef {{
 *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*> | null
 *   payload: P | null
 *   result: GraphqlResponse | null
 *   abortedReason?: LAUNCH_ABORTED_REASON
 * }} BaseGraphqlCapsuleFactoryParams
 * @template {GraphqlType.Payload<*>} P
 */

/**
 * @typedef {{
 *   data?: GraphqlResponseContent
 *   errors?: Array<GraphqlType.ResponseError>
 * }} GraphqlResponse
 */

/**
 * @typedef {Record<string, any>} GraphqlResponseContent
 */

/**
 * @typedef {*} BooleanLike
 */
