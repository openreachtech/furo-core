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
   * get: Constructor of `AbortSignal`.
   *
   * @returns {typeof AbortSignal} Constructor of `AbortSignal`.
   */
  static get AbortSignalCtor () {
    return AbortSignal
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
   * The flow is the same for every subclass: it creates the signal that aborts the request,
   * lets the subclass receive the response with it, and turns what happened into a parcel.
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
    const signal = this.createAbortSignal()

    try {
      const response = await this.receiveResponse({
        sink,
        signal,
      })

      return this.createHttpParcelByResponse({
        response,
      })
    } catch (error) {
      return this.createHttpParcelByFailure({
        error,
      })
    }
  }

  /**
   * Create a signal that aborts the request.
   *
   * It is aborted by the signal of the request, and by the timeout when the config has one.
   * The timeout is counted from the moment this method is called.
   *
   * @returns {AbortSignal} Signal that aborts the request.
   */
  createAbortSignal () {
    if (this.timeoutMilliseconds === 0) {
      return this.request.signal
    }

    const timeoutSignal = this.Ctor.AbortSignalCtor.timeout(this.timeoutMilliseconds)

    return this.Ctor.AbortSignalCtor.any([
      this.request.signal,
      timeoutSignal,
    ])
  }

  /**
   * Receive the response to the request.
   *
   * It rejects with the reason where the response cannot be received:
   * the reason of the signal where the signal aborted the request, and an error named `NetworkError` where the network failed.
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
   * The name of the failure tells which one it was: `TimeoutError` and `AbortError` are the reasons of a signal,
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
