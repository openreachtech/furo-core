/**
 * Resolver of the charset that the headers of a response declare.
 *
 * It resolves the charset of the `Content-Type` header,
 * and the default charset where the header is missing or declares no charset.
 */
export default class CharsetResolver {
  /**
   * Constructor.
   *
   * @param {{
   *   headerHash: Record<string, string> | null
   * }} params - Parameters of constructor.
   */
  constructor ({
    headerHash,
  }) {
    this.headerHash = headerHash
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof CharsetResolver ? X : never} T, X
   * @param {{
   *   headerHash: Record<string, string> | null
   * }} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    headerHash,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        headerHash,
      })
    )
  }

  /**
   * get: Charset that is used where the headers declare none.
   *
   * @returns {string} Label of the charset.
   */
  static get DEFAULT_CHARSET () {
    return 'utf-8'
  }

  /**
   * get: Constructor of this class.
   *
   * @returns {typeof CharsetResolver} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof CharsetResolver} */ (
      this.constructor
    )
  }

  /**
   * Resolve the charset that the `Content-Type` header declares.
   *
   * @returns {string} Label of the charset, or the default charset where the header declares none.
   * @public
   */
  resolveCharset () {
    const contentType = this.headerHash
      ?.['content-type']

    if (!contentType) {
      return this.Ctor.DEFAULT_CHARSET
    }

    const charset = this.extractDeclaredCharset({
      contentType,
    })

    if (!charset) {
      return this.Ctor.DEFAULT_CHARSET
    }

    return charset
  }

  /**
   * Extract the charset that the `Content-Type` declares, without the spaces around it.
   *
   * @param {{
   *   contentType: string
   * }} params - Parameters.
   * @returns {string | null} Label of the charset, or null where the `Content-Type` declares no charset.
   */
  extractDeclaredCharset ({
    contentType,
  }) {
    const groups = contentType.match(/;\s*charset\s*=\s*(?:"(?<quoted>[^"]*)"|(?<bare>[^;\s]+))/iu)
      ?.groups

    const charset = groups?.quoted
      ?? groups?.bare
      ?? null

    if (charset === null) {
      return null
    }

    return charset.trim()
  }
}
