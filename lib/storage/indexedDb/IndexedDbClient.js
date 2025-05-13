/**
 * IndexedDB client.
 */
export default class IndexedDbClient {
  /**
   * Constructor for IndexedDbClient.
   *
   * @param {IndexedDbClientParams} params - The parameters to initialize the IndexedDbClient.
   */
  constructor ({
    db,
  }) {
    this.db = db
  }

  /**
   * Factory method of IndexedDbClient.
   *
   * @template {X extends typeof IndexedDbClient ? X : never} T, X
   * @param {IndexedDbClientFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    db,
  }) {
    return /** @type {*} */ (
      new this({
        db,
      })
    )
  }

  /**
   * Factory method as an async function of IndexedDbClient.
   *
   * @template {X extends typeof IndexedDbClient ? X : never} T, X
   * @param {IndexedDbClientAsyncFactoryParams} params - Parameters of factory method.
   * @returns {Promise<InstanceType<T>>} Instance of this class.
   * @this {T}
   */
  static async createAsync ({
    config,
    callbacks,
  }) {
    const db = await this.createDatabase({
      config,
      callbacks,
    })

    return this.create({
      db,
    })
  }

  /**
   * Get the IndexedDB client.
   *
   * @returns {IDBFactory} The IndexedDB client.
   */
  static get indexedDbHandler () {
    return indexedDB
  }

  /**
   * Create a new IndexedDB database.
   *
   * @param {{
   *   config: {
   *     dbName: string
   *     dbVersion: number
   *   }
   *   callbacks: {
   *     onUpgradeNeeded: (params: import('./BaseDatabase').VersionChangeParams) => void
   *     onSuccess: (successEvent: Event) => void
   *     onError: (errorEvent: Event) => void
   *   }
   * }} params - The parameters to create a new IndexedDB database.
   * @returns {Promise<IDBDatabase | null>} The IndexedDB database.
   */
  static async createDatabase ({
    config: {
      dbName,
      dbVersion,
    },
    callbacks,
  }) {
    return new Promise((resolve, reject) => {
      const request = this.indexedDbHandler.open(
        dbName,
        dbVersion
      )

      /**
       * @param {IDBVersionChangeFulfilledEvent} versionChangeEvent
       * @returns {void}
       */
      const onupgradeneeded = versionChangeEvent => {
        const {
          newVersion,
          oldVersion,
          target: {
            result,
          },
        } = versionChangeEvent

        const dbClient = this.create({
          db: result,
        })

        callbacks.onUpgradeNeeded({
          dbClient,
          newVersion,
          oldVersion,
        })
      }

      request.onupgradeneeded = onupgradeneeded
      request.onsuccess = successEvent => resolve(successEvent)
      request.onerror = errorEvent => reject(errorEvent)
    })
      .then(successEvent => {
        callbacks.onSuccess(successEvent)

        return successEvent.target.result
      })
      .catch(errorEvent => {
        callbacks.onError(errorEvent)

        return null
      })
  }

  /**
   * get: Constructor.
   *
   * @returns {typeof IndexedDbClient} The constructor of this class.
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }

  /**
   * Create object store.
   *
   * @param {{
   *   storeName: string
   *   primaryKeyPath?: string | Array<string> | null
   *   storeOptions?: IDBObjectStoreParameters
   * }} params - The parameters to create object store.
   * @returns {IDBObjectStore} The object store.
   */
  createObjectStore ({
    storeName,
    primaryKeyPath = null,
    storeOptions = {},
  }) {
    return this.db.createObjectStore(storeName, {
      ...storeOptions,

      keyPath: primaryKeyPath,
    })
  }

  /**
   * Begin transaction.
   *
   * @param {{
   *   storeNames: Array<string>
   *   transactionMode?: IDBTransactionMode
   *   transactionOptions?: IDBTransactionOptions
   * }} params - The parameters to begin transaction.
   * @returns {IDBTransaction} The transaction.
   */
  beginTransaction ({
    storeNames,
    transactionMode = 'readwrite',
    transactionOptions = {},
  }) {
    return this.db.transaction(
      storeNames,
      transactionMode,
      transactionOptions
    )
  }

  /**
   * Take object store via transaction.
   *
   * @param {{
   *   storeName: string
   * }} params - The parameters to take object store.
   * @returns {IDBObjectStore} The object store.
   */
  takeStore ({
    storeName,
  }) {
    return this.beginTransaction({
      storeNames: [
        storeName,
      ],
    })
      .objectStore(storeName)
  }
}

/**
 * @typedef {{
 *   db: IDBDatabase | null
 * }} IndexedDbClientParams
 */

/**
 * @typedef {IndexedDbClientParams} IndexedDbClientFactoryParams
 */

/**
 * @typedef {{
 *   config: {
 *     dbName: string
 *     dbVersion: number
 *   }
 *   callbacks: {
 *     onUpgradeNeeded: (versionChangeEvent: import('./BaseDatabase').VersionChangeParams) => void
 *     onSuccess: (successEvent: Event) => void
 *     onError: (errorEvent: Event) => void
 *   }
 * }} IndexedDbClientAsyncFactoryParams
 */

/**
 * @typedef {IDBVersionChangeEvent & {
 *   target: {
 *     result: IDBDatabase
 *   }
 * }} IDBVersionChangeFulfilledEvent
 */
