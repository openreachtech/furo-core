import BaseAppRenchanRestfulApiLauncher from '../../BaseAppRenchanRestfulApiLauncher.js'

import AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload from './AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload.js'
import AlphaExternalCallbackSuccessGetRenchanRestfulApiCapsule from './AlphaExternalCallbackSuccessGetRenchanRestfulApiCapsule.js'

/**
 * Alpha external callback success GET Renchan RESTful API launcher.
 *
 * @extends {BaseAppRenchanRestfulApiLauncher}
 */
export default class AlphaExternalCallbackSuccessGetRenchanRestfulApiLauncher extends BaseAppRenchanRestfulApiLauncher {
  /** @override */
  static get Payload () {
    return AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload
  }

  /** @override */
  static get Capsule () {
    return AlphaExternalCallbackSuccessGetRenchanRestfulApiCapsule
  }
}
