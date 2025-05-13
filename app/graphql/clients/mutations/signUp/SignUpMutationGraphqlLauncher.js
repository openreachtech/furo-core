import BaseAppGraphqlLauncher from '../../BaseAppGraphqlLauncher.js'
import SignUpMutationGraphqlPayload from './SignUpMutationGraphqlPayload.js'
import SignUpMutationGraphqlCapsule from './SignUpMutationGraphqlCapsule.js'

/**
 * SignUp mutation graphql launcher.
 *
 * @extends {BaseAppGraphqlLauncher}
 */
export default class SignUpMutationGraphqlLauncher extends BaseAppGraphqlLauncher {
  /** @override */
  static get Payload () {
    return SignUpMutationGraphqlPayload
  }

  /** @override */
  static get Capsule () {
    return SignUpMutationGraphqlCapsule
  }
}
