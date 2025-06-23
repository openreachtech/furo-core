import DynamicDerivedCtorPool from '../DynamicDerivedCtorPool.js'
import DerivedClassNameGenerator from '../DerivedClassNameGenerator.js'

/**
 * Base class for a registry of derived constructors.
 *
 * @template {Function} C - The type of the derived class.
 * @abstract
 */
export default class BaseDerivedCtorRegistry {
  /**
   * Constructor.
   *
   * @param {BaseDerivedCtorRegistryParams<C>} params - Parameters for the class.
   */
  constructor ({
    SuperCtor,
    pool,
    classNameGenerator,
  }) {
    this.SuperCtor = SuperCtor
    this.pool = pool
    this.classNameGenerator = classNameGenerator
  }

  /**
   * Factory method
   *
   * @template {X extends typeof BaseDerivedCtorRegistry<*> ? X : never} T, X
   * @param {BaseDerivedCtorRegistryFactoryParams<*>} params - Parameters for the factory.
   * @returns {InstanceType<T>} - An instance of the class.
   * @this {T}
   */
  static create ({
    SuperCtor,
    pool = this.createDynamicDerivedCtorPool(),
    fixedPrefix = 'Base',
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
      })
    )
  }

  /**
   * Create a dynamic derived constructor pool.
   *
   * @returns {DynamicDerivedCtorPool} - A dynamic derived constructor pool.
   */
  static createDynamicDerivedCtorPool () {
    return DynamicDerivedCtorPool.create()
  }

  /**
   * Create a derived class name generator.
   *
   * @param {{
   *   className: string
   *   fixedPrefix?: string
   * }} params - Parameters.
   * @returns {DerivedClassNameGenerator} - A derived class name generator.
   */
  static createDerivedClassNameGenerator ({
    className,
    fixedPrefix,
  }) {
    return DerivedClassNameGenerator.create({
      className,
      fixedPrefix,
    })
  }

  /**
   * Obtain a derived constructor class
   *
   * @returns {C} - The derived constructor class.
   */
  obtainCtor () {
    const className = this.generateClassName()

    const existsCtor = this.retrieveCtor({
      className,
    })
    if (existsCtor) {
      return existsCtor
    }

    return this.registerDeclaredCtor({
      className,
    })
  }

  /**
   * Generate a class name.
   *
   * @returns {string} - The generated class name.
   */
  generateClassName () {
    const prefixMethod = this.generatePrefix()

    return this.classNameGenerator.generateClassName({
      prefix: prefixMethod,
    })
  }

  /**
   * Generate a prefix method name.
   *
   * @abstract
   * @returns {string} - The generated prefix method name.
   * @throws {Error} this feature must be inherited
   */
  generatePrefix () {
    throw new Error('this feature must be inherited')
  }

  /**
   * Retrieve a constructor from the pool.
   *
   * @param {{
   *   className: string
   * }} params - Parameters.
   * @returns {C | null} - The constructor or null if not found.
   */
  retrieveCtor ({
    className,
  }) {
    return /** @type {C | null} */ (
      this.pool.retrieveCtor({
        name: className,
      })
    )
  }

  /**
   * Register a declared constructor.
   *
   * @param {{
   *   className: string
   * }} params - Parameters.
   * @returns {C} - A derived constructor class.
   */
  registerDeclaredCtor ({
    className,
  }) {
    const Ctor = this.declareCtor()

    this.pool.registerCtor({
      name: className,
      Ctor,
    })

    return Ctor
  }

  /**
   * Declare a constructor as a REST method.
   *
   * @abstract
   * @returns {C} - A derived constructor class.
   * @throws {Error} this feature must be inherited
   */
  declareCtor () {
    throw new Error('this feature must be inherited')
  }
}

/**
 * @typedef {{
 *   SuperCtor: C
 *   pool: DynamicDerivedCtorPool
 *   classNameGenerator: DerivedClassNameGenerator
 * }} BaseDerivedCtorRegistryParams
 * @template C
 */

/**
 * @typedef {{
 *   SuperCtor: C
 *   pool?: DynamicDerivedCtorPool
 *   fixedPrefix?: string
 * }} BaseDerivedCtorRegistryFactoryParams
 * @template C
 */
