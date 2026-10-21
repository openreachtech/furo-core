/**
 * Base class for converting request bodies.
 *
 * @template B - Type of the converted request body.
 * @abstract
 */
export default class BaseRequestBodyConverter {
  /**
   * Constructor.
   *
   * @param {BaseRequestBodyConverterParams} params - Parameters of constructor.
   */
  constructor ({
    body,
    headerEntries,
  }) {
    this.body = body
    this.headerEntries = headerEntries
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof BaseRequestBodyConverter ? X : never} T, X
   * @param {BaseRequestBodyConverterFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    body,
    headerEntries = this.collectHeaderEntries(),
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        body,
        headerEntries,
      })
    )
  }

  /**
   * Collects header entries which the converted body requires.
   *
   * @abstract
   * @returns {Array<[string, string]>} Header entries.
   * @throws {Error} If the method is not implemented in a subclass.
   */
  static collectHeaderEntries () {
    throw new Error('this method must be inherited in subclass')
  }

  /**
   * Converts the request body.
   *
   * @abstract
   * @returns {B} Converted request body.
   * @throws {Error} If the method is not implemented in a subclass.
   */
  convertBody () {
    throw new Error('this method must be inherited in subclass')
  }
}

/**
 * @typedef {{
 *   body: Record<string, *>
 *   headerEntries: Array<[string, string]>
 * }} BaseRequestBodyConverterParams
 */

/**
 * @typedef {{
 *   body: Record<string, *>
 *   headerEntries?: Array<[string, string]>
 * }} BaseRequestBodyConverterFactoryParams
 */
