import BaseHttpParcel from '../BaseHttpParcel.js'

/**
 * HTTP parcel of the response built from `XMLHttpRequest`.
 *
 * The response is built after `XMLHttpRequest` received it, so that it knows nothing of the redirects.
 * This parcel answers for the redirects and the type from the URL of the response that `XMLHttpRequest` reports.
 *
 * @extends {BaseHttpParcel<XMLHttpParcelConfig>}
 */
export default class XMLHttpParcel extends BaseHttpParcel {
  /**
   * Check if the response is the result of a redirect.
   *
   * It compares the URL of the response with the URL of the request, both without the fragment.
   *
   * @override
   * @returns {BooleanLike} True if the response is the result of a redirect, false if the response was not received.
   * @public
   */
  isRedirected () {
    if (this.responseUrl === null) {
      return false
    }

    const requestUrlWithoutFragment = this.requestUrl
      .split('#')
      .at(0)

    return this.responseUrl !== requestUrlWithoutFragment
  }

  /**
   * Extract the type of the response.
   *
   * `XMLHttpRequest` does not report it, so that it is `basic` for a response of the same origin as the page,
   * and `cors` for any other.
   *
   * @override
   * @returns {ResponseType | null} Type of the response, or null if the response was not received.
   * @public
   */
  extractResponseType () {
    if (this.responseUrl === null) {
      return null
    }

    const responseOrigin = new URL(this.responseUrl).origin

    return responseOrigin === globalThis.location.origin
      ? 'basic'
      : 'cors'
  }
}

/**
 * @typedef {*} BooleanLike
 */

/**
 * @typedef {import('../../BaseHttpFetcher.js').HttpFetcherConfig} XMLHttpParcelConfig
 */
