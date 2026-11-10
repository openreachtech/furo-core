import BaseHttpFetcher from '../BaseHttpFetcher.js'
import FetchHttpParcel from '../parcels/concretes/FetchHttpParcel.js'

/**
 * HTTP fetcher that sends a request with `fetch()`.
 *
 * `fetch()` has no event of progress, so the sink is never called.
 * The response is resolved after its whole body has been received, so that the timeout covers the download.
 *
 * @extends {BaseHttpFetcher<FetchHttpFetcherConfig>}
 */
export default class FetchHttpFetcher extends BaseHttpFetcher {
  /**
   * get: Constructor of HTTP parcel.
   *
   * @override
   * @returns {typeof FetchHttpParcel} Constructor of HTTP parcel.
   */
  static get HttpParcelCtor () {
    return FetchHttpParcel
  }

  /**
   * get: Function that sends a request with `fetch()`.
   *
   * @returns {(request: Request, optionHash: RequestInit) => Promise<Response>} Function of `fetch()`.
   */
  static get fetch () {
    return (...args) => fetch(...args)
  }

  /**
   * get: Constructor of this class.
   *
   * @override
   * @returns {typeof FetchHttpFetcher} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof FetchHttpFetcher} */ (
      this.constructor
    )
  }

  /**
   * Receive the response to the request.
   *
   * `fetch()` has no event of progress, so that the sink is not used.
   *
   * @override
   * @param {{
   *   sink?: Partial<import('../BaseHttpFetcher.js').HttpFetcherSink>
   *   signal: AbortSignal
   * }} params - Parameters.
   * @returns {Promise<Response>} Promise of the response, which `fetch()` resolved at the headers.
   */
  async receiveResponse ({
    sink,
    signal,
  }) {
    const request = this.request.clone()
    const optionHash = this.buildOptionHash({
      signal,
    })

    return this.invokeFetch({
      request,
      optionHash,
    })
  }

  /**
   * Receive the response, and await its whole body while the timer still counts.
   *
   * @override
   * @param {{
   *   sink?: Partial<import('../BaseHttpFetcher.js').HttpFetcherSink>
   *   signal: AbortSignal
   * }} params - Parameters.
   * @returns {Promise<import('../parcels/concretes/FetchHttpParcel.js').default>} Promise of HTTP parcel, whose body has been received.
   */
  async receiveHttpParcel ({
    sink,
    signal,
  }) {
    const httpParcel = await super.receiveHttpParcel({
      sink,
      signal,
    })

    await httpParcel.awaitBody()

    return httpParcel
  }

  /**
   * Resolve the URL of the response, after the redirects.
   *
   * @override
   * @param {{
   *   response: Response
   * }} params - Parameters.
   * @returns {string} URL of the response, which `fetch()` resolved.
   */
  resolveResponseUrl ({
    response,
  }) {
    return response.url
  }

  /**
   * Build the option hash of `fetch()`.
   *
   * It is the only member that knows what `fetch()` takes as the second argument.
   * The signal is always the one that aborts the request, whatever the config holds.
   *
   * @param {{
   *   signal: AbortSignal
   * }} params - Parameters.
   * @returns {RequestInit} Option hash of `fetch()`.
   */
  buildOptionHash ({
    signal,
  }) {
    return {
      ...this.config.optionHash,
      signal,
    }
  }

  /**
   * Send a request through `fetch()`.
   *
   * @param {{
   *   request: Request
   *   optionHash: RequestInit
   * }} params - Parameters.
   * @returns {Promise<Response>} Promise of the response.
   */
  async invokeFetch ({
    request,
    optionHash,
  }) {
    return this.Ctor.fetch(
      request,
      optionHash
    )
  }

  /**
   * Create an HTTP parcel of the failure that none of the names tells.
   *
   * `fetch()` rejects with the failure of the network where it does not reject with the reason of a signal.
   *
   * @override
   * @param {{
   *   error: *
   * }} params - Parameters.
   * @returns {FetchHttpParcel} Instance of HTTP parcel.
   */
  createHttpParcelByUnnamedFailure ({
    error,
  }) {
    return /** @type {FetchHttpParcel} */ (
      this.createHttpParcelAsNetworkError()
    )
  }
}

/**
 * @typedef {import('../BaseHttpFetcher.js').HttpFetcherConfig & {
 *   optionHash?: Omit<RequestInit, 'signal'>
 * }} FetchHttpFetcherConfig
 */
