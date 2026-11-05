import BaseHttpFetcher from './BaseHttpFetcher.js'

/**
 * HTTP fetcher on the Fetch API.
 *
 * @extends {BaseHttpFetcher}
 */
export default class FetchHttpFetcher extends BaseHttpFetcher {
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
   * Fetch request. It reports no progress, so it leaves `sink` unread.
   *
   * @override
   * @param {{
   *   request: Request
   *   sink?: Partial<import('./BaseHttpFetcher.js').HttpFetcherSink>
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
