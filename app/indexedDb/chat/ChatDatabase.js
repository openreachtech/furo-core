import BaseDatabase from '../../../lib/storage/indexedDb/BaseDatabase.js'
import ChatDatabaseMigration from './ChatDatabaseMigration.js'
import MessagesStore from './objectStores/MessagesStore.js'

/**
 * ChatDatabase class.
 */
export default class ChatDatabase extends BaseDatabase {
  /** @override */
  static get dbName () {
    return 'chat'
  }

  /** @override */
  static get MigrationCtor () {
    return ChatDatabaseMigration
  }

  /**
   * get: The store of messages.
   *
   * @returns {MessagesStore} The store
   */
  get messagesStore () {
    return MessagesStore.create({
      dbClient: this.dbClient,
    })
  }
}
