import BaseAppGraphqlLauncher from '../../BaseAppGraphqlLauncher.js'

import CurriculumsQueryGraphqlPayload from './CurriculumsQueryGraphqlPayload.js'
import CurriculumsQueryGraphqlCapsule from './CurriculumsQueryGraphqlCapsule.js'

/**
 * Curriculums query graphql launcher.
 *
 * @extends {BaseAppGraphqlLauncher}
 */
export default class CurriculumsQueryGraphqlLauncher extends BaseAppGraphqlLauncher {
  /** @override */
  static get Payload () {
    return CurriculumsQueryGraphqlPayload
  }

  /** @override */
  static get Capsule () {
    return CurriculumsQueryGraphqlCapsule
  }
}
