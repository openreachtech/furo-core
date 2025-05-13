import BaseAppGraphqlPayload from '../../BaseAppGraphqlPayload.js'

/**
 * SignUp mutation payload.
 *
 * @extends {BaseAppGraphqlPayload<SignUpMutationRequestVariables>}
 */
export default class SignUpMutationGraphqlPayload extends BaseAppGraphqlPayload {
  /** @override */
  static get document () {
    return /* GraphQL */ `
      mutation SignUpMutation ($input: SignUpInput!) {
        signUp (input: $input) {
          sentTo
        }
      }
    `
  }
}

/**
 * @typedef {{
 *   input: {
 *     email: string
 *     username: string
 *     firstName: string
 *     lastName: string
 *     password: string
 *   }
 * }} SignUpMutationRequestVariables
 */
