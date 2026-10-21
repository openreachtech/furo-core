import BaseRequestBodyConverter from '../BaseRequestBodyConverter.js'

/**
 * JSON request body converter.
 *
 * @extends {BaseRequestBodyConverter<string>}
 */
export default class JsonRequestBodyConverter extends BaseRequestBodyConverter {
  /**
   * Collects the content type header entry of JSON.
   *
   * @override
   * @returns {Array<[string, string]>} Header entries.
   */
  static collectHeaderEntries () {
    return [
      ['content-type', 'application/json'],
    ]
  }

  /**
   * Converts the request body into JSON text.
   *
   * @override
   * @returns {string} JSON text of the request body.
   */
  convertBody () {
    return JSON.stringify(this.body)
  }
}
