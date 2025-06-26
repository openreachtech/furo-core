import type {
  PayloadCtor,
  Payload,
  BaseRestfulApiPayloadParams as PayloadParams,
  BaseRestfulApiPayloadFactoryParams as PayloadFactoryParams,

  RestfulApiRequestQuery as RequestQuery,
  RestfulApiRequestBody as RequestBody,
  RestfulApiRequestPathParams as RequestPathParams,
} from '../lib/client/restfulapi/BaseRestfulApiPayload'

import type {
  CapsuleCtor,
  Capsule,
  BaseRestfulApiCapsuleParams as CapsuleParams,
  BaseRestfulApiCapsuleFactoryParams as CapsuleFactoryParams,

  RestfulApiResponse as Response,
  RestfulApiResponseContent as ResponseContent,
  RestfulApiResponseError as ResponseError,
} from '../lib/client/restfulapi/BaseRestfulApiCapsule'

import type {
  LauncherCtor,
  Launcher,
  BaseRestfulApiLauncherParams as LauncherParams,
  BaseRestfulApiLauncherFactoryParams as LauncherFactoryParams,

  RestfulApiLaunchRequestArgs as LaunchRequestArgs,
  RestfulApiLauncherHooks as LauncherHooks,
} from '../lib/client/restfulapi/BaseRestfulApiLauncher'

type METHOD = 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'TRACE'
  | 'CONNECT'
type RequestUrl = RequestInfo | URL

/**
 * Furo RESTful API types
 */
declare global {
  namespace RestfulApiType {
    export {
      // Payload
      PayloadCtor,
      Payload,
      PayloadParams,
      PayloadFactoryParams,

      RequestQuery,
      RequestBody,
      RequestPathParams,

      // Capsule
      CapsuleCtor,
      Capsule,
      CapsuleParams,
      CapsuleFactoryParams,

      Response,
      ResponseContent,
      ResponseError,

      // Launcher
      LauncherCtor,
      Launcher,
      LauncherParams,
      LauncherFactoryParams,

      LaunchRequestArgs,
      LauncherHooks,

      METHOD,

      // Additional types
      RequestUrl
    }
  }
}
