import BaseAppSubscriptionGraphqlPayload from '../../BaseAppSubscriptionGraphqlPayload.js'

/**
 * On observe chat states subscription GraphQL payload.
 *
 * @extends {BaseAppSubscriptionGraphqlPayload<OnObserveChatStatesSubscriptionRequestVariables>}
 */
export default class OnObserveChatStatesSubscriptionGraphqlPayload extends BaseAppSubscriptionGraphqlPayload {
  /** @override */
  static get document () {
    return `
      subscription OnObserveChatStates ($input: OnObserveChatStatesInput!) {
        onObserveChatStates (input: $input) {
          hasUnreadMessages
          isUpdatedRooms
          isUpdatedMembers
        }
      }
    `
  }
}

/**
 * @typedef {{
 *   input: {
 *     chatRoomId: number
 *   }
 * }} OnObserveChatStatesSubscriptionRequestVariables
 */
