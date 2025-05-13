/**
 * Headers parser.
 */
export default class HeadersParser {
  /**
   * Constructor.
   *
   * @param {HeadersParserParams} params
   */
  constructor ({
    haystack,
  }) {
    this.haystack = haystack
  }

  /**
   * Parse headers.
   *
   * @template {X extends typeof HeadersParser ? X : never} T, X
   * @param {HeadersParserFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    haystack,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        haystack,
      })
    )
  }

  /**
   * Parse header entries.
   *
   * @returns {Array<[string, string]>} Parsed header entries.
   */
  parseHeaderEntries () {
    const keyValueSeparatorRegex = /(?<=^[^:]*):\s+/u

    return this.haystack
      .trim()
      .split(/\r?\n/u)
      .map(
        it => it.split(keyValueSeparatorRegex)
      )
      .map(
        ([key, value]) => /** @type {[string, string]} */ ([
          key.trim(),
          value.trim(),
        ])
      )
      .filter(
        ([key, value]) => key
      )
  }

  /**
   * Create headers.
   *
   * @returns {Headers} Parsed headers.
   */
  createHeaders () {
    return new Headers(
      this.parseHeaderEntries()
    )
  }
}

/**
 * @typedef {{
 *   haystack: string
 * }} HeadersParserParams
 */

/**
 * @typedef {HeadersParserParams} HeadersParserFactoryParams
 */
