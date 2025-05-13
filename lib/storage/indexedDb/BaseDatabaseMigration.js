/**
 * Base class for database migration.
 */
export default class BaseDatabaseMigration {
  /**
   * Constructor for BaseDatabaseMigration.
   *
   * @param {BaseDatabaseMigrationParams} params - The parameters to initialize the BaseDatabaseMigration.
   */
  constructor ({
    dbClient,
  }) {
    this.dbClient = dbClient
  }

  /**
   * Factory method of BaseDatabaseMigration.
   *
   * @template {X extends typeof BaseDatabaseMigration ? X : never} T, X
   * @param {BaseDatabaseMigrationFactoryParams} params - Parameters of factory method.
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
   * Migrate the database.
   *
   * @param {{
   *   newVersion: number
   *   oldVersion: number
   * }} params - The parameters to migrate the database.
   * @returns {Promise<void>} The promise with the result of the
   * migration
   * @throws {Error} This function must be inherited
   * @public
   */
  async migrate ({
    oldVersion,
    newVersion,
  }) {
    /*
     * TODO:
     * 此処で、新旧バージョンに応じたマイグレーション処理を実装する。以下の処理は駄目。
     *
     * #resolveMigration(oldVersion, newVersion) で処理を特定して、
     * attribute を追加するなりテーブルを書き換えるなりする。
     *
     * データの正属性を保持するなら、データの移行処理も必要。
     */

    const objectStoreArgs = this.generateObjectStoreArgs()

    const createResults = this.createObjectStores(...objectStoreArgs)

    const isValid = this.validatesCreatedStores({
      createResults,
    })

    if (!isValid) {
      throw new Error('Failed to create object stores')
    }
  }

  /**
   * Generate object store arguments.
   *
   * @abstract
   * @returns {Array<{
   *   storeName: string
   *   primaryKeyPath: string | Array<string> | null
   *   storeOptions?: IDBObjectStoreParameters
   *   indexArgs: Array<{
   *     indexName: string
   *     indexKeyPath: string | Array<string> | null
   *     indexOptions?: IDBIndexParameters
   *   }>
   * }>} The object store arguments
   * @throws {Error} This function must be inherited
   */
  generateObjectStoreArgs () {
    throw new Error('This function must be inherited')
  }

  /**
   * Create object store.
   *
   * @param {Array<{
   *   storeName: string
   *   primaryKeyPath: string | Array<string> | null
   *   storeOptions?: IDBObjectStoreParameters
   *   indexArgs: Array<{
   *     indexName: string
   *     indexKeyPath: string | Array<string> | null
   *     indexOptions?: IDBIndexParameters
   *   }>
   * }>} createArgs - The arguments to create object store.
   * @returns {Array<{
   *   store: IDBObjectStore
   *   indexes: Array<IDBIndex>
   * }>} The object stores.
   */
  createObjectStores (...createArgs) {
    const results = createArgs.map(({
      storeName,
      primaryKeyPath,
      storeOptions,
      indexArgs,
    }) => {
      const store = this.dbClient.createObjectStore({
        storeName,
        primaryKeyPath,
        storeOptions,
      })

      const indexResults = indexArgs.map(({
        indexName,
        indexKeyPath,
        indexOptions = {},
      }) =>
        store.createIndex(
          indexName,
          indexKeyPath,
          indexOptions
        )
      )

      return {
        store,
        indexes: indexResults,
      }
    })

    return results
  }

  /**
   * Validate created stores.
   *
   * @param {{
   *   createResults: Array<{
   *     store: IDBObjectStore
   *     indexes: Array<IDBIndex>
   *   }>
   * }} params - The parameters to validate created stores.
   * @returns {boolean} The result of the validation.
   */
  validatesCreatedStores ({
    createResults,
  }) {
    return createResults.every(({
      store,
      indexes,
    }) =>
      store instanceof IDBObjectStore
      && indexes.every(index => index instanceof IDBIndex)
    )
  }
}

/**
 * @typedef {{
 *   dbClient: import('./IndexedDbClient.js').default
 * }} BaseDatabaseMigrationParams
 */

/**
 * @typedef {BaseDatabaseMigrationParams} BaseDatabaseMigrationFactoryParams
 */
