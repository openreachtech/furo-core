import {
  GraphQLError,
} from 'graphql'

import {
  Client as WebSocketClient,
  ClientOptions as WebSocketClientOptions,
  SubscribePayload as WebSocketSubscribePayload,
  Sink as WebSocketSubscribeSink,

  EventErrorListener as GraphqlWebsocketEventErrorListener,
  EventConnectingListener as GraphqlWebsocketEventConnectingListener,
  EventOpenedListener as GraphqlWebsocketEventOpenedListener,
  EventMessageListener as GraphqlWebsocketEventMessageListener,
  EventConnectedListener as GraphqlWebsocketEventConnectedListener,
  EventClosedListener as GraphqlWebsocketEventClosedListener,
  EventPingListener as GraphqlWebsocketEventPingListener,
  EventPongListener as GraphqlWebsocketEventPongListener,
} from 'graphql-ws'

import {
  PayloadCtor,
  Payload,
  BaseGraphqlPayloadParams,
  BaseGraphqlPayloadFactoryParams,
  GraphqlRequestVariables,
} from '../lib/client/BaseGraphqlPayload'

import {
  CapsuleCtor,
  Capsule,
  BaseGraphqlCapsuleParams,
  BaseGraphqlCapsuleFactoryParams,
  GraphqlResponse,
  GraphqlResponseContent,
  GraphqlResponseError,
  LAUNCH_ABORTED_REASON,
} from '../lib/client/graphql/BaseGraphqlCapsule'

import {
  LauncherCtor,
  Launcher,
  BaseGraphqlLauncherParams,
  BaseGraphqlLauncherFactoryParams,
  GraphqlLaunchRequestArgs,
  GraphqlRequestArgs,
  GraphqlLauncherHooks,
} from '../lib/client/BaseGraphqlLauncher'

import {
  SubscriptionPayloadCtor,
  SubscriptionPayload,
  BaseSubscriptionGraphqlPayloadParams,
  BaseSubscriptionGraphqlPayloadFactoryParams,
} from '../lib/client/BaseSubscriptionGraphqlPayload'

import {
  SubscriptionCapsuleCtor,
  SubscriptionCapsule,
  BaseSubscriptionGraphqlCapsuleParams,
  BaseSubscriptionGraphqlCapsuleFactoryParams,
  SUBSCRIBE_ABORTED_REASON,
} from '../lib/client/BaseSubscriptionGraphqlCapsule'

import {
  SubscriberCtor,
  Subscriber,
  BaseGraphqlSubscriberParams,
  BaseGraphqlSubscriberFactoryParams,
  GraphqlSubscriberHooks,
} from '../lib/client/BaseGraphqlSubscriber'

import {
  ConnectorCtor,
  Connector,
  SubscriptionConnectorParams,
  SubscriptionConnectorFactoryParams,
} from '../lib/client/SubscriptionConnector'

import {
  FormElementClerkCtor,
  FormElementClerk,
  BaseFormElementClerkParams,
  BaseFormElementClerkFactoryParams,
  FormControlElementHash,
  FormControlElementType,
  FormValueHashType,
} from '../lib/domClerks/BaseFormElementClerk'

import {
  FormControlElementClerkParams,
  FormControlElementClerkFactoryParams,
  FormControlElementType,
  FormControlElementValueType,
} from '../lib/domClerks/FormControlElementClerk'

import {
  StorageClerkParams,
  StorageClerkFactoryParams,
} from '../lib/storage/StorageClerk'

import {
  default as FieldValidator,
  FieldValidatorCtor,
  FieldValidatorParams,
  FieldValidatorFactoryParams,
  ValidationRule,
} from '../lib/validator/FieldValidator'

import {
  ValueHashValidatorParams,
  ValueHashValidatorFactoryParams,
  ValidatorHashType,
} from '../lib/validator/ValueHashValidator'

type GraphqlWebSocketSink = Partial<{
  connecting: GraphqlWebsocketEventConnectingListener
  opened: GraphqlWebsocketEventOpenedListener
  message: GraphqlWebsocketEventMessageListener
  connected: GraphqlWebsocketEventConnectedListener
  closed: GraphqlWebsocketEventClosedListener
  ping: GraphqlWebsocketEventPingListener
  pong: GraphqlWebsocketEventPongListener
  error: GraphqlWebsocketEventErrorListener
}>

type GraphqlWebSocketSinkError = Error
  | Array<furo.GraphQLError>
  | furo.WebSocketCloseEvent

declare global {
  namespace furo {
    export {
      GraphQLError,

      CloseEvent as WebSocketCloseEvent,

      GraphqlWebSocketSink,
      GraphqlWebSocketSinkError,

      // from BaseGraphqlPayload
      PayloadCtor,
      Payload,
      BaseGraphqlPayloadParams,
      BaseGraphqlPayloadFactoryParams,
      GraphqlRequestVariables,

      // from BaseGraphqlCapsule
      CapsuleCtor,
      Capsule,
      BaseGraphqlCapsuleParams,
      BaseGraphqlCapsuleFactoryParams,
      GraphqlResponse,
      GraphqlResponseContent,
      GraphqlResponseError,
      LAUNCH_ABORTED_REASON,

      // from BaseGraphqlLauncher
      LauncherCtor,
      Launcher,
      BaseGraphqlLauncherParams,
      BaseGraphqlLauncherFactoryParams,
      GraphqlLaunchRequestArgs,
      GraphqlRequestArgs,
      GraphqlLauncherHooks,

      // ---------------------------------------------------------- Subscription

      // from BaseSubscriptionGraphqlPayload
      SubscriptionPayloadCtor,
      SubscriptionPayload,
      BaseSubscriptionGraphqlPayloadParams,
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

      GraphqlSubscribeRequestArgs,
      GraphqlRequestArgs,
      GraphqlSubscriberHooks,

      // from SubscriptionConnector
      ConnectorCtor,
      Connector,
      SubscriptionConnectorParams,
      SubscriptionConnectorFactoryParams,

      // from graphql-ws
      WebSocketClient,
      WebSocketClientOptions,
      WebSocketSubscribePayload,
      WebSocketSubscribeSink,

      // --------------------------------------------------- Form Element Clerks

      // from BaseFormElementClerk
      FormElementClerkCtor,
      FormElementClerk,
      BaseFormElementClerkParams,
      BaseFormElementClerkFactoryParams,
      FormControlElementHash,
      FormControlElementType,
      FormValueHashType,

      // from FormControlElementClerk
      FormControlElementClerkParams,
      FormControlElementClerkFactoryParams,
      FormControlElementType,
      FormControlElementValueType,

      // from StorageClerk
      StorageClerkParams,
      StorageClerkFactoryParams,

      // from FieldValidator
      FieldValidatorCtor,
      FieldValidator,
      FieldValidatorParams,
      FieldValidatorFactoryParams,
      ValidationRule,

      // from ValueHashValidator
      ValueHashValidatorParams,
      ValueHashValidatorFactoryParams,
      ValidatorHashType,
    }
  }
}
