/** @type {Map<string, DynamicDerivedCtor>} */
const globalCtorPool = new Map()

/**
 * DynamicDerivedCtorPool
 */
export default class DynamicDerivedCtorPool {
  /**
   * Constructor.
   *
   * @param {DynamicDerivedCtorPoolParams} params - Parameters for the class.
   */
  constructor ({
    pool,
  }) {
    this.pool = pool
  }

  /**
   * Factory method
   *
   * @template {X extends typeof DynamicDerivedCtorPool ? X : never} T, X
   * @param {DynamicDerivedCtorPoolFactoryParams} [params] - Parameters for the factory.
   * @returns {InstanceType<T>} - An instance of the class.
   * @this {T}
   */
  static create ({
    pool = globalCtorPool,
  } = {}) {
    return /** @type {InstanceType<T>} */ (
      new this({
        pool,
      })
    )
  }

  /**
   * Bulk register constructors to the pool.
   *
   * @param {{
   *   CtorHash: {
   *     [name: string]: DynamicDerivedCtor
   *   }
   * }} params - Parameters.
   * @returns {ThisType} For method chaining.
   */
  bulkRegisterCtors ({
    CtorHash,
  }) {
    return Object.entries(CtorHash)
      .reduce(
        (that, [name, Ctor]) =>
          that.registerCtor({
            name,
            Ctor,
          }),
        this
      )
  }

  /**
   * Register a constructor to the pool.
   *
   * @param {{
   *   name: string
   *   Ctor: DynamicDerivedCtor
   * }} params - Parameters.
   * @returns {ThisType} For method chaining.
   */
  registerCtor ({
    name,
    Ctor,
  }) {
    if (this.pool.has(name)) {
      return this
    }

    this.pool.set(name, Ctor)

    return this
  }

  /**
   * Retrieve a constructor from the pool.
   *
   * @param {{
   *   name: string
   * }} params - Parameters.
   * @returns {DynamicDerivedCtor | null} The constructor or null if not found.
   */
  retrieveCtor ({
    name,
  }) {
    return this.pool.get(name)
      ?? null
  }

  /**
   * Confirm if the name has already been registered in the pool.
   *
   * @param {{
   *   name: string
   * }} params - Parameters.
   * @returns {boolean} True if the constructor exists, false otherwise.
   */
  containsCtor ({
    name,
  }) {
    return this.pool.has(name)
  }
}

/**
 * @typedef {{
 *   pool: Map<string, DynamicDerivedCtor>
 * }} DynamicDerivedCtorPoolParams
 */

/**
 * @typedef {Partial<DynamicDerivedCtorPoolParams>} DynamicDerivedCtorPoolFactoryParams
 */

/**
 * @typedef {new (...args: any[]) => any} DynamicDerivedCtor
 */
