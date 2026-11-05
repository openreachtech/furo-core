/**
 * Base class for sending a `Request` and resolving to its `Response`.
 *
 * @abstract
 */
export default class BaseHttpFetcher {
  /**
   * Constructor.
   *
   * @param {BaseHttpFetcherParams} params - Parameters.
   */
  constructor ({
    timeout,
  }) {
    this.timeout = timeout
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof BaseHttpFetcher ? X : never} T, X
   * @param {BaseHttpFetcherFactoryParams} [params] - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    timeout = 0,
  } = {}) {
    return /** @type {InstanceType<T>} */ (
      new this({
        timeout,
      })
    )
  }

  /**
   * Fetch request.
   *
   * @abstract
   * @param {{
   *   request: Request
   *   sink?: Partial<HttpFetcherSink>
   * }} params - Parameters of fetch request.
   * @returns {Promise<Response>} Promise of fetch request.
   * @throws {Error} If the method is not implemented in a subclass.
   * @public
   */
  async fetchRequest ({
    request,
    sink,
  }) {
    throw new Error(`${this.constructor.name}#fetchRequest() must be inherited`)
  }
}

/**
 * @typedef {{
 *   timeout: number
 * }} BaseHttpFetcherParams
 */

/**
 * @typedef {{
 *   timeout?: number
 * }} BaseHttpFetcherFactoryParams
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
