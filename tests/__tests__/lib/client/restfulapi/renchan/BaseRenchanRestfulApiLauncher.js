import BaseRenchanRestfulApiLauncher from '~/lib/client/restfulapi/renchan/BaseRenchanRestfulApiLauncher.js'

import BaseRestfulApiLauncher from '~/lib/client/restfulapi/BaseRestfulApiLauncher.js'

describe('BaseRenchanRestfulApiLauncher', () => {
  describe('inheritance', () => {
    test('should extend BaseRestfulApiLauncher', () => {
      const actual = BaseRenchanRestfulApiLauncher.prototype

      expect(actual)
        .toBeInstanceOf(BaseRestfulApiLauncher)
    })
  })
})
