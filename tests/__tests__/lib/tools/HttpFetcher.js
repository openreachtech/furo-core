import HttpFetcher from '~/lib/tools/HttpFetcher.js'
import BaseRequestClerk from '~/lib/tools/request-clerk/BaseRequestClerk.js'
import FetchRequestClerk from '~/lib/tools/request-clerk/concretes/FetchRequestClerk.js'
import XMLHttpRequestClerk from '~/lib/tools/request-clerk/concretes/XMLHttpRequestClerk.js'

describe('HttpFetcher', () => {
  describe('constructor', () => {
    describe('should keep properties', () => {
      const cases = [
        {
          input: {
            RequestClerkCtor: FetchRequestClerk,
            config: {
              timeout: 3000,
            },
          },
        },
        {
          input: {
            RequestClerkCtor: XMLHttpRequestClerk,
            config: {},
          },
        },
      ]

      describe('#RequestClerkCtor', () => {
        test.each(cases)('RequestClerkCtor: $input.RequestClerkCtor.name', ({ input }) => {
          const fetcher = new HttpFetcher(input)

          expect(fetcher)
            .toHaveProperty('RequestClerkCtor', input.RequestClerkCtor)
        })
      })

      describe('#config', () => {
        test.each(cases)('config: $input.config', ({ input }) => {
          const fetcher = new HttpFetcher(input)

          expect(fetcher)
            .toHaveProperty('config', input.config) // same reference
        })
      })
    })
  })
})

describe('HttpFetcher', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      test('with no arguments', () => {
        const fetcher = HttpFetcher.create()

        expect(fetcher)
          .toBeInstanceOf(HttpFetcher)
      })
    })

    describe('should call constructor', () => {
      const config = {
        timeout: 15000,
      }

      const cases = [
        {
          params: undefined,
          expected: {
            RequestClerkCtor: XMLHttpRequestClerk,
            config: {},
          },
        },
        {
          params: {
            RequestClerkCtor: FetchRequestClerk,
          },
          expected: {
            RequestClerkCtor: FetchRequestClerk,
            config: {},
          },
        },
        {
          params: {
            RequestClerkCtor: FetchRequestClerk,
            config,
          },
          expected: {
            RequestClerkCtor: FetchRequestClerk,
            config,
          },
        },
        {
          params: {
            config,
          },
          expected: {
            RequestClerkCtor: XMLHttpRequestClerk,
            config,
          },
        },
      ]

      test.each(cases)('params: $params', ({ params, expected }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(HttpFetcher)

        SpyClass.create(params)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('HttpFetcher', () => {
  describe('#get:Ctor', () => {
    test('to be constructor of own class', () => {
      const fetcher = HttpFetcher.create()

      expect(fetcher.Ctor)
        .toBe(HttpFetcher)
    })
  })
})

describe('HttpFetcher', () => {
  describe('#fetchRequest()', () => {
    describe('should resolve to the response built by the clerk', () => {
      const cases = [
        {
          RequestClerkCtor: FetchRequestClerk,
        },
        {
          RequestClerkCtor: XMLHttpRequestClerk,
        },
      ]

      test.each(cases)('RequestClerkCtor: $RequestClerkCtor.name', async ({ RequestClerkCtor }) => {
        const response = new Response('{}')

        jest.spyOn(RequestClerkCtor, 'create')
          .mockReturnValue(
            /** @type {*} */ ({
              buildResponse: jest.fn()
                .mockResolvedValue(response),
            })
          )

        const fetcher = HttpFetcher.create({
          RequestClerkCtor,
        })

        const actual = await fetcher.fetchRequest({
          request: new Request('https://example.com/alpha'),
        })

        expect(actual)
          .toBe(response)
      })
    })

    describe('should create the clerk with request, config and sink', () => {
      const request = new Request('https://example.com/alpha')
      const config = {
        timeout: 3000,
        withCredentials: true,
      }
      const sink = {
        onUploadProgress: () => {},
      }

      const cases = [
        {
          params: {
            request,
            sink,
          },
          expected: {
            request,
            config,
            sink,
          },
        },
        {
          params: {
            request,
          },
          expected: {
            request,
            config,
            sink: undefined,
          },
        },
      ]

      test.each(cases)('sink: $params.sink', async ({ params, expected }) => {
        const createSpy = jest.spyOn(FetchRequestClerk, 'create')
          .mockReturnValue(
            /** @type {*} */ ({
              buildResponse: jest.fn()
                .mockResolvedValue(new Response('{}')),
            })
          )

        const fetcher = HttpFetcher.create({
          RequestClerkCtor: FetchRequestClerk,
          config,
        })

        await fetcher.fetchRequest(params)

        expect(createSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should build a response through the clerk of the given class', () => {
      test('with FetchRequestClerk', async () => {
        const response = new Response('{}')

        const fetchSpy = jest.spyOn(FetchRequestClerk, 'fetch')
          .mockResolvedValue(response)

        const fetcher = HttpFetcher.create({
          RequestClerkCtor: FetchRequestClerk,
          config: {
            timeout: 3000,
          },
        })

        const actual = await fetcher.fetchRequest({
          request: new Request('https://example.com/alpha'),
        })

        expect(actual)
          .toBe(response)
        expect(fetchSpy)
          .toHaveBeenCalledTimes(1)
      })
    })

    describe('should reject when the clerk rejects', () => {
      test('with the same error', async () => {
        const expected = new TypeError('Network request failed')

        jest.spyOn(BaseRequestClerk.prototype, 'buildResponse')
          .mockRejectedValue(expected)

        const fetcher = HttpFetcher.create({
          RequestClerkCtor: BaseRequestClerk,
        })

        await expect(fetcher.fetchRequest({
          request: new Request('https://example.com/alpha'),
        }))
          .rejects
          .toBe(expected)
      })
    })

    describe('should leave the config unchanged after a failure', () => {
      test('with the same reference and values', async () => {
        const config = {
          timeout: 3000,
        }

        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockRejectedValue(new TypeError('Network request failed'))

        const fetcher = HttpFetcher.create({
          RequestClerkCtor: FetchRequestClerk,
          config,
        })

        await expect(fetcher.fetchRequest({
          request: new Request('https://example.com/alpha'),
        }))
          .rejects
          .toThrow('Network request failed')

        expect(fetcher)
          .toHaveProperty('config', config)
        expect(config)
          .toStrictEqual({
            timeout: 3000,
          })
      })
    })
  })
})
