import BaseAppGraphqlSubscriber from '../../BaseAppGraphqlSubscriber.js'
import OnObserveChatStatesSubscriptionGraphqlPayload from './OnObserveChatStatesSubscriptionGraphqlPayload.js'
import OnObserveChatStatesSubscriptionGraphqlCapsule from './OnObserveChatStatesSubscriptionGraphqlCapsule.js'

/**
 * On observer chat state GraphQL subscriber.
 *
 * @extends {BaseAppGraphqlSubscriber}
 */
export default class OnObserveChatStatesGraphqlSubscriber extends BaseAppGraphqlSubscriber {
  /** @override */
  static get Payload () {
    return OnObserveChatStatesSubscriptionGraphqlPayload
  }

  /** @override */
  static get Capsule () {
    return OnObserveChatStatesSubscriptionGraphqlCapsule
  }
}
