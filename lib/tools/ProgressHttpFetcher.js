import HeadersParser from './HeadersParser.js'

const OPENS_AS_ASYNC = true

/**
 * Progress HTTP fetcher.
 */
export default class ProgressHttpFetcher {
  /**
   * Constructor.
   *
   * @param {ProgressHttpFetcherParams} params
   */
  constructor ({
    httpRequest,
  }) {
    this.httpRequest = httpRequest
  }

  /**
   * Parse headers.
   *
   * @template {X extends typeof ProgressHttpFetcher ? X : never} T, X
   * @param {ProgressHttpFetcherFactoryParams} [params] - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    httpRequest = this.createXMLHttpRequest(),
  } = {}) {
    return /** @type {InstanceType<T>} */ (
      new this({
        httpRequest,
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
   * Create FormData body from Request instance.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters of generate body.
   * @returns {Promise<FormData | null>} FormData instance or null.
   */
  static async createFormDataBody ({
    request,
  }) {
    const isBodyRequiredMethod = this.isBodyRequiredMethod({
      request,
    })

    if (!isBodyRequiredMethod) {
      return null
    }

    return this.createFormDataFromRequest({
      request,
    })
  }

  /**
   * Create a request body from an instance of Request.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters of create request body.
   * @returns {Promise<FormData | string | null>} FormData for a form data request, text for any other, or null.
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

    const isFormDataRequest = this.isFormDataRequest({
      request,
    })

    if (isFormDataRequest) {
      return this.createFormDataFromRequest({
        request,
      })
    }

    return this.createTextFromRequest({
      request,
    })
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
   * Create an instance of FormData from an instance of Request.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters of create form data body.
   * @returns {Promise<FormData>} FormData instance.
   */
  static async createFormDataFromRequest ({
    request,
  }) {
    const clonedRequest = request.clone()

    return clonedRequest['formData']()
  }

  /**
   * Create text from an instance of Request.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters of create text.
   * @returns {Promise<string>} Body as text.
   */
  static async createTextFromRequest ({
    request,
  }) {
    const clonedRequest = request.clone()

    return clonedRequest.text()
  }

  /**
   * Check if the request sends a form data body.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters of request.
   * @returns {boolean} True if the content type is absent, multipart or URL encoded, false otherwise.
   */
  static isFormDataRequest ({
    request,
  }) {
    const contentType = request.headers.get('content-type')

    if (contentType === null) {
      return true
    }

    const normalizedContentType = contentType.toLowerCase()

    return [
      'multipart/form-data',
      'application/x-www-form-urlencoded',
    ]
      .some(it =>
        normalizedContentType.startsWith(it)
      )
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
   * @param {{
   *   request: Request
   *   sink?: Partial<ProgressHttpFetcherSink>
   * }} params - Parameters of fetch request.
   * @returns {Promise<Response>} Promise of fetch request.
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

    return new Promise((resolve, reject) => {
      this.httpRequest.addEventListener('load', progressEvent => {
        resolve(
          this.createResponse()
        )
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
    const isFormDataRequest = this.Ctor.isFormDataRequest({
      request,
    })

    return [...request.headers.entries()]
      .filter(([key]) => !isFormDataRequest || key.toLowerCase() !== 'content-type')
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
      this.httpRequest.responseText,
      options
    )
  }
}

/**
 * @typedef {{
 *   httpRequest: XMLHttpRequest
 * }} ProgressHttpFetcherParams
 */

/**
 * @typedef {{
 *   httpRequest?: XMLHttpRequest
 * }} ProgressHttpFetcherFactoryParams
 */

/**
 * @typedef {{
 *   onUploadProgress: (args: {
 *     request: Request
 *     progressEvent: ProgressEvent
 *   }) => void
 *   onDownloadProgress: (args: {
 *     request: Request
 *     progressEvent: ProgressEvent
 *   }) => void
 * }} ProgressHttpFetcherSink
 */
