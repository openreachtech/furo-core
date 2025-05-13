import BaseAppGraphqlLauncher from '../../BaseAppGraphqlLauncher.js'
import UploadImageMutationGraphqlPayload from './UploadImageMutationGraphqlPayload.js'
import UploadImageMutationGraphqlCapsule from './UploadImageMutationGraphqlCapsule.js'

/**
 * UploadImage mutation graphql launcher.
 *
 * @extends {BaseAppGraphqlLauncher}
 */
export default class UploadImageMutationGraphqlLauncher extends BaseAppGraphqlLauncher {
  /** @override */
  static get Payload () {
    return UploadImageMutationGraphqlPayload
  }

  /** @override */
  static get Capsule () {
    return UploadImageMutationGraphqlCapsule
  }
}
