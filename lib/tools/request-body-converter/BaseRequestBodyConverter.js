/**
 * Base class for converting request bodies.
 *
 * @template {Record<string, *>} [B = Record<string, *>] - Type of the request body.
 * @abstract
 */
export default class BaseRequestBodyConverter {
  /**
   * Constructor.
   *
   * @param {BaseRequestBodyConverterFactoryParams<B>} params - Parameters of factory method.
   */
  constructor ({
    body,
  }) {
    this.body = body
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
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        body,
      })
    )
  }

  /**
   * Converts the request body.
   *
   * @abstract
   * @returns {FormData | string} Converted request body.
   * @throws {Error} If the method is not implemented in a subclass.
   */
  convertBody () {
    throw new Error('this method must be inherited in subclass')
  }

  /**
   * Generates header entries which the converted body requires.
   *
   * @abstract
   * @returns {Array<[string, string]>} Header entries.
   * @throws {Error} If the method is not implemented in a subclass.
   */
  generateHeaderEntries () {
    throw new Error('this method must be inherited in subclass')
  }
}

/**
 * @typedef {{
 *   body: B
 * }} BaseRequestBodyConverterParams
 * @template {Record<string, *>} [B = Record<string, *>]
 */

/**
 * @typedef {BaseRequestBodyConverterParams<B>} BaseRequestBodyConverterFactoryParams
 * @template {Record<string, *>} [B = Record<string, *>]
 */
