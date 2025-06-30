import PathParameterHashGetRenchanRestfulApiLauncher from '~/app/restfulapi/renchan/get/pathParameterHash/PathParameterHashGetRenchanRestfulApiLauncher.js'
import BaseAppRenchanRestfulApiLauncher from '~/app/restfulapi/renchan/BaseAppRenchanRestfulApiLauncher.js'

import PathParameterHashGetRenchanRestfulApiPayload from '~/app/restfulapi/renchan/get/pathParameterHash/PathParameterHashGetRenchanRestfulApiPayload.js'
import PathParameterHashGetRenchanRestfulApiCapsule from '~/app/restfulapi/renchan/get/pathParameterHash/PathParameterHashGetRenchanRestfulApiCapsule.js'

describe('PathParameterHashGetRenchanRestfulApiLauncher', () => {
  describe('inheritance', () => {
    test('should be a subclass of BaseAppRenchanRestfulApiLauncher', () => {
      const actual = PathParameterHashGetRenchanRestfulApiLauncher.prototype

      expect(actual)
        .toBeInstanceOf(BaseAppRenchanRestfulApiLauncher)
    })
  })
})

describe('PathParameterHashGetRenchanRestfulApiLauncher', () => {
  describe('.get:Payload', () => {
    test('should be PathParameterHashGetRenchanRestfulApiPayload', () => {
      const actual = PathParameterHashGetRenchanRestfulApiLauncher.Payload

      expect(actual)
        .toBe(PathParameterHashGetRenchanRestfulApiPayload) // same reference
    })
  })
})

describe('PathParameterHashGetRenchanRestfulApiLauncher', () => {
  describe('.get:Capsule', () => {
    test('should be PathParameterHashGetRenchanRestfulApiCapsule', () => {
      const actual = PathParameterHashGetRenchanRestfulApiLauncher.Capsule

      expect(actual)
        .toBe(PathParameterHashGetRenchanRestfulApiCapsule) // same reference
    })
  })
})
