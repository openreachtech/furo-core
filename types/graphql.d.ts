import type {
  PayloadCtor,
  Payload,
  BaseGraphqlPayloadParams as PayloadParams,
  BaseGraphqlPayloadFactoryParams as PayloadFactoryParams,
  GraphqlRequestVariables as RequestVariables,
} from '../lib/client/graphql/BaseGraphqlPayload'

import type {
  CapsuleCtor,
  Capsule,
  BaseGraphqlCapsuleParams as CapsuleParams,
  BaseGraphqlCapsuleFactoryParams as CapsuleFactoryParams,
  GraphqlResponse as Response,
  GraphqlResponseContent as ResponseContent,
  GraphqlResponseError as ResponseError,
  LAUNCH_ABORTED_REASON,
} from '../lib/client/graphql/BaseGraphqlCapsule'

import type {
  LauncherCtor,
  Launcher,
  BaseGraphqlLauncherParams as LauncherParams,
  BaseGraphqlLauncherFactoryParams as LauncherFactoryParams,
  GraphqlLaunchRequestArgs as LaunchRequestArgs,
  GraphqlLauncherHooks as LauncherHooks,
  GraphqlRequestArgs as RequestArgs,
} from '../lib/client/graphql/BaseGraphqlLauncher'

/**
 * Furo GraphQL types
 */
declare global {
  namespace GraphqlType {
    export {
      // Payload
      PayloadCtor,
      Payload,
      PayloadParams,
      PayloadFactoryParams,
      RequestVariables,

      // Capsule
      CapsuleCtor,
      Capsule,
      CapsuleParams,
      CapsuleFactoryParams,

      Response,
      ResponseContent,
      ResponseError,
      LAUNCH_ABORTED_REASON,

      // Launcher
      LauncherCtor,
      Launcher,
      LauncherParams,
      LauncherFactoryParams,

      LaunchRequestArgs,
      LauncherHooks,
      RequestArgs,
    }
  }
}
