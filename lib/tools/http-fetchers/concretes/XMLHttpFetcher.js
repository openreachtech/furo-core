import BaseHttpFetcher from '../BaseHttpFetcher.js'
import XMLHttpParcel from '../parcels/concretes/XMLHttpParcel.js'
import HeadersParser from '../../HeadersParser.js'
import XMLHttpRequestClerk from '../tools/XMLHttpRequestClerk.js'

/**
 * HTTP fetcher that sends a request with `XMLHttpRequest`.
 *
 * It receives the response body as an array buffer, and builds a `Response` after
 * the whole response has been received. The timeout is counted by the abort signal,
 * and `XMLHttpRequest#timeout` is not used.
 *
 * An instance is disposable. It holds one clerk of `XMLHttpRequest`, so it fetches once,
 * and a request that has to be sent again takes a new instance.
 *
 * @extends {BaseHttpFetcher<XMLHttpFetcherConfig>}
 */
export default class XMLHttpFetcher extends BaseHttpFetcher {
  /**
   * Constructor.
   *
   * @param {{
   *   request: Request
   *   config: XMLHttpFetcherConfig
   *   requestClerk: XMLHttpRequestClerk
   * }} params - Parameters of constructor.
   */
  constructor ({
    request,
    config,

    requestClerk,
  }) {
    super({
      request,
      config,
    })

    this.requestClerk = requestClerk
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof XMLHttpFetcher ? X : never} T, X
   * @override
   * @param {{
   *   request: Request
   *   config: XMLHttpFetcherConfig
   *   requestClerk?: XMLHttpRequestClerk
   * }} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    request,
    config,

    requestClerk = this.createXMLHttpRequestClerk(),
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        request,
        config,

        requestClerk,
      })
    )
  }

  /**
   * get: Constructor of the clerk of `XMLHttpRequest`.
   *
   * @returns {typeof XMLHttpRequestClerk} Constructor of the clerk of `XMLHttpRequest`.
   */
  static get XMLHttpRequestClerkCtor () {
    return XMLHttpRequestClerk
  }

  /**
   * get: Constructor of headers parser.
   *
   * @returns {typeof HeadersParser} Constructor of headers parser.
   */
  static get HeadersParserCtor () {
    return HeadersParser
  }

  /**
   * get: Constructor of HTTP parcel.
   *
   * @override
   * @returns {typeof XMLHttpParcel} Constructor of HTTP parcel.
   */
  static get HttpParcelCtor () {
    return XMLHttpParcel
  }

  /**
   * Create the clerk of `XMLHttpRequest`.
   *
   * @returns {XMLHttpRequestClerk} Instance of the clerk of a new `XMLHttpRequest`.
   */
  static createXMLHttpRequestClerk () {
    return this.XMLHttpRequestClerkCtor.create()
  }

  /**
   * Create headers parser.
   *
   * @param {{
   *   haystack: string
   * }} params - Parameters.
   * @returns {HeadersParser} Instance of headers parser.
   */
  static createHeadersParser ({
    haystack,
  }) {
    return this.HeadersParserCtor.create({
      haystack,
    })
  }

  /**
   * Create a request body from an instance of Request.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters.
   * @returns {Promise<Blob | null>} Blob of the body, or null for a method without a body.
   */
  static async createRequestBody ({
    request,
  }) {
    const isBodyRequiredMethod = this.isBodyRequiredMethod({
      request,
    })

    if (!isBodyRequiredMethod) {
      return null
    }

    return request.clone()
      .blob()
  }

  /**
   * Check if the request method requires a body.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters.
   * @returns {BooleanLike} True if the request method is a body handling method, false otherwise.
   */
  static isBodyRequiredMethod ({
    request,
  }) {
    return [
      'post',
      'put',
      'patch',
    ]
      .includes(
        request.method.toLowerCase()
      )
  }

  /**
   * Check if the status is of a response without a body.
   *
   * @param {{
   *   status: number
   * }} params - Parameters.
   * @returns {BooleanLike} True if the response of the status has no body.
   */
  static isNullBodyStatus ({
    status,
  }) {
    return [
      204,
      205,
      304,
    ]
      .includes(status)
  }

  /**
   * get: Constructor of this class.
   *
   * @override
   * @returns {typeof XMLHttpFetcher} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof XMLHttpFetcher} */ (
      this.constructor
    )
  }

  /**
   * Receive the response to the request.
   *
   * It rejects with the reason of the signal where the signal aborted the request,
   * and with an error named `NetworkError` where the network failed.
   *
   * @override
   * @param {{
   *   sink?: Partial<import('../BaseHttpFetcher.js').HttpFetcherSink>
   *   signal: AbortSignal
   * }} params - Parameters.
   * @returns {Promise<Response>} Promise of the response, which `XMLHttpRequest` received.
   */
  async receiveResponse ({
    sink,
    signal,
  }) {
    const requestBody = await this.Ctor.createRequestBody({
      request: this.request,
    })

    signal.throwIfAborted()

    this.setupRequestClerk()

    return new Promise((resolve, reject) => {
      const clerkSink = this.buildClerkSink({
        sink,
        signal,
        resolve,
        reject,
      })

      this.requestClerk.addSink({
        sink: clerkSink,
      })

      signal.addEventListener('abort', () => {
        this.requestClerk.abortRequest()
      })

      this.invokeSend({
        requestBody,
      })
    })
  }

  /**
   * Setup the clerk of `XMLHttpRequest` with the request.
   *
   * @returns {XMLHttpRequestClerk} The clerk that has been setup.
   */
  setupRequestClerk () {
    const withCredentials = this.shouldSendCredentials()

    return this.requestClerk.openRequest({
      method: this.request.method,
      url: this.request.url,
    })
      .setResponseType({
        responseType: 'arraybuffer',
      })
      .setWithCredentials({
        withCredentials,
      })
      .setRequestHeaders({
        headers: this.request.headers,
      })
  }

  /**
   * Check if the request carries credentials to a cross-site server.
   *
   * @returns {BooleanLike} True if the credentials mode of the request is `include`.
   */
  shouldSendCredentials () {
    return this.request.credentials === 'include'
  }

  /**
   * Build the sink that the clerk of `XMLHttpRequest` notifies of the events.
   *
   * The whole response is resolved as the response, and anything that ended the request otherwise is rejected with its reason.
   *
   * @param {{
   *   sink?: Partial<import('../BaseHttpFetcher.js').HttpFetcherSink>
   *   signal: AbortSignal
   *   resolve: (response: Response) => void
   *   reject: (reason: *) => void
   * }} params - Parameters.
   * @returns {import('../tools/XMLHttpRequestClerk.js').XMLHttpRequestClerkSink} Sink of the clerk.
   */
  buildClerkSink ({
    sink: {
      onUploadProgress = () => {},
      onDownloadProgress = () => {},
    } = {},
    signal,
    resolve,
    reject,
  }) {
    return {
      onUploadProgress: progressEvent => {
        onUploadProgress({
          request: this.request,
          progressEvent,
        })
      },
      onDownloadProgress: progressEvent => {
        onDownloadProgress({
          request: this.request,
          progressEvent,
        })
      },
      onLoad: () => {
        try {
          const response = this.createResponse()

          resolve(response)
        } catch (error) {
          reject(error)
        }
      },
      onAbort: () => {
        const reason = signal.reason
          ?? new DOMException('Network request aborted', 'AbortError')

        reject(reason)
      },
      onError: () => {
        const error = new DOMException('Network request failed', 'NetworkError')

        reject(error)
      },
    }
  }

  /**
   * Create a response from the clerk of `XMLHttpRequest` that received the response.
   *
   * @returns {Response} Instance of response.
   */
  createResponse () {
    const haystack = this.requestClerk.extractAllResponseHeadersText()

    const headers = this.Ctor.createHeadersParser({
      haystack,
    })
      .createHeaders()

    const responseBody = this.extractResponseBody()

    return new Response(
      responseBody,
      {
        status: this.requestClerk.status,
        statusText: this.requestClerk.statusText,
        headers,
      }
    )
  }

  /**
   * Extract the response body from the clerk of `XMLHttpRequest` that received the response.
   *
   * @returns {ArrayBuffer | null} Response body, or null for a response without a body.
   */
  extractResponseBody () {
    const isNullBodyStatus = this.Ctor.isNullBodyStatus({
      status: this.requestClerk.status,
    })

    if (isNullBodyStatus) {
      return null
    }

    return this.requestClerk.response
  }

  /**
   * Resolve the URL of the response, after the redirects.
   *
   * @override
   * @param {{
   *   response: Response
   * }} params - Parameters.
   * @returns {string} URL of the response that `XMLHttpRequest` reports, which the response built from it does not hold.
   */
  resolveResponseUrl ({
    response,
  }) {
    return this.requestClerk.responseUrl
  }

  /**
   * Send a request through the clerk of `XMLHttpRequest`.
   *
   * @param {{
   *   requestBody: Blob | null
   * }} params - Parameters.
   * @returns {XMLHttpRequestClerk} The clerk that sent the request.
   */
  invokeSend ({
    requestBody,
  }) {
    return this.requestClerk.sendRequest({
      requestBody,
    })
  }
}

/**
 * @typedef {*} BooleanLike
 */

/**
 * @typedef {import('../BaseHttpFetcher.js').HttpFetcherConfig} XMLHttpFetcherConfig
 */
