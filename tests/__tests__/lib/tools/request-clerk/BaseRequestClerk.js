import BaseRequestClerk from '~/lib/tools/request-clerk/BaseRequestClerk.js'

describe('BaseRequestClerk', () => {
  describe('constructor', () => {
    describe('should keep properties', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/alpha'),
            config: {
              timeout: 3000,
              responseType: 'blob',
              withCredentials: true,
            },
            sink: {
              onUploadProgress: () => {},
            },
          },
        },
        {
          input: {
            request: new Request('https://example.com/beta', {
              method: 'POST',
              body: '{}',
            }),
            config: {
              timeout: 0,
              responseType: '',
              withCredentials: false,
            },
            sink: {},
          },
        },
      ]

      describe('#request', () => {
        test.each(cases)('url: $input.request.url', ({ input }) => {
          const clerk = new BaseRequestClerk(input)

          expect(clerk)
            .toHaveProperty('request', input.request) // same reference
        })
      })

      describe('#config', () => {
        test.each(cases)('config: $input.config', ({ input }) => {
          const clerk = new BaseRequestClerk(input)

          expect(clerk)
            .toHaveProperty('config', input.config) // same reference
        })
      })

      describe('#sink', () => {
        test.each(cases)('url: $input.request.url', ({ input }) => {
          const clerk = new BaseRequestClerk(input)

          expect(clerk)
            .toHaveProperty('sink', input.sink) // same reference
        })
      })
    })
  })
})

describe('BaseRequestClerk', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      test('with a request only', () => {
        const clerk = BaseRequestClerk.create({
          request: new Request('https://example.com/alpha'),
        })

        expect(clerk)
          .toBeInstanceOf(BaseRequestClerk)
      })
    })

    describe('should call constructor', () => {
      const request = new Request('https://example.com/alpha')
      const credentialsRequest = new Request('https://example.com/beta', {
        credentials: 'include',
      })
      const sink = {
        onDownloadProgress: () => {},
      }

      const cases = [
        {
          params: {
            request,
          },
          expected: {
            request,
            config: {
              timeout: 0,
              responseType: '',
              withCredentials: false,
            },
            sink: {},
          },
        },
        {
          params: {
            request: credentialsRequest,
          },
          expected: {
            request: credentialsRequest,
            config: {
              timeout: 0,
              responseType: '',
              withCredentials: true,
            },
            sink: {},
          },
        },
        {
          params: {
            request,
            config: {
              timeout: 3000,
            },
          },
          expected: {
            request,
            config: {
              timeout: 3000,
              responseType: '',
              withCredentials: false,
            },
            sink: {},
          },
        },
        {
          params: {
            request: credentialsRequest,
            config: {
              responseType: 'blob',
              withCredentials: false,
            },
            sink,
          },
          expected: {
            request: credentialsRequest,
            config: {
              timeout: 0,
              responseType: 'blob',
              withCredentials: false,
            },
            sink,
          },
        },
      ]

      test.each(cases)('request: $params.request.url, config: $params.config', ({ params, expected }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(BaseRequestClerk)

        SpyClass.create(params)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should leave the given config untouched', () => {
      test('config: partial', () => {
        const config = {
          timeout: 3000,
        }

        BaseRequestClerk.create({
          request: new Request('https://example.com/alpha'),
          config,
        })

        expect(config)
          .toStrictEqual({
            timeout: 3000,
          })
      })
    })
  })
})

describe('BaseRequestClerk', () => {
  describe('.resolveWithCredentials()', () => {
    const cases = [
      {
        credentials: 'include',
        expected: true,
      },
      {
        credentials: 'same-origin',
        expected: false,
      },
      {
        credentials: 'omit',
        expected: false,
      },
    ]

    test.each(cases)('credentials: $credentials', ({ credentials, expected }) => {
      const actual = BaseRequestClerk.resolveWithCredentials({
        request: new Request('https://example.com/alpha', {
          credentials: /** @type {RequestCredentials} */ (credentials),
        }),
      })

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseRequestClerk', () => {
  describe('#buildResponse()', () => {
    describe('should reject with an error', () => {
      test('to be inherited in subclass', async () => {
        const clerk = BaseRequestClerk.create({
          request: new Request('https://example.com/alpha'),
        })

        await expect(clerk.buildResponse())
          .rejects
          .toThrow('BaseRequestClerk#buildResponse() must be inherited')
      })
    })
  })
})
