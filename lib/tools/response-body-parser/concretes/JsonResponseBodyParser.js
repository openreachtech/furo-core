import BaseResponseBodyParser from '../BaseResponseBodyParser.js'

/**
 * JSON response body parser.
 *
 * @template {Record<string, *>} C - Type of the parsed response body.
 * @extends {BaseResponseBodyParser<C>}
 */
export default class JsonResponseBodyParser extends BaseResponseBodyParser {
  /**
   * Parses the response body.
   *
   * @override
   * @returns {Promise<C | null>} Parsed response body, or null if the body is not JSON.
   */
  async parseBody () {
    return this.responseParcel.toJson()
  }
}
