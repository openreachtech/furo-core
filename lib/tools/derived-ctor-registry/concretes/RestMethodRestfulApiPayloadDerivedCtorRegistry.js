import BaseDerivedCtorRegistry from '../BaseDerivedCtorRegistry.js'

/**
 * Rest Method Derived Constructor Registry.
 *
 * @template {RestfulApiType.PayloadCtor} P
 * @extends {BaseDerivedCtorRegistry<P>}
 */
export default class RestMethodRestfulApiPayloadDerivedCtorRegistry extends BaseDerivedCtorRegistry {
  /**
   * Constructor.
   *
   * @param {RestMethodRestfulApiPayloadDerivedCtorRegistryParams} params - Parameters for the class.
   */
  constructor ({
    SuperCtor: Ctor,
    pool,
    classNameGenerator,

    method,
  }) {
    super({
      SuperCtor: /** @type {P} */ (Ctor),
      pool,
      classNameGenerator,
    })

    this.method = method
  }

  /**
   * Factory method
   *
   * @template {X extends typeof RestMethodRestfulApiPayloadDerivedCtorRegistry ? X : never} T, X
   * @param {RestMethodRestfulApiPayloadDerivedCtorRegistryFactoryParams} params - Parameters for the factory.
   * @returns {InstanceType<T>} - An instance of the class.
   * @this {T}
   */
  static create ({
    SuperCtor,
    pool = this.createDynamicDerivedCtorPool(),
    fixedPrefix = 'Base',

    method,
  }) {
    const classNameGenerator = this.createDerivedClassNameGenerator({
      className: SuperCtor.name,
      fixedPrefix,
    })

    return /** @type {InstanceType<T>} */ (
      new this({
        SuperCtor,
        pool,
        classNameGenerator,

        method,
      })
    )
  }

  /** @override */
  generatePrefix () {
    return this.method.toLowerCase()
      .replace(
        /^./u,
        it => it.toUpperCase()
      )
  }

  /** @override */
  declareCtor () {
    const restMethod = this.method

    // @ts-expect-error
    return class extends this.SuperCtor {
      /** @override */
      static get method () {
        return restMethod
      }
    }
  }
}

/**
 * @typedef {import('../BaseDerivedCtorRegistry.js').BaseDerivedCtorRegistryParams<RestfulApiType.PayloadCtor> & {
 *   method: RestfulApiType.METHOD
 * }} RestMethodRestfulApiPayloadDerivedCtorRegistryParams
 */

/**
 * @typedef {import('../BaseDerivedCtorRegistry.js').BaseDerivedCtorRegistryFactoryParams<RestfulApiType.PayloadCtor> & {
 *   method: RestfulApiType.METHOD
 * }} RestMethodRestfulApiPayloadDerivedCtorRegistryFactoryParams
 */
