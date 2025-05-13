import BaseAppGraphqlLauncher from '../../BaseAppGraphqlLauncher.js'
import CompanySponsorsQueryGraphqlPayload from './CompanySponsorsQueryGraphqlPayload.js'
import CompanySponsorsQueryGraphqlCapsule from './CompanySponsorsQueryGraphqlCapsule.js'

/**
 * Company sponsors query graphql launcher.
 *
 * @extends {BaseAppGraphqlLauncher}
 */
export default class CompanySponsorsQueryGraphqlLauncher extends BaseAppGraphqlLauncher {
  /** @override */
  static get Payload () {
    return CompanySponsorsQueryGraphqlPayload
  }

  /** @override */
  static get Capsule () {
    return CompanySponsorsQueryGraphqlCapsule
  }
}
