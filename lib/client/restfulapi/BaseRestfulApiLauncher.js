import FetchHttpFetcher from '../../tools/http-fetchers/concretes/FetchHttpFetcher.js'
import XMLHttpFetcher from '../../tools/http-fetchers/concretes/XMLHttpFetcher.js'
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
   * get: Constructor of HTTP fetcher.
   *
   * @returns {typeof XMLHttpFetcher} Constructor of HTTP fetcher.
   */
  static get HttpFetcherCtor () {
    return XMLHttpFetcher
  }

  /**
   * get: Constructor of HTTP fetcher for a request that omits credentials.
   *
   * @returns {typeof FetchHttpFetcher} Constructor of HTTP fetcher.
   */
  static get FetchHttpFetcherCtor () {
    return FetchHttpFetcher
  }

  /**
   * Create HTTP fetcher.
   *
   * @param {{
   *   request: Request
   *   config: import('../../tools/http-fetchers/BaseHttpFetcher.js').HttpFetcherConfig
   * }} params - Parameters.
   * @returns {import('../../tools/http-fetchers/BaseHttpFetcher.js').default} Instance of HTTP fetcher.
   */
  static createHttpFetcher ({
    request,
    config,
  }) {
    const HttpFetcherCtor = this.extractHttpFetcherCtor({
      request,
    })

    return HttpFetcherCtor.create({
      request,
      config,
    })
  }

  /**
   * Extract the constructor of HTTP fetcher that can honor the credentials mode of the request.
   *
   * @param {{
   *   request: Request
   * }} params - Parameters.
   * @returns {typeof XMLHttpFetcher | typeof FetchHttpFetcher} Constructor of HTTP fetcher.
   */
  static extractHttpFetcherCtor ({
    request,
  }) {
    // XMLHttpRequest sends same-origin cookies even with withCredentials false.
    if (request.credentials === 'omit') {
      return this.FetchHttpFetcherCtor
    }

    return this.HttpFetcherCtor
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
   * @returns {typeof import('../../tools/response-body-parser/BaseResponseBodyParser.js').default<*>} Response body parser class.
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
   * }} [params] - Parameters.
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
    responseParcel,
    payload,
    result,
    abortedReason,
  }) {
    const args = {
      responseParcel,
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
   * @returns {RestfulApiType.Capsule<*, *>} An instance of capsule.
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
   *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*>
   *   payload: RestfulApiType.Payload<*, *, *>
   * }} params - Parameters.
   * @returns {RestfulApiType.Capsule<*, *>} An instance of capsule.
   */
  static createCapsuleAsNetworkError ({
    responseParcel,
    payload,
  }) {
    return this.Capsule.createAsNetworkError({
      responseParcel,
      payload,
    })
  }

  /**
   * Creates a capsule instance representing a response body parse error.
   *
   * @param {{
   *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*>
   *   payload: RestfulApiType.Payload<*, *, *>
   * }} params - Parameters.
   * @returns {RestfulApiType.Capsule<*, *>} An instance of the capsule.
   */
  static createCapsuleAsResponseBodyParseError ({
    responseParcel,
    payload,
  }) {
    return this.Capsule.createAsResponseBodyParseError({
      responseParcel,
      payload,
    })
  }

  /**
   * Create response body parser.
   *
   * @param {{
   *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*>
   * }} params - Parameters of this method.
   * @returns {import('../../tools/response-body-parser/BaseResponseBodyParser.js').default} An instance of response body parser.
   */
  static createResponseBodyParser ({
    responseParcel,
  }) {
    return this.ResponseBodyParser.create({
      responseParcel,
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

    const httpParcel = await this.invokeFetchQuery({
      payload,
      sink: {
        onUploadProgress: extendedHooks.onUploadProgress,
        onDownloadProgress: extendedHooks.onDownloadProgress,
      },
    })

    const capsule = await this.retrieveCapsule({
      httpParcel,
      payload,
    })

    await extendedHooks.afterRequest(capsule)

    return capsule
  }

  /**
   * Extend request hooks.
   *
   * @param {RestfulApiLauncherHooks} hooks - Hooks.
   * @returns {Required<RestfulApiLauncherHooks>} Extended hooks.
   */
  extendRequestHooks ({
    beforeRequest = async () => false,
    afterRequest = async () => {},
    onUploadProgress = () => {},
    onDownloadProgress = () => {},
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
   *   sink?: Partial<import('../../tools/http-fetchers/BaseHttpFetcher.js').HttpFetcherSink>
   * }} params - Parameters.
   * @returns {Promise<import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*>>} Promise of HTTP parcel, which carries the response or the error of the fetcher.
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

    const httpFetcher = this.Ctor.createHttpFetcher({
      request,
      config: {
        timeoutMilliseconds: payload.timeoutMilliseconds,
      },
    })

    return httpFetcher.fetchResponse({
      sink: {
        onUploadProgress,
        onDownloadProgress,
      },
    })
  }

  /**
   * Resolve launched capsule.
   *
   * @param {{
   *   payload: RestfulApiType.Payload<*, *, *>
   *   httpParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*>
   * }} params - Parameters.
   * @returns {Promise<RestfulApiType.Capsule<*, *>>} Promise of instance of capsule.
   */
  async retrieveCapsule ({
    payload,
    httpParcel,
  }) {
    if (httpParcel.hasError()) {
      return this.Ctor.createCapsuleAsNetworkError({
        responseParcel: httpParcel,
        payload,
      })
    }

    const result = await this.generateFetchResult({
      responseParcel: httpParcel,
    })
    if (result === null) {
      return this.Ctor.createCapsuleAsResponseBodyParseError({
        responseParcel: httpParcel,
        payload,
      })
    }

    return this.Ctor.createCapsule({
      responseParcel: httpParcel,
      payload,
      result,
    })
  }

  /**
   * Generate fetch result.
   *
   * @param {{
   *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*>
   * }} params - Parameters.
   * @returns {Promise<object | null>} Parsed response body.
   */
  async generateFetchResult ({
    responseParcel,
  }) {
    const parser = this.Ctor.createResponseBodyParser({
      responseParcel,
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
 *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*> | null
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
