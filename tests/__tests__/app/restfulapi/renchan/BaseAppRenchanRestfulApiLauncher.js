import BaseAppRenchanRestfulApiLauncher from '~/app/restfulapi/renchan/BaseAppRenchanRestfulApiLauncher.js'
import BaseRenchanRestfulApiLauncher from '~/lib/client/restfulapi/renchan/BaseRenchanRestfulApiLauncher.js'

describe('BaseAppRenchanRestfulApiLauncher', () => {
  describe('inheritance', () => {
    test('should be a subclass of BaseRenchanRestfulApiLauncher', () => {
      const actual = BaseAppRenchanRestfulApiLauncher.prototype

      expect(actual)
        .toBeInstanceOf(BaseRenchanRestfulApiLauncher)
    })
  })
})

describe('BaseAppRenchanRestfulApiPayload', () => {
  describe('.get:restfulApiConfig', () => {
    test('should be fixed value', () => {
      const expected = {
        BASE_URL: 'http://localhost:8001',
      }

      const actual = BaseAppRenchanRestfulApiLauncher.restfulApiConfig

      expect(actual)
        .toEqual(expected)
    })
  })
})
