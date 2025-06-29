import BetaExternalCallbackSuccessPostRenchanRestfulApiCapsule from '~/app/restfulapi/renchan/post/betaExternalCallbackSuccess/BetaExternalCallbackSuccessPostRenchanRestfulApiCapsule.js'
import BaseAppRenchanRestfulApiCapsule from '~/app/restfulapi/renchan/BaseAppRenchanRestfulApiCapsule.js'

describe('BetaExternalCallbackSuccessPostRenchanRestfulApiCapsule', () => {
  describe('inheritance', () => {
    test('should be a subclass of BaseAppRenchanRestfulApiCapsule', () => {
      const actual = BetaExternalCallbackSuccessPostRenchanRestfulApiCapsule.prototype

      expect(actual)
        .toBeInstanceOf(BaseAppRenchanRestfulApiCapsule)
    })
  })
})
