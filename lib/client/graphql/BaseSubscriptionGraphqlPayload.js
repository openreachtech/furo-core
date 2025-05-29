/**
 * Base class of subscription GraphQL payload.
 *
 * @template {furo.GraphqlRequestVariables} SV - Type of variables for schema.
 */
export default class BaseSubscriptionGraphqlPayload {
  /**
   * Constructor.
   *
   * @param {BaseSubscriptionGraphqlPayloadParams} params
   */
  constructor ({
    queryTemplate,
    variables,
    operationName,
    extensions,

    context: {
      headers,
      ...restContext
    },
  }) {
    this.queryTemplate = queryTemplate
    this.variables = variables
    this.operationName = operationName
    this.extensions = extensions

    this.headers = headers
    this.restContext = restContext
  }

  /**
   * Factory method.
   *
   * @template {X extends SubscriptionPayloadCtor<*> ? X : never} T, X
   * @param {BaseSubscriptionGraphqlPayloadFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    variables = {},
    operationName = null,
    extensions = {},

    context = {
      headers: new Headers(),
    },
  } = {}) {
    const {
      headers,
      ...restContext
    } = context

    return /** @type {*} */ (
      new this({
        queryTemplate: this.document,
        variables,
        operationName,
        extensions,

        context: {
          headers: new Headers(headers),
          ...restContext,
        },
      })
    )
  }

  /**
   * Factory method with value hash.
   *
   * @template {SubscriptionPayloadCtor<*>} T
   * @param {{
   *   valueHash: {
   *     [field: string]: any
   *   }
   *   operationName?: string | null
   *   extensions?: Record<string, unknown>
   *   context?: {
   *     headers?: HeadersInit
   *     [key: string]: unknown
   *   }
   * }} params - Parameters.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static createWithValueHash ({
    valueHash,
    operationName = null,
    extensions = {},
    context = {
      headers: new Headers(),
    },
  }) {
    const variables = this.generateVariables({
      valueHash,
    })

    return this.create({
      variables,
      operationName,
      extensions,
      context,
    })
  }

  /**
   * Generate variables.
   *
   * @param {{
   *   valueHash: {
   *     [field: string]: any
   *   }
   * }} params - Parameters.
   * @returns {furo.GraphqlRequestVariables} Variables.
   */
  static generateVariables ({
    valueHash,
  }) {
    return {
      input: valueHash,
    }
  }

  /**
   * get: document.
   *
   * @abstract
   * @returns {string} GraphQL document template.
   * @throws {Error} This function must be inherited.
   */
  static get document () {
    throw new Error('this function must be inherited')
  }

  /**
   * get: field hash.
   *
   * @returns {Record<string, Array<string>>} Array of fields.
   */
  static get fieldHash () {
    return {}
  }

  /**
   * Collect based subscription payload options.
   *
   * @returns {Array<Record<string, unknown>>} Fetch options.
   */
  static collectBasedSubscriptionPayloadOptions () {
    return []
  }

  /**
   * Collect based subscription context options.
   *
   * @returns {Array<Record<string, unknown>>} Fetch options.
   */
  static collectBasedSubscriptionContextOptions () {
    return []
  }

  /**
   * Collect based headers options.
   *
   * @returns {Array<Record<string, string>>} Headers options.
   */
  static collectBasedHeadersOptions () {
    return []
  }

  /**
   * get: Ctor.
   *
   * @template {SubscriptionPayloadCtor<*>} T
   * @returns {T} Constructor of this
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }

  /**
   * Build subscription request.
   *
   * @returns {SubscriptionRequestPayload<SV>} Instance of this
   * @public
   */
  buildSubscriptionPayload () {
    const payloadOptions = this.buildSubscriptionPayloadOptions()
    const variables = this.extractFilteredVariables()
    const context = this.buildSubscriptionContext()

    return {
      ...payloadOptions,

      query: this.queryTemplate,

      variables,
      operationName: this.operationName,
      extensions: this.extensions,

      context,
    }
  }

  /**
   * Build subscription payload options.
   *
   * @returns {Record<string, unknown>} Options.
   */
  buildSubscriptionPayloadOptions () {
    return Object.fromEntries(
      this.Ctor.collectBasedSubscriptionPayloadOptions()
        .flatMap(it =>
          Object.entries(it)
        )
    )
  }

  /**
   * Extract filtered variables.
   * Kick out unnecessary variable from #variables
   *
   * @returns {SV} Filtered variables
   */
  extractFilteredVariables () {
    return /** @type {*} */ (this.variables)
  }

  /**
   * Build subscription context.
   *
   * @returns {{
   *   headers: Record<string, string>
   *   [key: string]: unknown
   * }} Instance of this
   */
  buildSubscriptionContext () {
    const headers = Object.fromEntries(
      this.createMergedHeaders()
        .entries()
    )

    return {
      headers,
      ...this.restContext,
    }
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
   * Is valid variables.
   *
   * @returns {boolean} true: valid, false: invalid.
   */
  isValidVariables () {
    return Object.entries(this.Ctor.fieldHash)
      .map(([
        schema,
        fields,
      ]) => [
        fields,
        Object.keys(
          this.variables?.[schema]
          ?? {}
        ),
      ])
      .map(([
        fields,
        variableFields,
      ]) => ({
        fields,
        unifiedFields: [...new Set(
          variableFields.concat(fields)
        )],
      }))
      .every(({
        fields,
        unifiedFields,
      }) =>
        unifiedFields.length === fields.length
      )
  }

  /**
   * Is invalid variables.
   *
   * @returns {boolean} true: invalid, false: valid.
   */
  isInvalidVariables () {
    return !this.isValidVariables()
  }
}

/**
 * @typedef {typeof BaseSubscriptionGraphqlPayload<V>} SubscriptionPayloadCtor
 * @template {furo.GraphqlRequestVariables} V
 */

/**
 * @typedef {InstanceType<SubscriptionPayloadCtor<V>>} SubscriptionPayload
 * @template {furo.GraphqlRequestVariables} V
 */

/**
 * @typedef {{
 *   queryTemplate: string
 *   variables: furo.GraphqlRequestVariables
 *   operationName: string | null
 *   extensions: Record<string, unknown>
 *   context: {
 *     headers: Headers
 *     [key: string]: unknown
 *   }
 * }} BaseSubscriptionGraphqlPayloadParams
 */

/**
 * @typedef {{
 *   variables?: furo.GraphqlRequestVariables
 *   operationName?: string | null
 *   extensions?: Record<string, unknown>
 *   context?: {
 *     headers?: HeadersInit
 *     [key: string]: unknown
 *   }
 * }} BaseSubscriptionGraphqlPayloadFactoryParams
 */

/**
 * @typedef {{
 *   query: string
 *   variables: SV
 *   operationName: string | null
 *   extensions: Record<string, unknown>
 *   context: SubscriptionRequestContext
 * }} SubscriptionRequestPayload
 * @template {furo.GraphqlRequestVariables} SV
 */

/**
 * @typedef {{
 *   headers?: Record<string, string>
 *   [key: string]: unknown
 * }} SubscriptionRequestContext
 */
