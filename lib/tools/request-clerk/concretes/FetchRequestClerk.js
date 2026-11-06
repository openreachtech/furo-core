import BaseRequestClerk from '../BaseRequestClerk.js'

/**
 * Request clerk on the Fetch API.
 *
 * @extends {BaseRequestClerk}
 */
export default class FetchRequestClerk extends BaseRequestClerk {
  /**
   * Call the native `fetch()`.
   *
   * @param {RequestInfo | URL} input - Resource to fetch.
   * @param {RequestInit} [init] - Options of `fetch()`.
   * @returns {Promise<Response>} Promise of the response.
   */
  static fetch (
    input,
    init
  ) {
    return fetch(input, init)
  }

  /**
   * Build a signal that aborts after the timeout.
   *
   * @param {{
   *   timeout: number
   * }} params - Parameters.
   * @returns {AbortSignal} Signal that aborts with `TimeoutError`.
   */
  static buildTimeoutSignal ({
    timeout,
  }) {
    return AbortSignal.timeout(timeout)
  }

  /**
   * Build a signal that aborts when any of the signals aborts.
   *
   * @param {{
   *   signals: Array<AbortSignal>
   * }} params - Parameters.
   * @returns {AbortSignal} Signal that follows the signals.
   */
  static buildAnySignal ({
    signals,
  }) {
    return AbortSignal.any(signals)
  }

  /**
   * get: Ctor.
   *
   * @returns {typeof FetchRequestClerk} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof FetchRequestClerk} */ (
      this.constructor
    )
  }

  /**
   * Build the response through `fetch()`. It reports no progress, so it leaves `sink` unread.
   *
   * @override
   * @returns {Promise<Response>} Promise of the response.
   * @public
   */
  async buildResponse () {
    const signal = this.buildAbortSignal()
    const credentials = this.resolveCredentials()

    return this.Ctor.fetch(this.request, {
      signal,
      credentials,
    })
  }

  /**
   * Build a signal that aborts with the request or after the timeout.
   *
   * @returns {AbortSignal} Signal of the request.
   */
  buildAbortSignal () {
    const signals = this.collectAbortSignals()

    return this.Ctor.buildAnySignal({
      signals,
    })
  }

  /**
   * Collect the signals to abort the request.
   *
   * @returns {Array<AbortSignal>} Signals to abort the request.
   */
  collectAbortSignals () {
    if (this.waitsWithoutLimit()) {
      return [
        this.request.signal,
      ]
    }

    return [
      this.request.signal,
      this.Ctor.buildTimeoutSignal({
        timeout: this.config.timeout,
      }),
    ]
  }

  /**
   * Check if the request waits without a time limit.
   *
   * @returns {boolean} True when the timeout is 0.
   */
  waitsWithoutLimit () {
    return this.config.timeout <= 0
  }

  /**
   * Resolve credentials of `fetch()`, raising them to `'include'` on `withCredentials`.
   *
   * @returns {RequestCredentials} Credentials to send.
   */
  resolveCredentials () {
    if (this.config.withCredentials) {
      return 'include'
    }

    return this.request.credentials
  }
}
