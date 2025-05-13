import BaseAppGraphqlLauncher from '../../BaseAppGraphqlLauncher.js'
import UploadArrayImagesMutationGraphqlPayload from './UploadArrayImagesMutationGraphqlPayload.js'
import UploadArrayImagesMutationGraphqlCapsule from './UploadArrayImagesMutationGraphqlCapsule.js'

/**
 * UploadArrayImages mutation graphql launcher.
 *
 * @extends {BaseAppGraphqlLauncher}
 */
export default class UploadArrayImagesMutationGraphqlLauncher extends BaseAppGraphqlLauncher {
  /** @override */
  static get Payload () {
    return UploadArrayImagesMutationGraphqlPayload
  }

  /** @override */
  static get Capsule () {
    return UploadArrayImagesMutationGraphqlCapsule
  }
}
