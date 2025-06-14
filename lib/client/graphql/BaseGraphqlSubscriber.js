const MAX_DELAY_MILLISECONDS = 32000
const ADJUSTMENT_DELAY_MILLISECONDS = 3000

/**
 * Base class of GraphQL subscriber.
 *
 * @property {() => void} unconnectHandler - Unconnect handler.
 * @property {number} resubscribeAttemptCount - Resubscribe attempt count.
 */
export default class BaseGraphqlSubscriber {
  /**
   * Constructor.
   *
   * @param {BaseGraphqlSubscriberParams} params - Parameters of constructor.
   */
  constructor ({
    connector,
  }) {
    this.webSocketConnection = connector

    this.unconnectHandler = () => {}
    this.resubscribeAttemptCount = 0
  }

  /**
   * Factory method.
   *
   * @template {X extends SubscriberCtor ? X : never} T, X
   * @param {BaseGraphqlSubscriberFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    connector,
  }) {
    return /** @type {*} */ (
      new this({
        connector,
      })
    )
  }

  /**
   * get: Subscriber class.
   *
   * @template {SubscriberCtor} T
   * @abstract
   * @returns {T} Subscriber class.
   * @this {T}
   */
  static get Subscriber () {
    return this
  }

  /**
   * get: Payload class.
   *
   * @abstract
   * @returns {furo.SubscriptionPayloadCtor<*>} Payload class.
   * @throws {Error} This function must be inherited.
   */
  static get Payload () {
    throw new Error('this function must be inherited')
  }

  /**
   * get: Capsule class.
   *
   * @abstract
   * @returns {furo.SubscriptionCapsuleCtor<*>} Capsule class.
   * @throws {Error} This function must be inherited.
   */
  static get Capsule () {
    throw new Error('this function must be inherited')
  }

  /**
   * Create payload.
   *
   * @template P
   * @param {furo.BaseSubscriptionGraphqlPayloadFactoryParams} params - Parameters.
   * @returns {InstanceType<P>} Instance of Payload.
   */
  static createPayload ({
    variables,
    operationName,
    extensions,
    context,
  } = {}) {
    return /** @type {*} */ (
      this.Payload
        .create({
          variables,
          operationName,
          extensions,
          context,
        })
    )
  }

  /**
   * Create payload with value hash.
   *
   * @template {furo.SubscriptionPayload<*>} P
   * @param {{
   *   valueHash: {
   *     [field: string]: any
   *   }
   *   operationName?: string | null
   *   extensions?: Record<string, unknown>
   *   context?: {
   *     headers?: HeadersInit
   *     [key: string]: unknown
   *   }
   * }} params - Parameters.
   * @returns {InstanceType<P>} Instance of Payload.
   */
  static createPayloadWithValueHash ({
    valueHash,
    operationName,
    extensions,
    context,
  }) {
    return /** @type {*} */ (
      this.Payload
        .createWithValueHash({
          valueHash,
          operationName,
          extensions,
          context,
        })
    )
  }

  /**
   * Create instance of capsule with result.
   *
   * @template C
   * @param {furo.BaseSubscriptionGraphqlCapsuleFactoryParams<*>} params - Parameters.
   * @returns {InstanceType<C>} Instance of capsule.
   */
  static createCapsule ({
    payload,
    result,
    abortedReason,
  }) {
    const args = {
      payload,
      result,
      abortedReason,
    }

    return /** @type {*} */ (
      this.Capsule.create(args)
    )
  }

  /**
   * Create instance of capsule with result as pending.
   *
   * @returns {furo.SubscriptionCapsule<*>} Instance of capsule.
   */
  static createCapsuleAsPending () {
    return this.Capsule.createAsPending()
  }

  /**
   * Create instance of capsule with result as invalid variables error.
   *
   * @param {{
   *   payload: furo.SubscriptionPayload<*>
   * }} params - Parameters.
   * @returns {furo.SubscriptionCapsule<*>} Instance of capsule.
   */
  static createCapsuleAsInvalidVariablesError ({
    payload,
  }) {
    return this.Capsule.createAsInvalidVariablesError({
      payload,
    })
  }

  /**
   * Create instance of capsule with result as aborted by hooks.
   *
   * @param {{
   *   payload: furo.SubscriptionPayload<*>
   * }} params - Parameters.
   * @returns {furo.SubscriptionCapsule<*>} Instance of capsule.
   */
  static createCapsuleAsAbortedByHooks ({
    payload,
  }) {
    return this.Capsule.createAsAbortedByHooks({
      payload,
    })
  }

  /**
   * Create instance of capsule with result as network error.
   *
   * @param {{
   *   payload: furo.SubscriptionPayload<*>
   * }} params - Parameters.
   * @returns {furo.SubscriptionCapsule<*>} Instance of capsule.capsule.
   */
  static createCapsuleAsNetworkError ({
    payload,
  }) {
    return this.Capsule.createAsNetworkError({
      payload,
    })
  }

  /**
   * get: Constructor from instance.
   *
   * @template {SubscriberCtor} T
   * @returns {T} Constructor of the instance.
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }

  /**
   * Unsubscribe.
   *
   * @returns {void}
   * @public
   */
  unsubscribe () {
    this.unconnectHandler()
  }

  /**
   * Subscribe.
   *
   * @template {furo.SubscriptionPayload<*>} P
   * @template {X extends furo.SubscriptionCapsule<*> ? X : never} C, X
   * @param {{
   *   payload: P
   *   hooks: furo.GraphqlSubscriberHooks<P, C>
   * }} params - Parameters.
   * @returns {void}
   * @public
   */
  subscribe ({
    payload,
    hooks,
  }) {
    if (payload.isInvalidVariables()) {
      const capsule = this.Ctor.createCapsuleAsInvalidVariablesError({
        payload,
      })

      // @ts-expect-error
      hooks.onPublish(capsule)

      return
    }

    const sink = this.buildSubscriptionHooks({
      payload,
      hooks,
    })

    this.unsubscribe()

    this.unconnectHandler = this.webSocketConnection.subscribe({
      webSocketPayload: payload.buildSubscriptionPayload(),
      sink,
    })
  }

  /**
   * Build subscription hooks.
   *
   * @template {furo.SubscriptionPayload<*>} P
   * @param {{
   *   payload: P
   *   hooks: {
   *     onPublish: (capsule: furo.SubscriptionCapsule<*>) => void
   *     onDisconnected?: (args:{
   *       payload: P
   *       error: furo.GraphqlWebSocketSinkError
   *     }) => void
   *     onTerminate?: (args:{
   *       payload: P
   *     }) => void
   *   }
   * }} params - Parameters.
   * @returns {furo.WebSocketSubscribeSink<furo.GraphqlResponse>} Subscription hooks.
   */
  buildSubscriptionHooks ({
    payload,
    hooks,
  }) {
    return {
      next: response => {
        const capsule = this.Ctor.createCapsule({
          payload,
          result: response,
        })

        hooks.onPublish(capsule)
      },
      error: (/** @type {furo.GraphqlWebSocketSinkError} */ error) => {
        hooks.onDisconnected?.({
          payload,
          error,
        })

        this.resubscribeAfterDelay({
          handler: () => {
            this.subscribe({
              payload,
              hooks,
            })
          },
        })
      },
      complete: () => {
        hooks.onTerminate?.({
          payload,
        })
      },
    }
  }

  /**
   * Resubscribe after delay.
   *
   * @param {{
   *   handler: () => void
   *   delayMilliseconds?: number
   * }} params - Parameters.
   * @returns {void}
   */
  resubscribeAfterDelay ({
    handler,
    delayMilliseconds = this.calculateResubscribeDelayMilliseconds(),
  }) {
    setTimeout(handler, delayMilliseconds)

    if (this.resubscribeAttemptCount === 0) {
      this.addConnectorLifecycleListener({
        eventName: 'connected',
        handler: () => {
          this.resubscribeAttemptCount = 0
        },
        options: {
          once: true,
        },
      })
    }

    this.resubscribeAttemptCount += 1
  }

  /**
   * Calculate resubscribe delay in milliseconds.
   *
   * @returns {number} Resubscribe delay in milliseconds.
   */
  calculateResubscribeDelayMilliseconds () {
    const variableMilliseconds = (2 ** this.resubscribeAttemptCount) * 1000

    return Math.min(
      MAX_DELAY_MILLISECONDS,
      ADJUSTMENT_DELAY_MILLISECONDS + variableMilliseconds
    )
  }

  /**
   * Add lifecycle to subscription connector.
   *
   * @abstract
   * @param {{
   *   eventName: string
   *   handler: (event: *) => void
   *   options?: AddEventListenerOptions
   * }} params - Parameters.
   * @returns {BaseGraphqlSubscriber} For method chaining.
   */
  addConnectorLifecycleListener ({
    eventName,
    handler,
    options,
  }) {
    this.webSocketConnection.addLifecycleListener({
      eventName,
      handler,
      options,
    })

    return this
  }

  /**
   * Remove lifecycle from subscription connector.
   *
   * @abstract
   * @param {{
   *   eventName: string
   *   handler: (event: *) => void
   *   options?: EventListenerOptions
   * }} params - Parameters.
   * @returns {BaseGraphqlSubscriber} For method chaining.
   */
  removeConnectorLifecycleListener ({
    eventName,
    handler,
    options,
  }) {
    this.webSocketConnection.removeLifecycleListener({
      eventName,
      handler,
      options,
    })

    return this
  }
}

/**
 * @typedef {typeof BaseGraphqlSubscriber} SubscriberCtor
 */

/**
 * @typedef {InstanceType<SubscriberCtor>} Subscriber
 */

/**
 * @typedef {{
 *   connector: furo.Connector
 * }} BaseGraphqlSubscriberParams
 */

/**
 * @typedef {{
 *   connector: furo.Connector
 * }} BaseGraphqlSubscriberFactoryParams
 */

/**
 * @typedef {{
 *   hooks: GraphqlSubscriberHooks<P, C>
 *   variables?: furo.GraphqlRequestVariables
 *   operationName?: string | null
 *   extensions?: Record<string, unknown>
 *   context?: {
 *     headers?: HeadersInit
 *     [key: string]: unknown
 *   }
 * }} GraphqlSubscribeRequestArgs
 * @template {furo.SubscriptionPayload<*>} [P = furo.SubscriptionPayload<*>]
 * @template {furo.SubscriptionCapsule<*>} [C = furo.SubscriptionCapsule<*>]
 */

/**
 * @typedef {{
 *   onPublish: (capsule: C) => void
 *   onDisconnected?: (args: {
 *     payload: P
 *     error: furo.GraphqlWebSocketSinkError
 *   }) => void
 *   onTerminate?: (args: {
 *     payload: P
 *   }) => void
 * }} GraphqlSubscriberHooks
 * @template {furo.SubscriptionPayload<*>} [P = furo.SubscriptionPayload<*>]
 * @template {furo.SubscriptionCapsule<*>} [C = furo.SubscriptionCapsule<*>]
 */
