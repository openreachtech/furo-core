import BaseAppRenchanRestfulApiLauncher from '../../BaseAppRenchanRestfulApiLauncher.js'

import PathParameterHashGetRenchanRestfulApiPayload from './PathParameterHashGetRenchanRestfulApiPayload.js'
import PathParameterHashGetRenchanRestfulApiCapsule from './PathParameterHashGetRenchanRestfulApiCapsule.js'

/**
 * Path parameter hash GET Renchan RESTful API launcher.
 *
 * @extends {BaseAppRenchanRestfulApiLauncher}
 */
export default class PathParameterHashGetRenchanRestfulApiLauncher extends BaseAppRenchanRestfulApiLauncher {
  /** @override */
  static get Payload () {
    return PathParameterHashGetRenchanRestfulApiPayload
  }

  /** @override */
  static get Capsule () {
    return PathParameterHashGetRenchanRestfulApiCapsule
  }
}
