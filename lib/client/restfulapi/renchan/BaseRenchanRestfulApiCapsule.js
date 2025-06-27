import BaseRestfulApiCapsule from '../BaseRestfulApiCapsule.js'

/**
 * Base class for Renchan RESTful API capsules.
 *
 * @template C - Type of the content held by the capsule.
 * @template {RestfulApiType.Payload<*, *, *>} [P = RestfulApiType.Payload<*, *, *>] - Type of the payload associated with this capsule.
 * @extends {BaseRestfulApiCapsule<C, P>}
 */
export default class BaseRenchanRestfulApiCapsule extends BaseRestfulApiCapsule {
  // noop
}
