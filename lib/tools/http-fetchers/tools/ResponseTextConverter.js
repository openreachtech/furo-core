import CharsetResolver from './CharsetResolver.js'

/**
 * Converter that decodes the body of a response into text.
 *
 * It decodes with the charset that `CharsetResolver` resolves from the headers of the response,
 * and with the default charset where `TextDecoder` does not know that charset.
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
   * get: Charset that is used where `TextDecoder` does not know the resolved one.
   *
   * @returns {string} Label of the charset, which is the default charset of the resolver.
   */
  static get DEFAULT_CHARSET () {
    return this.CharsetResolverCtor.DEFAULT_CHARSET
  }

  /**
   * get: Constructor of the resolver of the charset.
   *
   * @returns {typeof CharsetResolver} Constructor of the resolver.
   */
  static get CharsetResolverCtor () {
    return CharsetResolver
  }

  /**
   * Create a resolver of the charset that the headers declare.
   *
   * @param {{
   *   headerHash: Record<string, string> | null
   * }} params - Parameters.
   * @returns {CharsetResolver} Instance of the resolver.
   */
  static createCharsetResolver ({
    headerHash,
  }) {
    return this.CharsetResolverCtor.create({
      headerHash,
    })
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
   * Resolve the charset that the headers of the response declare.
   *
   * @returns {string} Label of the charset, or the default charset where the response declares none.
   */
  resolveCharset () {
    const resolver = this.Ctor.createCharsetResolver({
      headerHash: this.responseParcel.extractHeaderHash(),
    })

    return resolver.resolveCharset()
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
      charset: this.resolveCharset(),
    })

    return decoder.decode(arrayBuffer)
  }
}
