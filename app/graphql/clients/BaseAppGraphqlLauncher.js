import BaseGraphqlLauncher from '../../../lib/client/BaseGraphqlLauncher.js'

import graphqlConfig from '../graphql.config.js'

/**
 * Company sponsors query graphql launcher.
 *
 * @extends {BaseGraphqlLauncher}
 */
export default class BaseAppGraphqlLauncher extends BaseGraphqlLauncher {
  /** @override */
  static get graphqlConfig () {
    return graphqlConfig
  }
}

/**
 * @typedef {furo.BaseGraphqlLauncherFactoryParams} BaseAppGraphqlLauncherFactoryParams
 */
