import ProgressHttpFetcher from '../../tools/ProgressHttpFetcher.js'

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
   * @returns {furo.CapsuleCtor<*>} Capsule class.
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
   *   variables?: furo.GraphqlRequestVariables
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
   * @param {furo.BaseGraphqlCapsuleFactoryParams<*>} params - Parameters.
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
   * @returns {furo.Capsule<*>} Instance of capsule.
   */
  static createCapsuleAsPending () {
    return this.Capsule.createAsPending()
  }

  /**
   * Create instance of capsule with result as invalid variables error.
   *
   * @param {{
   *   payload: furo.Payload<*>
   * }} params - Parameters.
   * @returns {furo.Capsule<*>} Instance of capsule.
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
   *   payload: furo.Payload<*>
   * }} params - Parameters.
   * @returns {furo.Capsule<*>} Instance of capsule.
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
   *   payload: furo.Payload<*>
   * }} params - Parameters.
   * @returns {furo.Capsule<*>} Instance of capsule.capsule.
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
   *   payload: furo.Payload<*>
   * }} params - Parameters.
   * @returns {furo.Capsule<*>} Instance of capsule.capsule.
   */
  static createCapsuleAsJsonParseError ({
    rawResponse,
    payload,
  }) {
    return this.Capsule.createAsJsonParseError({
      rawResponse,
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
   * @returns {Promise<furo.Capsule<D>>} Promise of instance of capsule.
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
   * @template {(payload: furo.Payload<*>) => Promise<boolean>} T
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
   * @template {(capsule: furo.Capsule<*>) => Promise<void>} T
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
   *   payload: furo.Payload<*>
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
      url: this.endpointUrl,
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
   *   payload: furo.Payload<*>
   *   response: Response | null
   * }} params - Parameters.
   * @returns {Promise<furo.Capsule<*>>} Promise of instance of capsule.
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
    try {
      const result = await response.json()

      return result
    } catch (error) {
      return null
    }
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
 *   payload: furo.Payload<*>
 *   hooks?: GraphqlLauncherHooks
 * }} GraphqlLaunchRequestArgs
 */

/**
 * @typedef {{
 *   variables?: furo.GraphqlRequestVariables
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
 * @template {furo.Payload<*>} [P = furo.Payload<*>]
 * @template {furo.Capsule<*>} [C = furo.Capsule<*>]
 */
