import BetaExternalCallbackSuccessPostRenchanRestfulApiLauncher from '~/app/restfulapi/renchan/post/betaExternalCallbackSuccess/BetaExternalCallbackSuccessPostRenchanRestfulApiLauncher.js'
import BaseAppRenchanRestfulApiLauncher from '~/app/restfulapi/renchan/BaseAppRenchanRestfulApiLauncher.js'

import BetaExternalCallbackSuccessPostRenchanRestfulApiPayload from '~/app/restfulapi/renchan/post/betaExternalCallbackSuccess/BetaExternalCallbackSuccessPostRenchanRestfulApiPayload.js'
import BetaExternalCallbackSuccessPostRenchanRestfulApiCapsule from '~/app/restfulapi/renchan/post/betaExternalCallbackSuccess/BetaExternalCallbackSuccessPostRenchanRestfulApiCapsule.js'

describe('BetaExternalCallbackSuccessPostRenchanRestfulApiLauncher', () => {
  describe('inheritance', () => {
    test('should be a subclass of BaseAppRenchanRestfulApiLauncher', () => {
      const actual = BetaExternalCallbackSuccessPostRenchanRestfulApiLauncher.prototype

      expect(actual)
        .toBeInstanceOf(BaseAppRenchanRestfulApiLauncher)
    })
  })
})

describe('BetaExternalCallbackSuccessPostRenchanRestfulApiLauncher', () => {
  describe('.get:Payload', () => {
    test('should be BetaExternalCallbackSuccessPostRenchanRestfulApiPayload', () => {
      const actual = BetaExternalCallbackSuccessPostRenchanRestfulApiLauncher.Payload

      expect(actual)
        .toBe(BetaExternalCallbackSuccessPostRenchanRestfulApiPayload) // same reference
    })
  })
})

describe('BetaExternalCallbackSuccessPostRenchanRestfulApiLauncher', () => {
  describe('.get:Capsule', () => {
    test('should be BetaExternalCallbackSuccessPostRenchanRestfulApiCapsule', () => {
      const actual = BetaExternalCallbackSuccessPostRenchanRestfulApiLauncher.Capsule

      expect(actual)
        .toBe(BetaExternalCallbackSuccessPostRenchanRestfulApiCapsule) // same reference
    })
  })
})
