import BaseRestfulApiCapsule from '../BaseRestfulApiCapsule.js'

/**
 * Base class for Renchan RESTful API capsules.
 *
 * @template {RestfulApiType.Payload<*, *, *>} [P = RestfulApiType.Payload<*, *, *>] - Type of the payload associated with this capsule.
 * @extends {BaseRestfulApiCapsule<RenchanRestfulApiResponse, P>}
 */
export default class BaseRenchanRestfulApiCapsule extends BaseRestfulApiCapsule {
  /**
   * get: Content as result.content
   *
   * @returns {RenchanRestfulApiResponseContent | null} Content.
   */
  get content () {
    return this.result?.content
      ?? null
  }

  /**
   * get: Error as result.error
   *
   * @returns {RenchanRestfulApiResponseError | null} Error.
   */
  get error () {
    return this.result?.error
      ?? null
  }

  /**
   * Check to have content.
   *
   * @returns {boolean} true: has content.
   */
  hasResultContent () {
    return Boolean(this.content)
  }

  /**
   * Check to have result error.
   *
   * @returns {boolean} true: has result error.
   */
  hasResultError () {
    return Boolean(this.error)
  }

  /** @override */
  generateResultErrorCode () {
    return this.error?.code
      ?? this.Ctor.unknownErrorCode
  }
}

/**
 * @typedef {{
 *   content?: RenchanRestfulApiResponseContent | null
 *   error?: RenchanRestfulApiResponseError | null
 * }} RenchanRestfulApiResponse
 */

/**
 * @typedef {Record<string, *>} RenchanRestfulApiResponseContent
 */

/**
 * @typedef {{
 *   code: string
 * }} RenchanRestfulApiResponseError
 */
