import UploadingPropertyPathBuilder from '../../domClerks/UploadingPropertyPathBuilder.js'

/**
 * Base class of GraphQL payload.
 *
 * @template {GraphqlRequestVariables} SV - Type of variables for schema.
 */
export default class BaseGraphqlPayload {
  /**
   * Constructor.
   *
   * @param {BaseGraphqlPayloadParams} params
   */
  constructor ({
    queryTemplate,
    variables,
    options: {
      headers = new Headers(),
      ...restOptions
    } = {},
  }) {
    this.queryTemplate = queryTemplate
    this.variables = variables
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
   * @template {X extends PayloadCtor<*> ? X : never} T, X
   * @param {BaseGraphqlPayloadFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    variables = {},
    options = {},
  } = {}) {
    return /** @type {*} */ (
      new this({
        queryTemplate: this.document,
        variables,
        options,
      })
    )
  }

  /**
   * Factory method with value hash.
   *
   * @template {PayloadCtor<*>} T
   * @param {{
   *   valueHash: {
   *     [field: string]: any
   *   }
   *   options?: RequestInit
   * }} params - Parameters.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static createWithValueHash ({
    valueHash,
    options = {},
  }) {
    const variables = this.generateVariables({
      valueHash,
    })

    return this.create({
      variables,
      options,
    })
  }

  /**
   * Factory method with <form> value hash.
   *
   * @template {PayloadCtor<*>} T
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

    return this.createWithValueHash({
      valueHash: builtValueHash,
      options,
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
   * @returns {GraphqlRequestVariables} Variables.
   */
  static generateVariables ({
    valueHash,
  }) {
    return {
      input: valueHash,
    }
  }

  /**
   * Normalize key case.
   *
   * @param {{
   *   valueHash: {
   *     [field: string]: *
   *   }
   *   extraValueHash: {
   *     [field: string]: *
   *   }
   * }} params - Parameters.
   * @returns {{
   *   [field: string]: *
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
   * Collect based headers options.
   *
   * @returns {Array<Record<string, string>>} Headers options.
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
   * get: Ctor.
   *
   * @template {PayloadCtor<*>} T
   * @returns {T} Constructor of this
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }

  /**
   * Create fetch request.
   *
   * @param {{
   *   url: RequestInfo | URL
   * }} params - Parameters.
   * @returns {Request} Instance of fetch request.
   * @public
   */
  createFetchRequest ({
    url,
  }) {
    const builtOptions = this.generateMergedFetchOptionHash()

    return new Request(
      url,
      builtOptions
    )
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

    return new Headers(
      Object.fromEntries(entries)
    )
  }

  /**
   * Generate merged fetch option hash.
   *
   * @returns {RequestInit} Instance of RequestInit.
   */
  generateMergedFetchOptionHash () {
    const mergedHeaders = this.createMergedHeaders()

    const basedOptionsEntries = this.Ctor.collectBasedFetchOptions()
      .flatMap(it =>
        Object.entries(it)
      )

    const formDataBody = this.buildFormDataBody()

    return Object.fromEntries([
      ...basedOptionsEntries,
      ...Object.entries(this.restOptions),

      [
        'method',
        'POST',
      ],
      [
        'headers',
        mergedHeaders,
      ],
      [
        'body',
        formDataBody,
      ],
    ])
  }

  /**
   * Build FormData body.
   *
   * @returns {FormData} FormData instance.
   */
  buildFormDataBody () {
    const extractedVariables = this.extractFilteredVariables()

    const builder = this.createUploadingPropertyPathBuilder({
      value: {
        variables: extractedVariables,
      },
    })

    // Create FormData instance
    const formDataHub = this.createFormDataInstance()

    // Add query and variables as separate fields
    formDataHub.append('operations', JSON.stringify({
      query: this.queryTemplate,
      variables: extractedVariables,
    }))

    formDataHub.append('map',
      JSON.stringify(
        builder.generateUploadingPathMap()
      )
    )
    builder.generateUploadingEntries()
      .reduce(
        (hub, [key, value]) => {
          hub.append(key, value)

          return hub
        },
        formDataHub
      )

    return formDataHub
  }

  /**
   * Extract filtered variables.
   *
   * @abstract
   * @returns {SV} Filtered variables
   */
  extractFilteredVariables () {
    return /** @type {*} */ (this.variables)
  }

  /**
   * Create instance of UploadingPropertyPathBuilder.
   *
   * @param {{
   *   value: *
   * }} params - Parameters,
   * @returns {UploadingPropertyPathBuilder} Instance of UploadingPropertyPathBuilder.
   */
  createUploadingPropertyPathBuilder ({
    value,
  }) {
    return UploadingPropertyPathBuilder.create({
      value,
    })
  }

  /**
   * Create FormData instance.
   *
   * @returns {FormData} FormData instance.
   */
  createFormDataInstance () {
    return new FormData()
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
 * @typedef {typeof BaseGraphqlPayload<V>} PayloadCtor
 * @template {GraphqlRequestVariables} V
 */

/**
 * @typedef {InstanceType<PayloadCtor<V>>} Payload
 * @template {GraphqlRequestVariables} V
 */

/**
 * @typedef {{
 *   queryTemplate: string
 *   variables: GraphqlRequestVariables
 *   options?: RequestInit
 * }} BaseGraphqlPayloadParams
 */

/**
 * @typedef {{
 *   variables?: GraphqlRequestVariables
 *   options?: RequestInit
 * }} BaseGraphqlPayloadFactoryParams
 */

/**
 * @typedef {{
 *   [variablesName: string]: {
 *     [field: string]: any
 *   }
 * }} GraphqlRequestVariables
 */
