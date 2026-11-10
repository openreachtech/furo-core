import BaseHttpParcel from '../BaseHttpParcel.js'

/**
 * HTTP parcel of the response that `fetch()` resolved.
 *
 * The response is the one `fetch()` resolved, so that it answers for itself.
 *
 * @extends {BaseHttpParcel<import('../../concretes/FetchHttpFetcher.js').FetchHttpFetcherConfig>}
 */
export default class FetchHttpParcel extends BaseHttpParcel {
  /**
   * Await the whole body of the response.
   *
   * `fetch()` resolves at the headers, so it drains a clone without keeping a copy, and a failure during the download rejects here.
   *
   * @returns {Promise<void>} Promise that resolves once the whole body has arrived.
   * @public
   */
  async awaitBody () {
    await this.cloneResponse()
      ?.body
      ?.pipeTo(new WritableStream())
  }

  /**
   * Check if the response is the result of a redirect.
   *
   * @override
   * @returns {BooleanLike} True if the response is the result of a redirect, false if the response was not received.
   * @public
   */
  isRedirected () {
    return this.response
      ?.redirected
      ?? false
  }

  /**
   * Extract the type of the response.
   *
   * @override
   * @returns {ResponseType | null} Type of the response, or null if the response was not received.
   * @public
   */
  extractResponseType () {
    return this.response
      ?.type
      ?? null
  }
}

/**
 * @typedef {*} BooleanLike
 */
