import BaseAppRenchanRestfulApiCapsule from '~/app/restfulapi/renchan/BaseAppRenchanRestfulApiCapsule.js'
import BaseRenchanRestfulApiCapsule from '~/lib/client/restfulapi/renchan/BaseRenchanRestfulApiCapsule.js'

describe('BaseAppRenchanRestfulApiCapsule', () => {
  describe('inheritance', () => {
    test('should be a subclass of BaseRenchanRestfulApiCapsule', () => {
      const actual = BaseAppRenchanRestfulApiCapsule.prototype

      expect(actual)
        .toBeInstanceOf(BaseRenchanRestfulApiCapsule)
    })
  })
})
