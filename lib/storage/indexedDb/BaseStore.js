/**
 * Base store.
 *
 * @template V
 */
export default class BaseStore {
  /**
   * Constructor for BaseStore.
   *
   * @param {BaseStoreParams} params - The parameters to initialize the BaseStore.
   */
  constructor ({
    dbClient,
  }) {
    this.dbClient = dbClient
  }

  /**
   * Factory method of BaseStore.
   *
   * @template {X extends typeof BaseStore ? X : never} T, X
   * @param {BaseStoreFactoryParams} params - Parameters of factory method.
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
   * get: Store name.
   *
   * @abstract
   * @returns {string} The store name
   */
  static get storeName () {
    throw new Error('This method must be inherited')
  }

  /**
   * get: Constructor of this class.
   *
   * @returns {typeof BaseStore} The constructor of this class
   */
  get Ctor () {
    return /** @type {typeof BaseStore} */ (this.constructor)
  }

  /**
   * get: The store.
   *
   * @returns {IDBObjectStore} The store
   */
  get objectStore () {
    return this.dbClient.takeStore({
      storeName: this.Ctor.storeName,
    })
  }

  /**
   * Find all values.
   *
   * @param {{
   *   query?: IDBValidKey | IDBKeyRange | null
   *   count?: number
   * }} [params] - The parameters to find all values.
   * @returns {Promise<Array<V>>} The promise with the result
   * @throws {Error} The error
   */
  async findAll ({
    query = null,
    count,
  } = {}) {
    const request = this.objectStore.getAll(
      query,
      count
    )

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Find by primary key.
   *
   * @param {{
   *   key: string
   * }} params - The parameters to put the value.
   * @returns {Promise<V>} The request
   * @throws {Error} The error
   */
  async findByKey ({
    key,
  }) {
    const request = this.objectStore.get(key)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Find by index.
   *
   * @param {{
   *   indexName: string
   *   value: string | number | IDBKeyRange | null
   *   direction?: 'next' | 'prev'
   *   limit?: number | null
   * }} params - The parameters to find via index.
   * @returns {Promise<Array<V>>} The request
   * @throws {Error} The error
   */
  async findByIndex ({
    indexName,
    value,
    direction = 'prev',
    limit = Infinity,
  }) {
    const dbIndex = this.objectStore.index(indexName)

    const query = this.normalizeIndexQuery({
      dbIndex,
      value,
    })

    const cursorRequest = dbIndex.openCursor(
      query,
      direction
    )

    const messages = []

    return new Promise((resolve, reject) => {
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result

        if (!cursor) {
          resolve(messages)

          return
        }

        messages.push(cursor.value)

        if (limit <= messages.length) {
          resolve(messages)

          return
        }

        cursor.continue()
      }

      cursorRequest.onerror = () => {
        reject(cursorRequest.error)
      }
    })
  }

  /**
   * Normalize index query.
   *
   * @param {{
   *   dbIndex: IDBIndex
   *   value: string | number | IDBKeyRange | null
   * }} params - The parameters to normalize the index value.
   * @returns {IDBKeyRange | null} Index query
   */
  normalizeIndexQuery ({
    dbIndex,
    value,
  }) {
    if (value === null) {
      return null
    }

    if (value instanceof IDBKeyRange) {
      return value
    }

    return this.createKeyRange({
      keyPath: dbIndex.keyPath,
      value,
    })
  }

  /**
   * Create key range.
   *
   * @param {{
   *   keyPath: string | Array<string>
   *   value: string | number
   * }} params - The parameters to create the key range.
   * @returns {IDBKeyRange} The key range
   */
  createKeyRange ({
    keyPath,
    value,
  }) {
    return IDBKeyRange.bound(
      [value, ''],
      [value, '\uffff']
    )
  }

  /**
   * Save a value.
   *
   * @param {{
   *   value: V
   *   key?: IDBValidKey
   * }} params - The parameters to create the value.
   * @returns {Promise<IDBValidKey>} The request
   * @throws {Error} The error
   */
  async save ({
    value,
    key,
  }) {
    const request = this.objectStore.put(value, key)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
      .then(it => it)
      .catch(error => null)
  }

  /**
   * Bulk save values.
   *
   * @param {{
   *   values: Array<{
   *     value: V
   *     key?: IDBValidKey
   *   }>
   * }} params - The parameters to bulk save the values.
   * @returns {Promise<Array<V>>} The request
   * @throws {Error} The error
   */
  async bulkSave ({
    values,
  }) {
    const store = this.objectStore

    return Promise.all(
      values.map(it =>
        new Promise((resolve, reject) => {
          const request = store.put(it)

          request.onsuccess = () => resolve(request.result)
          request.onerror = () => reject(request.error)
        })
      )
    )
  }
}

/**
 * @typedef {{
 *   dbClient: import('./IndexedDbClient.js').default
 * }} BaseStoreParams
 */

/**
 * @typedef {BaseStoreParams} BaseStoreFactoryParams
 */
