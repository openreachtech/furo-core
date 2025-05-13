import BaseAppGraphqlPayload from '../../BaseAppGraphqlPayload.js'

/**
 * UploadDeepPropertyImages mutation graphql payload.
 *
 * @extends {BaseAppGraphqlPayload<UploadDeepPropertyImagesMutationRequestVariables>}
 */
export default class UploadDeepPropertyImagesMutationGraphqlPayload extends BaseAppGraphqlPayload {
  /** @override */
  static get document () {
    return /* GraphQL */ `
      mutation UploadDeepPropertyImagesMutation ($input: UploadDeepPropertyImagesInput!) {
        uploadDeepPropertyImages (input: $input) {
          avatarImage {
            filename
            mimetype
            encoding
          }
          coverImage {
            filename
            mimetype
            encoding
          }
        }
      }
    `
  }

  /**
   * Factory method with form value hash.
   *
   * @override
   * @param {{
   *   valueHash: {
   *     nickname: string
   *     bio: string
   *     'avatar-image': File
   *     'theme-color': string
   *     'cover-image': File
   *   }
   *   options?: RequestInit
   * }} params - Parameters.
   * @returns {*} Instance of this class. FIXME: resolve this type.
   */
  static createWithFormValueHash ({
    valueHash,
    options = {},
  }) {
    const normalizedValueHash = {
      nickname: valueHash.nickname,
      bio: valueHash.bio,
      avatarImage: valueHash['avatar-image'],
      themeColor: valueHash['theme-color'],
      coverImage: valueHash['cover-image'],
    }

    return /** @type {*} */ (
      super.createWithFormValueHash({
        valueHash: normalizedValueHash,
        options,
      })
    )
  }

  /**
   * @override
   * @param {{
   *   valueHash: {
   *     nickname: string
   *     bio: string
   *     avatarImage: File
   *     themeColor: string
   *     coverImage: File
   *   }
   * }} params - Parameters.
   * @returns {UploadDeepPropertyImagesMutationRequestVariables} Variables.
   */
  static generateVariables ({
    valueHash: {
      nickname,
      bio,
      avatarImage,
      themeColor,
      coverImage,
    },
  }) {
    return {
      input: {
        profile: {
          nickname,
          bio,
          avatarImage,
        },
        config: {
          themeColor,
          coverImage,
        },
      },
    }
  }
}

/**
 * @typedef {{
 *   input: {
 *     profile: {
 *       nickname: string
 *       bio: string
 *       avatarImage: File | null
 *     }
 *     config: {
 *       themeColor: string
 *       coverImage: File | null
 *     }
 *   }
 * }} UploadDeepPropertyImagesMutationRequestVariables
 */
