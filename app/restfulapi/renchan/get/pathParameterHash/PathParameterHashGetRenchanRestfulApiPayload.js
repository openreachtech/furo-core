import {
  RESTFUL_API_METHOD,
} from '../../../../../lib/client/restfulapi/constants.js'

import BaseAppRenchanRestfulApiPayload from '../../BaseAppRenchanRestfulApiPayload.js'

/**
 * Path parameter hash Renchan RESTful API payload.
 *
 * @extends {BaseAppRenchanRestfulApiPayload<*, *, *>}
 */
export default class PathParameterHashGetRenchanRestfulApiPayload extends BaseAppRenchanRestfulApiPayload {
  /** @override */
  static get method () {
    return RESTFUL_API_METHOD.GET
  }

  /** @override */
  static get pathname () {
    return '/path-parameter-hash/[id]/[name]'
  }
}
