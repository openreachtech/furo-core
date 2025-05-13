import BaseAppGraphqlCapsule from '~/app/graphql/clients/BaseAppGraphqlCapsule.js'
import BaseGraphqlCapsule from '~/lib/client/BaseGraphqlCapsule.js'

beforeEach(() => {
  localStorage.clear()
})

describe('BaseAppGraphqlCapsule', () => {
  describe('super class', () => {
    test('to be derived class of BaseGraphqlLauncher', () => {
      const actual = BaseAppGraphqlCapsule.prototype

      expect(actual)
        .toBeInstanceOf(BaseGraphqlCapsule)
    })
  })
})
