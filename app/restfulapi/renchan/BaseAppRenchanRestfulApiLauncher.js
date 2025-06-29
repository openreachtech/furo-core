import BaseRenchanRestfulApiLauncher from '../../../lib/client/restfulapi/renchan/BaseRenchanRestfulApiLauncher.js'

import renchanRestfulApiConfig from './renchan-restfulapi.config.js'

/**
 * Base app for Renchan RESTful API launchers.
 *
 * @abstract
 * @extends {BaseRenchanRestfulApiLauncher}
 */
export default class BaseAppRenchanRestfulApiLauncher extends BaseRenchanRestfulApiLauncher {
  /** @override */
  static get restfulApiConfig () {
    return renchanRestfulApiConfig
  }
}
