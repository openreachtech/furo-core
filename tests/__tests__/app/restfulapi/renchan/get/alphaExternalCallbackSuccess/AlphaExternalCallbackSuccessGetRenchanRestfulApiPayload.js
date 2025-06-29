import AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload from '~/app/restfulapi/renchan/get/alphaExternalCallbackSuccess/AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload.js'
import BaseAppRenchanRestfulApiPayload from '~/app/restfulapi/renchan/BaseAppRenchanRestfulApiPayload.js'

import {
  RESTFUL_API_METHOD,
} from '~/lib/client/restfulapi/constants.js'

describe('AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload', () => {
  describe('inheritance', () => {
    test('should be a subclass of BaseAppRenchanRestfulApiPayload', () => {
      const actual = AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload.prototype

      expect(actual)
        .toBeInstanceOf(BaseAppRenchanRestfulApiPayload)
    })
  })
})

describe('AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload', () => {
  describe('.get:method', () => {
    test('should be fixed value', () => {
      const expected = RESTFUL_API_METHOD.GET

      const actual = AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload.method

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload', () => {
  describe('.get:pathname', () => {
    test('should be fixed value', () => {
      const expected = '/alpha-external-callback/success'

      const actual = AlphaExternalCallbackSuccessGetRenchanRestfulApiPayload.pathname

      expect(actual)
        .toBe(expected)
    })
  })
})
