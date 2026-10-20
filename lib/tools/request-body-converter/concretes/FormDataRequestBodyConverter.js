import BaseRequestBodyConverter from '../BaseRequestBodyConverter.js'

/**
 * FormData request body converter.
 *
 * @template {Record<string, *>} [B = Record<string, *>]
 * @extends {BaseRequestBodyConverter<B>}
 */
export default class FormDataRequestBodyConverter extends BaseRequestBodyConverter {
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
    const formDataHub = this.Ctor.createFormDataInstance()

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
