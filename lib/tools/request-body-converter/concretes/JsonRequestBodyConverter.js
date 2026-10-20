import BaseRequestBodyConverter from '../BaseRequestBodyConverter.js'

/**
 * JSON request body converter.
 *
 * @template {Record<string, *>} [B = Record<string, *>]
 * @extends {BaseRequestBodyConverter<B>}
 */
export default class JsonRequestBodyConverter extends BaseRequestBodyConverter {
  /**
   * Converts the request body into JSON text.
   *
   * @override
   * @returns {string} JSON text of the request body.
   */
  convertBody () {
    return JSON.stringify(this.body)
  }

  /**
   * Generates the content type header entry of JSON.
   *
   * @override
   * @returns {Array<[string, string]>} Header entries.
   */
  generateHeaderEntries () {
    return [
      [
        'content-type',
        'application/json',
      ],
    ]
  }
}
