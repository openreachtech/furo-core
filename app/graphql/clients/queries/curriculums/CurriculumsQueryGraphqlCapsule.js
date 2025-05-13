import BaseAppGraphqlCapsule from '../../BaseAppGraphqlCapsule.js'

/**
 * Curriculums query graphql capsule.
 *
 * @extends {BaseAppGraphqlCapsule<CurriculumsQueryResponseContent>}
 */
export default class CurriculumsQueryGraphqlCapsule extends BaseAppGraphqlCapsule {
  /**
   * get: curriculums
   *
   * @returns {Array<CurriculumEntity>} Array of curriculum
   */
  get curriculums () {
    const content = this.extractContent()

    return content
      ?.curriculums
      ?.curriculums
      ?? []
  }
}

/**
 * @typedef {{
 *   curriculums: {
 *     curriculums: Array<CurriculumEntity>
 *   }
 * }} CurriculumsQueryResponseContent
 */

/**
 * @typedef {{
 *   id: number
 *   title: string
 *   description: string
 *   thumbnailUrl: string
 *   postedAt: string
 * }} CurriculumEntity
 */
