import FetchHttpFetcher from '../../tools/http-fetchers/concretes/FetchHttpFetcher.js'
import XMLHttpFetcher from '../../tools/http-fetchers/concretes/XMLHttpFetcher.js'

/**
 * Base class of GraphQL launcher.
 */
export default class BaseGraphqlLauncher {
  /**
   * Constructor.
   *
   * @param {BaseGraphqlLauncherParams} params - Parameters of constructor.
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
   * @param {BaseGraphqlLauncherFactoryParams} [params] - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    config = this.graphqlConfig,
  } = {}) {
    return /** @type {*} */ (
      new this({
        config,
      })
    )
  }

  /**
   * get: GraphQL configuration.
   *
   * @abstract
   * @returns {{
   *   [key: string]: string
   * }} GraphQL configuration.
   * @throws {Error} This function must be inherited.
   */
  static get graphqlConfig () {
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
   * @returns {GraphqlType.PayloadCtor<*>} Payload class.
   * @throws {Error} This function must be inherited.
   */
  static get Payload () {
    throw new Error('this function must be inherited')
  }

  /**
   * get: Capsule class.
   *
   * @abstract
   * @returns {GraphqlType.CapsuleCtor<*>} Capsule class.
   * @throws {Error} This function must be inherited.
   */
  static get Capsule () {
    throw new Error('this function must be inherited')
  }

  /**
   * Create payload.
   *
   * @template P
   * @param {{
   *   variables?: GraphqlType.RequestVariables
   *   options?: RequestInit
   * }} params - Parameters.
   * @returns {InstanceType<P>} Instance of Payload.
   */
  static createPayload ({
    variables,
    options,
  } = {}) {
    return /** @type {*} */ (
      this.Payload
        .create({
          variables,
          options,
        })
    )
  }

  /**
   * Create payload with value hash.
   *
   * @template P
   * @param {{
   *   valueHash: {
   *     [field: string]: any
   *   }
   *   options?: RequestInit
   * }} params - Parameters.
   * @returns {InstanceType<P>} Instance of Payload.
   */
  static createPayloadWithValueHash ({
    valueHash,
    options,
  }) {
    return /** @type {*} */ (
      this.Payload
        .createWithValueHash({
          valueHash,
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
   * @param {GraphqlType.CapsuleFactoryParams<*>} params - Parameters.
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
   * @returns {GraphqlType.Capsule<*>} Instance of capsule.
   */
  static createCapsuleAsPending () {
    return this.Capsule.createAsPending()
  }

  /**
   * Create instance of capsule with result as invalid variables error.
   *
   * @param {{
   *   payload: GraphqlType.Payload<*>
   * }} params - Parameters.
   * @returns {GraphqlType.Capsule<*>} Instance of capsule.
   */
  static createCapsuleAsInvalidVariablesError ({
    payload,
  }) {
    return this.Capsule.createAsInvalidVariablesError({
      payload,
    })
  }

  /**
   * Create instance of capsule with result as aborted by hooks.
   *
   * @param {{
   *   payload: GraphqlType.Payload<*>
   * }} params - Parameters.
   * @returns {GraphqlType.Capsule<*>} Instance of capsule.
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
   *   payload: GraphqlType.Payload<*>
   * }} params - Parameters.
   * @returns {GraphqlType.Capsule<*>} Instance of capsule.capsule.
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
   * Create instance of capsule with result as JSON parse error.
   *
   * @param {{
   *   responseParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*>
   *   payload: GraphqlType.Payload<*>
   * }} params - Parameters.
   * @returns {GraphqlType.Capsule<*>} Instance of capsule.capsule.
   */
  static createCapsuleAsJsonParseError ({
    responseParcel,
    payload,
  }) {
    return this.Capsule.createAsJsonParseError({
      responseParcel,
      payload,
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
   * get: Endpoint URL.
   *
   * @returns {RequestInfo | URL} Endpoint URL.
   */
  get endpointUrl () {
    return this.config.ENDPOINT_URL
  }

  /**
   * Launch request.
   *
   * @template C, D
   * @param {GraphqlLaunchRequestArgs} params - Parameters.
   * @returns {Promise<GraphqlType.Capsule<D>>} Promise of instance of capsule.
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

    if (payload.isInvalidVariables()) {
      return this.Ctor.createCapsuleAsInvalidVariablesError({
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
   * @param {GraphqlLauncherHooks} hooks - Hooks.
   * @returns {GraphqlLauncherHooks} Extended hooks.
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
   * @template {(payload: GraphqlType.Payload<*>) => Promise<boolean>} T
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
   * @template {(capsule: GraphqlType.Capsule<*>) => Promise<void>} T
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
   *   payload: GraphqlType.Payload<*>
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
      url: this.endpointUrl,
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
   *   payload: GraphqlType.Payload<*>
   *   httpParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*>
   * }} params - Parameters.
   * @returns {Promise<GraphqlType.Capsule<*>>} Promise of instance of capsule.
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
      httpParcel,
    })
    if (result === null) {
      return this.Ctor.createCapsuleAsJsonParseError({
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
   *   httpParcel: import('../../tools/http-fetchers/parcels/BaseHttpParcel.js').default<*>
   * }} params - Parameters.
   * @returns {Promise<object | null>} Promise of JSON.
   */
  async generateFetchResult ({
    httpParcel,
  }) {
    return httpParcel.toJson()
  }
}

/**
 * @typedef {typeof BaseGraphqlLauncher} LauncherCtor
 */

/**
 * @typedef {InstanceType<LauncherCtor>} Launcher
 */

/**
 * @typedef {{
 *   config: {
 *     [x: string]: string
 *   }
 * }} BaseGraphqlLauncherParams
 */

/**
 * @typedef {{
 *   config?: {
 *     [x: string]: string
 *   }
 * }} BaseGraphqlLauncherFactoryParams
 */

/**
 * @typedef {{
 *   payload: GraphqlType.Payload<*>
 *   hooks?: GraphqlLauncherHooks
 * }} GraphqlLaunchRequestArgs
 */

/**
 * @typedef {{
 *   variables?: GraphqlType.RequestVariables
 *   options?: RequestInit
 *   hooks?: GraphqlLauncherHooks
 * }} GraphqlRequestArgs
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
 * }} GraphqlLauncherHooks
 * @template {GraphqlType.Payload<*>} [P = GraphqlType.Payload<*>]
 * @template {GraphqlType.Capsule<*>} [C = GraphqlType.Capsule<*>]
 */
