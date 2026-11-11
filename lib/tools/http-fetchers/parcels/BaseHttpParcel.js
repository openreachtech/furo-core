import ResponseTextConverter from '../tools/ResponseTextConverter.js'
import { HTTP_FETCHER_ERROR } from '../tools/constants/HTTP_FETCHER_ERROR.js'

/**
 * Base class of HTTP parcel.
 *
 * It carries a request, the config the request was sent with, and either the response to it
 * or the error of the fetcher that kept the response from being received.
 *
 * @template {import('../BaseHttpFetcher.js').HttpFetcherConfig} [C = import('../BaseHttpFetcher.js').HttpFetcherConfig] - Type of the config, which each subclass decides for itself.
 */
export default class BaseHttpParcel {
  /**
   * Constructor.
   *
   * @param {{
   *   request: Request
   *   config: C
   *   response: Response | null
   *   responseUrl: string | null
   *   fetcherError: symbol | null
   * }} params - Parameters of constructor.
   */
  constructor ({
    request,
    config,

    response,
    responseUrl,

    fetcherError,
  }) {
    this.request = request
    this.config = config

    this.response = response
    this.responseUrl = responseUrl

    this.fetcherError = fetcherError
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof BaseHttpParcel ? X : never} T, X
   * @param {{
   *   request: Request
   *   config: ConstructorParameters<T>[0]['config']
   *   response?: Response | null
   *   responseUrl?: string | null
   *   fetcherError?: symbol | null
   * }} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    request,
    config,

    response = null,
    responseUrl = null,

    fetcherError = null,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        request,
        config,

        response,
        responseUrl,

        fetcherError,
      })
    )
  }

  /**
   * Factory method to create an instance of an error, which no response comes with.
   *
   * @template {X extends typeof BaseHttpParcel ? X : never} T, X
   * @param {{
   *   request: Request
   *   config: ConstructorParameters<T>[0]['config']
   *   fetcherError?: symbol
   * }} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static createAsError ({
    request,
    config,

    fetcherError = this.HTTP_FETCHER_ERROR.UNKNOWN,
  }) {
    return this.create({
      request,
      config,

      fetcherError,
    })
  }

  /**
   * Factory method to create an instance of a network failure.
   *
   * @template {X extends typeof BaseHttpParcel ? X : never} T, X
   * @param {{
   *   request: Request
   *   config: ConstructorParameters<T>[0]['config']
   * }} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static createAsNetworkError ({
    request,
    config,
  }) {
    return this.createAsError({
      request,
      config,

      fetcherError: this.HTTP_FETCHER_ERROR.NETWORK,
    })
  }

  /**
   * Factory method to create an instance of a timed out request.
   *
   * @template {X extends typeof BaseHttpParcel ? X : never} T, X
   * @param {{
   *   request: Request
   *   config: ConstructorParameters<T>[0]['config']
   * }} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static createAsTimeoutError ({
    request,
    config,
  }) {
    return this.createAsError({
      request,
      config,

      fetcherError: this.HTTP_FETCHER_ERROR.TIMEOUT,
    })
  }

  /**
   * Factory method to create an instance of an aborted request.
   *
   * @template {X extends typeof BaseHttpParcel ? X : never} T, X
   * @param {{
   *   request: Request
   *   config: ConstructorParameters<T>[0]['config']
   * }} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static createAsAbortError ({
    request,
    config,
  }) {
    return this.createAsError({
      request,
      config,

      fetcherError: this.HTTP_FETCHER_ERROR.ABORT,
    })
  }

  /**
   * get: Errors of the fetcher that kept the response from being received.
   *
   * @returns {typeof HTTP_FETCHER_ERROR} Errors of the fetcher.
   */
  static get HTTP_FETCHER_ERROR () {
    return HTTP_FETCHER_ERROR
  }

  /**
   * get: Constructor of the converter that decodes the response body into text.
   *
   * @returns {typeof ResponseTextConverter} Constructor of the converter.
   */
  static get ResponseTextConverterCtor () {
    return ResponseTextConverter
  }

  /**
   * Create a converter that decodes the response body into text.
   *
   * @param {{
   *   responseParcel: BaseHttpParcel<*>
   * }} params - Parameters.
   * @returns {ResponseTextConverter} Instance of the converter.
   */
  static createResponseTextConverter ({
    responseParcel,
  }) {
    return this.ResponseTextConverterCtor.create({
      responseParcel,
    })
  }

  /**
   * get: Constructor of this class.
   *
   * @returns {typeof BaseHttpParcel} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof BaseHttpParcel} */ (
      this.constructor
    )
  }

  /**
   * get: URL the request was sent to.
   *
   * @returns {string} URL of the request.
   */
  get requestUrl () {
    return this.request.url
  }

  /**
   * get: HTTP status code of the response.
   *
   * @returns {number | null} HTTP status code, or null if the response was not received.
   */
  get status () {
    return this.response
      ?.status
      ?? null
  }

  /**
   * get: HTTP status text of the response.
   *
   * @returns {string | null} HTTP status text, or null if the response was not received.
   */
  get statusText () {
    return this.response
      ?.statusText
      ?? null
  }

  /**
   * get: Whether the status code is in the range of 200 to 299.
   *
   * @returns {BooleanLike} True if the status code is in the range of 200 to 299, false if the response was not received.
   */
  get ok () {
    return this.response
      ?.ok
      ?? false
  }

  /**
   * Extract the headers of the response, as a record whose names are in lower case.
   *
   * @returns {Record<string, string> | null} Record of the headers, or null if the response was not received.
   * @public
   */
  extractHeaderHash () {
    if (!this.response) {
      return null
    }

    return Object.fromEntries(
      this.response.headers.entries()
    )
  }

  /**
   * Check if the response was not received because of an error.
   *
   * @returns {BooleanLike} True if the parcel carries an error of the fetcher.
   * @public
   */
  hasError () {
    return this.fetcherError !== null
  }

  /**
   * Check if the response was not received because of a network failure.
   *
   * @returns {BooleanLike} True if the parcel carries the error of a network failure.
   * @public
   */
  hasNetworkError () {
    return this.fetcherError === this.Ctor.HTTP_FETCHER_ERROR.NETWORK
  }

  /**
   * Check if the response was not received because the request timed out.
   *
   * @returns {BooleanLike} True if the parcel carries the error of a timed out request.
   * @public
   */
  hasTimeoutError () {
    return this.fetcherError === this.Ctor.HTTP_FETCHER_ERROR.TIMEOUT
  }

  /**
   * Check if the response was not received because the request was aborted.
   *
   * @returns {BooleanLike} True if the parcel carries the error of an aborted request.
   * @public
   */
  hasAbortError () {
    return this.fetcherError === this.Ctor.HTTP_FETCHER_ERROR.ABORT
  }

  /**
   * Check if the response was not received because of an error that no category tells.
   *
   * @returns {BooleanLike} True if the parcel carries the error that no category tells.
   * @public
   */
  hasUnknownError () {
    return this.fetcherError === this.Ctor.HTTP_FETCHER_ERROR.UNKNOWN
  }

  /**
   * Read the response body as JSON.
   *
   * It parses the text of the body, so that it decodes with the charset of the response.
   * It reads a clone of the response, so that the parcel can be read again.
   *
   * @returns {Promise<*>} Parsed JSON, or null if the response was not received or the body is not JSON.
   * @public
   */
  async toJson () {
    const text = await this.toText()

    if (text === null) {
      return null
    }

    return this.parseJson({
      text,
    })
  }

  /**
   * Parse the text of the body as JSON.
   *
   * @param {{
   *   text: string
   * }} params - Parameters.
   * @returns {*} Parsed JSON, or null if the text is not JSON.
   */
  parseJson ({
    text,
  }) {
    try {
      return JSON.parse(text)
    } catch (error) {
      return null
    }
  }

  /**
   * Clone the response.
   *
   * @returns {Response | null} Clone of the response, which is read independently of the response of this parcel, or null if the response was not received.
   * @public
   */
  cloneResponse () {
    return this.response
      ?.clone()
      ?? null
  }

  /**
   * Read the response body as text.
   *
   * It decodes with the charset that the response declares, and with UTF-8 where it declares none.
   * It reads a clone of the response, so that the parcel can be read again.
   *
   * @returns {Promise<string | null>} Text of the response body, or null if the response was not received.
   * @public
   */
  async toText () {
    const converter = this.Ctor.createResponseTextConverter({
      responseParcel: this,
    })

    return converter.toText()
  }

  /**
   * Read the response body as an array buffer.
   *
   * It reads a clone of the response, so that the parcel can be read again.
   *
   * @returns {Promise<ArrayBuffer | null>} Array buffer of the response body, or null if the response was not received.
   * @public
   */
  async toArrayBuffer () {
    return this.cloneResponse()
      ?.arrayBuffer()
      ?? null
  }

  /**
   * Read the response body as a blob.
   *
   * It reads a clone of the response, so that the parcel can be read again.
   *
   * @returns {Promise<Blob | null>} Blob of the response body, or null if the response was not received.
   * @public
   */
  async toBlob () {
    return this.cloneResponse()
      ?.blob()
      ?? null
  }

  /**
   * Check if the response is the result of a redirect.
   *
   * @abstract
   * @returns {BooleanLike} True if the response is the result of a redirect.
   * @throws {Error} If the method is not implemented in a subclass.
   * @public
   */
  isRedirected () {
    throw new Error(`${this.constructor.name}#isRedirected() must be inherited`)
  }

  /**
   * Extract the type of the response.
   *
   * @abstract
   * @returns {ResponseType | null} Type of the response, or null if the response was not received.
   * @throws {Error} If the method is not implemented in a subclass.
   * @public
   */
  extractResponseType () {
    throw new Error(`${this.constructor.name}#extractResponseType() must be inherited`)
  }
}

/**
 * @typedef {*} BooleanLike
 */
