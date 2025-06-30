import {
  RESTFUL_API_METHOD,
} from '../../../../../lib/client/restfulapi/constants.js'

import BaseAppRenchanRestfulApiPayload from '../../BaseAppRenchanRestfulApiPayload.js'

/**
 * Alpha external callback success GET Renchan RESTful API payload.
 *
 * @extends {BaseAppRenchanRestfulApiPayload<*, *, *>}
 */
export default class AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload extends BaseAppRenchanRestfulApiPayload {
  /**
   * get: method.
   *
   * @override
   * @returns {RestfulApiType.METHOD} HTTP method.
   */
  static get method () {
    return RESTFUL_API_METHOD.GET
  }

  /** @override */
  static get pathname () {
    return '/alpha-external-callback/success'
  }
}
