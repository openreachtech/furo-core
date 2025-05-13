import {
  createClient,
} from 'graphql-ws'

const INFINITY_RETRY_ATTEMPTS = -1

/**
 * Subscription connector.
 */
export default class SubscriptionConnector {
  /**
   * Constructor.
   *
   * @param {SubscriptionConnectorParams} params - Parameters of constructor.
   */
  constructor ({
    websocketClient,
    eventTarget,
  }) {
    this.websocketClient = websocketClient

    this.eventTarget = eventTarget
  }

  /**
   * Factory method.
   *
   * @template {X extends furo.ConnectorCtor ? X : never} T, X
   * @param {SubscriptionConnectorFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    config,
  }) {
    const eventTarget = this.createEventTarget()

    const websocketClient = this.createWebSocketClient({
      url: config.WEBSOCKET_URL,
      eventTarget,
    })

    return /** @type {*} */ (
      new this({
        websocketClient,
        eventTarget,
      })
    )
  }

  /**
   * Create event target.
   *
   * @returns {EventTarget} Instance of EventEmitter.
   */
  static createEventTarget () {
    return new EventTarget()
  }

  /**
   * Create WebSocket client.
   *
   * @param {{
   *   url: string
   *   eventTarget: EventTarget
   * }} params - Parameters.
   * @returns {furo.WebSocketClient} Instance of WebSocket client.
   */
  static createWebSocketClient ({
    url,
    eventTarget,
  }) {
    const webSocketSink = this.generateWebSocketSink({
      eventTarget,
    })

    return this.graphqlWsCore
      .createClient({
        url,
        retryAttempts: INFINITY_RETRY_ATTEMPTS,
        on: webSocketSink,
      })
  }

  /**
   * Generate WebSocket sink.
   *
   * @param {{
   *   eventTarget: EventTarget
   * }} params - Parameters.
   * @returns {furo.GraphqlWebSocketSink} Instance of WebSocket client.
   */
  static generateWebSocketSink ({
    eventTarget,
  }) {
    return {
      connecting: result => {
        const customEvent = this.createCustomEvent({
          eventName: 'connecting',
          detail: result,
        })
        eventTarget.dispatchEvent(customEvent)
      },
      opened: socket => {
        const customEvent = this.createCustomEvent({
          eventName: 'opened',
          detail: socket,
        })
        eventTarget.dispatchEvent(customEvent)
      },
      message: message => {
        const customEvent = this.createCustomEvent({
          eventName: 'message',
          detail: message,
        })
        eventTarget.dispatchEvent(customEvent)
      },
      connected: socket => {
        const customEvent = this.createCustomEvent({
          eventName: 'connected',
          detail: socket,
        })
        eventTarget.dispatchEvent(customEvent)
      },
      closed: error => {
        const customEvent = this.createCustomEvent({
          eventName: 'closed',
          detail: error,
        })
        eventTarget.dispatchEvent(customEvent)
      },
      error: error => {
        const customEvent = this.createCustomEvent({
          eventName: 'error',
          detail: error,
        })
        eventTarget.dispatchEvent(customEvent)
      },
      ping: message => {
        const customEvent = this.createCustomEvent({
          eventName: 'ping',
          detail: message,
        })
        eventTarget.dispatchEvent(customEvent)
      },
      pong: message => {
        const customEvent = this.createCustomEvent({
          eventName: 'pong',
          detail: message,
        })
        eventTarget.dispatchEvent(customEvent)
      },
    }
  }

  /**
   * Create custom event.
   *
   * @param {{
   *   eventName: string
   *   detail: unknown
   * }} params - Parameters.
   * @returns {CustomEvent} Instance of CustomEvent.
   */
  static createCustomEvent ({
    eventName,
    detail,
  }) {
    return new CustomEvent(eventName, {
      detail,
    })
  }

  /**
   * get: graphqlWs core.
   *
   * @returns {{
   *   createClient: (options: furo.WebSocketClientOptions) => furo.WebSocketClient
   * }} graphqlWs core.
   */
  static get graphqlWsCore () {
    return {
      createClient,
    }
  }

  /**
   * Subscribe via WebSocket.
   *
   * @param {{
   *   webSocketPayload: furo.WebSocketSubscribePayload
   *   sink?: furo.WebSocketSubscribeSink<*>
   * }} args - Arguments.
   * @returns {() => void} Nothing.
   */
  subscribe ({
    webSocketPayload,
    sink,
  }) {
    this.unsubscribe()

    return this.websocketClient
      .subscribe(
        webSocketPayload,
        sink
      )
  }

  /**
   * Unsubscribe via WebSocket.
   *
   * @returns {void} Nothing.
   * @public
   */
  unsubscribe () {
    // noop
  }

  /**
   * Add lifecycle listener to event emitter.
   *
   * @param {{
   *   eventName: string
   *   handler: (event: Event) => void
   *   options?: AddEventListenerOptions
   * }} params - Parameters.
   * @returns {SubscriptionConnector} For method chaining.
   */
  addLifecycleListener ({
    eventName,
    handler,
    options = {},
  }) {
    this.eventTarget.addEventListener(
      eventName,
      handler,
      options
    )

    return this
  }

  /**
   * Add lifecycle listener to event emitter.
   *
   * @param {{
   *   eventName: string
   *   handler: (event: Event) => void
   *   options?: EventListenerOptions
   * }} params - Parameters.
   * @returns {SubscriptionConnector} For method chaining.
   */
  removeLifecycleListener ({
    eventName,
    handler,
    options = {},
  }) {
    this.eventTarget.removeEventListener(
      eventName,
      handler,
      options
    )

    return this
  }
}

/**
 * @typedef {typeof SubscriptionConnector} ConnectorCtor
 */

/**
 * @typedef {InstanceType<ConnectorCtor>} Connector
 */

/**
 * @typedef {{
 *   websocketClient: furo.WebSocketClient
 *   eventTarget: EventTarget
 * }} SubscriptionConnectorParams
 */

/**
 * @typedef {{
 *   config: {
 *     [x: string]: string
 *   }
 * }} SubscriptionConnectorFactoryParams
 */
