import BaseAppGraphqlCapsule from '../../BaseAppGraphqlCapsule.js'

/**
 * CompanySponsorsQueryGraphqlCapsule
 *
 * @extends {BaseAppGraphqlCapsule<CompanySponsorsQueryResponseContent>}
 */
export default class CompanySponsorsQueryGraphqlCapsule extends BaseAppGraphqlCapsule {
  /**
   * get: companySponsors
   *
   * @returns {Array<CompanySponsorEntity>} Array of company sponsor.
   */
  get companySponsors () {
    const content = this.extractContent()

    return content
      ?.companySponsors
      ?.companySponsors
      ?? []
  }
}

/**
 * @typedef {{
 *   companySponsors: {
 *     companySponsors: Array<CompanySponsorEntity>
 *   }
 * }} CompanySponsorsQueryResponseContent
 */

/**
 * @typedef {{
 *   id: number
 *   registeredAt: string
 *   companyName: string
 *   companyDescription: string
 *   companySponsorHomepage: string
 *   companySponsorLogo: string
 * }} CompanySponsorEntity
 */
