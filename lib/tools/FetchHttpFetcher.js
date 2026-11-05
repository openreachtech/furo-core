/**
 * HTTP fetcher on the Fetch API.
 */
export default class FetchHttpFetcher {
  /**
   * Constructor.
   *
   * @param {FetchHttpFetcherParams} params - Parameters.
   */
  constructor ({
    timeout,
  }) {
    this.timeout = timeout
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof FetchHttpFetcher ? X : never} T, X
   * @param {FetchHttpFetcherFactoryParams} [params] - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    timeout = 0,
  } = {}) {
    return /** @type {InstanceType<T>} */ (
      new this({
        timeout,
      })
    )
  }

  /**
   * get: Ctor.
   *
   * @returns {typeof FetchHttpFetcher} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof FetchHttpFetcher} */ (
      this.constructor
    )
  }

  /**
   * Fetch request.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters of fetch request.
   * @returns {Promise<Response>} Promise of fetch request.
   * @public
   */
  async fetchRequest ({
    request,
  }) {
    return fetch(request, {
      signal: this.createAbortSignal({
        request,
      }),
    })
  }

  /**
   * Create a signal that aborts with the request or after the timeout.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters.
   * @returns {AbortSignal} Signal of the request.
   */
  createAbortSignal ({
    request,
  }) {
    const abortSignals = this.collectAbortSignals({
      request,
    })

    return AbortSignal.any(abortSignals)
  }

  /**
   * Collect the signals to abort the request.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters.
   * @returns {Array<AbortSignal>} Signals to abort the request.
   */
  collectAbortSignals ({
    request,
  }) {
    if (this.waitsWithoutLimit()) {
      return [
        request.signal,
      ]
    }

    return [
      request.signal,
      AbortSignal.timeout(this.timeout),
    ]
  }

  /**
   * Check if the request waits without a time limit.
   *
   * @returns {boolean} True when the timeout is 0.
   */
  waitsWithoutLimit () {
    return this.timeout <= 0
  }
}

/**
 * @typedef {{
 *   timeout: number
 * }} FetchHttpFetcherParams
 */

/**
 * @typedef {{
 *   timeout?: number
 * }} FetchHttpFetcherFactoryParams
 */
