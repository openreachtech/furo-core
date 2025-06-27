import BaseRenchanRestfulApiCapsule from '~/lib/client/restfulapi/renchan/BaseRenchanRestfulApiCapsule.js'

import BaseRestfulApiCapsule from '~/lib/client/restfulapi/BaseRestfulApiCapsule.js'

describe('BaseRenchanRestfulApiCapsule', () => {
  describe('inheritance', () => {
    test('should extend BaseRestfulApiCapsule', () => {
      const actual = BaseRenchanRestfulApiCapsule.prototype

      expect(actual)
        .toBeInstanceOf(BaseRestfulApiCapsule)
    })
  })
})
