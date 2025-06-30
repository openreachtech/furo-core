/**
 * Anonymous Name Assigner
 *
 * @template {new (...args: any[]) => any} C
 * @property {C} AnonymousCtor - The constructor of the anonymous class.
 */
export default class AnonymousClassNameAssigner {
  /**
   * Constructor.
   *
   * @param {AnonymousClassNameAssignerParams} params - Parameters for the class.
   */
  constructor ({
    AnonymousCtor,
  }) {
    this.AnonymousCtor = AnonymousCtor
  }

  /**
   * Factory method
   *
   * @template {X extends typeof AnonymousClassNameAssigner ? X : never} T, X
   * @param {AnonymousClassNameAssignerFactoryParams} params - Parameters for the factory.
   * @returns {InstanceType<T>} - An instance of the class.
   * @this {T}
   */
  static create ({
    AnonymousCtor,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        AnonymousCtor,
      })
    )
  }

  /**
   * Assigns a class name to the anonymous constructor.
   *
   * @param {{
   *   name: string
   * }} params - Parameters for assigning the class name.
   * @returns {C}
   */
  assignClassName ({
    name,
  }) {
    return /** @type {C} */ (
      { [name]: class extends this.AnonymousCtor {} }[name]
    )
  }
}

/**
 * @typedef {{
 *   AnonymousCtor: new (...args: any[]) => any
 * }} AnonymousClassNameAssignerParams
 */

/**
 * @typedef {AnonymousClassNameAssignerParams} AnonymousClassNameAssignerFactoryParams
 */
