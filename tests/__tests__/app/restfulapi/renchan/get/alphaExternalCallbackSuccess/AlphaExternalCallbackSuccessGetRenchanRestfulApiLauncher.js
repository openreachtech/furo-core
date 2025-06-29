import AlphaExternalCallbackSuccessGetRenchanRestfulApiLauncher from '~/app/restfulapi/renchan/get/alphaExternalCallbackSuccess/AlphaExternalCallbackSuccessGetRenchanRestfulApiLauncher.js'
import BaseAppRenchanRestfulApiLauncher from '~/app/restfulapi/renchan/BaseAppRenchanRestfulApiLauncher.js'

import AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload from '~/app/restfulapi/renchan/get/alphaExternalCallbackSuccess/AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload.js'
import AlphaExternalCallbackSuccessGetRenchanRestfulApiCapsule from '~/app/restfulapi/renchan/get/alphaExternalCallbackSuccess/AlphaExternalCallbackSuccessGetRenchanRestfulApiCapsule.js'

describe('AlphaExternalCallbackSuccessGetRenchanRestfulApiLauncher', () => {
  describe('inheritance', () => {
    test('should be a subclass of BaseAppRenchanRestfulApiLauncher', () => {
      const actual = AlphaExternalCallbackSuccessGetRenchanRestfulApiLauncher.prototype

      expect(actual)
        .toBeInstanceOf(BaseAppRenchanRestfulApiLauncher)
    })
  })
})

describe('AlphaExternalCallbackSuccessGetRenchanRestfulApiLauncher', () => {
  describe('.get:Payload', () => {
    test('should be AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload', () => {
      const actual = AlphaExternalCallbackSuccessGetRenchanRestfulApiLauncher.Payload

      expect(actual)
        .toBe(AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload) // same reference
    })
  })
})

describe('AlphaExternalCallbackSuccessGetRenchanRestfulApiLauncher', () => {
  describe('.get:Capsule', () => {
    test('should be AlphaExternalCallbackSuccessGetRenchanRestfulApiCapsule', () => {
      const actual = AlphaExternalCallbackSuccessGetRenchanRestfulApiLauncher.Capsule

      expect(actual)
        .toBe(AlphaExternalCallbackSuccessGetRenchanRestfulApiCapsule) // same reference
    })
  })
})
