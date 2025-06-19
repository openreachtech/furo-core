/**
 * Derived class name generator.
 */
export default class DerivedClassNameGenerator {
  /**
   * Constructor.
   *
   * @param {DerivedClassNameGeneratorParams} params - Parameters for the class.
   */
  constructor ({
    className,
    fixedPrefix,
  }) {
    this.className = className
    this.fixedPrefix = fixedPrefix
  }

  /**
   * Factory method
   *
   * @template {X extends typeof DerivedClassNameGenerator ? X : never} T, X
   * @param {DerivedClassNameGeneratorFactoryParams} params - Parameters for the factory.
   * @returns {InstanceType<T>} - An instance of the class.
   * @this {T}
   */
  static create ({
    className,
    fixedPrefix = '',
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        className,
        fixedPrefix,
      })
    )
  }

  /**
   * Generates a class name based on the fixed prefix and class name.
   *
   * @param {{
   *   prefix: string
   * }} params - Parameters for generating the class name.
   * @returns {string} - The generated class name.
   */
  generateClassName ({
    prefix,
  }) {
    return this.className.replace(
      new RegExp(`(?<=^${this.fixedPrefix})`, 'u'),
      prefix
    )
  }
}

/**
 * @typedef {{
 *   className: string
 *   fixedPrefix: string
 * }} DerivedClassNameGeneratorParams
 */

/**
 * @typedef {{
 *   className: string
 *   fixedPrefix?: string
 * }} DerivedClassNameGeneratorFactoryParams
 */
