import BaseRestfulApiPayload from '../BaseRestfulApiPayload.js'

import StorageClerk from '../../../../lib/storage/StorageClerk.js'

/**
 * Base class for Renchan RESTful API payloads.
 *
 * @template {RestfulApiType.RequestQuery} [QP = {}] - Query parameters.
 * @template {RestfulApiType.RequestBody} [BP = {}] - Request body.
 * @template {RestfulApiType.RequestPathParams} [PP = {}] - Path parameters.
 * @extends {BaseRestfulApiPayload<QP, BP, PP>}
 */
export default class BaseRenchanRestfulApiPayload extends BaseRestfulApiPayload {
  /**
   * get: Access token header key.
   *
   * @abstract
   * @returns {string} Header key for access token.
   * @throws {Error} this feature must be inherited
   */
  static get ACCESS_TOKEN_HEADER_KEY () {
    throw new Error('this feature must be inherited')
  }

  /**
   * get: Access token storage key.
   *
   * @abstract
   * @returns {string} Access token storage key.
   * @throws {Error} this feature must be inherited
   */
  static get ACCESS_TOKEN_STORAGE_KEY () {
    throw new Error('this feature must be inherited')
  }

  /** @override */
  static collectBasedHeadersOptions () {
    const headerKey = this.ACCESS_TOKEN_HEADER_KEY
    const accessToken = this.loadAccessToken()

    return [
      ...super.collectBasedHeadersOptions(),

      {
        [headerKey]: accessToken,
      },
    ]
  }

  /**
   * get: load access token from session storage.
   *
   * @returns {string | null} Access token or null if not found.
   */
  static loadAccessToken () {
    const key = this.ACCESS_TOKEN_STORAGE_KEY

    return StorageClerk.createAsSession()
      .get(key)
  }
}
