import AbortTimer from './tools/AbortTimer.js'

/**
 * Base class of HTTP fetcher.
 *
 * It sends a request, and resolves the response to it as an HTTP parcel.
 * Every piece of information a request needs is carried by the request itself,
 * except for the config, which holds what a request cannot express.
 *
 * @template {HttpFetcherConfig} [C = HttpFetcherConfig] - Type of the config, which each subclass decides for itself.
 * @abstract
 */
export default class BaseHttpFetcher {
  /**
   * Constructor.
   *
   * @param {{
   *   request: Request
   *   config: C
   * }} params - Parameters of constructor.
   */
  constructor ({
    request,
    config,
  }) {
    this.request = request
    this.config = config
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof BaseHttpFetcher ? X : never} T, X
   * @param {{
   *   request: Request
   *   config: ConstructorParameters<T>[0]['config']
   * }} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    request,
    config,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        request,
        config,
      })
    )
  }

  /**
   * get: Constructor of the timer that aborts the request.
   *
   * @returns {typeof AbortTimer} Constructor of the timer.
   */
  static get AbortTimerCtor () {
    return AbortTimer
  }

  /**
   * get: Constructor of HTTP parcel.
   *
   * @abstract
   * @returns {typeof import('./parcels/BaseHttpParcel.js').default<*>} Constructor of HTTP parcel.
   * @throws {Error} If the getter is not implemented in a subclass.
   */
  static get HttpParcelCtor () {
    throw new Error(`${this.name}.get:HttpParcelCtor must be inherited`)
  }

  /**
   * Create an HTTP parcel.
   *
   * @param {{
   *   request: Request
   *   config: HttpFetcherConfig
   *   response: Response
   *   responseUrl: string
   * }} params - Parameters.
   * @returns {import('./parcels/BaseHttpParcel.js').default<*>} Instance of HTTP parcel.
   */
  static createHttpParcel ({
    request,
    config,
    response,
    responseUrl,
  }) {
    return this.HttpParcelCtor.create({
      request,
      config,
      response,
      responseUrl,
    })
  }

  /**
   * get: Constructor of this class.
   *
   * @returns {typeof BaseHttpFetcher<C>} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof BaseHttpFetcher<C>} */ (
      this.constructor
    )
  }

  /**
   * get: Milliseconds to wait for the response.
   *
   * @returns {number} Milliseconds to wait for the response, or 0 if the wait has no limit.
   */
  get timeoutMilliseconds () {
    return this.config.timeoutMilliseconds
      ?? 0
  }

  /**
   * Fetch the response to the request.
   *
   * The flow is the same for every subclass: it creates the timer that aborts the request,
   * lets the subclass receive the response with the signal of the timer, and turns what happened into a parcel.
   * It never rejects, so that a failure is a parcel that tells which one it was.
   *
   * @param {{
   *   sink?: Partial<HttpFetcherSink>
   * }} params - Parameters.
   * @returns {Promise<import('./parcels/BaseHttpParcel.js').default<*>>} Promise of HTTP parcel, which carries the error where the response cannot be received.
   * @public
   */
  async fetchResponse ({
    sink,
  }) {
    try {
      return await this.fetchResponseUnderTimer({
        sink,
      })
    } catch (error) {
      return this.createHttpParcelByFailure({
        error,
      })
    }
  }

  /**
   * Fetch the response to the request, while the timer counts the timeout.
   *
   * The timer stops once the response is received or the fetch fails,
   * so that the timeout never aborts what has already finished.
   *
   * @param {{
   *   sink?: Partial<HttpFetcherSink>
   * }} params - Parameters.
   * @returns {Promise<import('./parcels/BaseHttpParcel.js').default<*>>} Promise of HTTP parcel of the response.
   * @throws {*} Failure that kept the response from being received.
   */
  async fetchResponseUnderTimer ({
    sink,
  }) {
    const abortTimer = this.createAbortTimer()

    try {
      const response = await this.receiveResponse({
        sink,
        signal: abortTimer.signal,
      })

      return this.createHttpParcelByResponse({
        response,
      })
    } finally {
      abortTimer.clear()
    }
  }

  /**
   * Create a timer that aborts the request.
   *
   * Its signal is aborted by the signal of the request, and by the timeout when the config has one.
   * The timeout is counted from the moment this method is called.
   *
   * @returns {AbortTimer} Timer that aborts the request.
   */
  createAbortTimer () {
    return this.Ctor.AbortTimerCtor.create({
      requestSignal: this.request.signal,
      timeoutMilliseconds: this.timeoutMilliseconds,
    })
  }

  /**
   * Receive the response to the request.
   *
   * It rejects with the reason where the response cannot be received:
   * the reason of the signal where the signal aborted the request, and an error named `NetworkError` where the network failed.
   * The timer stops when the promise settles, so a subclass finishes all the work the timeout must cover before it resolves.
   *
   * @abstract
   * @param {{
   *   sink?: Partial<HttpFetcherSink>
   *   signal: AbortSignal
   * }} params - Parameters.
   * @returns {Promise<Response>} Promise of the response.
   * @throws {Error} If the method is not implemented in a subclass.
   */
  async receiveResponse ({
    sink,
    signal,
  }) {
    throw new Error(`${this.constructor.name}#receiveResponse() must be inherited`)
  }

  /**
   * Create an HTTP parcel of the response.
   *
   * @param {{
   *   response: Response
   * }} params - Parameters.
   * @returns {import('./parcels/BaseHttpParcel.js').default<*>} Instance of HTTP parcel.
   */
  createHttpParcelByResponse ({
    response,
  }) {
    const responseUrl = this.resolveResponseUrl({
      response,
    })

    return this.Ctor.createHttpParcel({
      request: this.request,
      config: this.config,
      response,
      responseUrl,
    })
  }

  /**
   * Resolve the URL of the response, after the redirects.
   *
   * @abstract
   * @param {{
   *   response: Response
   * }} params - Parameters.
   * @returns {string} URL of the response.
   * @throws {Error} If the method is not implemented in a subclass.
   */
  resolveResponseUrl ({
    response,
  }) {
    throw new Error(`${this.constructor.name}#resolveResponseUrl() must be inherited`)
  }

  /**
   * Create an HTTP parcel of the failure that kept the response from being received.
   *
   * A failure while the signal of the request is aborted is an abort, whatever the reason is.
   * Otherwise the name of the failure tells which one it was: `TimeoutError` and `AbortError` are the reasons of a signal,
   * and `NetworkError` is the failure of the network. A subclass decides what any other name is.
   *
   * @param {{
   *   error: *
   * }} params - Parameters.
   * @returns {import('./parcels/BaseHttpParcel.js').default<*>} Instance of HTTP parcel.
   */
  createHttpParcelByFailure ({
    error,
  }) {
    if (this.request.signal.aborted) {
      return this.createHttpParcelAsAbortError()
    }

    const errorName = error?.name
      ?? null

    if (errorName === 'TimeoutError') {
      return this.createHttpParcelAsTimeoutError()
    }

    if (errorName === 'AbortError') {
      return this.createHttpParcelAsAbortError()
    }

    if (errorName === 'NetworkError') {
      return this.createHttpParcelAsNetworkError()
    }

    return this.createHttpParcelByUnnamedFailure({
      error,
    })
  }

  /**
   * Create an HTTP parcel of the failure that none of the names tells.
   *
   * It is the parcel of an error that no category tells, until a subclass knows better.
   *
   * @param {{
   *   error: *
   * }} params - Parameters.
   * @returns {import('./parcels/BaseHttpParcel.js').default<*>} Instance of HTTP parcel.
   */
  createHttpParcelByUnnamedFailure ({
    error,
  }) {
    return this.createHttpParcelAsError()
  }

  /**
   * Create an HTTP parcel of a network failure.
   *
   * @returns {import('./parcels/BaseHttpParcel.js').default<*>} Instance of HTTP parcel.
   */
  createHttpParcelAsNetworkError () {
    return this.Ctor.HttpParcelCtor.createAsNetworkError({
      request: this.request,
      config: this.config,
    })
  }

  /**
   * Create an HTTP parcel of a timed out request.
   *
   * @returns {import('./parcels/BaseHttpParcel.js').default<*>} Instance of HTTP parcel.
   */
  createHttpParcelAsTimeoutError () {
    return this.Ctor.HttpParcelCtor.createAsTimeoutError({
      request: this.request,
      config: this.config,
    })
  }

  /**
   * Create an HTTP parcel of an aborted request.
   *
   * @returns {import('./parcels/BaseHttpParcel.js').default<*>} Instance of HTTP parcel.
   */
  createHttpParcelAsAbortError () {
    return this.Ctor.HttpParcelCtor.createAsAbortError({
      request: this.request,
      config: this.config,
    })
  }

  /**
   * Create an HTTP parcel of an error that no category tells.
   *
   * @returns {import('./parcels/BaseHttpParcel.js').default<*>} Instance of HTTP parcel.
   */
  createHttpParcelAsError () {
    return this.Ctor.HttpParcelCtor.createAsError({
      request: this.request,
      config: this.config,
    })
  }
}

/**
 * @typedef {{
 *   timeoutMilliseconds?: number
 * }} HttpFetcherConfig
 */

/**
 * @typedef {{
 *   onUploadProgress: (args: {
 *     request: Request
 *     progressEvent: ProgressEvent
 *   }) => void
 *   onDownloadProgress: (args: {
 *     request: Request
 *     progressEvent: ProgressEvent
 *   }) => void
 * }} HttpFetcherSink
 */
