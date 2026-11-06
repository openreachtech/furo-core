import XMLHttpRequestClerk from './request-clerk/concretes/XMLHttpRequestClerk.js'

/**
 * HTTP fetcher that sends a `Request` through a request clerk.
 */
export default class HttpFetcher {
  /**
   * Constructor.
   *
   * @param {HttpFetcherParams} params - Parameters of constructor.
   */
  constructor ({
    RequestClerkCtor,
    config,
  }) {
    this.RequestClerkCtor = RequestClerkCtor
    this.config = config
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof HttpFetcher ? X : never} T, X
   * @param {HttpFetcherFactoryParams} [params] - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    RequestClerkCtor = XMLHttpRequestClerk,
    config = {},
  } = {}) {
    return /** @type {InstanceType<T>} */ (
      new this({
        RequestClerkCtor,
        config,
      })
    )
  }

  /**
   * get: Ctor.
   *
   * @returns {typeof HttpFetcher} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof HttpFetcher} */ (
      this.constructor
    )
  }

  /**
   * Fetch request.
   *
   * @param {{
   *   request: Request
   *   sink?: Partial<HttpFetcherSink>
   * }} params - Parameters of fetch request.
   * @returns {Promise<Response>} Promise of fetch request.
   * @public
   */
  async fetchRequest ({
    request,
    sink,
  }) {
    return this.RequestClerkCtor.create({
      request,
      config: this.config,
      sink,
    })
      .buildResponse()
  }
}

/**
 * @typedef {{
 *   RequestClerkCtor: typeof import('./request-clerk/BaseRequestClerk.js').default
 *   config: Partial<import('./request-clerk/BaseRequestClerk.js').RequestClerkConfig>
 * }} HttpFetcherParams
 */

/**
 * @typedef {{
 *   RequestClerkCtor?: typeof import('./request-clerk/BaseRequestClerk.js').default
 *   config?: Partial<import('./request-clerk/BaseRequestClerk.js').RequestClerkConfig>
 * }} HttpFetcherFactoryParams
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
 * }} HttpFetcherSink
 */
