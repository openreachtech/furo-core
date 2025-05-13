import IndexedDbClient from './IndexedDbClient.js'

const Timber = console

/**
 * @class BaseDatabase
 * @classdesc BaseDatabase is a class that provides a simple interface to interact with IndexedDB.
 * @note
 * IndexedDbClient に渡すパラメータは、BaseDatabase で生成する。
 * {
 *   dbName: string
 *   dbVersion: number
 *   onUpgradeNeeded: ($event: IDBVersionChangeEvent) => void
 *   onSuccess?: ($event: Event) => void
 *   onError?: ($event: Event) => void
 * }
 */
export default class BaseDatabase {
  /**
   * Constructor for BaseDatabase.
   *
   * @param {BaseDatabaseParams} params - The parameters to initialize the BaseDatabase.
   */
  constructor ({
    dbClient,
  }) {
    this.dbClient = dbClient
  }

  /**
   * Factory method of BaseDatabase.
   *
   * @template {X extends typeof BaseDatabase ? X : never} T, X
   * @param {BaseDatabaseFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    dbClient,
  }) {
    return /** @type {*} */ (
      new this({
        dbClient,
      })
    )
  }

  /**
   * Factory method as an async function of BaseDatabase.
   *
   * @template {X extends typeof BaseDatabase ? X : never} T, X
   * @returns {Promise<InstanceType<T>>} Instance of this class.
   * @this {T}
   */
  static async createAsync () {
    const dbClient = await this.createDbClient()

    return this.create({
      dbClient,
    })
  }

  /**
   * get: IndexedDBClient class.
   *
   * @returns {typeof IndexedDbClient} The class of IndexedDbClient.
   */
  static get IndexedDbClientCtor () {
    return IndexedDbClient
  }

  /**
   * get: Database name.
   *
   * @abstract
   * @returns {string} The name of the database.
   * @throws {Error} This function must be inherited
   */
  static get dbName () {
    throw new Error('This function must be inherited')
  }

  /**
   * get: Database version.
   *
   * @returns {number} The version of the database.
   */
  static get dbVersion () {
    return 1
  }

  /**
   * get: Migration class.
   *
   * @abstract
   * @returns {typeof import('./BaseDatabaseMigration.js').default} The class of migration.
   * @throws {Error} This function must be inherited
   */
  static get MigrationCtor () {
    throw new Error('This function must be inherited')
  }

  /**
   * Create IndexedDB client.
   *
   * @returns {Promise<IndexedDbClient>} The IndexedDB database.
   */
  static async createDbClient () {
    return this.IndexedDbClientCtor.createAsync({
      config: this.config,
      callbacks: this.generateCallbacks(),
    })
  }

  /**
   * Generate config.
   *
   * @returns {{
   *   dbName: string
   *   dbVersion: number
   * }}
   */
  static get config () {
    return {
      dbName: this.dbName,
      dbVersion: this.dbVersion,
    }
  }

  /**
   * Generate callbacks.
   *
   * @returns {{
   *   onSuccess: (successEvent: Event) => void
   *   onError: (errorEvent: Event) => void
   *   onUpgradeNeeded: (params: VersionChangeParams) => void
   * }} The callbacks.
   */
  static generateCallbacks () {
    return {
      onSuccess: this.defineOnSuccess(),
      onError: this.defineOnError(),
      onUpgradeNeeded: this.defineOnUpgradeNeeded(),
    }
  }

  /**
   * Define onSuccess event handler.
   *
   * @returns {(successEvent: Event) => void} The event handler.
   */
  static defineOnSuccess () {
    return successEvent => {
      Timber.log('✅️✅️✅️✅️✅️✅️✅️✅️ onsuccess (2)', successEvent)
    }
  }

  /**
   * Define onError event handler.
   *
   * @returns {(errorEvent: Event) => void} The event handler.
   */
  static defineOnError () {
    return errorEvent => {
      Timber.error('🔥🔥🔥🔥🔥🔥🔥🔥🔥 onerror (2)', errorEvent)
    }
  }

  /**
   * Define onUpgradeNeeded event handler.
   *
   * @returns {(params: VersionChangeParams) => void} The event handler.
   */
  static defineOnUpgradeNeeded () {
    return ({
      dbClient,
      newVersion,
      oldVersion,
    }) => {
      const migration = this.MigrationCtor.create({
        dbClient,
      })

      migration.migrate({
        newVersion,
        oldVersion,
      })
    }
  }

  /**
   * get: Constructor.
   *
   * @returns {typeof BaseDatabase} The constructor of this class.
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }
}

/**
 * @typedef {{
 *   dbClient: import('./IndexedDbClient.js').default
 * }} BaseDatabaseParams
 */

/**
 * @typedef {BaseDatabaseParams} BaseDatabaseFactoryParams
 */

/**
 * @typedef {{
 *   dbClient: import('./IndexedDbClient.js').default
 *   newVersion: number
 *   oldVersion: number
 * }} VersionChangeParams
 */
