/**
 * enum: Subscribe aborted reason.
 *
 * @enum {symbol}
 */
export const SUBSCRIBE_ABORTED_REASON = {
  NONE: Symbol('not aborted'),
  INVALID_VARIABLES: Symbol('aborted by invalid variables'),
  BEFORE_REQUEST_HOOK: Symbol('aborted by before request hook'),
  UNKNOWN: Symbol('aborted by unknown cause'),
}

/**
 * Base class of subscription GraphQL capsule.
 *
 * @template D - Type of content (data).
 * @extends {BaseGraphqlCapsule<D>}
 */
export default class BaseSubscriptionGraphqlCapsule {
  /**
   * Constructor.
   *
   * @param {BaseSubscriptionGraphqlCapsuleParams<*>} params
   */
  constructor ({
    payload,
    result,
    abortedReason,
  }) {
    this.payload = payload
    this.result = result
    this.abortedReason = abortedReason
  }

  /**
   * Factory method.
   *
   * @template {furo.SubscriptionPayload<*>} P
   * @template {X extends SubscriptionCapsuleCtor<D> ? X : never} C, D, X
   * @param {BaseSubscriptionGraphqlCapsuleFactoryParams<P>} params - Parameters of factory method.
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static create ({
    payload,
    result,
    abortedReason = SUBSCRIBE_ABORTED_REASON.NONE,
  }) {
    return /** @type {*} */ (
      new this({
        payload,
        result,
        abortedReason,
      })
    )
  }

  /**
   * Factory method to create as pending behavior.
   *
   * @template {furo.SubscriptionCapsuleCtor<D>} C, D
   * @returns {InstanceType<C>} Instance of this class.
   * @this {C}
   */
  static createAsPending () {
    return this.create({
      payload: null,
      result: null,
    })
  }

  /**
   * Factory method to create as invalid variables error.
   *
   * @template {furo.SubscriptionPayload<*>} P
   * @template {furo.SubscriptionCapsuleCtor<D>} C, D
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
      payload,
      result: null,
      abortedReason: SUBSCRIBE_ABORTED_REASON.INVALID_VARIABLES,
    })
  }

  /**
   * Factory method to create as aborted by hooks.
   *
   * @template {furo.SubscriptionPayload<*>} P
   * @template {furo.SubscriptionCapsuleCtor<D>} C, D
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
      payload,
      result: null,
      abortedReason: SUBSCRIBE_ABORTED_REASON.BEFORE_REQUEST_HOOK,
    })
  }

  /**
   * Factory method to create as network error.
   *
   * @template {furo.SubscriptionPayload<*>} P
   * @template {furo.SubscriptionCapsuleCtor<D>} C, D
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
   * get: constructor of own class.
   *
   * @returns {furo.CapsuleCtor<D>} Constructor.
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }

  /**
   * Check to have content.
   *
   * @returns {BooleanLike} true: has content.
   */
  hasContent () {
    return this.result
      ?.data
      ?? false
  }

  /**
   * Check to have error.
   *
   * @returns {BooleanLike} true: has error.
   */
  hasError () {
    return this.hasQueryError()
      || this.hasNetworkError()
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
    return false // TODO: Implement this method.
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
   * @returns {Array<furo.GraphqlResponseError>} Array of errors.
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
 * @typedef {typeof BaseSubscriptionGraphqlCapsule<D>} SubscriptionCapsuleCtor
 * @template D - Type of content (data).
 */

/**
 * @typedef {InstanceType<SubscriptionCapsuleCtor<D>>} SubscriptionCapsule
 * @template D - Type of content (data).
 */

/**
 * @typedef {{
 *   payload: P | null
 *   result: furo.GraphqlResponse | null
 *   abortedReason: furo.SUBSCRIBE_ABORTED_REASON
 * }} BaseSubscriptionGraphqlCapsuleParams
 * @template {furo.SubscriptionPayload<*>} P
 */

/**
 * @typedef {{
 *   payload: P | null
 *   result: furo.GraphqlResponse | null
 *   abortedReason?: furo.SUBSCRIBE_ABORTED_REASON
 * }} BaseSubscriptionGraphqlCapsuleFactoryParams
 * @template {furo.SubscriptionPayload<*>} P
 */

/**
 * @typedef {*} BooleanLike
 */
