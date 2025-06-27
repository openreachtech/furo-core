import BaseRenchanRestfulApiPayload from '~/lib/client/restfulapi/renchan/BaseRenchanRestfulApiPayload.js'

import BaseRestfulApiPayload from '~/lib/client/restfulapi/BaseRestfulApiPayload.js'

describe('BaseRenchanRestfulApiPayload', () => {
  describe('inheritance', () => {
    test('should extend BaseRestfulApiPayload', () => {
      const actual = BaseRenchanRestfulApiPayload.prototype

      expect(actual)
        .toBeInstanceOf(BaseRestfulApiPayload)
    })
  })
})
