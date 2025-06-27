import BaseRestfulApiPayload from '../BaseRestfulApiPayload.js'

/**
 * Base class for Renchan RESTful API payloads.
 *
 * @template {RestfulApiType.RequestQuery} [QP = {}] - Query parameters.
 * @template {RestfulApiType.RequestBody} [BP = {}] - Request body.
 * @template {RestfulApiType.RequestPathParams} [PP = {}] - Path parameters.
 * @extends {BaseRestfulApiPayload<QP, BP, PP>}
 */
export default class BaseRenchanRestfulApiPayload extends BaseRestfulApiPayload {
  // noop
}
