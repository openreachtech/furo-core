import BaseRequestBodyConverter from '../BaseRequestBodyConverter.js'

/**
 * FormData request body converter.
 *
 * @template {Record<string, *>} [B = Record<string, *>]
 * @extends {BaseRequestBodyConverter<B>}
 */
export default class FormDataRequestBodyConverter extends BaseRequestBodyConverter {
  /**
   * Constructor.
   *
   * @param {FormDataRequestBodyConverterParams<B>} params - Parameters of factory method.
   */
  constructor ({
    body,
    formDataBuilder = null,
  }) {
    super({
      body,
    })

    this.formDataBuilder = formDataBuilder
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof FormDataRequestBodyConverter ? X : never} T, X
   * @param {FormDataRequestBodyConverterParams} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    body,
    formDataBuilder = null,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        body,
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
   * Generates no header entries, because the Request sets the multipart content type.
   *
   * @override
   * @returns {Array<[string, string]>} Header entries.
   */
  generateHeaderEntries () {
    return []
  }
}

/**
 * @typedef {{
 *   body: B
 *   formDataBuilder?: (() => FormData) | null
 * }} FormDataRequestBodyConverterParams
 * @template {Record<string, *>} [B = Record<string, *>]
 */
