/**
 * Converter that decodes the body of a response into text.
 *
 * It decodes with the charset that the `Content-Type` header of the response declares,
 * and with UTF-8 where the header declares none or declares one that `TextDecoder` does not know.
 */
export default class ResponseTextConverter {
  /**
   * Constructor.
   *
   * @param {{
   *   responseParcel: import('../parcels/BaseHttpParcel.js').default<*>
   * }} params - Parameters of constructor.
   */
  constructor ({
    responseParcel,
  }) {
    this.responseParcel = responseParcel
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof ResponseTextConverter ? X : never} T, X
   * @param {{
   *   responseParcel: import('../parcels/BaseHttpParcel.js').default<*>
   * }} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
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
   * get: Charset that is used where the response declares none.
   *
   * @returns {string} Label of the charset.
   */
  static get DEFAULT_CHARSET () {
    return 'utf-8'
  }

  /**
   * get: Constructor of `TextDecoder`.
   *
   * @returns {typeof TextDecoder} Constructor of `TextDecoder`.
   */
  static get TextDecoderCtor () {
    return TextDecoder
  }

  /**
   * Create a text decoder of the charset.
   *
   * @param {{
   *   charset: string
   * }} params - Parameters.
   * @returns {TextDecoder} Instance of `TextDecoder`, which falls back to UTF-8 where the charset is unknown.
   */
  static createTextDecoder ({
    charset,
  }) {
    try {
      return new this.TextDecoderCtor(charset)
    } catch (error) {
      return new this.TextDecoderCtor(this.DEFAULT_CHARSET)
    }
  }

  /**
   * get: Constructor of this class.
   *
   * @returns {typeof ResponseTextConverter} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof ResponseTextConverter} */ (
      this.constructor
    )
  }

  /**
   * Extract the charset that the `Content-Type` header of the response declares.
   *
   * @returns {string} Label of the charset, or UTF-8 if the response declares none.
   */
  extractCharset () {
    const contentType = this.responseParcel.response
      ?.headers
      .get('Content-Type')
      ?? ''

    return contentType.match(/;\s*charset\s*=\s*"?([^";\s]+)"?/iu)
      ?.at(1)
      ?? this.Ctor.DEFAULT_CHARSET
  }

  /**
   * Convert the response body into text.
   *
   * @returns {Promise<string | null>} Text of the response body, or null if the response was not received.
   * @public
   */
  async toText () {
    const arrayBuffer = await this.responseParcel.toArrayBuffer()

    if (arrayBuffer === null) {
      return null
    }

    const decoder = this.Ctor.createTextDecoder({
      charset: this.extractCharset(),
    })

    return decoder.decode(arrayBuffer)
  }
}
