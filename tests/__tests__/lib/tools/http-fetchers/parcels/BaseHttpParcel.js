import BaseHttpParcel from '../../../../../../lib/tools/http-fetchers/parcels/BaseHttpParcel.js'

import ResponseTextConverter from '../../../../../../lib/tools/http-fetchers/tools/ResponseTextConverter.js'

import { HTTP_FETCHER_ERROR } from '../../../../../../lib/tools/http-fetchers/tools/constants/HTTP_FETCHER_ERROR.js'

describe('BaseHttpParcel', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#request', () => {
        const alphaRequest = new Request('https://example.com/resource-0001')
        const betaRequest = new Request('https://example.com/resource-0002')

        const cases = [
          {
            input: {
              request: alphaRequest,
            },
            expected: alphaRequest,
          },
          {
            input: {
              request: betaRequest,
            },
            expected: betaRequest,
          },
        ]

        test.each(cases)('request: $input.request.url', ({ input, expected }) => {
          const args = {
            request: input.request,
            config: {}, // Neutral value
            response: new Response(''), // Neutral value
            fetcherError: null, // Neutral value
          }

          const parcel = new BaseHttpParcel(args)

          expect(parcel)
            .toHaveProperty('request', expected)
        })
      })

      describe('#config', () => {
        const cases = [
          {
            input: {
              config: {
                timeoutMilliseconds: 1000,
              },
            },
            expected: {
              timeoutMilliseconds: 1000,
            },
          },
          {
            input: {
              config: {
                timeoutMilliseconds: 0,
              },
            },
            expected: {
              timeoutMilliseconds: 0,
            },
          },
        ]

        test.each(cases)('timeoutMilliseconds: $input.config.timeoutMilliseconds', ({ input, expected }) => {
          const args = {
            request: new Request('https://example.com/neutral'), // Neutral value
            config: input.config,
            response: new Response(''), // Neutral value
          }

          const parcel = new BaseHttpParcel(args)

          expect(parcel)
            .toHaveProperty('config', expected)
        })
      })

      describe('#fetcherError', () => {
        const alphaCategory = Symbol('alpha')

        const cases = [
          {
            input: {
              fetcherError: alphaCategory,
            },
            expected: alphaCategory,
          },
          {
            input: {
              fetcherError: null,
            },
            expected: null,
          },
        ]

        test.each(cases)('fetcherError: $input.fetcherError', ({ input, expected }) => {
          const args = {
            request: new Request('https://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
            response: null, // Neutral value
            fetcherError: input.fetcherError,
          }

          const parcel = new BaseHttpParcel(args)

          expect(parcel)
            .toHaveProperty('fetcherError', expected)
        })
      })

      describe('#responseUrl', () => {
        const cases = [
          {
            input: {
              responseUrl: 'https://example.com/resource-0001',
            },
            expected: 'https://example.com/resource-0001',
          },
          {
            input: {
              responseUrl: null,
            },
            expected: null,
          },
        ]

        test.each(cases)('responseUrl: $input.responseUrl', ({ input, expected }) => {
          const args = {
            request: new Request('https://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
            response: null, // Neutral value
            responseUrl: input.responseUrl,
            fetcherError: null, // Neutral value
          }

          const parcel = new BaseHttpParcel(args)

          expect(parcel)
            .toHaveProperty('responseUrl', expected)
        })
      })

      describe('#response', () => {
        const alphaResponse = new Response('text-0001', {
          status: 200,
        })
        const betaResponse = new Response('text-0002', {
          status: 404,
        })

        const cases = [
          {
            input: {
              response: alphaResponse,
            },
            expected: alphaResponse,
          },
          {
            input: {
              response: betaResponse,
            },
            expected: betaResponse,
          },
        ]

        test.each(cases)('status: $input.response.status', ({ input, expected }) => {
          const args = {
            request: new Request('https://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
            response: input.response,
          }

          const parcel = new BaseHttpParcel(args)

          expect(parcel)
            .toHaveProperty('response', expected)
        })
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('.create()', () => {
    const cases = [
      {
        tally: {
          request: new Request('https://example.com/resource-0001'),
          config: {
            timeoutMilliseconds: 1000,
          },
          response: new Response('text-0001'),
          responseUrl: 'https://example.com/resource-0001',
          fetcherError: null,
        },
      },
      {
        tally: {
          request: new Request('https://example.com/resource-0002'),
          config: {
            timeoutMilliseconds: 0,
          },
          response: null,
          responseUrl: null,
          fetcherError: Symbol('network'),
        },
      },
    ]

    describe('should be an instance of own class', () => {
      test.each(cases)('url: $tally.request.url', ({ tally }) => {
        const parcel = BaseHttpParcel.create(tally)

        expect(parcel)
          .toBeInstanceOf(BaseHttpParcel)
      })
    })

    describe('should call constructor', () => {
      test.each(cases)('url: $tally.request.url', ({ tally }) => {
        const SpyClass = constructorSpy.spyOn(BaseHttpParcel)

        SpyClass.create(tally)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(tally)
      })
    })

    describe('should fill default value', () => {
      const request = new Request('https://example.com/neutral')
      const config = {}
      const alphaResponse = new Response('text-0001')
      const betaResponse = new Response('text-0002')
      const alphaCategory = Symbol('alpha')
      const betaCategory = Symbol('beta')

      const omittedCases = [
        {
          input: {
            request,
            config,
            response: alphaResponse,
            responseUrl: 'https://example.com/resource-0001',
            // fetcherError: omitted -> default null
          },
          expected: {
            request,
            config,
            response: alphaResponse,
            responseUrl: 'https://example.com/resource-0001',
            fetcherError: null,
          },
        },
        {
          input: {
            request,
            config,
            response: betaResponse,
            // responseUrl: omitted -> default null
            fetcherError: alphaCategory,
          },
          expected: {
            request,
            config,
            response: betaResponse,
            responseUrl: null,
            fetcherError: alphaCategory,
          },
        },
        {
          input: {
            request,
            config,
            // response: omitted -> default null
            responseUrl: 'https://example.com/resource-0002',
            fetcherError: betaCategory,
          },
          expected: {
            request,
            config,
            response: null,
            responseUrl: 'https://example.com/resource-0002',
            fetcherError: betaCategory,
          },
        },
        {
          input: {
            request,
            config,
            response: alphaResponse,
            // responseUrl: omitted -> default null
            // fetcherError: omitted -> default null
          },
          expected: {
            request,
            config,
            response: alphaResponse,
            responseUrl: null,
            fetcherError: null,
          },
        },
        {
          input: {
            request,
            config,
            // response: omitted -> default null
            responseUrl: 'https://example.com/resource-0003',
            // fetcherError: omitted -> default null
          },
          expected: {
            request,
            config,
            response: null,
            responseUrl: 'https://example.com/resource-0003',
            fetcherError: null,
          },
        },
        {
          input: {
            request,
            config,
            // response: omitted -> default null
            // responseUrl: omitted -> default null
            fetcherError: alphaCategory,
          },
          expected: {
            request,
            config,
            response: null,
            responseUrl: null,
            fetcherError: alphaCategory,
          },
        },
        {
          input: {
            request,
            config,
            // response: omitted -> default null
            // responseUrl: omitted -> default null
            // fetcherError: omitted -> default null
          },
          expected: {
            request,
            config,
            response: null,
            responseUrl: null,
            fetcherError: null,
          },
        },
      ]

      test.each(omittedCases)('response: $expected.response, responseUrl: $expected.responseUrl, fetcherError: $expected.fetcherError', ({ input, expected }) => {
        const SpyClass = constructorSpy.spyOn(BaseHttpParcel)

        SpyClass.create(input)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('.createAsError()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            fetcherError: Symbol('alpha'),
          },
        },
      ]

      test.each(cases)('url: $input.request.url', ({ input }) => {
        const received = BaseHttpParcel.createAsError(input)

        expect(received)
          .toBeInstanceOf(BaseHttpParcel)
      })
    })

    describe('should carry the request, the config and no response', () => {
      const alphaRequest = new Request('https://example.com/resource-0001')
      const betaRequest = new Request('https://example.com/resource-0002')

      const cases = [
        {
          input: {
            request: alphaRequest,
            config: {
              timeoutMilliseconds: 1000,
            },
          },
          expected: {
            request: alphaRequest,
            config: {
              timeoutMilliseconds: 1000,
            },
          },
        },
        {
          input: {
            request: betaRequest,
            config: {
              timeoutMilliseconds: 0,
            },
            fetcherError: Symbol('alpha'),
          },
          expected: {
            request: betaRequest,
            config: {
              timeoutMilliseconds: 0,
            },
          },
        },
      ]

      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const parcel = BaseHttpParcel.createAsError(input)

        expect(parcel)
          .toHaveProperty('request', expected.request)
        expect(parcel)
          .toHaveProperty('config', expected.config)
        expect(parcel)
          .toHaveProperty('response', null)
        expect(parcel)
          .toHaveProperty('responseUrl', null)
      })
    })

    describe('should carry the category that is given', () => {
      const alphaCategory = Symbol('alpha')
      const betaCategory = Symbol('beta')

      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            fetcherError: alphaCategory,
          },
          expected: alphaCategory,
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            fetcherError: betaCategory,
          },
          expected: betaCategory,
        },
      ]

      test.each(cases)('fetcherError: $input.fetcherError', ({ input, expected }) => {
        const parcel = BaseHttpParcel.createAsError(input)

        expect(parcel)
          .toHaveProperty('fetcherError', expected)
      })
    })

    describe('should carry the unknown category when no category is given', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
        },
      ]

      test.each(cases)('url: $input.request.url', ({ input }) => {
        const parcel = BaseHttpParcel.createAsError(input)

        expect(parcel)
          .toHaveProperty('fetcherError', HTTP_FETCHER_ERROR.UNKNOWN)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('.createAsNetworkError()', () => {
    const cases = [
      {
        input: {
          request: new Request('https://example.com/resource-0001'),
          config: {
            timeoutMilliseconds: 1000,
          },
        },
      },
      {
        input: {
          request: new Request('https://example.com/resource-0002'),
          config: {
            timeoutMilliseconds: 0,
          },
        },
      },
    ]

    describe('should be an instance of own class', () => {
      test.each(cases)('url: $input.request.url', ({ input }) => {
        const received = BaseHttpParcel.createAsNetworkError(input)

        expect(received)
          .toBeInstanceOf(BaseHttpParcel)
      })
    })

    describe('should create the parcel of an error with the category', () => {
      test.each(cases)('url: $input.request.url', ({ input }) => {
        const createAsErrorSpy = jest.spyOn(BaseHttpParcel, 'createAsError')

        BaseHttpParcel.createAsNetworkError(input)

        expect(createAsErrorSpy)
          .toHaveBeenCalledWith({
            request: input.request,
            config: input.config,
            fetcherError: HTTP_FETCHER_ERROR.NETWORK,
          })
      })
    })

    describe('should carry the category', () => {
      test.each(cases)('url: $input.request.url', ({ input }) => {
        const parcel = BaseHttpParcel.createAsNetworkError(input)

        expect(parcel)
          .toHaveProperty('fetcherError', HTTP_FETCHER_ERROR.NETWORK)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('.createAsTimeoutError()', () => {
    const cases = [
      {
        input: {
          request: new Request('https://example.com/resource-0001'),
          config: {
            timeoutMilliseconds: 1000,
          },
        },
      },
      {
        input: {
          request: new Request('https://example.com/resource-0002'),
          config: {
            timeoutMilliseconds: 0,
          },
        },
      },
    ]

    describe('should be an instance of own class', () => {
      test.each(cases)('url: $input.request.url', ({ input }) => {
        const received = BaseHttpParcel.createAsTimeoutError(input)

        expect(received)
          .toBeInstanceOf(BaseHttpParcel)
      })
    })

    describe('should create the parcel of an error with the category', () => {
      test.each(cases)('url: $input.request.url', ({ input }) => {
        const createAsErrorSpy = jest.spyOn(BaseHttpParcel, 'createAsError')

        BaseHttpParcel.createAsTimeoutError(input)

        expect(createAsErrorSpy)
          .toHaveBeenCalledWith({
            request: input.request,
            config: input.config,
            fetcherError: HTTP_FETCHER_ERROR.TIMEOUT,
          })
      })
    })

    describe('should carry the category', () => {
      test.each(cases)('url: $input.request.url', ({ input }) => {
        const parcel = BaseHttpParcel.createAsTimeoutError(input)

        expect(parcel)
          .toHaveProperty('fetcherError', HTTP_FETCHER_ERROR.TIMEOUT)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('.createAsAbortError()', () => {
    const cases = [
      {
        input: {
          request: new Request('https://example.com/resource-0001'),
          config: {
            timeoutMilliseconds: 1000,
          },
        },
      },
      {
        input: {
          request: new Request('https://example.com/resource-0002'),
          config: {
            timeoutMilliseconds: 0,
          },
        },
      },
    ]

    describe('should be an instance of own class', () => {
      test.each(cases)('url: $input.request.url', ({ input }) => {
        const received = BaseHttpParcel.createAsAbortError(input)

        expect(received)
          .toBeInstanceOf(BaseHttpParcel)
      })
    })

    describe('should create the parcel of an error with the category', () => {
      test.each(cases)('url: $input.request.url', ({ input }) => {
        const createAsErrorSpy = jest.spyOn(BaseHttpParcel, 'createAsError')

        BaseHttpParcel.createAsAbortError(input)

        expect(createAsErrorSpy)
          .toHaveBeenCalledWith({
            request: input.request,
            config: input.config,
            fetcherError: HTTP_FETCHER_ERROR.ABORT,
          })
      })
    })

    describe('should carry the category', () => {
      test.each(cases)('url: $input.request.url', ({ input }) => {
        const parcel = BaseHttpParcel.createAsAbortError(input)

        expect(parcel)
          .toHaveProperty('fetcherError', HTTP_FETCHER_ERROR.ABORT)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('.get:HTTP_FETCHER_ERROR', () => {
    describe('when called as is', () => {
      test('should be HTTP_FETCHER_ERROR', () => {
        const received = BaseHttpParcel.HTTP_FETCHER_ERROR

        expect(received)
          .toBe(HTTP_FETCHER_ERROR) // same reference
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('.get:ResponseTextConverterCtor', () => {
    describe('when called as is', () => {
      test('should be ResponseTextConverter', () => {
        const received = BaseHttpParcel.ResponseTextConverterCtor

        expect(received)
          .toBe(ResponseTextConverter) // same reference
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('.createResponseTextConverter()', () => {
    const alphaParcel = BaseHttpParcel.create({
      request: new Request('https://example.com/resource-0001'),
      config: {},
    })
    const betaParcel = BaseHttpParcel.create({
      request: new Request('https://example.com/resource-0002'),
      config: {},
    })

    const cases = [
      {
        input: {
          responseParcel: alphaParcel,
        },
      },
      {
        input: {
          responseParcel: betaParcel,
        },
      },
    ]

    describe('should be an instance of the converter class', () => {
      test.each(cases)('url: $input.responseParcel.request.url', ({ input }) => {
        const received = BaseHttpParcel.createResponseTextConverter(input)

        expect(received)
          .toBeInstanceOf(ResponseTextConverter)
      })
    })

    describe('should call the factory method of the converter class with the parcel', () => {
      test.each(cases)('url: $input.responseParcel.request.url', ({ input }) => {
        const createSpy = jest.spyOn(ResponseTextConverter, 'create')

        BaseHttpParcel.createResponseTextConverter(input)

        expect(createSpy)
          .toHaveBeenCalledWith({
            responseParcel: input.responseParcel,
          })
      })
    })

    describe('should use the converter class that a subclass overrides', () => {
      class AlphaConverter extends ResponseTextConverter {}

      class AlphaHttpParcel extends BaseHttpParcel {
        /** @override */
        static get ResponseTextConverterCtor () {
          return AlphaConverter
        }
      }

      test.each(cases)('url: $input.responseParcel.request.url', ({ input }) => {
        const received = AlphaHttpParcel.createResponseTextConverter(input)

        expect(received)
          .toBeInstanceOf(AlphaConverter)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#get:Ctor', () => {
    class AlphaHttpParcel extends BaseHttpParcel {}

    class BetaHttpParcel extends BaseHttpParcel {}

    describe('should be constructor of instance', () => {
      const cases = [
        {
          input: {
            Parcel: BaseHttpParcel,
          },
          expected: BaseHttpParcel,
        },
        {
          input: {
            Parcel: AlphaHttpParcel,
          },
          expected: AlphaHttpParcel,
        },
        {
          input: {
            Parcel: BetaHttpParcel,
          },
          expected: BetaHttpParcel,
        },
      ]

      test.each(cases)('Parcel: $input.Parcel.name', ({ input, expected }) => {
        const parcel = input.Parcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: new Response(''), // Neutral value
        })

        const received = parcel.Ctor

        expect(received)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#get:requestUrl', () => {
    describe('should be the URL of the request', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
          },
          expected: 'https://example.com/resource-0001',
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002?page=2'),
          },
          expected: 'https://example.com/resource-0002?page=2',
        },
      ]

      test.each(cases)('request: $input.request.url', ({ input, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: input.request,
          config: {}, // Neutral value
          response: new Response(''), // Neutral value
        })

        const received = parcel.requestUrl

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#get:status', () => {
    describe('should be null when the response was not received', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.status

        expect(received)
          .toBeNull()
      })
    })

    describe('should be the status code of the response', () => {
      const cases = [
        {
          input: {
            response: new Response('', {
              status: 200,
            }),
          },
          expected: 200,
        },
        {
          input: {
            response: new Response('', {
              status: 404,
            }),
          },
          expected: 404,
        },
        {
          input: {
            response: new Response('', {
              status: 500,
            }),
          },
          expected: 500,
        },
      ]

      test.each(cases)('response status: $input.response.status', ({ input, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = parcel.status

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#get:statusText', () => {
    describe('should be null when the response was not received', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.statusText

        expect(received)
          .toBeNull()
      })
    })

    describe('should be the status text of the response', () => {
      const cases = [
        {
          input: {
            response: new Response('', {
              status: 200,
              statusText: 'OK',
            }),
          },
          expected: 'OK',
        },
        {
          input: {
            response: new Response('', {
              status: 404,
              statusText: 'Not Found',
            }),
          },
          expected: 'Not Found',
        },
      ]

      test.each(cases)('response statusText: $input.response.statusText', ({ input, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = parcel.statusText

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#get:ok', () => {
    describe('should be false when the response was not received', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.ok

        expect(received)
          .toBe(false)
      })
    })

    describe('should be true when the status code is in the range of 200 to 299', () => {
      const cases = [
        {
          input: {
            response: new Response('', {
              status: 200,
            }),
          },
        },
        {
          input: {
            response: new Response('', {
              status: 204,
            }),
          },
        },
      ]

      test.each(cases)('response status: $input.response.status', ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = parcel.ok

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false when the status code is out of the range of 200 to 299', () => {
      const cases = [
        {
          input: {
            response: new Response('', {
              status: 404,
            }),
          },
        },
        {
          input: {
            response: new Response('', {
              status: 500,
            }),
          },
        },
      ]

      test.each(cases)('response status: $input.response.status', ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = parcel.ok

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#hasError()', () => {
    describe('should be true when the parcel carries the category of an error', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.hasError()

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false when the parcel carries no category of an error', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.create({
              request: new Request('https://example.com/resource-0003'),
              config: {},
              response: new Response('text-0003'),
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.create({
              request: new Request('https://example.com/resource-0004'),
              config: {},
              response: new Response('text-0004'),
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.hasError()

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#hasNetworkError()', () => {
    describe('should be true when the category of the error matches', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.hasNetworkError()

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false when the category of the error does not match or the parcel carries no category', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0003'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsAbortError({
              request: new Request('https://example.com/resource-0004'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsError({
              request: new Request('https://example.com/resource-0005'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.create({
              request: new Request('https://example.com/resource-0009'),
              config: {},
              response: new Response('text-0009'),
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.hasNetworkError()

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#hasTimeoutError()', () => {
    describe('should be true when the category of the error matches', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.hasTimeoutError()

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false when the category of the error does not match or the parcel carries no category', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0003'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsAbortError({
              request: new Request('https://example.com/resource-0004'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsError({
              request: new Request('https://example.com/resource-0005'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.create({
              request: new Request('https://example.com/resource-0009'),
              config: {},
              response: new Response('text-0009'),
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.hasTimeoutError()

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#hasAbortError()', () => {
    describe('should be true when the category of the error matches', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsAbortError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsAbortError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.hasAbortError()

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false when the category of the error does not match or the parcel carries no category', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0003'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0004'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsError({
              request: new Request('https://example.com/resource-0005'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.create({
              request: new Request('https://example.com/resource-0009'),
              config: {},
              response: new Response('text-0009'),
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.hasAbortError()

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#hasUnknownError()', () => {
    describe('should be true when the category of the error matches', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.hasUnknownError()

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false when the category of the error does not match or the parcel carries no category', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0003'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0004'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsAbortError({
              request: new Request('https://example.com/resource-0005'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.create({
              request: new Request('https://example.com/resource-0009'),
              config: {},
              response: new Response('text-0009'),
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.hasUnknownError()

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#toJson()', () => {
    describe('should be null when the response was not received', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', async ({ input }) => {
        const received = await input.parcel.toJson()

        expect(received)
          .toBeNull()
      })
    })

    describe('should parse the text that #toText() resolved', () => {
      const cases = [
        {
          override: {
            text: '{"id":100001}',
          },
          expected: {
            id: 100001,
          },
        },
        {
          override: {
            text: '{"id":100002}',
          },
          expected: {
            id: 100002,
          },
        },
      ]

      test.each(cases)('text: $override.text', async ({ override, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: new Response('{}'), // Neutral value
        })
        const toTextSpy = jest.spyOn(parcel, 'toText')
          .mockResolvedValue(override.text)

        const received = await parcel.toJson()

        expect(toTextSpy)
          .toHaveBeenCalledWith()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be null where the body is not JSON', () => {
      const cases = [
        {
          input: {
            response: new Response('{"id":10001}}'),
          },
        },
        {
          input: {
            response: new Response(''),
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = await parcel.toJson()

        expect(received)
          .toBeNull()
      })
    })

    describe('should decode the body with the charset of the response', () => {
      const cases = [
        {
          input: {
            response: new Response(
              Uint8Array.from([0x7B, 0x22, 0x69, 0x64, 0x22, 0x3A, 0x22, 0x82, 0xB1, 0x82, 0xF1, 0x22, 0x7D]), // {"id":"こん"} in Shift_JIS
              {
                headers: {
                  'Content-Type': 'application/json; charset=Shift_JIS',
                },
              }
            ),
          },
          expected: {
            id: 'こん',
          },
        },
        {
          input: {
            response: new Response(
              Uint8Array.from([0x7B, 0x22, 0x69, 0x64, 0x22, 0x3A, 0x22, 0xE3, 0x81, 0x93, 0x22, 0x7D]), // {"id":"こ"} in UTF-8
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            ),
          },
          expected: {
            id: 'こ',
          },
        },
      ]

      test.each(cases)('content-type: $input.response.headers', async ({ input, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = await parcel.toJson()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be parsed content', () => {
      const cases = [
        {
          input: {
            response: new Response('{"id":10001}'),
          },
          expected: {
            id: 10001,
          },
        },
        {
          input: {
            response: new Response('{"id":10002}'),
          },
          expected: {
            id: 10002,
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = await parcel.toJson()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be readable again', () => {
      const cases = [
        {
          input: {
            response: new Response('{"id":10001}'),
          },
          expected: {
            id: 10001,
          },
        },
        {
          input: {
            response: new Response('{"id":10002}'),
          },
          expected: {
            id: 10002,
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        await parcel.toJson()

        const received = await parcel.toJson()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should leave the response unread', () => {
      const cases = [
        {
          input: {
            response: new Response('{"id":10001}'),
          },
        },
        {
          input: {
            response: new Response('{"id":10002}'),
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        await parcel.toJson()

        const received = input.response.bodyUsed

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#cloneResponse()', () => {
    describe('should be null when the response was not received', () => {
      const notReceivedCases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(notReceivedCases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.cloneResponse()

        expect(received)
          .toBeNull()
      })
    })

    const cases = [
      {
        input: {
          response: new Response('text-0001'),
        },
        expected: 'text-0001',
      },
      {
        input: {
          response: new Response('text-0002'),
        },
        expected: 'text-0002',
      },
    ]

    describe('should be an instance of Response', () => {
      test.each(cases)('response: $input.response', ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = parcel.cloneResponse()

        expect(received)
          .toBeInstanceOf(Response)
      })
    })

    describe('should not be the response of the parcel itself', () => {
      test.each(cases)('response: $input.response', ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = parcel.cloneResponse()

        expect(received)
          .not
          .toBe(input.response)
      })
    })

    describe('should carry the body of the response', () => {
      test.each(cases)('response: $input.response', async ({ input, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const clonedResponse = parcel.cloneResponse()
        const received = await clonedResponse.text()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should leave the response of the parcel unread', () => {
      test.each(cases)('response: $input.response', async ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const clonedResponse = parcel.cloneResponse()

        await clonedResponse.text()

        const received = input.response.bodyUsed

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#toText()', () => {
    describe('should be null when the response was not received', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', async ({ input }) => {
        const received = await input.parcel.toText()

        expect(received)
          .toBeNull()
      })
    })

    describe('should read the clone of the response', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
        },
        {
          input: {
            response: new Response('text-0002'),
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })
        const cloneResponseSpy = jest.spyOn(parcel, 'cloneResponse')

        await parcel.toText()

        expect(cloneResponseSpy)
          .toHaveBeenCalledWith()
      })
    })

    describe('should convert through the converter that is created with the parcel itself', () => {
      const cases = [
        {
          override: {
            text: 'text-0001',
          },
          input: {
            response: new Response('neutral-0001'), // Neutral value
          },
        },
        {
          override: {
            text: 'text-0002',
          },
          input: {
            response: new Response('neutral-0002'), // Neutral value
          },
        },
      ]

      test.each(cases)('text: $override.text', async ({ override, input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })
        const converter = ResponseTextConverter.create({
          responseParcel: parcel,
        })
        const createSpy = jest.spyOn(BaseHttpParcel, 'createResponseTextConverter')
          .mockReturnValue(converter)
        jest.spyOn(converter, 'toText')
          .mockResolvedValue(override.text)

        const received = await parcel.toText()

        expect(createSpy)
          .toHaveBeenCalledWith({
            responseParcel: parcel,
          })

        expect(received)
          .toBe(override.text)
      })
    })

    describe('should decode the body with the charset of the response', () => {
      const cases = [
        {
          input: {
            response: new Response(
              Uint8Array.from([0x82, 0xB1, 0x82, 0xF1, 0x82, 0xC9, 0x82, 0xBF, 0x82, 0xCD]), // こんにちは in Shift_JIS
              {
                headers: {
                  'Content-Type': 'text/plain; charset=Shift_JIS',
                },
              }
            ),
          },
          expected: 'こんにちは',
        },
        {
          input: {
            response: new Response(
              Uint8Array.from([0xE3, 0x81, 0x93, 0xE3, 0x82, 0x93]), // こん in UTF-8
              {
                headers: {
                  'Content-Type': 'text/plain; charset="utf-8"',
                },
              }
            ),
          },
          expected: 'こん',
        },
      ]

      test.each(cases)('content-type: $input.response.headers', async ({ input, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = await parcel.toText()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be the text of the body', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
          expected: 'text-0001',
        },
        {
          input: {
            response: new Response('text-0002'),
          },
          expected: 'text-0002',
        },
      ]

      test.each(cases)('response: $input.response', async ({ input, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = await parcel.toText()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be readable again', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
          expected: 'text-0001',
        },
        {
          input: {
            response: new Response('text-0002'),
          },
          expected: 'text-0002',
        },
      ]

      test.each(cases)('response: $input.response', async ({ input, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        await parcel.toText()

        const received = await parcel.toText()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should leave the response unread', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
        },
        {
          input: {
            response: new Response('text-0002'),
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        await parcel.toText()

        const received = input.response.bodyUsed

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#toArrayBuffer()', () => {
    describe('should be null when the response was not received', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', async ({ input }) => {
        const received = await input.parcel.toArrayBuffer()

        expect(received)
          .toBeNull()
      })
    })

    describe('should read the clone of the response', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
        },
        {
          input: {
            response: new Response('text-0002'),
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })
        const cloneResponseSpy = jest.spyOn(parcel, 'cloneResponse')

        await parcel.toArrayBuffer()

        expect(cloneResponseSpy)
          .toHaveBeenCalledWith()
      })
    })

    describe('should be an array buffer', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
        },
        {
          input: {
            response: new Response('text-0002'),
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = await parcel.toArrayBuffer()

        expect(received)
          .toBeInstanceOf(ArrayBuffer)
      })
    })

    describe('should be the bytes of the body', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
          expected: 'text-0001',
        },
        {
          input: {
            response: new Response('text-0002'),
          },
          expected: 'text-0002',
        },
      ]

      test.each(cases)('response: $input.response', async ({ input, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const arrayBuffer = await parcel.toArrayBuffer()
        const response = new Response(arrayBuffer)
        const received = await response.text()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should leave the response unread', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
        },
        {
          input: {
            response: new Response('text-0002'),
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        await parcel.toArrayBuffer()

        const received = input.response.bodyUsed

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#toBlob()', () => {
    describe('should be null when the response was not received', () => {
      const cases = [
        {
          input: {
            parcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', async ({ input }) => {
        const received = await input.parcel.toBlob()

        expect(received)
          .toBeNull()
      })
    })

    describe('should read the clone of the response', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
        },
        {
          input: {
            response: new Response('text-0002'),
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })
        const cloneResponseSpy = jest.spyOn(parcel, 'cloneResponse')

        await parcel.toBlob()

        expect(cloneResponseSpy)
          .toHaveBeenCalledWith()
      })
    })

    describe('should be a blob', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
        },
        {
          input: {
            response: new Response('text-0002'),
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = await parcel.toBlob()

        expect(received)
          .toBeInstanceOf(Blob)
      })
    })

    describe('should be the bytes of the body', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
          expected: 'text-0001',
        },
        {
          input: {
            response: new Response('text-0002'),
          },
          expected: 'text-0002',
        },
      ]

      test.each(cases)('response: $input.response', async ({ input, expected }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const blob = await parcel.toBlob()
        const response = new Response(blob)
        const received = await response.text()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should leave the response unread', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
        },
        {
          input: {
            response: new Response('text-0002'),
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input }) => {
        const parcel = BaseHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        await parcel.toBlob()

        const received = input.response.bodyUsed

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#isRedirected()', () => {
    describe('when not inherited', () => {
      class AlphaHttpParcel extends BaseHttpParcel {}

      class BetaHttpParcel extends BaseHttpParcel {}

      const cases = [
        {
          input: {
            Parcel: BaseHttpParcel,
          },
          expected: 'BaseHttpParcel#isRedirected() must be inherited',
        },
        {
          input: {
            Parcel: AlphaHttpParcel,
          },
          expected: 'AlphaHttpParcel#isRedirected() must be inherited',
        },
        {
          input: {
            Parcel: BetaHttpParcel,
          },
          expected: 'BetaHttpParcel#isRedirected() must be inherited',
        },
      ]

      test.each(cases)('Parcel: $input.Parcel.name', ({ input, expected }) => {
        const parcel = input.Parcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: new Response(''), // Neutral value
        })

        expect(() => parcel.isRedirected())
          .toThrow(expected)
      })
    })
  })
})

describe('BaseHttpParcel', () => {
  describe('#extractResponseType()', () => {
    describe('when not inherited', () => {
      class AlphaHttpParcel extends BaseHttpParcel {}

      class BetaHttpParcel extends BaseHttpParcel {}

      const cases = [
        {
          input: {
            Parcel: BaseHttpParcel,
          },
          expected: 'BaseHttpParcel#extractResponseType() must be inherited',
        },
        {
          input: {
            Parcel: AlphaHttpParcel,
          },
          expected: 'AlphaHttpParcel#extractResponseType() must be inherited',
        },
        {
          input: {
            Parcel: BetaHttpParcel,
          },
          expected: 'BetaHttpParcel#extractResponseType() must be inherited',
        },
      ]

      test.each(cases)('Parcel: $input.Parcel.name', ({ input, expected }) => {
        const parcel = input.Parcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: new Response(''), // Neutral value
        })

        expect(() => parcel.extractResponseType())
          .toThrow(expected)
      })
    })
  })
})
