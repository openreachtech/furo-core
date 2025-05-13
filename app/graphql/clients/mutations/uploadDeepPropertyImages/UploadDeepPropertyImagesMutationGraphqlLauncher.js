import BaseAppGraphqlLauncher from '../../BaseAppGraphqlLauncher.js'
import UploadDeepPropertyImagesMutationGraphqlPayload from './UploadDeepPropertyImagesMutationGraphqlPayload.js'
import UploadDeepPropertyImagesMutationGraphqlCapsule from './UploadDeepPropertyImagesMutationGraphqlCapsule.js'

/**
 * UploadDeepPropertyImages mutation graphql launcher.
 *
 * @extends {BaseAppGraphqlLauncher}
 */
export default class UploadDeepPropertyImagesMutationGraphqlLauncher extends BaseAppGraphqlLauncher {
  /** @override */
  static get Payload () {
    return UploadDeepPropertyImagesMutationGraphqlPayload
  }

  /** @override */
  static get Capsule () {
    return UploadDeepPropertyImagesMutationGraphqlCapsule
  }
}
