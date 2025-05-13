import BaseAppGraphqlPayload from '../../BaseAppGraphqlPayload.js'

/**
 * UploadArrayImages mutation payload.
 *
 * @extends {BaseAppGraphqlPayload<UploadArrayImagesMutationRequestVariables>}
 */
export default class UploadArrayImagesMutationGraphqlPayload extends BaseAppGraphqlPayload {
  /** @override */
  static get document () {
    return /* GraphQL */ `
      mutation UploadArrayImagesMutation ($input: UploadArrayImagesInput!) {
        uploadArrayImages (input: $input) {
          filename
          mimetype
          encoding
        }
      }
    `
  }

  /**
   * Generate variables from value hash.
   *
   * @override
   * @param {{
   *   valueHash: {
   *     images: Array<File>
   *   }
   * }} params - Parameters.
   * @returns {UploadArrayImagesMutationRequestVariables} Variables.
   */
  static generateVariables ({
    valueHash: {
      images,
    },
  }) {
    return {
      input: {
        images,
      },
    }
  }
}

/**
 * @typedef {{
 *   input: {
 *     images: Array<File>
 *   }
 * }} UploadArrayImagesMutationRequestVariables
 */

/*
input UploadArrayImagesInput {
  images: [Upload!]!
}
*/
