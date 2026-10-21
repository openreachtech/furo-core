import BaseRequestBodyConverter from '../BaseRequestBodyConverter.js'

/**
 * FormData request body converter.
 *
 * @extends {BaseRequestBodyConverter<FormData>}
 */
export default class FormDataRequestBodyConverter extends BaseRequestBodyConverter {
  /**
   * Constructor.
   *
   * @param {FormDataRequestBodyConverterParams} params - Parameters of constructor.
   */
  constructor ({
    body,
    headerEntries,
    formDataBuilder = null,
  }) {
    super({
      body,
      headerEntries,
    })

    this.formDataBuilder = formDataBuilder
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof FormDataRequestBodyConverter ? X : never} T, X
   * @param {FormDataRequestBodyConverterFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    body,
    headerEntries = this.collectHeaderEntries(),
    formDataBuilder = null,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        body,
        headerEntries,
        formDataBuilder,
      })
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
   * Collects no header entries, because the Request sets the multipart content type.
   *
   * @override
   * @returns {Array<[string, string]>} Header entries.
   */
  static collectHeaderEntries () {
    return []
  }

  /**
   * get: Ctor.
   *
   * @returns {typeof FormDataRequestBodyConverter} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof FormDataRequestBodyConverter} */ (this.constructor)
  }

  /**
   * Converts the request body into FormData.
   *
   * @override
   * @returns {FormData} FormData instance.
   */
  convertBody () {
    return this.formDataBuilder?.()
      ?? this.appendBodyTo({
        formDataHub: this.Ctor.createFormDataInstance(),
      })
  }

  /**
   * Appends every field of the request body to the given FormData.
   * Each element of an array value becomes its own part under the same key.
   *
   * @param {{
   *   formDataHub: FormData
   * }} params - Parameters of this method.
   * @returns {FormData} The given FormData instance.
   */
  appendBodyTo ({
    formDataHub,
  }) {
    return Object.entries(this.body)
      .flatMap(([key, value]) => [value].flat()
        .map(it => [key, it]))
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
}

/**
 * @typedef {{
 *   body: Record<string, *>
 *   headerEntries: Array<[string, string]>
 *   formDataBuilder?: (() => FormData) | null
 * }} FormDataRequestBodyConverterParams
 */

/**
 * @typedef {{
 *   body: Record<string, *>
 *   headerEntries?: Array<[string, string]>
 *   formDataBuilder?: (() => FormData) | null
 * }} FormDataRequestBodyConverterFactoryParams
 */
