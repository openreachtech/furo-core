/**
 * Base class of GraphQL payload.
 *
 * @template {RestfulApiRequestQuery} [QP = {}] - Query parameters.
 * @template {RestfulApiRequestBody} [BP = {}] - Request body.
 * @template {RestfulApiRequestPathParams} [PP = {}] - Path parameters.
 * @abstract
 * @property {QP} query - Query parameters.
 * @property {BP} body - Request body.
 * @property {PP} pathParameterHash - Path parameters.
 */
export default class BaseRestfulApiPayload {
  /**
   * Constructor.
   *
   * @param {BaseRestfulApiPayloadParams} params
   */
  constructor ({
    query,
    body,
    pathParameterHash,
    options: {
      headers = new Headers(),
      ...restOptions
    },
  }) {
    this.query = query
    this.body = body
    this.pathParameterHash = pathParameterHash

    this.headers = headers
    this.restOptions = restOptions

    this.options = {
      headers,
      ...restOptions,
    }
  }

  /**
   * Factory method.
   *
   * @template {X extends PayloadCtor<*, *, *> ? X : never} T, X
   * @param {BaseRestfulApiPayloadFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    query = {},
    body = {},
    pathParameterHash = {},
    options = {},
  } = {}) {
    return /** @type {InstanceType<T>} */ (
      new this({
        query,
        body,
        pathParameterHash,
        options,
      })
    )
  }

  /**
   * Factory method with <form> value hash.
   *
   * @template {PayloadCtor<*, *, *>} T
   * @param {{
   *   valueHash: {
   *     [field: string]: furo.FormControlElementValueType
   *   }
   *   extraValueHash?: {
   *     [field: string]: furo.FormControlElementValueType
   *   }
   *   options?: RequestInit
   * }} params - Parameters.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static createWithFormValueHash ({
    valueHash,
    extraValueHash = {},
    options = {},
  }) {
    const builtValueHash = this.buildFormBasedValueHash({
      valueHash,
      extraValueHash,
    })

    const {
      query = {},
      body = {},
      pathParameterHash = {},
    } = this.generateRequestParameterHash({
      valueHash: builtValueHash,
    })

    return this.create({
      query,
      body,
      pathParameterHash,
      options,
    })
  }

  /**
   * Normalize key case.
   *
   * @param {{
   *   valueHash: {
   *     [field: string]: furo.FormControlElementValueType
   *   }
   *   extraValueHash: {
   *     [field: string]: furo.FormControlElementValueType
   *   }
   * }} params - Parameters.
   * @returns {{
   *   [field: string]: furo.FormControlElementValueType
   * }}
   */
  static buildFormBasedValueHash ({
    valueHash,
    extraValueHash,
  }) {
    const normalizedValueHash = this.normalizeFormBasedValueHash({
      valueHash,
    })

    return {
      ...normalizedValueHash,
      ...extraValueHash,
    }
  }

  /**
   * Normalize form based value hash.
   *
   * @param {{
   *   valueHash: {
   *     [field: string]: furo.FormControlElementValueType
   *   }
   * }} params - Parameters.
   * @returns {{
   *   [field: string]: any
   * }} Normalized form value hash.
   */
  static normalizeFormBasedValueHash ({
    valueHash,
  }) {
    return valueHash
  }

  /**
   * Generate request parameter hash.
   *
   * @abstract
   * @param {{
   *   valueHash: Record<string, *>
   * }} params - Parameters.
   * @returns {{
   *   query?: RestfulApiRequestQuery
   *   body?: RestfulApiRequestBody
   *   pathParameterHash?: RestfulApiRequestPathParams
   * }} Request parameter hash.
   * @throws {Error} this function must be inherited
   */
  static generateRequestParameterHash ({
    valueHash,
  }) {
    throw new Error('this function must be inherited')
  }

  /**
   * get: method.
   *
   * @abstract
   * @returns {RestfulApiType.METHOD} HTTP method.
   * @throws {Error} this function must be inherited
   */
  static get method () {
    throw new Error('this function must be inherited')
  }

  /**
   * get: URL path name.
   *
   * @abstract
   * @returns {string} Pathname.
   * @throws {Error} this function must be inherited
   * @example
   * ```js
   * return '/amounts'
   * // or
   * return '/profile/:id' // with path parameter
   * ```
   */
  static get pathname () {
    throw new Error('this function must be inherited')
  }

  /**
   * get: prefix pathname.
   *
   * @returns {string} Prefix pathname.
   */
  static get prefixPathname () {
    return ''
  }

  /**
   * get: query fields.
   *
   * @returns {Array<string>} Array of fields.
   */
  static get queryRequiredFields () {
    return []
  }

  /**
   * get: body fields.
   *
   * @returns {Array<string>} Array of fields.
   */
  static get bodyRequiredFields () {
    return []
  }

  /**
   * get: path parameter fields
   *
   * @returns {Array<string>} Array of fields.
   */
  static get pathParameterRequiredFields () {
    return []
  }

  /**
   * Collect based headers options.
   *
   * @returns {Array<HeadersInit>} Headers options.
   */
  static collectBasedHeadersOptions () {
    return []
  }

  /**
   * Collect based fetch options.
   *
   * @returns {Array<RequestInit>} Fetch options.
   */
  static collectBasedFetchOptions () {
    return []
  }

  /**
   * Resolve base URL from base URL.
   *
   * @param {{
   *   baseUrl: RestfulApiType.RequestUrl
   * }} params - Parameters.
   * @returns {string} Resolved URL as string.
   */
  static resolveBaseUrl ({
    baseUrl,
  }) {
    if (baseUrl instanceof URL) {
      return baseUrl.origin
    }

    if (baseUrl instanceof Request) {
      return new URL(baseUrl.url).origin
    }

    return baseUrl
  }

  /**
   * Is body required method.
   *
   * @returns {boolean} true: body is required, false: body is not required.
   */
  static isBodyRequiredMethod () {
    return [
      'post',
      'put',
      'patch',
    ]
      .includes(
        this.method.toLowerCase()
      )
  }

  /**
   * Create FormData instance.
   *
   * @returns {FormData} FormData instance.
   */
  static createFormDataInstance () {
    return new FormData()
  }

  /**
   * Is valid value hash.
   *
   * @param {{
   *   requiredFields: Array<string>
   *   valueHash: Record<string, *>
   * }} params - Parameters.
   * @returns {boolean} true: valid, false: invalid.
   */
  static isValidValueHash ({
    requiredFields,
    valueHash,
  }) {
    return requiredFields.every(
      field => field in valueHash
    )
  }

  /**
   * get: Ctor.
   *
   * @template {PayloadCtor<QP, BP, PP>} T
   * @returns {T} Constructor of this
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }

  /**
   * Create fetch request.
   *
   * @param {{
   *   baseUrl: RestfulApiType.RequestUrl
   * }} params - Parameters.
   * @returns {Request} Instance of fetch request.
   * @public
   */
  createFetchRequest ({
    baseUrl,
  }) {
    const requestUrl = this.createRequestURL({
      baseUrl,
    })
    const requestOptionHash = this.generateRequestOptionHash()

    return new Request(
      requestUrl,
      requestOptionHash
    )
  }

  /**
   * Create request URL with query and path parameter hash.
   *
   * @param {{
   *   baseUrl: RestfulApiType.RequestUrl // passed from Launcher
   * }} params - Parameters.
   * @returns {URL} URL with query.
   */
  createRequestURL ({
    baseUrl,
  }) {
    const resolvedBaseUrl = this.Ctor.resolveBaseUrl({
      baseUrl,
    })

    const builtPathname = this.buildRequestUri()

    return new URL(
      builtPathname,
      resolvedBaseUrl
    )
  }

  /**
   * Build request URI with query and path parameter hash.
   *
   * @returns {string} Request URI
   */
  buildRequestUri () {
    const basePathname = this.buildPathname()

    const searchQuery = this.generateSearchQuery()

    if (!searchQuery) {
      return basePathname
    }

    return `${basePathname}?${searchQuery}`
  }

  /**
   * Build pathname with path parameter hash.
   *
   * @returns {string} Pathname.
   */
  buildPathname () {
    // Replace path parameters in pathname
    return `${this.Ctor.prefixPathname}${this.Ctor.pathname}`
      .replace(
        /(?<=\/):(\w+)/ug,
        (_, key) =>
          this.pathParameterHash[key] ?? ''
      )
  }

  /**
   * Generate search query string.
   *
   * @returns {string} Search query string.
   */
  generateSearchQuery () {
    const queryBuilder = new URLSearchParams(this.query)

    queryBuilder.sort()

    return queryBuilder.toString()
  }

  /**
   * Generate request option hash.
   *
   * @returns {RequestInit} Instance of RequestInit.
   */
  generateRequestOptionHash () {
    const basedOptionsEntries = this.Ctor.collectBasedFetchOptions()
      .flatMap(it =>
        Object.entries(it)
      )
    const extraRequestOptionEntries = Object.entries(this.restOptions)

    const mergedHeaders = this.createMergedHeaders()
    const bodyEntries = this.generateBodyEntry()

    const entries = [
      ...basedOptionsEntries,
      ...extraRequestOptionEntries,

      [
        'method',
        this.Ctor.method,
      ],
      [
        'headers',
        mergedHeaders,
      ],

      ...bodyEntries,
    ]

    return Object.fromEntries(entries)
  }

  /**
   * Create merged headers.
   *
   * @returns {Headers} Instance of Headers.
   */
  createMergedHeaders () {
    const optionsEntries = this.Ctor.collectBasedHeadersOptions()
      .flatMap(it =>
        Object.entries(it)
      )
    const normalizedHeaders = new Headers(this.headers)

    const entries = [
      ...optionsEntries,
      ...normalizedHeaders.entries(),
    ]
      .map(([key, value]) => [
        key.toLowerCase(),
        value,
      ])

    return new Headers(
      Object.fromEntries(entries)
    )
  }

  /**
   * Generate body entries.
   *
   * @returns {Array<['body', FormData]>} Array of body entries.
   */
  generateBodyEntry () {
    if (!this.Ctor.isBodyRequiredMethod()) {
      return []
    }

    return [
      [
        'body',
        this.buildFormDataBody(),
      ],
    ]
  }

  /**
   * Build FormData body.
   *
   * @returns {FormData} FormData instance.
   */
  buildFormDataBody () {
    const body = this.extractFilteredRequestBody()

    // Create FormData instance
    const formDataHub = this.Ctor.createFormDataInstance()

    return Object.entries(body)
      .reduce(
        (hub, [key, value]) => {
          hub.append(
            key,
            value
          )

          return hub
        },
        formDataHub
      )
  }

  /**
   * Extract filtered variables.
   *
   * @abstract
   * @returns {BP} Filtered variables
   */
  extractFilteredRequestBody () {
    return /** @type {BP} */ (this.body)
  }

  /**
   * Is invalid all parameter hash.
   *
   * @returns {boolean} true: invalid, false: valid.
   */
  isInvalidAllParameterHash () {
    return !this.isValidAllParameterHash()
  }

  /**
   * Is valid all parameter hash.
   *
   * @returns {boolean} true: valid, false: invalid.
   */
  isValidAllParameterHash () {
    const isValidQuery = this.Ctor.isValidValueHash({
      requiredFields: this.Ctor.queryRequiredFields,
      valueHash: this.query,
    })
    const isValidBody = this.Ctor.isValidValueHash({
      requiredFields: this.Ctor.bodyRequiredFields,
      valueHash: this.body,
    })
    const isValidPathParameter = this.Ctor.isValidValueHash({
      requiredFields: this.Ctor.pathParameterRequiredFields,
      valueHash: this.pathParameterHash,
    })

    return isValidQuery
      && isValidBody
      && isValidPathParameter
  }
}

/**
 * @typedef {typeof BaseRestfulApiPayload<QP, BP, PP>} PayloadCtor
 * @template {RestfulApiRequestQuery} [QP = {}]
 * @template {RestfulApiRequestBody} [BP = {}]
 * @template {RestfulApiRequestPathParams} [PP = {}]
 */

/**
 * @typedef {InstanceType<PayloadCtor<QP, BP, PP>>} Payload
 * @template {RestfulApiRequestQuery} [QP = {}]
 * @template {RestfulApiRequestBody} [BP = {}]
 * @template {RestfulApiRequestPathParams} [PP = {}]
 */

/**
 * @typedef {{
 *   query: Record<string, *>
 *   body: Record<string, *>
 *   pathParameterHash: Record<string, *>
 *   options: RequestInit
 * }} BaseRestfulApiPayloadParams
 */

/**
 * @typedef {{
 *   query?: Record<string, *>
 *   body?: Record<string, *>
 *   pathParameterHash?: Record<string, *>
 *   options?: RequestInit
 * }} BaseRestfulApiPayloadFactoryParams
 */

/**
 * @typedef {{
 *   [field: string]: *
 * }} RestfulApiRequestQuery
 */

/**
 * @typedef {{
 *   [field: string]: *
 * }} RestfulApiRequestBody
 */

/**
 * @typedef {{
 *   [field: string]: *
 * }} RestfulApiRequestPathParams
 */
