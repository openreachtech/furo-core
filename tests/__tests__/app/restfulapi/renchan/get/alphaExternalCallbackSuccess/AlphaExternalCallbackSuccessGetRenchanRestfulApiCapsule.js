import AlphaExternalCallbackSuccessGetRenchanRestfulApiCapsule from '~/app/restfulapi/renchan/get/alphaExternalCallbackSuccess/AlphaExternalCallbackSuccessGetRenchanRestfulApiCapsule.js'
import BaseAppRenchanRestfulApiCapsule from '~/app/restfulapi/renchan/BaseAppRenchanRestfulApiCapsule.js'

describe('AlphaExternalCallbackSuccessGetRenchanRestfulApiCapsule', () => {
  describe('inheritance', () => {
    test('should be a subclass of BaseAppRenchanRestfulApiCapsule', () => {
      const actual = AlphaExternalCallbackSuccessGetRenchanRestfulApiCapsule.prototype

      expect(actual)
        .toBeInstanceOf(BaseAppRenchanRestfulApiCapsule)
    })
  })
})
