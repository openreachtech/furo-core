import PathParameterHashGetRenchanRestfulApiCapsule from '~/app/restfulapi/renchan/get/pathParameterHash/PathParameterHashGetRenchanRestfulApiCapsule.js'
import BaseAppRenchanRestfulApiCapsule from '~/app/restfulapi/renchan/BaseAppRenchanRestfulApiCapsule.js'

describe('PathParameterHashGetRenchanRestfulApiCapsule', () => {
  describe('inheritance', () => {
    test('should be a subclass of BaseAppRenchanRestfulApiCapsule', () => {
      const actual = PathParameterHashGetRenchanRestfulApiCapsule.prototype

      expect(actual)
        .toBeInstanceOf(BaseAppRenchanRestfulApiCapsule)
    })
  })
})
