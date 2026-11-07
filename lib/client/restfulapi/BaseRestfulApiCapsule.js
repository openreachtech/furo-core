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
 * @template R - Type of result.
 * @template {RestfulApiType.Payload<*, *, *>} [P = RestfulApiType.Payload<*, *, *>] - Type of payload.
 */
export default class BaseRestfulApiCapsule {
  /**
   * Constructor.
   *
   * @param {BaseRestfulApiCapsuleParams<R, P>} params
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
   * @template {RestfulApiType.Payload<*, *, *>} P
   * @template {X extends CapsuleCtor<R, P> ? X : never} C, R, X
   * @param {BaseRestfulApiCapsuleFactoryParams<R, P>} params - Parameters of factory method.
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
   * @template {RestfulApiType.Payload<*, *, *>} P
   * @template {CapsuleCtor<R, P>} C, R
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
   * @template {RestfulApiType.Payload<*, *, *>} P
   * @template {CapsuleCtor<R, P>} C, R
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
      responseParcel: null,
      payload,
      result: null,
      abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
    })
  }

  /**
   * Factory method to create as aborted by hooks.
   *
   * @template {RestfulApiType.Payload<*, *, *>} P
   * @template {CapsuleCtor<R>} C, R
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
   * @template {RestfulApiType.Payload<*, *, *>} P
   * @template {CapsuleCtor<R>} C, R
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
   * Factory method to create as response body parse error.
   *
   * @template {RestfulApiType.Payload<*, *, *>} P
   * @template {CapsuleCtor<R>} C, R
   * @param {{
   *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*>
   *   payload: P
   * }} params - Parameters.
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static createAsResponseBodyParseError ({
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
   * get: error code for invalid parameter hash.
   *
   * @returns {string} Error code.
   */
  static get invalidParameterHashErrorCode () {
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
   * get: error code for response body parse error.
   *
   * @returns {string} Error code.
   */
  static get responseBodyParseErrorCode () {
    return '192.X000.002'
  }

  /**
   * get: constructor of own class.
   *
   * @returns {CapsuleCtor<R>} Constructor.
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
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
    if (!this.responseParcel) {
      return null
    }

    return this.responseParcel.status
  }

  /**
   * get: HTTP status text.
   *
   * @returns {string | null} HTTP status text.
   */
  get statusText () {
    if (!this.responseParcel) {
      return null
    }

    return this.responseParcel.statusText
  }

  /**
   * Check to have error.
   *
   * @returns {BooleanLike} true: has error.
   */
  hasError () {
    return this.hasInvalidParameterHashError()
      || this.hasAbortError()
      || this.hasTimeoutError()
      || this.hasNetworkError()
      || this.hasResponseBodyParseError()
      || this.hasStatusCodeError()
      || this.hasResultError()
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
   * Check to have response body parse error.
   *
   * @returns {BooleanLike} true: has response body parse error.
   */
  hasResponseBodyParseError () {
    if (this.responseParcel === null) {
      return false
    }

    return this.responseParcel.response !== null
      && !this.result
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

    return !this.responseParcel.ok
      && this.statusCode >= 400
  }

  /**
   * Check to have result error.
   *
   * @returns {BooleanLike} true: has result error.
   */
  hasResultError () {
    return false
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

    if (this.hasAbortError()) {
      return this.Ctor.abortErrorCode
    }

    if (this.hasTimeoutError()) {
      return this.Ctor.timeoutErrorCode
    }

    if (this.hasNetworkError()) {
      return this.Ctor.networkErrorCode
    }

    if (this.hasResponseBodyParseError()) {
      return this.Ctor.responseBodyParseErrorCode
    }

    if (this.hasStatusCodeError()) {
      return this.generateErrorCodeByStatusError()
    }

    if (this.hasResultError()) {
      return this.generateResultErrorCode()
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

  /**
   * Generate error code by result error.
   *
   * @abstract
   * @returns {string} Error code.
   * @throws {Error} this method must be inherited
   */
  generateResultErrorCode () {
    throw new Error('this feature must be inherited')
  }
}

/**
 * @typedef {typeof BaseRestfulApiCapsule<R, P>} CapsuleCtor
 * @template R - Type of result.
 * @template {RestfulApiType.Payload<*, *, *>} [P = RestfulApiType.Payload<*, *, *>] - Type of payload.
 */

/**
 * @typedef {InstanceType<CapsuleCtor<R, P>>} Capsule
 * @template R - Type of result.
 * @template {RestfulApiType.Payload<*, *, *>} [P = RestfulApiType.Payload<*, *, *>] - Type of payload.
 */

/**
 * @typedef {{
 *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*> | null
 *   payload: P | null
 *   result: R | null
 *   abortedReason: LAUNCH_ABORTED_REASON
 * }} BaseRestfulApiCapsuleParams
 * @template R - Type of result.
 * @template {RestfulApiType.Payload<*, *, *>} [P = RestfulApiType.Payload<*, *, *>]
 */

/**
 * @typedef {{
 *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*> | null
 *   payload: P | null
 *   result: R | null
 *   abortedReason?: LAUNCH_ABORTED_REASON
 * }} BaseRestfulApiCapsuleFactoryParams
 * @template R - Type of result.
 * @template {RestfulApiType.Payload<*, *, *>} [P = RestfulApiType.Payload<*, *, *>]]
 */

/**
 * @typedef {*} BooleanLike
 */
