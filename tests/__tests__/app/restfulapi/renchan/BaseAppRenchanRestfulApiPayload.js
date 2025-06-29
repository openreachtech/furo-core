import BaseAppRenchanRestfulApiPayload from '~/app/restfulapi/renchan/BaseAppRenchanRestfulApiPayload.js'
import BaseRenchanRestfulApiPayload from '~/lib/client/restfulapi/renchan/BaseRenchanRestfulApiPayload.js'

describe('BaseAppRenchanRestfulApiPayload', () => {
  describe('inheritance', () => {
    test('should be a subclass of BaseRenchanRestfulApiPayload', () => {
      const actual = BaseAppRenchanRestfulApiPayload.prototype

      expect(actual)
        .toBeInstanceOf(BaseRenchanRestfulApiPayload)
    })
  })
})

describe('BaseAppRenchanRestfulApiPayload', () => {
  describe('.get:ACCESS_TOKEN_HEADER_KEY', () => {
    test('should be fixed value', () => {
      const expected = 'x-renchan-access-token'

      const actual = BaseAppRenchanRestfulApiPayload.ACCESS_TOKEN_HEADER_KEY

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseAppRenchanRestfulApiPayload', () => {
  describe('.get:ACCESS_TOKEN_STORAGE_KEY', () => {
    test('should be fixed value', () => {
      const expected = 'access_token'

      const actual = BaseAppRenchanRestfulApiPayload.ACCESS_TOKEN_STORAGE_KEY

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseAppRenchanRestfulApiPayload', () => {
  describe('.get:prefixPathname', () => {
    test('should be fixed value', () => {
      const expected = '/v1'

      const actual = BaseAppRenchanRestfulApiPayload.prefixPathname

      expect(actual)
        .toBe(expected)
    })
  })
})
