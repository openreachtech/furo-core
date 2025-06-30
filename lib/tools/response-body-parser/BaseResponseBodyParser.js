/**
 * Base class for parsing response bodies.
 *
 * @template {Record<string, *>} C - Type of the parsed response body.
 * @abstract
 */
export default class BaseResponseBodyParser {
  /**
   * Constructor.
   *
   * @param {BaseResponseBodyParserFactoryParams} params - Parameters of factory method.
   */
  constructor ({
    response,
  }) {
    this.response = response
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
    response,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        response,
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
 *   response: Response
 * }} BaseResponseBodyParserParams
 */

/**
 * @typedef {BaseResponseBodyParserParams} BaseResponseBodyParserFactoryParams
 */
