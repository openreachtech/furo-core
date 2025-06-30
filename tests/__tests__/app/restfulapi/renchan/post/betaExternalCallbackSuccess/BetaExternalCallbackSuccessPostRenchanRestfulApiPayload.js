import BetaExternalCallbackSuccessPostRenchanRestfulApiPayload from '~/app/restfulapi/renchan/post/betaExternalCallbackSuccess/BetaExternalCallbackSuccessPostRenchanRestfulApiPayload.js'
import BaseAppRenchanRestfulApiPayload from '~/app/restfulapi/renchan/BaseAppRenchanRestfulApiPayload.js'

import {
  RESTFUL_API_METHOD,
} from '~/lib/client/restfulapi/constants.js'

describe('BetaExternalCallbackSuccessPostRenchanRestfulApiPayload', () => {
  describe('inheritance', () => {
    test('should be a subclass of BaseAppRenchanRestfulApiPayload', () => {
      const actual = BetaExternalCallbackSuccessPostRenchanRestfulApiPayload.prototype

      expect(actual)
        .toBeInstanceOf(BaseAppRenchanRestfulApiPayload)
    })
  })
})

describe('BetaExternalCallbackSuccessPostRenchanRestfulApiPayload', () => {
  describe('.get:method', () => {
    test('should be fixed value', () => {
      const expected = RESTFUL_API_METHOD.POST

      const actual = BetaExternalCallbackSuccessPostRenchanRestfulApiPayload.method

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BetaExternalCallbackSuccessPostRenchanRestfulApiPayload', () => {
  describe('.get:pathname', () => {
    test('should be fixed value', () => {
      const expected = '/beta-external-callback/success'

      const actual = BetaExternalCallbackSuccessPostRenchanRestfulApiPayload.pathname

      expect(actual)
        .toBe(expected)
    })
  })
})
