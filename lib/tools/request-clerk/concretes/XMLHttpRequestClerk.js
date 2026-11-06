import HeadersParser from '../../HeadersParser.js'
import BaseRequestClerk from '../BaseRequestClerk.js'

const OPENS_AS_ASYNC = true
const NULL_BODY_STATUSES = [
  101,
  103,
  204,
  205,
  304,
]

/**
 * Request clerk on `XMLHttpRequest`, reporting upload and download progress.
 *
 * @extends {BaseRequestClerk}
 */
export default class XMLHttpRequestClerk extends BaseRequestClerk {
  /**
   * Create `XMLHttpRequest` configured by the config.
   *
   * @param {import('../BaseRequestClerk.js').RequestClerkConfig} config - Config of the clerk.
   * @returns {XMLHttpRequest} New `XMLHttpRequest`.
   */
  static createXMLHttpRequest ({
    timeout,
    responseType,
    withCredentials,
  }) {
    const httpRequest = new XMLHttpRequest()

    httpRequest.timeout = timeout
    httpRequest.responseType = responseType
    httpRequest.withCredentials = withCredentials

    return httpRequest
  }

  /**
   * Build a request body from an instance of Request.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters.
   * @returns {Promise<Blob | null>} Blob of the body, or null for a method without a body.
   */
  static async buildRequestBody ({
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
   * Check if the response status carries no body.
   *
   * @param {{
   *   status: number
   * }} params - Parameters.
   * @returns {boolean} True on 101, 103, 204, 205, or 304.
   */
  static isNullBodyStatus ({
    status,
  }) {
    return NULL_BODY_STATUSES.includes(status)
  }

  /**
   * Build a response from a loaded `XMLHttpRequest`.
   *
   * @param {{
   *   httpRequest: XMLHttpRequest
   * }} params - Parameters.
   * @returns {Response} Response of the load.
   */
  static buildResponseByHttpRequest ({
    httpRequest,
  }) {
    const headers = HeadersParser.create({
      haystack: httpRequest.getAllResponseHeaders(),
    })
      .createHeaders()

    const options = {
      status: httpRequest.status,
      statusText: httpRequest.statusText,
      headers,
    }

    return new Response(
      this.extractResponseBody({
        httpRequest,
      }),
      options
    )
  }

  /**
   * Extract the response body, null on a status that carries no body.
   *
   * @param {{
   *   httpRequest: XMLHttpRequest
   * }} params - Parameters.
   * @returns {*} Body of the response.
   */
  static extractResponseBody ({
    httpRequest,
  }) {
    const isNullBodyStatus = this.isNullBodyStatus({
      status: httpRequest.status,
    })

    if (isNullBodyStatus) {
      return null
    }

    return httpRequest.response
  }

  /**
   * get: Ctor.
   *
   * @returns {typeof XMLHttpRequestClerk} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof XMLHttpRequestClerk} */ (
      this.constructor
    )
  }

  /**
   * Build the response through `XMLHttpRequest`, reporting progress to `sink`.
   *
   * @override
   * @returns {Promise<Response>} Promise of the response.
   * @public
   */
  async buildResponse () {
    const requestBody = await this.Ctor.buildRequestBody({
      request: this.request,
    })

    const httpRequest = this.Ctor.createXMLHttpRequest(this.config)

    httpRequest.open(
      this.request.method,
      this.request.url,
      OPENS_AS_ASYNC
    )

    this.setupRequestHeaders({
      httpRequest,
    })

    this.listenProgress({
      httpRequest,
    })

    await this.sendRequest({
      httpRequest,
      requestBody,
    })

    return this.Ctor.buildResponseByHttpRequest({
      httpRequest,
    })
  }

  /**
   * Set the headers of the request to `XMLHttpRequest`.
   *
   * @param {{
   *   httpRequest: XMLHttpRequest
   * }} params - Parameters.
   * @returns {XMLHttpRequest} `XMLHttpRequest` with headers set.
   */
  setupRequestHeaders ({
    httpRequest,
  }) {
    return [...this.request.headers.entries()]
      .reduce(
        (accumulator, [key, value]) => {
          accumulator.setRequestHeader(key, value)

          return accumulator
        },
        httpRequest
      )
  }

  /**
   * Report upload and download progress to the sink.
   *
   * @param {{
   *   httpRequest: XMLHttpRequest
   * }} params - Parameters.
   * @returns {void}
   */
  listenProgress ({
    httpRequest,
  }) {
    httpRequest.upload.addEventListener('progress', progressEvent => {
      this.sink.onUploadProgress?.({
        request: this.request,
        progressEvent,
      })
    })

    httpRequest.addEventListener('progress', progressEvent => {
      this.sink.onDownloadProgress?.({
        request: this.request,
        progressEvent,
      })
    })
  }

  /**
   * Send the request, aborting it while the signal of the request aborts.
   *
   * @param {{
   *   httpRequest: XMLHttpRequest
   *   requestBody: Blob | null
   * }} params - Parameters.
   * @returns {Promise<void>} Promise resolved on load.
   */
  async sendRequest ({
    httpRequest,
    requestBody,
  }) {
    const abortHttpRequest = () => {
      httpRequest.abort()
    }

    this.request.signal.addEventListener('abort', abortHttpRequest)

    try {
      await this.waitForLoad({
        httpRequest,
        requestBody,
      })
    } finally {
      this.request.signal.removeEventListener('abort', abortHttpRequest)
    }
  }

  /**
   * Send the request body, settling once it loads, aborts, fails, or times out.
   *
   * @param {{
   *   httpRequest: XMLHttpRequest
   *   requestBody: Blob | null
   * }} params - Parameters.
   * @returns {Promise<void>} Promise resolved on load.
   */
  waitForLoad ({
    httpRequest,
    requestBody,
  }) {
    return new Promise((resolve, reject) => {
      if (this.request.signal.aborted) {
        reject(new TypeError('Network request aborted'))

        return
      }

      httpRequest.addEventListener('load', () => {
        resolve()
      })

      httpRequest.addEventListener('abort', () => {
        reject(new TypeError('Network request aborted'))
      })

      httpRequest.addEventListener('error', () => {
        reject(new TypeError('Network request failed'))
      })

      httpRequest.addEventListener('timeout', () => {
        reject(new TypeError('Network request timed out'))
      })

      httpRequest.send(requestBody)
    })
  }
}
