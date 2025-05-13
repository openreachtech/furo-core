import BaseAppGraphqlPayload from '../../BaseAppGraphqlPayload.js'

/**
 * CompanySponsors query payload.
 *
 * @extends {BaseAppGraphqlPayload<CompanySponsorsQueryRequestVariables>}
 */
export default class CompanySponsorsQueryGraphqlPayload extends BaseAppGraphqlPayload {
  /** @override */
  static get document () {
    return /* GraphQL */ `
      query CompanySponsorsQuery {
        companySponsors {
          companySponsors {
            id
            registeredAt
            companyName
            companyDescription
            companySponsorHomepage
            companySponsorLogo
          }
        }
      }
    `
  }
}

/**
 * @typedef {{}} CompanySponsorsQueryRequestVariables
 */
