import {
  GraphQLError as GraphqlError,
} from 'graphql'

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

import {
  SubscriptionPayloadCtor,
  SubscriptionPayload,
  BaseSubscriptionGraphqlPayloadParams as SubscriptionPayloadParams,
  BaseSubscriptionGraphqlPayloadFactoryParams,
} from '../lib/client/graphql/BaseSubscriptionGraphqlPayload'

import {
  SubscriptionCapsuleCtor,
  SubscriptionCapsule,
  BaseSubscriptionGraphqlCapsuleParams,
  BaseSubscriptionGraphqlCapsuleFactoryParams,
  SUBSCRIBE_ABORTED_REASON,
} from '../lib/client/graphql/BaseSubscriptionGraphqlCapsule'

import {
  SubscriberCtor,
  Subscriber,
  BaseGraphqlSubscriberParams,
  BaseGraphqlSubscriberFactoryParams,
  GraphqlSubscribeRequestArgs as SubscribeRequestArgs,
  GraphqlSubscriberHooks as SubscriberHooks,
} from '../lib/client/graphql/BaseGraphqlSubscriber'

type WebSocketSink = Partial<{
  connecting: GraphqlWebsocketEventConnectingListener
  opened: GraphqlWebsocketEventOpenedListener
  message: GraphqlWebsocketEventMessageListener
  connected: GraphqlWebsocketEventConnectedListener
  closed: GraphqlWebsocketEventClosedListener
  ping: GraphqlWebsocketEventPingListener
  pong: GraphqlWebsocketEventPongListener
  error: GraphqlWebsocketEventErrorListener
}>

type WebSocketSinkError = Error
  | Array<ResponseError>
  | furo.WebSocketCloseEvent

/**
 * Furo GraphQL types
 */
declare global {
  namespace GraphqlType {
    export {
      //--------------------------------------------------- Native GraphQL Types

      GraphqlError as ResponseError,

      WebSocketSink,
      WebSocketSinkError,

      // ---------------------------------------------------- Query and Mutation

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
      LAUNCH_ABORTED_REASON,

      // Launcher
      LauncherCtor,
      Launcher,
      LauncherParams,
      LauncherFactoryParams,

      LaunchRequestArgs,
      LauncherHooks,
      RequestArgs,

      // ---------------------------------------------------------- Subscription

      // from BaseSubscriptionGraphqlPayload
      SubscriptionPayloadCtor,
      SubscriptionPayload,
      SubscriptionPayloadParams,
      BaseSubscriptionGraphqlPayloadFactoryParams,

      // from BaseSubscriptionGraphqlCapsule
      SubscriptionCapsuleCtor,
      SubscriptionCapsule,
      BaseSubscriptionGraphqlCapsuleParams,
      BaseSubscriptionGraphqlCapsuleFactoryParams,
      SUBSCRIBE_ABORTED_REASON,

      // from BaseGraphqlSubscriber
      SubscriberCtor,
      Subscriber,
      BaseGraphqlSubscriberParams,
      BaseGraphqlSubscriberFactoryParams,

      SubscribeRequestArgs,
      SubscriberHooks,
    }
  }
}
