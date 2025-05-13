import BaseAppSubscriptionGraphqlCapsule from '../../BaseAppSubscriptionGraphqlCapsule.js'

/**
 * On observe chat states subscription GraphQL capsule.
 */
export default class OnObserveChatStatesSubscriptionGraphqlCapsule extends BaseAppSubscriptionGraphqlCapsule {
  /**
   * Extract value hash.
   *
   * @returns {Record<string, *> | null} Value hash.
   */
  extractValueHash () {
    const content = this.extractContent()

    return content?.onObserveChatStates
      ?? null
  }

  /**
   * Has unread messages.
   *
   * @returns {boolean | null} Has unread messages
   */
  hasUnreadMessages () {
    return this.extractValueHash()
      ?.hasUnreadMessages
  }

  /**
   * Has updated members.
   *
   * @returns {boolean | null} Has unread messages
   */
  hasUpdatedMembers () {
    return this.extractValueHash()
      ?.hasUpdatedMembers
  }
}
