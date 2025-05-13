import BaseAppGraphqlPayload from '../../BaseAppGraphqlPayload.js'

/**
 * UploadImage mutation payload.
 *
 * @extends {BaseAppGraphqlPayload<UploadImageMutationRequestVariables>}
 */
export default class UploadImageMutationGraphqlPayload extends BaseAppGraphqlPayload {
  /** @override */
  static get document () {
    return /* GraphQL */ `
      mutation UploadImageMutation ($input: UploadImageInput!) {
        uploadImage (input: $input) {
          filename
          mimetype
          encoding
        }
      }
    `
  }
}

/**
 * @typedef {{
 *   input: {
 *     image: File
 *   }
 * }} UploadImageMutationRequestVariables
 */

/*
input UploadImageInput {
  image: Upload!
}
*/
