import ProgressHttpFetcher from '../../tools/ProgressHttpFetcher.js'
import JsonResponseBodyParser from '../../tools/response-body-parser/concretes/JsonResponseBodyParser.js'

/**
 * Base class of RESTful API launcher.
 */
export default class BaseRestfulApiLauncher {
  /**
   * Constructor.
   *
   * @param {BaseRestfulApiLauncherParams} params - Parameters of constructor.
   */
  constructor ({
    config,
  }) {
    this.config = config
  }

  /**
   * Factory method.
   *
   * @template {X extends LauncherCtor ? X : never} T, X
   * @param {BaseRestfulApiLauncherFactoryParams} [params] - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    config = this.restfulApiConfig,
  } = {}) {
    return /** @type {*} */ (
      new this({
        config,
      })
    )
  }

  /**
   * get: RESTful API configuration.
   *
   * @abstract
   * @returns {{
   *   [key: string]: string
   * }} RESTful API configuration.
   * @throws {Error} This function must be inherited.
   */
  static get restfulApiConfig () {
    throw new Error('this function must be inherited')
  }

  /**
   * Fetch function.
   *
   * @returns {(
   *   input: URL | RequestInfo,
   *   init?: RequestInit
   * ) => Promise<Response>} fetch function.
   */
  static get fetch () {
    return fetch
  }

  /**
   * Create HTTP fetcher.
   *
   * @returns {ProgressHttpFetcher} Instance of ProgressHttpFetcher.
   */
  static createHttpFetcher () {
    return ProgressHttpFetcher.create()
  }

  /**
   * get: Launcher class.
   *
   * @template {LauncherCtor} T
   * @abstract
   * @returns {T} Launcher class.
   * @this {T}
   */
  static get Launcher () {
    return this
  }

  /**
   * get: Payload class.
   *
   * @abstract
   * @returns {RestfulApiType.PayloadCtor<*, *, *>} Payload class.
   * @throws {Error} This function must be inherited.
   */
  static get Payload () {
    throw new Error('this function must be inherited')
  }

  /**
   * get: Capsule class.
   *
   * @abstract
   * @returns {RestfulApiType.CapsuleCtor<*, *>} Capsule class.
   * @throws {Error} This function must be inherited.
   */
  static get Capsule () {
    throw new Error('this function must be inherited')
  }

  /**
   * get: Response body parser class.
   *
   * @returns {typeof import('../../tools/response-body-parser/BaseResponseBodyParser.js').default} Response body parser class.
   */
  static get ResponseBodyParser () {
    return JsonResponseBodyParser
  }

  /**
   * Create payload.
   *
   * @template P
   * @param {{
   *   query?: Record<string, *>
   *   body?: Record<string, *>
   *   pathParameterHash?: Record<string, *>
   *   options?: RequestInit
   * }} params - Parameters.
   * @returns {InstanceType<P>} Instance of Payload.
   */
  static createPayload ({
    query,
    body,
    pathParameterHash,
    options,
  } = {}) {
    return /** @type {*} */ (
      this.Payload
        .create({
          query,
          body,
          pathParameterHash,
          options,
        })
    )
  }

  /**
   * Create payload with <form> value hash.
   *
   * @template P
   * @param {{
   *   valueHash: {
   *     [field: string]: furo.FormControlElementValueType
   *   }
   *   extraValueHash?: {
   *     [field: string]: furo.FormControlElementValueType
   *   }
   *   options?: RequestInit
   * }} params - Parameters.
   * @returns {InstanceType<P>} Instance of Payload.
   */
  static createPayloadWithFormValueHash ({
    valueHash,
    extraValueHash = {},
    options,
  }) {
    return /** @type {*} */ (
      this.Payload
        .createWithFormValueHash({
          valueHash,
          extraValueHash,
          options,
        })
    )
  }

  /**
   * Create instance of capsule with result.
   *
   * @template C
   * @param {CapsuleParams} params - Parameters.
   * @returns {InstanceType<C>} Instance of capsule.
   */
  static createCapsule ({
    rawResponse,
    payload,
    result,
    abortedReason,
  }) {
    const args = {
      rawResponse,
      payload,
      result,
      abortedReason,
    }

    return /** @type {*} */ (
      this.Capsule.create(args)
    )
  }

  /**
   * Create instance of capsule with result as pending.
   *
   * @returns {RestfulApiType.Capsule<*, *>} Instance of capsule.
   */
  static createCapsuleAsPending () {
    return this.Capsule.createAsPending()
  }

  /**
   * Create instance of capsule with result as invalid parameters error.
   *
   * @param {{
   *   payload: RestfulApiType.Payload<*, *, *>
   * }} params - Parameters.
   * @returns {RestfulApiType.Capsule<*, *>} Instance of capsule.
   */
  static createCapsuleAsInvalidParametersError ({
    payload,
  }) {
    return this.Capsule.createAsInvalidParametersError({
      payload,
    })
  }

  /**
   * Create instance of capsule with result as aborted by hooks.
   *
   * @param {{
   *   payload: RestfulApiType.Payload<*, *, *>
   * }} params - Parameters.
   * @returns {RestfulApiType.Capsule<*, *>} Instance of capsule.
   */
  static createCapsuleAsAbortedByHooks ({
    payload,
  }) {
    return this.Capsule.createAsAbortedByHooks({
      payload,
    })
  }

  /**
   * Create instance of capsule with result as network error.
   *
   * @param {{
   *   payload: RestfulApiType.Payload<*, *, *>
   * }} params - Parameters.
   * @returns {RestfulApiType.Capsule<*, *>} Instance of capsule.capsule.
   */
  static createCapsuleAsNetworkError ({
    payload,
  }) {
    return this.Capsule.createAsNetworkError({
      payload,
    })
  }

  /**
   * Create instance of capsule with result as JSON parse error.
   *
   * @param {{
   *   rawResponse: Response
   *   payload: RestfulApiType.Payload<*, *, *>
   * }} params - Parameters.
   * @returns {RestfulApiType.Capsule<*, *>} Instance of capsule.capsule.
   */
  static createCapsuleAsJsonParseError ({
    rawResponse,
    payload,
  }) {
    return this.Capsule.createAsResponseBodyParseError({
      rawResponse,
      payload,
    })
  }

  /**
   * Create response body parser.
   *
   * @param {{
   *   response: Response
   * }} params - Parameters of this method.
   * @returns {import('../../tools/response-body-parser/BaseResponseBodyParser.js').default} An instance of response body parser.
   */
  static createResponseBodyParser ({
    response,
  }) {
    return this.ResponseBodyParser.create({
      response,
    })
  }

  /**
   * get: Constructor from instance.
   *
   * @template {LauncherCtor} T
   * @returns {T} Constructor of the instance.
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }

  /**
   * get: Base URL.
   *
   * @returns {string} Endpoint URL.
   */
  get baseUrl () {
    return this.config.BASE_URL
  }

  /**
   * Launch request.
   *
   * @template C, D
   * @param {RestfulApiLaunchRequestArgs} params - Parameters.
   * @returns {Promise<RestfulApiType.Capsule<D>>} Promise of instance of capsule.
   * @public
   */
  async launchRequest ({
    payload,
    hooks: {
      beforeRequest = async () => false,
      afterRequest = async () => {},
      onUploadProgress = () => {},
      onDownloadProgress = () => {},
    } = {},
  }) {
    const extendedHooks = this.extendRequestHooks({
      beforeRequest,
      afterRequest,
      onUploadProgress,
      onDownloadProgress,
    })

    // -------------------------------------------------------------------------

    if (payload.isInvalidAllParameterHash()) {
      return this.Ctor.createCapsuleAsInvalidParametersError({
        payload,
      })
    }

    const aborted = await extendedHooks.beforeRequest(payload)
    if (aborted) {
      return this.Ctor.createCapsuleAsAbortedByHooks({
        payload,
      })
    }

    // -------------------------------------------------------------------------

    const response = await this.invokeFetchQuery({
      payload,
      sink: {
        onUploadProgress: extendedHooks.onUploadProgress,
        onDownloadProgress: extendedHooks.onDownloadProgress,
      },
    })

    const capsule = await this.retrieveCapsule({
      response,
      payload,
    })

    await extendedHooks.afterRequest(capsule)

    return capsule
  }

  /**
   * Extend request hooks.
   *
   * @param {RestfulApiLauncherHooks} hooks - Hooks.
   * @returns {RestfulApiLauncherHooks} Extended hooks.
   */
  extendRequestHooks ({
    beforeRequest,
    afterRequest,
    onUploadProgress,
    onDownloadProgress,
  }) {
    return {
      beforeRequest: this.extendBeforeRequestHook({
        beforeRequest,
      }),
      afterRequest: this.extendAfterRequestHook({
        afterRequest,
      }),
      onUploadProgress: this.extendOnUploadProgressHook({
        onUploadProgress,
      }),
      onDownloadProgress: this.extendOnDownloadProgressHook({
        onDownloadProgress,
      }),
    }
  }

  /**
   * Extend before request hook.
   *
   * @template {(payload: RestfulApiType.Payload<*, *, *>) => Promise<boolean>} T
   * @param {{
   *   beforeRequest: T
   * }} params - Parameters.
   * @returns {T} Before request function.
   */
  extendBeforeRequestHook ({
    beforeRequest,
  }) {
    return beforeRequest
  }

  /**
   * Extend after request hook.
   *
   * @template {(capsule: RestfulApiType.Capsule<*, *>) => Promise<void>} T
   * @param {{
   *   afterRequest: T
   * }} params - Parameters.
   * @returns {T} After request function.
   */
  extendAfterRequestHook ({
    afterRequest,
  }) {
    return afterRequest
  }

  /**
   * Extend on progress hook.
   *
   * @template {(args: {
   *   request: Request
   *   progressEvent: ProgressEvent
   * }) => void} T
   * @param {{
   *   onUploadProgress: T
   * }} params - Parameters.
   * @returns {T} On progress function.
   */
  extendOnUploadProgressHook ({
    onUploadProgress,
  }) {
    return onUploadProgress
  }

  /**
   * Extend on progress hook.
   *
   * @template {(args: {
   *   request: Request
   *   progressEvent: ProgressEvent
   * }) => void} T
   * @param {{
   *   onDownloadProgress: T
   * }} params - Parameters.
   * @returns {T} On progress function.
   */
  extendOnDownloadProgressHook ({
    onDownloadProgress,
  }) {
    return onDownloadProgress
  }

  /**
   * Invoke fetch query.
   *
   * @param {{
   *   payload: RestfulApiType.Payload<*, *, *>
   *   sink?: Partial<import('../../tools/ProgressHttpFetcher.js').ProgressHttpFetcherSink>
   * }} params - Parameters.
   * @returns {Promise<Response | null>} Instance of fetch API response.
   */
  async invokeFetchQuery ({
    payload,
    sink: {
      onUploadProgress = () => {},
      onDownloadProgress = () => {},
    } = {},
  }) {
    const request = payload.createFetchRequest({
      baseUrl: this.baseUrl,
    })

    const httpRequest = this.Ctor.createHttpFetcher()

    try {
      const response = await httpRequest.fetchRequest({
        request,
        sink: {
          onUploadProgress,
          onDownloadProgress,
        },
      })

      return response
    } catch (error) {
      return null
    }
  }

  /**
   * Resolve launched capsule.
   *
   * @param {{
   *   payload: RestfulApiType.Payload<*, *, *>
   *   response: Response | null
   * }} params - Parameters.
   * @returns {Promise<RestfulApiType.Capsule<*, *>>} Promise of instance of capsule.
   */
  async retrieveCapsule ({
    payload,
    response,
  }) {
    if (response === null) {
      return this.Ctor.createCapsuleAsNetworkError({
        payload,
      })
    }

    const result = await this.generateFetchResult({
      response,
    })
    if (result === null) {
      return this.Ctor.createCapsuleAsJsonParseError({
        rawResponse: response,
        payload,
      })
    }

    return this.Ctor.createCapsule({
      rawResponse: response,
      payload,
      result,
    })
  }

  /**
   * Generate fetch result.
   *
   * @param {{
   *   response: Response
   * }} params - Parameters.
   * @returns {Promise<object | null>} Promise of JSON.
   */
  async generateFetchResult ({
    response,
  }) {
    const parser = this.Ctor.createResponseBodyParser({
      response,
    })

    try {
      const result = await parser.parseBody()

      return result
    } catch (error) {
      return null
    }
  }
}

/**
 * @typedef {typeof BaseRestfulApiLauncher} LauncherCtor
 */

/**
 * @typedef {InstanceType<LauncherCtor>} Launcher
 */

/**
 * @typedef {{
 *   config: {
 *     [x: string]: string
 *   }
 * }} BaseRestfulApiLauncherParams
 */

/**
 * @typedef {{
 *   config?: {
 *     [x: string]: string
 *   }
 * }} BaseRestfulApiLauncherFactoryParams
 */

/**
 * @typedef {{
 *   rawResponse: Response | null
 *   payload: RestfulApiType.Payload<*, *, *> | null
 *   result: object | null
 *   abortedReason?: import('./BaseRestfulApiCapsule.js').LAUNCH_ABORTED_REASON
 * }} CapsuleParams
 */

/**
 * @typedef {{
 *   payload: RestfulApiType.Payload<*, *, *>
 *   hooks?: RestfulApiLauncherHooks
 * }} RestfulApiLaunchRequestArgs
 */

/**
 * @typedef {{
 *   beforeRequest?: (payload: P) => Promise<boolean>
 *   afterRequest?: (capsule: C) => Promise<void>
 *   onUploadProgress?: (args: {
 *     request: Request
 *     progressEvent: ProgressEvent
 *   }) => void
 *   onDownloadProgress?: (args: {
 *     request: Request
 *     progressEvent: ProgressEvent
 *   }) => void
 * }} RestfulApiLauncherHooks
 * @template {RestfulApiType.Payload<*, *, *>} [P = RestfulApiType.Payload<*, *, *>]
 * @template {RestfulApiType.Capsule<*, *>} [C = RestfulApiType.Capsule<*, *>]
 */
