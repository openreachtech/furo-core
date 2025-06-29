import BaseRenchanRestfulApiPayload from '../../../lib/client/restfulapi/renchan/BaseRenchanRestfulApiPayload.js'

import {
  HEADER_KEY,
  STORAGE_KEY,
} from '../../constants.js'

/**
 * Base app for Renchan RESTful API payloads.
 *
 * @template QP, BP, PP
 * @abstract
 * @extends {BaseRenchanRestfulApiPayload<QP, BP, PP>}
 */
export default class BaseAppRenchanRestfulApiPayload extends BaseRenchanRestfulApiPayload {
  /** @override */
  static get ACCESS_TOKEN_HEADER_KEY () {
    return HEADER_KEY.ACCESS_TOKEN
  }

  /** @override */
  static get ACCESS_TOKEN_STORAGE_KEY () {
    return STORAGE_KEY.ACCESS_TOKEN
  }

  /**
   * get: prefix pathname.
   *
   * @override
   * @returns {string} Prefix pathname.
   * @example
   * ```javascript
   * return '/v1'
   * ```
   */
  static get prefixPathname () {
    return '/v1'
  }
}
