const SUPPORTED_RESPONSE_TYPES = [
  '',
  'text',
  'blob',
  'arraybuffer',
]

/**
 * Base class for sending a `Request` and building its `Response`.
 *
 * @abstract
 */
export default class BaseRequestClerk {
  /**
   * Constructor.
   *
   * @param {BaseRequestClerkParams} params - Parameters of constructor.
   */
  constructor ({
    request,
    config,
    sink,
  }) {
    this.request = request
    this.config = config
    this.sink = sink
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof BaseRequestClerk ? X : never} T, X
   * @param {BaseRequestClerkFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    request,
    config: {
      timeout = 0,
      responseType = '',
      withCredentials = this.resolveWithCredentials({
        request,
      }),
    } = {},
    sink = {},
  }) {
    this.validateResponseType({
      responseType,
    })

    return /** @type {InstanceType<T>} */ (
      new this({
        request,
        config: {
          timeout,
          responseType,
          withCredentials,
        },
        sink,
      })
    )
  }

  /**
   * Validate that `Response` takes the body of the `responseType` as it is.
   *
   * @param {{
   *   responseType: XMLHttpRequestResponseType
   * }} params - Parameters.
   * @returns {void}
   * @throws {TypeError} On `'json'` or `'document'`, whose body `Response` turns into `[object Object]`.
   */
  static validateResponseType ({
    responseType,
  }) {
    if (SUPPORTED_RESPONSE_TYPES.includes(responseType)) {
      return
    }

    throw new TypeError(`responseType '${responseType}' is not supported`)
  }

  /**
   * Resolve whether the request sends credentials to every origin.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters.
   * @returns {boolean} True when `credentials` of the request is `'include'`.
   */
  static resolveWithCredentials ({
    request,
  }) {
    return request.credentials === 'include'
  }

  /**
   * Build the error that every concrete rejects with on a failed request.
   *
   * @param {{
   *   reason: RequestClerkFailureReason
   *   cause?: *
   * }} params - Parameters.
   * @returns {TypeError} Error of the failed request.
   */
  static buildNetworkError ({
    reason,
    cause,
  }) {
    return new TypeError(`Network request ${reason}`, {
      cause,
    })
  }

  /**
   * Build the response of the request.
   *
   * @abstract
   * @returns {Promise<Response>} Promise of the response.
   * @throws {Error} If the method is not implemented in a subclass.
   * @public
   */
  async buildResponse () {
    throw new Error(`${this.constructor.name}#buildResponse() must be inherited`)
  }
}

/**
 * @typedef {{
 *   timeout: number
 *   responseType: XMLHttpRequestResponseType
 *   withCredentials: boolean
 * }} RequestClerkConfig
 */

/**
 * @typedef {'aborted' | 'failed' | 'timed out'} RequestClerkFailureReason
 */

/**
 * @typedef {{
 *   request: Request
 *   config: RequestClerkConfig
 *   sink: Partial<import('../HttpFetcher.js').HttpFetcherSink>
 * }} BaseRequestClerkParams
 */

/**
 * @typedef {{
 *   request: Request
 *   config?: Partial<RequestClerkConfig>
 *   sink?: Partial<import('../HttpFetcher.js').HttpFetcherSink>
 * }} BaseRequestClerkFactoryParams
 */
