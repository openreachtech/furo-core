import BaseGraphqlLauncher from '../../../lib/client/graphql/BaseGraphqlLauncher.js'

import graphqlConfig from '../graphql.config.js'

/**
 * Base class of GraphQL launcher for the app.
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
 * @typedef {GraphqlType.LauncherFactoryParams} BaseAppGraphqlLauncherFactoryParams
 */
