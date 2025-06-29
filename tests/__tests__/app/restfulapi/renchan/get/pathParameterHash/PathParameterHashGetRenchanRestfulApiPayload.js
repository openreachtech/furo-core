import PathParameterHashGetRenchanRestfulApiPayload from '~/app/restfulapi/renchan/get/pathParameterHash/PathParameterHashGetRenchanRestfulApiPayload.js'
import BaseAppRenchanRestfulApiPayload from '~/app/restfulapi/renchan/BaseAppRenchanRestfulApiPayload.js'

import {
  RESTFUL_API_METHOD,
} from '~/lib/client/restfulapi/constants.js'

describe('PathParameterHashGetRenchanRestfulApiPayload', () => {
  describe('inheritance', () => {
    test('should be a subclass of BaseAppRenchanRestfulApiPayload', () => {
      const actual = PathParameterHashGetRenchanRestfulApiPayload.prototype

      expect(actual)
        .toBeInstanceOf(BaseAppRenchanRestfulApiPayload)
    })
  })
})

describe('PathParameterHashGetRenchanRestfulApiPayload', () => {
  describe('.get:method', () => {
    test('should be fixed value', () => {
      const expected = RESTFUL_API_METHOD.GET

      const actual = PathParameterHashGetRenchanRestfulApiPayload.method

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('PathParameterHashGetRenchanRestfulApiPayload', () => {
  describe('.get:pathname', () => {
    test('should be fixed value', () => {
      const expected = '/path-parameter-hash/[id]/[name]'

      const actual = PathParameterHashGetRenchanRestfulApiPayload.pathname

      expect(actual)
        .toBe(expected)
    })
  })
})
