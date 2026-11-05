import BaseHttpFetcher from './BaseHttpFetcher.js'
import HeadersParser from './HeadersParser.js'

const OPENS_AS_ASYNC = true
const RESPONSE_TYPE = 'blob'
const NULL_BODY_STATUSES = [
  101,
  103,
  204,
  205,
  304,
]

/**
 * Progress HTTP fetcher.
 *
 * @extends {BaseHttpFetcher}
 */
export default class ProgressHttpFetcher extends BaseHttpFetcher {
  /**
   * Constructor.
   *
   * @param {ProgressHttpFetcherParams} params - Parameters.
   */
  constructor ({
    httpRequest,
    timeout = httpRequest.timeout,
  }) {
    super({
      timeout,
    })

    this.httpRequest = httpRequest
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof ProgressHttpFetcher ? X : never} T, X
   * @override
   * @param {ProgressHttpFetcherFactoryParams} [params] - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    httpRequest = this.createXMLHttpRequest(),
    timeout = httpRequest.timeout,
  } = {}) {
    return /** @type {InstanceType<T>} */ (
      new this({
        httpRequest,
        timeout,
      })
    )
  }

  /**
   * Create XMLHttpRequest.
   *
   * @returns {XMLHttpRequest} XMLHttpRequest instance.
   */
  static createXMLHttpRequest () {
    return new XMLHttpRequest()
  }

  /**
   * Create a request body from an instance of Request.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters of create request body.
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
   * }} params - Parameters of request.
   * @returns {boolean} True if the request method is a body handling method, false otherwise.
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
   * Check if the request sends credentials to every origin.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters of request.
   * @returns {boolean} True when `credentials` of the request is `'include'`.
   */
  static isCredentialsIncluded ({
    request,
  }) {
    return request.credentials === 'include'
  }

  /**
   * get: Ctor.
   *
   * @returns {typeof ProgressHttpFetcher} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof ProgressHttpFetcher} */ (
      this.constructor
    )
  }

  /**
   * Fetch request.
   *
   * @override
   * @param {{
   *   request: Request
   *   sink?: Partial<ProgressHttpFetcherSink>
   * }} params - Parameters of fetch request.
   * @returns {Promise<Response>} Promise of fetch request.
   * @public
   */
  async fetchRequest ({
    request,
    sink: {
      onUploadProgress,
      onDownloadProgress,
    } = {},
  }) {
    const requestBody = await this.Ctor.createRequestBody({
      request,
    })

    this.httpRequest.open(
      request.method,
      request.url,
      OPENS_AS_ASYNC
    )

    this.httpRequest.timeout = this.timeout
    this.httpRequest.responseType = RESPONSE_TYPE
    this.httpRequest.withCredentials ||= this.Ctor.isCredentialsIncluded({
      request,
    })

    const httpRequest = this.setupRequestHeaders({
      request,
    })

    httpRequest.upload.addEventListener('progress', progressEvent => {
      onUploadProgress?.({
        request,
        progressEvent,
      })
    })

    httpRequest.addEventListener('progress', progressEvent => {
      onDownloadProgress?.({
        request,
        progressEvent,
      })
    })

    await this.sendRequest({
      request,
      requestBody,
    })

    return this.createResponse()
  }

  /**
   * Send the request, aborting it while the signal of the request aborts.
   *
   * @param {{
   *   request: Request
   *   requestBody: Blob | null
   * }} params - Parameters of send request.
   * @returns {Promise<void>} Promise resolved on load.
   */
  async sendRequest ({
    request,
    requestBody,
  }) {
    const abortHttpRequest = () => {
      this.httpRequest.abort()
    }

    request.signal.addEventListener('abort', abortHttpRequest)

    try {
      await this.waitForLoad({
        request,
        requestBody,
      })
    } finally {
      request.signal.removeEventListener('abort', abortHttpRequest)
    }
  }

  /**
   * Send the request body, settling once it loads, aborts, fails, or times out.
   *
   * @param {{
   *   request: Request
   *   requestBody: Blob | null
   * }} params - Parameters of wait for load.
   * @returns {Promise<void>} Promise resolved on load.
   */
  waitForLoad ({
    request,
    requestBody,
  }) {
    return new Promise((resolve, reject) => {
      if (request.signal.aborted) {
        reject(new TypeError('Network request aborted'))

        return
      }

      this.httpRequest.addEventListener('load', progressEvent => {
        resolve()
      })

      this.httpRequest.addEventListener('abort', progressEvent => {
        reject(new TypeError('Network request aborted'))
      })

      this.httpRequest.addEventListener('error', progressEvent => {
        reject(new TypeError('Network request failed'))
      })

      this.httpRequest.addEventListener('timeout', progressEvent => {
        reject(new TypeError('Network request timed out'))
      })

      this.httpRequest.send(requestBody)
    })
  }

  /**
   * Setup request headers.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters of setup request headers.
   * @returns {XMLHttpRequest} XMLHttpRequest instance with headers set.
   */
  setupRequestHeaders ({
    request,
  }) {
    return [...request.headers.entries()]
      .reduce(
        (httpRequest, [key, value]) => {
          httpRequest.setRequestHeader(key, value)

          return httpRequest
        },
        this.httpRequest
      )
  }

  /**
   * Create response.
   *
   * @returns {Response} Response instance.
   */
  createResponse () {
    const headers = HeadersParser.create({
      haystack: this.httpRequest.getAllResponseHeaders(),
    })
      .createHeaders()

    const options = {
      status: this.httpRequest.status,
      statusText: this.httpRequest.statusText,
      headers,
    }

    return new Response(
      this.extractResponseBody(),
      options
    )
  }

  /**
   * Extract the response body, null on a status that carries no body.
   *
   * @returns {Blob | null} Body of the response.
   */
  extractResponseBody () {
    if (this.hasNullBodyStatus()) {
      return null
    }

    return this.httpRequest.response
  }

  /**
   * Check if the response status carries no body.
   *
   * @returns {boolean} True on 101, 103, 204, 205, or 304.
   */
  hasNullBodyStatus () {
    return NULL_BODY_STATUSES.includes(this.httpRequest.status)
  }
}

/**
 * @typedef {{
 *   httpRequest: XMLHttpRequest
 *   timeout?: number
 * }} ProgressHttpFetcherParams
 */

/**
 * @typedef {{
 *   httpRequest?: XMLHttpRequest
 *   timeout?: number
 * }} ProgressHttpFetcherFactoryParams
 */

/**
 * @typedef {import('./BaseHttpFetcher.js').HttpFetcherSink} ProgressHttpFetcherSink
 */
