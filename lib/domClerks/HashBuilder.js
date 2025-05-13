/**
 * Object hash builder.
 */
export default class HashBuilder {
  /**
   * Constructor.
   *
   * @param {HashBuilderParams} params
   */
  constructor ({
    core,
  }) {
    this.core = core
  }

  /**
   * Build hash.
   *
   * @template {X extends typeof HashBuilder ? X : never} T, X
   * @param {HashBuilderFactoryParams} [params] - Factory parameters.
   * @returns {InstanceType<T>}
   * @this {T}
   */
  static create ({
    core = {},
  } = {}) {
    return /** @type {InstanceType<T>} */ (
      new this({
        core,
      })
    )
  }

  /**
   * get: Constructor of this class.
   *
   * @template {X extends typeof HashBuilder ? X : never} T, X
   * @returns {T}
   * @this {InstanceType<T>}
   */
  get Ctor () {
    return /** @type {T} */ (
      this.constructor
    )
  }

  /**
   * Set values.
   *
   * @param {{
   *   values: Array<[string, *]>
   * }} params - Parameters.
   * @returns {HashBuilder} - An instance of this class for method chaining.
   */
  setValues ({
    values,
  }) {
    return values.reduce(
      (builder, [name, value]) =>
        builder.setValue({
          name,
          value,
        }),
      this
    )
  }

  /*
   * keysPath と value を渡すと、
   * keysPath に従ってハッシュを構築した後、
   * value を設定して this を返す。
   */

  /**
   * Set value.
   *
   * @param {{
   *   name: string
   *   value: *
   * }} params - Parameters.
   * @returns {HashBuilder} - An instance of this class for method chaining.
   */
  setValue ({
    name,
    value,
  }) {
    if (!name) {
      return this
    }

    const keys = name.split('.')
    const lastKey = keys.at(-1)

    const childrenKey = keys.slice(0, -1)
      .join('.')

    this.fulfillHash({
      keysPath: childrenKey,
    })

    /** @type {HashBuilder | null} */
    const leafHash = keys.slice(0, -1)
      .reduce(
        (core, key) => core.extractValue({
          key,
        }),
        this
      )

    leafHash?.assignValueToCore({
      key: lastKey,
      value,
    })

    return this
  }

  /**
   * Fulfill hash.
   *
   * @param {{
   *   keysPath: string
   * }} params - Parameters.
   * @returns {HashBuilder} - An instance of this class for method chaining.
   */
  fulfillHash ({
    keysPath,
  }) {
    if (!keysPath) {
      return this
    }

    const [
      key,
      childrenKey = '',
    ] = keysPath.split(/(?<=^[^.]+)\./u)

    this.core[key] = this.resolveChildHash({
      key,
    })
      .fulfillHash({
        keysPath: childrenKey,
      })

    return this
  }

  /**
   * Extract value.
   *
   * @param {{
   *   key: string
   * }} params - Parameters.
   * @returns {HashBuilder | * | null} - Value.
   */
  extractValue ({
    key,
  }) {
    return this.core[key] ?? null
  }

  /**
   * Assign value to core.
   *
   * @param {{
   *   key: string
   *   value: *
   * }} params - Parameters.
   */
  assignValueToCore ({
    key,
    value,
  }) {
    this.core[key] = value
  }

  /**
   * Resolve child hash.
   *
   * @param {{
   *   key: string
   * }} params - Parameters.
   * @returns {HashBuilder} - An instance of this class.
   */
  resolveChildHash ({
    key,
  }) {
    if (this.core[key]) {
      return this.core[key]
    }

    return this.createChildHashBuilder({
      key,
    })
  }

  /**
   * Create child hash builder.
   *
   * @param {{
   *   key: string
   * }} params - Parameters.
   * @returns {HashBuilder} - An instance of this class.
   */
  createChildHashBuilder ({
    key,
  }) {
    const childCore = key.endsWith('[]')
      ? []
      : {}

    return this.createHashBuilder({
      core: childCore,
    })
  }

  /**
   * Create core.
   *
   * @param {{
   *   core: object | Array<*>
   * }} params - Parameters.
   * @returns {HashBuilder} - An instance of this class.
   */
  createHashBuilder ({
    core,
  }) {
    return this.Ctor.create({
      core,
    })
  }

  /**
   * Build hash.
   *
   * @returns {Record<string, *>} - Hash.
   * @public
   */
  buildHash () {
    if (Array.isArray(this.core)) {
      return this.core
        .map(
          value => (
            value instanceof HashBuilder
              ? value.buildHash()
              : value
          )
        )
    }

    return Object.fromEntries(
      Object.entries(this.core)
        .map(
          ([key, value]) => [
            key.replace(/\[\]$/u, ''),
            value instanceof HashBuilder
              ? value.buildHash()
              : value,
          ]
        )
    )
  }
}

/**
 * @typedef {{
 *   core: object
 * }} HashBuilderParams
 */

/**
 * @typedef {{
 *   core?: object
 * }} HashBuilderFactoryParams
 */
