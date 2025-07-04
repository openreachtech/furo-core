import {
  GraphQLError,
} from 'graphql'

import './graphql.d.ts'
import './restfulapi.d.ts'

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
  ConnectorCtor,
  Connector,
  SubscriptionConnectorParams,
  SubscriptionConnectorFactoryParams,
} from '../lib/client/graphql/SubscriptionConnector'

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
  FormControlElementInspectorParams,
  FormControlElementInspectorFactoryParams,
  FormControlElementType,
  FormControlElementValueType,
} from '../lib/domClerks/FormControlElementInspector.js'

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

declare global {
  namespace furo {
    export {
      CloseEvent as WebSocketCloseEvent,

      // ---------------------------------------------------------- Subscription

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

      // from FormControlElementInspector
      FormControlElementInspectorParams,
      FormControlElementInspectorFactoryParams,
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
