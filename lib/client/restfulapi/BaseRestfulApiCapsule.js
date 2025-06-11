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
 * Base class for RestfulApi capsule.
 *
 * @template D - Type of content.
 * @template {RestfulApiType.Payload<*, *, *>} [P = RestfulApiType.Payload<*, *, *>] - Type of payload.
 */
export default class BaseRestfulApiCapsule {
  /**
   * Constructor.
   *
   * @param {BaseRestfulApiCapsuleParams<*>} params
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
   * @template {RestfulApiType.Payload<*, *, *>} P
   * @template {X extends CapsuleCtor<D> ? X : never} C, D, X
   * @param {BaseRestfulApiCapsuleFactoryParams<P>} params - Parameters of factory method.
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
   * @template {RestfulApiType.Payload<*, *, *>} P
   * @template {CapsuleCtor<D>} C, D
   * @param {{
   *   payload: P
   * }} params - Parameters.
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static createAsInvalidParametersError ({
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
   * @template {RestfulApiType.Payload<*, *, *>} P
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
   * @template {RestfulApiType.Payload<*, *, *>} P
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
   * @template {RestfulApiType.Payload<*, *, *>} P
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
   * get: error code for invalid parameter hash.
   *
   * @returns {string} Error code.
   */
  static get invalidParameterHashErrorCode () {
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
   * @returns {CapsuleCtor<D>} Constructor.
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }

  /**
   * get: Content as result.content
   *
   * @returns {D | null} Content.
   */
  get content () {
    return /** @type {D} */ (this.result?.content)
      ?? null
  }

  /**
   * get: Error as result.error
   *
   * @returns {RestfulApiResponseError | null} Error.
   */
  get error () {
    return this.result?.error
      ?? null
  }

  /**
   * get: HTTP method.
   *
   * @returns {string | null} HTTP method.
   */
  get requestMethod () {
    if (!this.payload) {
      return null
    }

    return this.payload.Ctor.method
  }

  /**
   * get: HTTP status code.
   *
   * @returns {number | null} HTTP status code.
   */
  get statusCode () {
    if (!this.rawResponse) {
      return null
    }

    return this.rawResponse.status
  }

  /**
   * get: HTTP status text.
   *
   * @returns {string | null} HTTP status text.
   */
  get statusText () {
    if (!this.rawResponse) {
      return null
    }

    return this.rawResponse.statusText
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
    return this.hasInvalidParameterHashError()
      || this.hasQueryError()
      || this.hasNetworkError()
      || this.hasJsonParseError()
      || this.hasStatusCodeError()
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
   * Check to have invalid parameter hash error.
   *
   * @returns {BooleanLike} true: has query error.
   */
  hasInvalidParameterHashError () {
    if (!this.payload) {
      return false
    }

    return this.payload.isInvalidAllParameterHash()
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
    return Boolean(
      this.result?.error
    )
  }

  /**
   * Check to have status code error.
   *
   * @returns {BooleanLike} true: has query error.
   */
  hasStatusCodeError () {
    if (!this.statusCode) {
      return false
    }

    return !this.rawResponse.ok
      && this.rawResponse.status >= 400
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

    if (this.hasInvalidParameterHashError()) {
      return this.Ctor.invalidParameterHashErrorCode
    }

    if (this.hasNetworkError()) {
      return this.Ctor.networkErrorCode
    }

    if (this.hasJsonParseError()) {
      return this.Ctor.jsonParseErrorCode
    }

    if (this.hasStatusCodeError()) {
      return this.generateErrorCodeByStatusError()
    }

    if (this.hasQueryError()) {
      return this.error?.code
        ?? this.Ctor.unknownErrorCode
    }

    return null
  }

  /**
   * Generate error code by status code.
   *
   * @returns {string} Error code.
   */
  generateErrorCodeByStatusError () {
    if (!this.statusCode) {
      return this.Ctor.unknownErrorCode
    }

    return `193.X000.${this.statusCode}`
  }
}

/**
 * @typedef {typeof BaseRestfulApiCapsule<D, P>} CapsuleCtor
 * @template D - Type of content.
 * @template {RestfulApiType.Payload<*, *, *>} [P = RestfulApiType.Payload<*, *, *>] - Type of payload.
 */

/**
 * @typedef {InstanceType<CapsuleCtor<D, P>>} Capsule
 * @template D - Type of content.
 * @template {RestfulApiType.Payload<*, *, *>} [P = RestfulApiType.Payload<*, *, *>] - Type of payload.
 */

/**
 * @typedef {{
 *   rawResponse: Response | null
 *   payload: P | null
 *   result: RestfulApiResponse | null
 *   abortedReason: LAUNCH_ABORTED_REASON
 * }} BaseRestfulApiCapsuleParams
 * @template {RestfulApiType.Payload<*, *, *>} P
 */

/**
 * @typedef {{
 *   rawResponse: Response | null
 *   payload: P | null
 *   result: RestfulApiResponse | null
 *   abortedReason?: LAUNCH_ABORTED_REASON
 * }} BaseRestfulApiCapsuleFactoryParams
 * @template {RestfulApiType.Payload<*, *, *>} P
 */

/**
 * @typedef {{
 *   content?: RestfulApiResponseContent | null
 *   error?: RestfulApiResponseError | null
 * }} RestfulApiResponse
 */

/**
 * @typedef {Record<string, *>} RestfulApiResponseContent
 */

/**
 * @typedef {{
 *   code: string
 * }} RestfulApiResponseError
 */

/**
 * @typedef {*} BooleanLike
 */
