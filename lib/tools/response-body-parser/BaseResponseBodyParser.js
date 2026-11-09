/**
 * Base class for parsing response bodies.
 *
 * @template {Record<string, *>} [C = Record<string, *>] - Type of the parsed response body.
 * @abstract
 */
export default class BaseResponseBodyParser {
  /**
   * Constructor.
   *
   * @param {BaseResponseBodyParserFactoryParams} params - Parameters of factory method.
   */
  constructor ({
    responseParcel,
  }) {
    this.responseParcel = responseParcel
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof BaseResponseBodyParser ? X : never} T, X
   * @param {BaseResponseBodyParserFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    responseParcel,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        responseParcel,
      })
    )
  }

  /**
   * Parses the response body.
   *
   * @abstract
   * @returns {Promise<C | null>} Parsed response body.
   * @throws {Error} If the method is not implemented in a subclass.
   */
  async parseBody () {
    throw new Error('this method must be inherited in subclass')
  }
}

/**
 * @typedef {{
 *   responseParcel: import('../http-fetchers/parcels/BaseHttpParcel.js').default<*>
 * }} BaseResponseBodyParserParams
 */

/**
 * @typedef {BaseResponseBodyParserParams} BaseResponseBodyParserFactoryParams
 */
