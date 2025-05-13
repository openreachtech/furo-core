import BaseStore from '../../../../lib/storage/indexedDb/BaseStore.js'

/**
 * Messages store.
 *
 * @extends {BaseStore<MessageEntity>}
 */
export default class MessagesStore extends BaseStore {
  /** @override */
  static get storeName () {
    return 'messages'
  }
}

/**
 * @typedef {{
 *   id: number
 *   roomId: number
 *   postedAt: string
 *   content: string
 *   sender: string
 * }} MessageEntity
 */
