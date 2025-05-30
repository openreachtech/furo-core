import BaseAppGraphqlLauncher from '~/app/graphql/clients/BaseAppGraphqlLauncher.js'
import BaseGraphqlLauncher from '~/lib/client/graphql/BaseGraphqlLauncher.js'

beforeEach(() => {
  localStorage.clear()
})

describe('BaseAppGraphqlLauncher', () => {
  describe('super class', () => {
    test('to be derived class of BaseGraphqlLauncher', () => {
      const actual = BaseAppGraphqlLauncher.prototype

      expect(actual)
        .toBeInstanceOf(BaseGraphqlLauncher)
    })
  })
})

describe('BaseAppGraphqlLauncher', () => {
  describe('.create()', () => {
    describe('to be instance of BaseAppGraphqlLauncher', () => {
      const cases = [
        {
          params: {
            config: {
              ENDPOINT_URL: 'http://example.com/graphql-customer',
            },
          },
        },
        {
          params: {
            config: {
              ENDPOINT_URL: 'http://example.com/graphql-admin',
            },
          },
        },
      ]

      test.each(cases)('config: $params.config', ({ params }) => {
        const actual = BaseAppGraphqlLauncher.create(params)

        expect(actual)
          .toBeInstanceOf(BaseAppGraphqlLauncher)
      })

      test('without params', () => {
        const actual = BaseAppGraphqlLauncher.create()

        expect(actual)
          .toBeInstanceOf(BaseAppGraphqlLauncher)
      })
    })

    describe('to call super.create()', () => {
      const cases = [
        {
          params: {
            config: {
              ENDPOINT_URL: 'http://example.com/graphql-customer',
            },
          },
        },
        {
          params: {
            config: {
              ENDPOINT_URL: 'http://example.com/graphql-admin',
            },
          },
        },
      ]

      test.each(cases)('config: $params.config', ({ params }) => {
        const createSpy = jest.spyOn(BaseGraphqlLauncher, 'create')

        BaseAppGraphqlLauncher.create(params)

        expect(createSpy)
          .toHaveBeenCalledWith(params)
      })
    })
  })
})

describe('BaseAppGraphqlLauncher', () => {
  describe('.get:graphqlConfig', () => {
    test('to be fixed value', () => {
      const expected = {
        ENDPOINT_URL: 'http://localhost:3900/graphql-customer',
        WEBSOCKET_URL: 'ws://localhost:3900/graphql-customer',
      }

      const actual = BaseAppGraphqlLauncher.graphqlConfig

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseAppGraphqlLauncher', () => {
  describe('#get:Ctor', () => {
    describe('to be BaseAppGraphqlLauncher', () => {
      const cases = [
        {
          params: {
            config: {
              ENDPOINT_URL: 'http://example.com/graphql-customer',
            },
          },
        },
        {
          params: {
            config: {
              ENDPOINT_URL: 'http://example.com/graphql-admin',
            },
          },
        },
      ]

      test.each(cases)('config: $params.config', ({ params }) => {
        /** @type {BaseAppGraphqlLauncher} */
        const launcher = BaseAppGraphqlLauncher.create(params)

        const actual = launcher.Ctor

        expect(actual)
          .toBe(BaseAppGraphqlLauncher) // same reference
        expect(actual)
          .not
          .toBe(BaseGraphqlLauncher) // not same reference
      })
    })
  })
})
