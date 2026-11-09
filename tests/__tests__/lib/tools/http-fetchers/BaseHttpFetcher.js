import BaseHttpFetcher from '../../../../../lib/tools/http-fetchers/BaseHttpFetcher.js'

import AbortTimer from '../../../../../lib/tools/http-fetchers/tools/AbortTimer.js'

import FetchHttpParcel from '../../../../../lib/tools/http-fetchers/parcels/concretes/FetchHttpParcel.js'
import XMLHttpParcel from '../../../../../lib/tools/http-fetchers/parcels/concretes/XMLHttpParcel.js'

import { HTTP_FETCHER_ERROR } from '../../../../../lib/tools/http-fetchers/tools/constants/HTTP_FETCHER_ERROR.js'

describe('BaseHttpFetcher', () => {
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
          }

          const fetcher = new BaseHttpFetcher(args)

          expect(fetcher)
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
          }

          const fetcher = new BaseHttpFetcher(args)

          expect(fetcher)
            .toHaveProperty('config', expected)
        })
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('.create()', () => {
    const cases = [
      {
        tally: {
          request: new Request('https://example.com/resource-0001'),
          config: {
            timeoutMilliseconds: 1000,
          },
        },
      },
      {
        tally: {
          request: new Request('https://example.com/resource-0002'),
          config: {
            timeoutMilliseconds: 0,
          },
        },
      },
    ]

    describe('should be an instance of own class', () => {
      test.each(cases)('url: $tally.request.url', ({ tally }) => {
        const fetcher = BaseHttpFetcher.create(tally)

        expect(fetcher)
          .toBeInstanceOf(BaseHttpFetcher)
      })
    })

    describe('should call constructor', () => {
      test.each(cases)('url: $tally.request.url', ({ tally }) => {
        const SpyClass = constructorSpy.spyOn(BaseHttpFetcher)

        SpyClass.create(tally)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(tally)
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('.get:AbortTimerCtor', () => {
    describe('when called as is', () => {
      test('should be AbortTimer', () => {
        const received = BaseHttpFetcher.AbortTimerCtor

        expect(received)
          .toBe(AbortTimer) // same reference
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('.get:HttpParcelCtor', () => {
    describe('when not inherited', () => {
      class AlphaHttpFetcher extends BaseHttpFetcher {}

      class BetaHttpFetcher extends BaseHttpFetcher {}

      const cases = [
        {
          input: {
            Fetcher: BaseHttpFetcher,
          },
          expected: 'BaseHttpFetcher.get:HttpParcelCtor must be inherited',
        },
        {
          input: {
            Fetcher: AlphaHttpFetcher,
          },
          expected: 'AlphaHttpFetcher.get:HttpParcelCtor must be inherited',
        },
        {
          input: {
            Fetcher: BetaHttpFetcher,
          },
          expected: 'BetaHttpFetcher.get:HttpParcelCtor must be inherited',
        },
      ]

      test.each(cases)('Fetcher: $input.Fetcher.name', ({ input, expected }) => {
        expect(() => input.Fetcher.HttpParcelCtor)
          .toThrow(expected)
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('.createHttpParcel()', () => {
    describe('should be an instance of the HTTP parcel class', () => {
      const cases = [
        {
          override: {
            HttpParcelCtor: FetchHttpParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {
              timeoutMilliseconds: 1000,
            },
            response: new Response('text-0001'),
            responseUrl: 'https://example.com/resource-0001',
          },
          expected: FetchHttpParcel,
        },
        {
          override: {
            HttpParcelCtor: XMLHttpParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {
              timeoutMilliseconds: 0,
            },
            response: new Response('text-0002'),
            responseUrl: 'https://example.com/resource-0002',
          },
          expected: XMLHttpParcel,
        },
      ]

      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input, expected }) => {
        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const received = BaseHttpFetcher.createHttpParcel(input)

        expect(received)
          .toBeInstanceOf(expected)
      })
    })

    describe('should call the factory method of the HTTP parcel class', () => {
      const cases = [
        {
          override: {
            HttpParcelCtor: FetchHttpParcel,
          },
          tally: {
            request: new Request('https://example.com/resource-0001'),
            config: {
              timeoutMilliseconds: 1000,
            },
            response: new Response('text-0001'),
            responseUrl: 'https://example.com/resource-0001',
          },
        },
        {
          override: {
            HttpParcelCtor: XMLHttpParcel,
          },
          tally: {
            request: new Request('https://example.com/resource-0002'),
            config: {
              timeoutMilliseconds: 0,
            },
            response: new Response('text-0002'),
            responseUrl: 'https://example.com/resource-0002',
          },
        },
      ]

      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, tally }) => {
        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const createSpy = jest.spyOn(override.HttpParcelCtor, 'create')

        BaseHttpFetcher.createHttpParcel(tally)

        expect(createSpy)
          .toHaveBeenCalledWith(tally)
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#get:Ctor', () => {
    class AlphaHttpFetcher extends BaseHttpFetcher {}

    class BetaHttpFetcher extends BaseHttpFetcher {}

    describe('should be constructor of instance', () => {
      const cases = [
        {
          input: {
            Fetcher: BaseHttpFetcher,
          },
          expected: BaseHttpFetcher,
        },
        {
          input: {
            Fetcher: AlphaHttpFetcher,
          },
          expected: AlphaHttpFetcher,
        },
        {
          input: {
            Fetcher: BetaHttpFetcher,
          },
          expected: BetaHttpFetcher,
        },
      ]

      test.each(cases)('Fetcher: $input.Fetcher.name', ({ input, expected }) => {
        const fetcher = input.Fetcher.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
        })

        const received = fetcher.Ctor

        expect(received)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#get:timeoutMilliseconds', () => {
    describe('should be the milliseconds of the config', () => {
      const cases = [
        {
          input: {
            config: {
              timeoutMilliseconds: 1000,
            },
          },
          expected: 1000,
        },
        {
          input: {
            config: {
              timeoutMilliseconds: 30000,
            },
          },
          expected: 30000,
        },
        {
          input: {
            config: {
              timeoutMilliseconds: 0,
            },
          },
          expected: 0,
        },
      ]

      test.each(cases)('timeoutMilliseconds: $input.config.timeoutMilliseconds', ({ input, expected }) => {
        const fetcher = BaseHttpFetcher.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: input.config,
        })

        const received = fetcher.timeoutMilliseconds

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be 0 when the config has no limit', () => {
      const cases = [
        {
          input: {
            config: {
              timeoutMilliseconds: 0,
            },
          },
        },
        {
          input: {
            config: {
              // timeoutMilliseconds: omitted
            },
          },
        },
      ]

      test.each(cases)('config: $input.config', ({ input }) => {
        const fetcher = BaseHttpFetcher.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: input.config,
        })

        const received = fetcher.timeoutMilliseconds

        expect(received)
          .toBe(0)
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#fetchResponse()', () => {
    const alphaSink = {
      onUploadProgress: () => {},
    }
    const betaSink = {
      onDownloadProgress: () => {},
    }
    const alphaSignal = new AbortController().signal
    const betaSignal = new AbortController().signal
    const alphaResponse = new Response('text-0001')
    const betaResponse = new Response('text-0002')
    const alphaParcel = FetchHttpParcel.createAsNetworkError({
      request: new Request('https://example.com/resource-0001'),
      config: {},
    })
    const betaParcel = FetchHttpParcel.createAsTimeoutError({
      request: new Request('https://example.com/resource-0002'),
      config: {},
    })

    /**
     * Create a timer of fake, which tells whether it was cleared.
     *
     * @param {{
     *   signal: AbortSignal
     * }} params - Parameters.
     * @returns {{ signal: AbortSignal, clear: jest.Mock }} Fake of the timer.
     */
    const createTimerFake = ({ signal }) => ({
      signal,
      clear: jest.fn(),
    })

    describe('should let the subclass receive the response with the sink and the signal of the timer', () => {
      const cases = [
        {
          override: {
            signal: alphaSignal,
            response: alphaResponse,
            parcel: alphaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            sink: alphaSink,
          },
          expected: {
            sink: alphaSink,
            signal: alphaSignal,
          },
        },
        {
          override: {
            signal: betaSignal,
            response: betaResponse,
            parcel: betaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            sink: betaSink,
          },
          expected: {
            sink: betaSink,
            signal: betaSignal,
          },
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        const createArgs = {
          request: input.request,
          config: input.config,
        }
        const fetchResponseArgs = {
          sink: input.sink,
        }

        const fetcher = BaseHttpFetcher.create(createArgs)

        jest.spyOn(fetcher, 'createAbortTimer')
          .mockReturnValue(createTimerFake({ signal: override.signal }))
        const receiveResponseSpy = jest.spyOn(fetcher, 'receiveResponse')
          .mockResolvedValue(override.response)
        jest.spyOn(fetcher, 'createHttpParcelByResponse')
          .mockReturnValue(override.parcel)

        await fetcher.fetchResponse(fetchResponseArgs)

        expect(receiveResponseSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should create the parcel of the response that the subclass received', () => {
      const cases = [
        {
          override: {
            response: alphaResponse,
            parcel: alphaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
          expected: {
            response: alphaResponse,
          },
        },
        {
          override: {
            response: betaResponse,
            parcel: betaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
          expected: {
            response: betaResponse,
          },
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        const fetchResponseArgs = {
          sink: {}, // Neutral value
        }

        const fetcher = BaseHttpFetcher.create(input)

        jest.spyOn(fetcher, 'receiveResponse')
          .mockResolvedValue(override.response)
        const createHttpParcelByResponseSpy = jest.spyOn(fetcher, 'createHttpParcelByResponse')
          .mockReturnValue(override.parcel)

        await fetcher.fetchResponse(fetchResponseArgs)

        expect(createHttpParcelByResponseSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should resolve the parcel that was created of the response', () => {
      const cases = [
        {
          override: {
            response: alphaResponse,
            parcel: alphaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
          expected: alphaParcel,
        },
        {
          override: {
            response: betaResponse,
            parcel: betaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
          expected: betaParcel,
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        const fetchResponseArgs = {
          sink: {}, // Neutral value
        }

        const fetcher = BaseHttpFetcher.create(input)

        jest.spyOn(fetcher, 'receiveResponse')
          .mockResolvedValue(override.response)
        jest.spyOn(fetcher, 'createHttpParcelByResponse')
          .mockReturnValue(override.parcel)

        const received = await fetcher.fetchResponse(fetchResponseArgs)

        expect(received)
          .toBe(expected) // same reference
      })
    })

    describe('should create the parcel of the failure where the subclass rejects', () => {
      const alphaError = new Error('Error 0001')
      const betaError = new DOMException('The operation timed out.', 'TimeoutError')

      const cases = [
        {
          override: {
            error: alphaError,
            parcel: alphaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
          expected: {
            error: alphaError,
          },
        },
        {
          override: {
            error: betaError,
            parcel: betaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
          expected: {
            error: betaError,
          },
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        const fetchResponseArgs = {
          sink: {}, // Neutral value
        }

        const fetcher = BaseHttpFetcher.create(input)

        jest.spyOn(fetcher, 'receiveResponse')
          .mockRejectedValue(override.error)
        const createHttpParcelByFailureSpy = jest.spyOn(fetcher, 'createHttpParcelByFailure')
          .mockReturnValue(override.parcel)

        await fetcher.fetchResponse(fetchResponseArgs)

        expect(createHttpParcelByFailureSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should resolve the parcel of the failure instead of rejecting', () => {
      const cases = [
        {
          override: {
            error: new Error('Error 0001'),
            parcel: alphaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
          expected: alphaParcel,
        },
        {
          override: {
            error: new DOMException('The operation was aborted.', 'AbortError'),
            parcel: betaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
          expected: betaParcel,
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        const fetchResponseArgs = {
          sink: {}, // Neutral value
        }

        const fetcher = BaseHttpFetcher.create(input)

        jest.spyOn(fetcher, 'receiveResponse')
          .mockRejectedValue(override.error)
        jest.spyOn(fetcher, 'createHttpParcelByFailure')
          .mockReturnValue(override.parcel)

        const received = await fetcher.fetchResponse(fetchResponseArgs)

        expect(received)
          .toBe(expected) // same reference
      })
    })

    describe('should resolve the parcel of the failure where the timer cannot be created', () => {
      const cases = [
        {
          override: {
            error: new TypeError('AbortSignal.any is not a function'),
            parcel: alphaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
          expected: {
            parcel: alphaParcel,
            error: new TypeError('AbortSignal.any is not a function'),
          },
        },
        {
          override: {
            error: new RangeError('Timeout must not be negative'),
            parcel: betaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
          expected: {
            parcel: betaParcel,
            error: new RangeError('Timeout must not be negative'),
          },
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        const fetchResponseArgs = {
          sink: {}, // Neutral value
        }

        const fetcher = BaseHttpFetcher.create(input)

        jest.spyOn(fetcher, 'createAbortTimer')
          .mockImplementation(() => {
            throw override.error
          })
        const createHttpParcelByFailureSpy = jest.spyOn(fetcher, 'createHttpParcelByFailure')
          .mockReturnValue(override.parcel)

        const received = await fetcher.fetchResponse(fetchResponseArgs)

        expect(received)
          .toBe(expected.parcel) // same reference

        expect(createHttpParcelByFailureSpy)
          .toHaveBeenCalledWith({
            error: expected.error,
          })
      })
    })

    describe('should clear the timer after the response was received', () => {
      const cases = [
        {
          override: {
            response: alphaResponse,
            parcel: alphaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
        },
        {
          override: {
            response: betaResponse,
            parcel: betaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input }) => {
        const fetchResponseArgs = {
          sink: {}, // Neutral value
        }
        const timerFake = createTimerFake({ signal: alphaSignal })

        const fetcher = BaseHttpFetcher.create(input)

        jest.spyOn(fetcher, 'createAbortTimer')
          .mockReturnValue(timerFake)
        jest.spyOn(fetcher, 'receiveResponse')
          .mockResolvedValue(override.response)
        jest.spyOn(fetcher, 'createHttpParcelByResponse')
          .mockReturnValue(override.parcel)

        await fetcher.fetchResponse(fetchResponseArgs)

        expect(timerFake.clear)
          .toHaveBeenCalledTimes(1)
      })
    })

    describe('should clear the timer after the failure of the subclass', () => {
      const cases = [
        {
          override: {
            error: new Error('Error 0001'),
            parcel: alphaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
        },
        {
          override: {
            error: new DOMException('The operation timed out.', 'TimeoutError'),
            parcel: betaParcel,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input }) => {
        const fetchResponseArgs = {
          sink: {}, // Neutral value
        }
        const timerFake = createTimerFake({ signal: alphaSignal })

        const fetcher = BaseHttpFetcher.create(input)

        jest.spyOn(fetcher, 'createAbortTimer')
          .mockReturnValue(timerFake)
        jest.spyOn(fetcher, 'receiveResponse')
          .mockRejectedValue(override.error)
        jest.spyOn(fetcher, 'createHttpParcelByFailure')
          .mockReturnValue(override.parcel)

        await fetcher.fetchResponse(fetchResponseArgs)

        expect(timerFake.clear)
          .toHaveBeenCalledTimes(1)
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#createAbortTimer()', () => {
    const alphaRequest = new Request('https://example.com/resource-0001')
    const betaRequest = new Request('https://example.com/resource-0002')
    const alphaTimer = AbortTimer.create({
      requestSignal: alphaRequest.signal,
      timeoutMilliseconds: 0,
    })
    const betaTimer = AbortTimer.create({
      requestSignal: betaRequest.signal,
      timeoutMilliseconds: 0,
    })

    const cases = [
      {
        override: {
          timer: alphaTimer,
        },
        input: {
          request: alphaRequest,
          config: {
            timeoutMilliseconds: 1000,
          },
        },
        expected: {
          timer: alphaTimer,
          args: {
            requestSignal: alphaRequest.signal,
            timeoutMilliseconds: 1000,
          },
        },
      },
      {
        override: {
          timer: betaTimer,
        },
        input: {
          request: betaRequest,
          config: {
            // timeoutMilliseconds: omitted
          },
        },
        expected: {
          timer: betaTimer,
          args: {
            requestSignal: betaRequest.signal,
            timeoutMilliseconds: 0,
          },
        },
      },
    ]

    describe('should create the timer with the signal of the request and the timeout', () => {
      test.each(cases)('url: $input.request.url', ({ override, input, expected }) => {
        const createSpy = jest.spyOn(AbortTimer, 'create')
          .mockReturnValue(override.timer)

        const fetcher = BaseHttpFetcher.create(input)

        fetcher.createAbortTimer()

        expect(createSpy)
          .toHaveBeenCalledWith(expected.args)
      })
    })

    describe('should be the timer that the factory method created', () => {
      test.each(cases)('url: $input.request.url', ({ override, input, expected }) => {
        jest.spyOn(AbortTimer, 'create')
          .mockReturnValue(override.timer)

        const fetcher = BaseHttpFetcher.create(input)

        const received = fetcher.createAbortTimer()

        expect(received)
          .toBe(expected.timer) // same reference
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#receiveResponse()', () => {
    describe('when not inherited', () => {
      class AlphaHttpFetcher extends BaseHttpFetcher {}

      class BetaHttpFetcher extends BaseHttpFetcher {}

      const cases = [
        {
          input: {
            Fetcher: BaseHttpFetcher,
          },
          expected: 'BaseHttpFetcher#receiveResponse() must be inherited',
        },
        {
          input: {
            Fetcher: AlphaHttpFetcher,
          },
          expected: 'AlphaHttpFetcher#receiveResponse() must be inherited',
        },
        {
          input: {
            Fetcher: BetaHttpFetcher,
          },
          expected: 'BetaHttpFetcher#receiveResponse() must be inherited',
        },
      ]

      test.each(cases)('Fetcher: $input.Fetcher.name', async ({ input, expected }) => {
        const fetcher = input.Fetcher.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
        })
        const args = {
          sink: {}, // Neutral value
          signal: new AbortController().signal, // Neutral value
        }

        const received = () => fetcher.receiveResponse(args)

        await expect(received)
          .rejects
          .toThrow(expected)
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#createHttpParcelByResponse()', () => {
    describe('should be an instance of the HTTP parcel class', () => {
      const cases = [
        {
          override: {
            HttpParcelCtor: FetchHttpParcel,
            responseUrl: 'https://example.com/resource-0001',
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {
              timeoutMilliseconds: 1000,
            },
            response: new Response('text-0001'),
          },
          expected: FetchHttpParcel,
        },
        {
          override: {
            HttpParcelCtor: XMLHttpParcel,
            responseUrl: 'https://example.com/resource-0002',
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {
              timeoutMilliseconds: 0,
            },
            response: new Response('text-0002'),
          },
          expected: XMLHttpParcel,
        },
      ]

      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input, expected }) => {
        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const createArgs = {
          request: input.request,
          config: input.config,
        }
        const createHttpParcelByResponseArgs = {
          response: input.response,
        }

        const fetcher = BaseHttpFetcher.create(createArgs)

        jest.spyOn(fetcher, 'resolveResponseUrl')
          .mockReturnValue(override.responseUrl)

        const received = fetcher.createHttpParcelByResponse(createHttpParcelByResponseArgs)

        expect(received)
          .toBeInstanceOf(expected)
      })
    })

    describe('should carry the request, the config, the response and the URL of the response', () => {
      const alphaRequest = new Request('https://example.com/resource-0001')
      const betaRequest = new Request('https://example.com/resource-0002')
      const alphaResponse = new Response('text-0001')
      const betaResponse = new Response('text-0002')

      const cases = [
        {
          override: {
            HttpParcelCtor: FetchHttpParcel,
            responseUrl: 'https://example.com/resource-0003',
          },
          input: {
            request: alphaRequest,
            config: {
              timeoutMilliseconds: 1000,
            },
            response: alphaResponse,
          },
          expected: {
            request: alphaRequest,
            config: {
              timeoutMilliseconds: 1000,
            },
            response: alphaResponse,
            responseUrl: 'https://example.com/resource-0003',
          },
        },
        {
          override: {
            HttpParcelCtor: XMLHttpParcel,
            responseUrl: 'https://example.com/resource-0004',
          },
          input: {
            request: betaRequest,
            config: {
              timeoutMilliseconds: 0,
            },
            response: betaResponse,
          },
          expected: {
            request: betaRequest,
            config: {
              timeoutMilliseconds: 0,
            },
            response: betaResponse,
            responseUrl: 'https://example.com/resource-0004',
          },
        },
      ]

      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input, expected }) => {
        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const createHttpParcelSpy = jest.spyOn(BaseHttpFetcher, 'createHttpParcel')

        const createArgs = {
          request: input.request,
          config: input.config,
        }
        const createHttpParcelByResponseArgs = {
          response: input.response,
        }

        const fetcher = BaseHttpFetcher.create(createArgs)

        jest.spyOn(fetcher, 'resolveResponseUrl')
          .mockReturnValue(override.responseUrl)

        fetcher.createHttpParcelByResponse(createHttpParcelByResponseArgs)

        expect(createHttpParcelSpy)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#resolveResponseUrl()', () => {
    describe('when not inherited', () => {
      class AlphaHttpFetcher extends BaseHttpFetcher {}

      class BetaHttpFetcher extends BaseHttpFetcher {}

      const cases = [
        {
          input: {
            Fetcher: BaseHttpFetcher,
          },
          expected: 'BaseHttpFetcher#resolveResponseUrl() must be inherited',
        },
        {
          input: {
            Fetcher: AlphaHttpFetcher,
          },
          expected: 'AlphaHttpFetcher#resolveResponseUrl() must be inherited',
        },
        {
          input: {
            Fetcher: BetaHttpFetcher,
          },
          expected: 'BetaHttpFetcher#resolveResponseUrl() must be inherited',
        },
      ]

      test.each(cases)('Fetcher: $input.Fetcher.name', ({ input, expected }) => {
        const fetcher = input.Fetcher.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
        })
        const args = {
          response: new Response(''), // Neutral value
        }

        expect(() => fetcher.resolveResponseUrl(args))
          .toThrow(expected)
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#createHttpParcelByFailure()', () => {
    describe('should create the parcel through #createHttpParcelAsTimeoutError() where the failure is named TimeoutError', () => {
      const parcel = FetchHttpParcel.createAsError({
        request: new Request('https://example.com/neutral'), // Neutral value
        config: {}, // Neutral value
      })

      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            error: new DOMException('Failure 0001', 'TimeoutError'),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            error: new DOMException('Failure 0002', 'TimeoutError'),
          },
        },
      ]

      test.each(cases)('request: $input.request.url', ({ input }) => {
        const args = {
          error: input.error,
        }

        const fetcher = BaseHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const hookSpy = jest.spyOn(fetcher, 'createHttpParcelAsTimeoutError')
          .mockReturnValue(parcel)

        const received = fetcher.createHttpParcelByFailure(args)

        expect(hookSpy)
          .toHaveBeenCalledWith()

        expect(received)
          .toBe(parcel) // same reference
      })
    })

    describe('should create the parcel through #createHttpParcelAsAbortError() where the failure is named AbortError', () => {
      const parcel = FetchHttpParcel.createAsError({
        request: new Request('https://example.com/neutral'), // Neutral value
        config: {}, // Neutral value
      })

      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0003'),
            config: {},
            error: new DOMException('Failure 0003', 'AbortError'),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0004'),
            config: {},
            error: new DOMException('Failure 0004', 'AbortError'),
          },
        },
      ]

      test.each(cases)('request: $input.request.url', ({ input }) => {
        const args = {
          error: input.error,
        }

        const fetcher = BaseHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const hookSpy = jest.spyOn(fetcher, 'createHttpParcelAsAbortError')
          .mockReturnValue(parcel)

        const received = fetcher.createHttpParcelByFailure(args)

        expect(hookSpy)
          .toHaveBeenCalledWith()

        expect(received)
          .toBe(parcel) // same reference
      })
    })

    describe('should create the parcel through #createHttpParcelAsAbortError() where the signal of the request was aborted, whatever the reason is', () => {
      const parcel = FetchHttpParcel.createAsError({
        request: new Request('https://example.com/neutral'), // Neutral value
        config: {}, // Neutral value
      })

      const createAbortedRequest = ({ url, reason }) => {
        const controller = new AbortController()

        controller.abort(reason)

        return new Request(url, {
          signal: controller.signal,
        })
      }

      const cases = [
        {
          input: {
            request: createAbortedRequest({
              url: 'https://example.com/resource-0021',
              reason: 'cancel', // string has no name
            }),
            config: {},
            error: 'cancel',
          },
        },
        {
          input: {
            request: createAbortedRequest({
              url: 'https://example.com/resource-0022',
              reason: new Error('Cancel 0022'), // name is Error
            }),
            config: {},
            error: new Error('Cancel 0022'),
          },
        },
        {
          input: {
            request: createAbortedRequest({
              url: 'https://example.com/resource-0023',
              reason: new DOMException('Failure 0023', 'NetworkError'),
            }),
            config: {},
            error: new DOMException('Failure 0023', 'NetworkError'),
          },
        },
      ]

      test.each(cases)('request: $input.request.url', ({ input }) => {
        const args = {
          error: input.error,
        }

        const fetcher = BaseHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const hookSpy = jest.spyOn(fetcher, 'createHttpParcelAsAbortError')
          .mockReturnValue(parcel)

        const received = fetcher.createHttpParcelByFailure(args)

        expect(hookSpy)
          .toHaveBeenCalledWith()

        expect(received)
          .toBe(parcel) // same reference
      })
    })

    describe('should create the parcel through #createHttpParcelAsNetworkError() where the failure is named NetworkError', () => {
      const parcel = FetchHttpParcel.createAsError({
        request: new Request('https://example.com/neutral'), // Neutral value
        config: {}, // Neutral value
      })

      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0005'),
            config: {},
            error: new DOMException('Failure 0005', 'NetworkError'),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0006'),
            config: {},
            error: new DOMException('Failure 0006', 'NetworkError'),
          },
        },
      ]

      test.each(cases)('request: $input.request.url', ({ input }) => {
        const args = {
          error: input.error,
        }

        const fetcher = BaseHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const hookSpy = jest.spyOn(fetcher, 'createHttpParcelAsNetworkError')
          .mockReturnValue(parcel)

        const received = fetcher.createHttpParcelByFailure(args)

        expect(hookSpy)
          .toHaveBeenCalledWith()

        expect(received)
          .toBe(parcel) // same reference
      })
    })

    describe('should create the parcel through #createHttpParcelByUnnamedFailure() where the failure has no name that it knows', () => {
      const parcel = FetchHttpParcel.createAsError({
        request: new Request('https://example.com/neutral'), // Neutral value
        config: {}, // Neutral value
      })

      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0007'),
            config: {},
            error: new Error('Failure 0007'),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0008'),
            config: {},
            error: new DOMException('Failure 0008', 'DataCloneError'),
          },
        },
      ]

      test.each(cases)('request: $input.request.url', ({ input }) => {
        const args = {
          error: input.error,
        }

        const fetcher = BaseHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const unnamedSpy = jest.spyOn(fetcher, 'createHttpParcelByUnnamedFailure')
          .mockReturnValue(parcel)

        const received = fetcher.createHttpParcelByFailure(args)

        expect(unnamedSpy)
          .toHaveBeenCalledWith(args)

        expect(received)
          .toBe(parcel) // same reference
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#createHttpParcelByUnnamedFailure()', () => {
    const cases = [
      {
        override: {
          HttpParcelCtor: FetchHttpParcel,
        },
        input: {
          request: new Request('https://example.com/resource-0001'),
          config: {},
          error: new Error('Failure 0001'),
        },
      },
      {
        override: {
          HttpParcelCtor: XMLHttpParcel,
        },
        input: {
          request: new Request('https://example.com/resource-0002'),
          config: {},
          error: new Error('Failure 0002'),
        },
      },
    ]

    describe('should be the parcel of an unknown failure', () => {
      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input }) => {
        const args = {
          error: input.error,
        }

        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const fetcher = BaseHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const received = fetcher.createHttpParcelByUnnamedFailure(args)

        expect(received)
          .toHaveProperty('fetcherError', HTTP_FETCHER_ERROR.UNKNOWN)
      })
    })

    describe('should be an instance of the HTTP parcel class', () => {
      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input }) => {
        const args = {
          error: input.error,
        }

        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const fetcher = BaseHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const received = fetcher.createHttpParcelByUnnamedFailure(args)

        expect(received)
          .toBeInstanceOf(override.HttpParcelCtor)
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#createHttpParcelAsError()', () => {
    const cases = [
      {
        override: {
          HttpParcelCtor: FetchHttpParcel,
        },
        input: {
          request: new Request('https://example.com/resource-0001'),
          config: {
            timeoutMilliseconds: 1000,
          },
        },
        expected: FetchHttpParcel,
      },
      {
        override: {
          HttpParcelCtor: XMLHttpParcel,
        },
        input: {
          request: new Request('https://example.com/resource-0002'),
          config: {
            timeoutMilliseconds: 0,
          },
        },
        expected: XMLHttpParcel,
      },
    ]

    describe('should be an instance of the HTTP parcel class', () => {
      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input, expected }) => {
        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const fetcher = BaseHttpFetcher.create(input)

        const received = fetcher.createHttpParcelAsError()

        expect(received)
          .toBeInstanceOf(expected)
      })
    })

    describe('should create the parcel with the request and the config', () => {
      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input }) => {
        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const createAsErrorSpy = jest.spyOn(override.HttpParcelCtor, 'createAsError')

        const fetcher = BaseHttpFetcher.create(input)

        fetcher.createHttpParcelAsError()

        expect(createAsErrorSpy)
          .toHaveBeenCalledWith({
            request: input.request,
            config: input.config,
          })
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#createHttpParcelAsNetworkError()', () => {
    const cases = [
      {
        override: {
          HttpParcelCtor: FetchHttpParcel,
        },
        input: {
          request: new Request('https://example.com/resource-0001'),
          config: {
            timeoutMilliseconds: 1000,
          },
        },
        expected: FetchHttpParcel,
      },
      {
        override: {
          HttpParcelCtor: XMLHttpParcel,
        },
        input: {
          request: new Request('https://example.com/resource-0002'),
          config: {
            timeoutMilliseconds: 0,
          },
        },
        expected: XMLHttpParcel,
      },
    ]

    describe('should be an instance of the HTTP parcel class', () => {
      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input, expected }) => {
        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const fetcher = BaseHttpFetcher.create(input)

        const received = fetcher.createHttpParcelAsNetworkError()

        expect(received)
          .toBeInstanceOf(expected)
      })
    })

    describe('should create the parcel with the request and the config', () => {
      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input }) => {
        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const createAsNetworkErrorSpy = jest.spyOn(override.HttpParcelCtor, 'createAsNetworkError')

        const fetcher = BaseHttpFetcher.create(input)

        fetcher.createHttpParcelAsNetworkError()

        expect(createAsNetworkErrorSpy)
          .toHaveBeenCalledWith({
            request: input.request,
            config: input.config,
          })
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#createHttpParcelAsTimeoutError()', () => {
    const cases = [
      {
        override: {
          HttpParcelCtor: FetchHttpParcel,
        },
        input: {
          request: new Request('https://example.com/resource-0001'),
          config: {
            timeoutMilliseconds: 1000,
          },
        },
        expected: FetchHttpParcel,
      },
      {
        override: {
          HttpParcelCtor: XMLHttpParcel,
        },
        input: {
          request: new Request('https://example.com/resource-0002'),
          config: {
            timeoutMilliseconds: 0,
          },
        },
        expected: XMLHttpParcel,
      },
    ]

    describe('should be an instance of the HTTP parcel class', () => {
      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input, expected }) => {
        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const fetcher = BaseHttpFetcher.create(input)

        const received = fetcher.createHttpParcelAsTimeoutError()

        expect(received)
          .toBeInstanceOf(expected)
      })
    })

    describe('should create the parcel with the request and the config', () => {
      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input }) => {
        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const createAsTimeoutErrorSpy = jest.spyOn(override.HttpParcelCtor, 'createAsTimeoutError')

        const fetcher = BaseHttpFetcher.create(input)

        fetcher.createHttpParcelAsTimeoutError()

        expect(createAsTimeoutErrorSpy)
          .toHaveBeenCalledWith({
            request: input.request,
            config: input.config,
          })
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#createHttpParcelAsAbortError()', () => {
    const cases = [
      {
        override: {
          HttpParcelCtor: FetchHttpParcel,
        },
        input: {
          request: new Request('https://example.com/resource-0001'),
          config: {
            timeoutMilliseconds: 1000,
          },
        },
        expected: FetchHttpParcel,
      },
      {
        override: {
          HttpParcelCtor: XMLHttpParcel,
        },
        input: {
          request: new Request('https://example.com/resource-0002'),
          config: {
            timeoutMilliseconds: 0,
          },
        },
        expected: XMLHttpParcel,
      },
    ]

    describe('should be an instance of the HTTP parcel class', () => {
      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input, expected }) => {
        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const fetcher = BaseHttpFetcher.create(input)

        const received = fetcher.createHttpParcelAsAbortError()

        expect(received)
          .toBeInstanceOf(expected)
      })
    })

    describe('should create the parcel with the request and the config', () => {
      test.each(cases)('HttpParcelCtor: $override.HttpParcelCtor.name', ({ override, input }) => {
        jest.spyOn(BaseHttpFetcher, 'HttpParcelCtor', 'get')
          .mockReturnValue(override.HttpParcelCtor)

        const createAsAbortErrorSpy = jest.spyOn(override.HttpParcelCtor, 'createAsAbortError')

        const fetcher = BaseHttpFetcher.create(input)

        fetcher.createHttpParcelAsAbortError()

        expect(createAsAbortErrorSpy)
          .toHaveBeenCalledWith({
            request: input.request,
            config: input.config,
          })
      })
    })
  })
})
