/**
 * Pathname Builder.
 */
export default class PathnameBuilder {
  /**
   * Constructor.
   *
   * @param {PathnameBuilderParams} params - Parameters for constructor.
   */
  constructor ({
    templatePathname,
  }) {
    this.templatePathname = templatePathname
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof PathnameBuilder ? X : never} T, X
   * @param {PathnameBuilderFactoryParams} params - Parameters for the factory method.
   * @returns {InstanceType<T>} An instance of the class.
   * @this {T}
   */
  static create ({
    templatePathname,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        templatePathname,
      })
    )
  }

  /**
   * Build interpolated pathname
   *
   * @param {{
   *   valueHash: Record<string, *>
   * }} params - Parameters for the method.
   * @returns {string} Interpolated pathname.
   */
  buildPathname ({
    valueHash,
  }) {
    return this.templatePathname.replace(
      /\[([^\]]+)\]/ug,
      (_, key) =>
        valueHash[key] ?? ''
    )
  }
}

/**
 * @typedef {{
 *   templatePathname: string
 * }} PathnameBuilderParams
 */

/**
 * @typedef {PathnameBuilderParams} PathnameBuilderFactoryParams
 */
