import BaseAppGraphqlCapsule from '../../BaseAppGraphqlCapsule.js'

/**
 * @extends {BaseAppGraphqlCapsule<UploadDeepPropertyImagesMutationResponseContent>}
 */
export default class UploadDeepPropertyImagesMutationGraphqlCapsule extends BaseAppGraphqlCapsule {

}

/**
 * @typedef {{
 *   avatarImage: FileParameters
 *   coverImage: FileParameters
 * }} UploadDeepPropertyImagesMutationResponseContent
 */

/**
 * @typedef {{
 *   filename: string
 *   mimetype: string
 *   encoding: string
 * }} FileParameters
 */
