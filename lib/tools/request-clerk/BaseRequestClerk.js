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
