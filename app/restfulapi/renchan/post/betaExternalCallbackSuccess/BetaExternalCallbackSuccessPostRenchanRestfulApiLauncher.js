import BaseAppRenchanRestfulApiLauncher from '../../BaseAppRenchanRestfulApiLauncher.js'

import BetaExternalCallbackSuccessPostRenchanRestfulApiPayload from './BetaExternalCallbackSuccessPostRenchanRestfulApiPayload.js'
import BetaExternalCallbackSuccessPostRenchanRestfulApiCapsule from './BetaExternalCallbackSuccessPostRenchanRestfulApiCapsule.js'

/**
 * Beta external callback success POST Renchan RESTful API launcher.
 *
 * @extends {BaseAppRenchanRestfulApiLauncher}
 */
export default class BetaExternalCallbackSuccessPostRenchanRestfulApiLauncher extends BaseAppRenchanRestfulApiLauncher {
  /** @override */
  static get Payload () {
    return BetaExternalCallbackSuccessPostRenchanRestfulApiPayload
  }

  /** @override */
  static get Capsule () {
    return BetaExternalCallbackSuccessPostRenchanRestfulApiCapsule
  }
}
