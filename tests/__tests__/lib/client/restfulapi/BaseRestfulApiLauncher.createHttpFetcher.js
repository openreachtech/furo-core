import BaseRestfulApiLauncher from '~/lib/client/restfulapi/BaseRestfulApiLauncher.js'
import HttpFetcher from '~/lib/tools/HttpFetcher.js'
import XMLHttpRequestClerk from '~/lib/tools/request-clerk/concretes/XMLHttpRequestClerk.js'

describe('BaseRestfulApiLauncher', () => {
  describe('.createHttpFetcher()', () => {
    test('to be instance of HttpFetcher', () => {
      const actual = BaseRestfulApiLauncher.createHttpFetcher()

      expect(actual)
        .toBeInstanceOf(HttpFetcher)
    })

    test('to send requests through XMLHttpRequestClerk to report progress', () => {
      const actual = BaseRestfulApiLauncher.createHttpFetcher()

      expect(actual)
        .toHaveProperty('RequestClerkCtor', XMLHttpRequestClerk)
    })

    test('to give the clerk the default config', () => {
      const actual = BaseRestfulApiLauncher.createHttpFetcher()

      expect(actual.config)
        .toStrictEqual({})
    })
  })
})
