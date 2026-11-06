import BaseGraphqlLauncher from '~/lib/client/graphql/BaseGraphqlLauncher.js'
import HttpFetcher from '~/lib/tools/HttpFetcher.js'
import XMLHttpRequestClerk from '~/lib/tools/request-clerk/concretes/XMLHttpRequestClerk.js'

describe('BaseGraphqlLauncher', () => {
  describe('.createHttpFetcher()', () => {
    test('to be instance of HttpFetcher', () => {
      const actual = BaseGraphqlLauncher.createHttpFetcher()

      expect(actual)
        .toBeInstanceOf(HttpFetcher)
    })

    test('to send requests through XMLHttpRequestClerk to report progress', () => {
      const actual = BaseGraphqlLauncher.createHttpFetcher()

      expect(actual)
        .toHaveProperty('RequestClerkCtor', XMLHttpRequestClerk)
    })

    test('to give the clerk the default config', () => {
      const actual = BaseGraphqlLauncher.createHttpFetcher()

      expect(actual.config)
        .toStrictEqual({})
    })
  })
})
