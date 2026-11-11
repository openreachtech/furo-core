import FetchHttpFetcher from '../../../../../../lib/tools/http-fetchers/concretes/FetchHttpFetcher.js'

import BaseHttpFetcher from '../../../../../../lib/tools/http-fetchers/BaseHttpFetcher.js'
import FetchHttpParcel from '../../../../../../lib/tools/http-fetchers/parcels/concretes/FetchHttpParcel.js'

import { HTTP_FETCHER_ERROR } from '../../../../../../lib/tools/http-fetchers/tools/constants/HTTP_FETCHER_ERROR.js'

describe('FetchHttpFetcher', () => {
  describe('inheritance', () => {
    test('should be correct class', () => {
      const received = FetchHttpFetcher.prototype

      expect(received)
        .toBeInstanceOf(BaseHttpFetcher)
    })
  })
})

describe('FetchHttpFetcher', () => {
  describe('.get:HttpParcelCtor', () => {
    describe('when called as is', () => {
      test('should be FetchHttpParcel', () => {
        const received = FetchHttpFetcher.HttpParcelCtor

        expect(received)
          .toBe(FetchHttpParcel) // same reference
      })
    })
  })
})

describe('FetchHttpFetcher', () => {
  describe('.get:fetch', () => {
    describe('should send the request through the global fetch()', () => {
      const cases = [
        {
          override: {
            response: new Response('text-0001'),
          },
          tally: {
            request: new Request('https://example.com/resource-0001'),
            optionHash: {
              signal: new AbortController().signal,
            },
          },
        },
        {
          override: {
            response: new Response('text-0002'),
          },
          tally: {
            request: new Request('https://example.com/resource-0002'),
            optionHash: {
              signal: new AbortController().signal,
            },
          },
        },
      ]

      test.each(cases)('url: $tally.request.url', async ({ override, tally }) => {
        const fetchSpy = jest.spyOn(globalThis, 'fetch')
          .mockResolvedValue(override.response)

        await FetchHttpFetcher.fetch(tally.request, tally.optionHash)

        expect(fetchSpy)
          .toHaveBeenCalledWith(tally.request, tally.optionHash)
      })
    })

    describe('should resolve the response of the global fetch()', () => {
      const alphaResponse = new Response('text-0001')
      const betaResponse = new Response('text-0002')

      const cases = [
        {
          override: {
            response: alphaResponse,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            optionHash: {
              signal: new AbortController().signal,
            },
          },
          expected: alphaResponse,
        },
        {
          override: {
            response: betaResponse,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            optionHash: {
              signal: new AbortController().signal,
            },
          },
          expected: betaResponse,
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        jest.spyOn(globalThis, 'fetch')
          .mockResolvedValue(override.response)

        const received = await FetchHttpFetcher.fetch(input.request, input.optionHash)

        expect(received)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('FetchHttpFetcher', () => {
  describe('#get:Ctor', () => {
    class AlphaFetchHttpFetcher extends FetchHttpFetcher {}

    class BetaFetchHttpFetcher extends FetchHttpFetcher {}

    describe('should be constructor of instance', () => {
      const cases = [
        {
          input: {
            Fetcher: FetchHttpFetcher,
          },
          expected: FetchHttpFetcher,
        },
        {
          input: {
            Fetcher: AlphaFetchHttpFetcher,
          },
          expected: AlphaFetchHttpFetcher,
        },
        {
          input: {
            Fetcher: BetaFetchHttpFetcher,
          },
          expected: BetaFetchHttpFetcher,
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

describe('FetchHttpFetcher', () => {
  describe('#receiveResponse()', () => {
    describe('should resolve the response that fetch() resolved', () => {
      const alphaResponse = new Response('text-0001', {
        status: 200,
      })
      const betaResponse = new Response('text-0002', {
        status: 404,
      })

      const cases = [
        {
          override: {
            response: alphaResponse,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
          expected: alphaResponse,
        },
        {
          override: {
            response: betaResponse,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
          expected: betaResponse,
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        const fetcher = FetchHttpFetcher.create(input)

        jest.spyOn(fetcher, 'invokeFetch')
          .mockResolvedValue(override.response)

        const args = {
          sink: {}, // Neutral value
          signal: new AbortController().signal, // Neutral value
        }

        const received = await fetcher.receiveResponse(args)

        expect(received)
          .toBe(expected) // same reference
      })
    })

    describe('should send the clone of the request, not the request itself', () => {
      const alphaClone = new Request('https://example.com/resource-0001')
      const betaClone = new Request('https://example.com/resource-0002', {
        method: 'POST',
        body: 'text-0002',
      })
      const alphaOptionHash = {
        keepalive: true,
      }
      const betaOptionHash = {
        cache: 'no-store',
      }

      const cases = [
        {
          override: {
            clone: alphaClone,
            optionHash: alphaOptionHash,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
          expected: {
            request: alphaClone,
            optionHash: alphaOptionHash,
          },
        },
        {
          override: {
            clone: betaClone,
            optionHash: betaOptionHash,
          },
          input: {
            request: new Request('https://example.com/resource-0002', {
              method: 'POST',
              body: 'text-0002',
            }),
            config: {},
          },
          expected: {
            request: betaClone,
            optionHash: betaOptionHash,
          },
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        const cloneSpy = jest.spyOn(input.request, 'clone')
          .mockReturnValue(override.clone)

        const fetcher = FetchHttpFetcher.create(input)

        jest.spyOn(fetcher, 'buildOptionHash')
          .mockReturnValue(override.optionHash)
        const invokeFetchSpy = jest.spyOn(fetcher, 'invokeFetch')
          .mockResolvedValue(new Response('')) // Neutral value

        const args = {
          sink: {}, // Neutral value
          signal: new AbortController().signal, // Neutral value
        }

        await fetcher.receiveResponse(args)

        expect(cloneSpy)
          .toHaveBeenCalledWith()
        expect(invokeFetchSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should send the option hash that is built with the signal', () => {
      const alphaSignal = new AbortController().signal
      const alphaClone = new Request('https://example.com/resource-0001')
      const betaClone = new Request('https://example.com/resource-0002')
      const betaSignal = new AbortController().signal

      const cases = [
        {
          override: {
            clone: alphaClone,
            optionHash: {
              signal: alphaSignal,
            },
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            signal: alphaSignal,
          },
          expected: {
            request: alphaClone,
            optionHash: {
              signal: alphaSignal,
            },
          },
        },
        {
          override: {
            clone: betaClone,
            optionHash: {
              keepalive: true,
              signal: betaSignal,
            },
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            signal: betaSignal,
          },
          expected: {
            request: betaClone,
            optionHash: {
              keepalive: true,
              signal: betaSignal,
            },
          },
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        jest.spyOn(input.request, 'clone')
          .mockReturnValue(override.clone)

        const fetcher = FetchHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const buildOptionHashSpy = jest.spyOn(fetcher, 'buildOptionHash')
          .mockReturnValue(override.optionHash)
        const invokeFetchSpy = jest.spyOn(fetcher, 'invokeFetch')
          .mockResolvedValue(new Response('')) // Neutral value

        const args = {
          sink: {}, // Neutral value
          signal: input.signal,
        }

        await fetcher.receiveResponse(args)

        expect(buildOptionHashSpy)
          .toHaveBeenCalledWith({
            signal: input.signal,
          })

        expect(invokeFetchSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should reject where fetch() rejects', () => {
      const cases = [
        {
          override: {
            error: new Error('Failed to fetch'),
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
          expected: 'Failed to fetch',
        },
        {
          override: {
            error: new DOMException('The operation timed out.', 'TimeoutError'),
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
          expected: 'The operation timed out.',
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        const fetcher = FetchHttpFetcher.create(input)

        jest.spyOn(fetcher, 'invokeFetch')
          .mockRejectedValue(override.error)

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

    describe('should reject where the request cannot be cloned', () => {
      const cases = [
        {
          override: {
            error: new Error('Request cloning failed 0001'),
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
          expected: 'Request cloning failed 0001',
        },
        {
          override: {
            error: new Error('Request cloning failed 0002'),
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
          expected: 'Request cloning failed 0002',
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        jest.spyOn(input.request, 'clone')
          .mockImplementation(() => {
            throw override.error
          })

        const fetcher = FetchHttpFetcher.create(input)

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

describe('FetchHttpFetcher', () => {
  describe('#fetchResponse()', () => {
    /**
     * Create a response of fake, whose body download never ends unless the signal aborts it.
     *
     * @param {{
     *   signal: AbortSignal
     * }} params - Parameters.
     * @returns {Response} Response of fake.
     */
    const createStalledResponse = ({ signal }) => {
      const response = new Response('neutral') // Neutral value

      jest.spyOn(response, 'clone')
        .mockReturnValue({
          body: {
            pipeTo: () => new Promise((resolve, reject) => {
              signal.addEventListener('abort', () => reject(signal.reason))
            }),
          },
        })

      return response
    }

    describe('should be the parcel of a timeout where the timeout elapses while the body downloads', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {
              timeoutMilliseconds: 20,
            },
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {
              timeoutMilliseconds: 40,
            },
          },
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ input }) => {
        const fetcher = FetchHttpFetcher.create(input)

        jest.spyOn(fetcher, 'invokeFetch')
          .mockImplementation(async ({ optionHash }) => createStalledResponse({
            signal: optionHash.signal,
          }))

        const received = await fetcher.fetchResponse({
          sink: {}, // Neutral value
        })

        expect(received.hasTimeoutError())
          .toBe(true)
      })
    })

    describe('should be the parcel of a timeout where the body download rejects with an error other than the reason of the signal', () => {
      /**
       * Create a response of fake, whose body download rejects with a generic `AbortError` once the signal aborts it.
       *
       * @param {{
       *   signal: AbortSignal
       * }} params - Parameters.
       * @returns {Response} Response of fake.
       */
      const createGenericAbortResponse = ({ signal }) => {
        const response = new Response('neutral') // Neutral value

        jest.spyOn(response, 'clone')
          .mockReturnValue({
            body: {
              pipeTo: () => new Promise((resolve, reject) => {
                signal.addEventListener('abort', () => reject(new DOMException('Fetch is aborted', 'AbortError')))
              }),
            },
          })

        return response
      }

      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {
              timeoutMilliseconds: 20,
            },
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {
              timeoutMilliseconds: 40,
            },
          },
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ input }) => {
        const fetcher = FetchHttpFetcher.create(input)

        jest.spyOn(fetcher, 'invokeFetch')
          .mockImplementation(async ({ optionHash }) => createGenericAbortResponse({
            signal: optionHash.signal,
          }))

        const received = await fetcher.fetchResponse({
          sink: {}, // Neutral value
        })

        expect(received.hasTimeoutError())
          .toBe(true)
      })
    })

    describe('should be the parcel of an abort where the request is aborted while the body downloads', () => {
      const cases = [
        {
          input: {
            reason: 'cancel', // string has no name
          },
        },
        {
          input: {
            reason: new DOMException('Cancel 0002', 'AbortError'),
          },
        },
      ]

      test.each(cases)('reason: $input.reason', async ({ input }) => {
        const controller = new AbortController()
        const request = new Request('https://example.com/resource-0001', {
          signal: controller.signal,
        })

        const fetcher = FetchHttpFetcher.create({
          request,
          config: {
            timeoutMilliseconds: 1000,
          },
        })

        jest.spyOn(fetcher, 'invokeFetch')
          .mockImplementation(async ({ optionHash }) => {
            setTimeout(() => controller.abort(input.reason), 10)

            return createStalledResponse({
              signal: optionHash.signal,
            })
          })

        const received = await fetcher.fetchResponse({
          sink: {}, // Neutral value
        })

        expect(received.hasAbortError())
          .toBe(true)
      })
    })

    describe('should be the parcel of the response, which stays readable after the timeout window', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {
              timeoutMilliseconds: 30,
            },
            body: '{"id":10001}',
          },
          expected: {
            id: 10001,
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {
              timeoutMilliseconds: 30,
            },
            body: '{"id":10002}',
          },
          expected: {
            id: 10002,
          },
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ input, expected }) => {
        const fetcher = FetchHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        jest.spyOn(fetcher, 'invokeFetch')
          .mockResolvedValue(new Response(input.body))

        const received = await fetcher.fetchResponse({
          sink: {}, // Neutral value
        })

        await new Promise(resolve => {
          setTimeout(resolve, input.config.timeoutMilliseconds * 2)
        })

        const json = await received.toJson()

        expect(received.hasError())
          .toBe(false)

        expect(json)
          .toEqual(expected)
      })
    })
  })
})

describe('FetchHttpFetcher', () => {
  describe('#resolveResponseUrl()', () => {
    describe('should be the URL of the response that fetch() resolved', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001', {
              url: 'https://example.com/resource-0001',
            }),
          },
          expected: 'https://example.com/resource-0001',
        },
        {
          input: {
            response: new Response('text-0002', {
              url: 'https://example.com/resource-0002',
            }),
          },
          expected: 'https://example.com/resource-0002',
        },
      ]

      test.each(cases)('response url: $input.response.url', ({ input, expected }) => {
        const fetcher = FetchHttpFetcher.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
        })

        const received = fetcher.resolveResponseUrl(input)

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('FetchHttpFetcher', () => {
  describe('#buildOptionHash()', () => {
    describe('should hold the option hash of the config and the signal', () => {
      const alphaSignal = new AbortController().signal
      const betaSignal = new AbortController().signal

      const cases = [
        {
          input: {
            signal: alphaSignal,
            request: new Request('https://example.com/resource-0001'),
            config: {
              optionHash: {
                priority: 'high',
              },
            },
          },
          expected: {
            priority: 'high',
            signal: alphaSignal,
          },
        },
        {
          input: {
            signal: betaSignal,
            request: new Request('https://example.com/resource-0002'),
            config: {
              optionHash: {
                keepalive: true,
                cache: 'no-store',
              },
            },
          },
          expected: {
            keepalive: true,
            cache: 'no-store',
            signal: betaSignal,
          },
        },
      ]

      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const fetcher = FetchHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const received = fetcher.buildOptionHash({
          signal: input.signal,
        })

        expect(received)
          .toStrictEqual(expected)
      })
    })

    describe('should hold only the signal when the config has no option hash', () => {
      const alphaSignal = new AbortController().signal
      const betaSignal = new AbortController().signal

      const cases = [
        {
          input: {
            signal: alphaSignal,
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
          expected: {
            signal: alphaSignal,
          },
        },
        {
          input: {
            signal: betaSignal,
            request: new Request('https://example.com/resource-0002'),
            config: {
              timeoutMilliseconds: 1000,
            },
          },
          expected: {
            signal: betaSignal,
          },
        },
      ]

      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const fetcher = FetchHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const received = fetcher.buildOptionHash({
          signal: input.signal,
        })

        expect(received)
          .toStrictEqual(expected)
      })
    })

    describe('should hold the signal that aborts the request, whatever the option hash holds', () => {
      const alphaSignal = new AbortController().signal
      const betaSignal = new AbortController().signal

      const cases = [
        {
          input: {
            signal: alphaSignal,
            request: new Request('https://example.com/resource-0001'),
            config: {
              optionHash: {
                signal: new AbortController().signal, // a signal that the option hash must not override
              },
            },
          },
          expected: alphaSignal,
        },
        {
          input: {
            signal: betaSignal,
            request: new Request('https://example.com/resource-0002'),
            config: {
              optionHash: {
                signal: new AbortController().signal, // a signal that the option hash must not override
              },
            },
          },
          expected: betaSignal,
        },
      ]

      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const fetcher = FetchHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const optionHash = fetcher.buildOptionHash({
          signal: input.signal,
        })
        const received = optionHash.signal

        expect(received)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('FetchHttpFetcher', () => {
  describe('#invokeFetch()', () => {
    describe('should call fetch() with the request and the option hash', () => {
      const alphaRequest = new Request('https://example.com/resource-0001')
      const alphaOptionHash = {
        signal: new AbortController().signal,
      }
      const betaRequest = new Request('https://example.com/resource-0002')
      const betaOptionHash = {
        priority: 'high',
        signal: new AbortController().signal,
      }

      const cases = [
        {
          override: {
            response: new Response('text-0001'),
          },
          input: {
            request: alphaRequest,
            optionHash: alphaOptionHash,
          },
          expected: [
            alphaRequest,
            alphaOptionHash,
          ],
        },
        {
          override: {
            response: new Response('text-0002'),
          },
          input: {
            request: betaRequest,
            optionHash: betaOptionHash,
          },
          expected: [
            betaRequest,
            betaOptionHash,
          ],
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        const fetcher = FetchHttpFetcher.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
        })
        const fetchSpy = jest.spyOn(globalThis, 'fetch')
          .mockResolvedValue(override.response)

        await fetcher.invokeFetch(input)

        expect(fetchSpy)
          .toHaveBeenCalledWith(...expected)
      })
    })

    describe('should resolve the response', () => {
      const alphaResponse = new Response('text-0001')
      const betaResponse = new Response('text-0002')

      const cases = [
        {
          override: {
            response: alphaResponse,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            optionHash: {
              signal: new AbortController().signal,
            },
          },
          expected: alphaResponse,
        },
        {
          override: {
            response: betaResponse,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            optionHash: {
              signal: new AbortController().signal,
            },
          },
          expected: betaResponse,
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
        const fetcher = FetchHttpFetcher.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
        })

        jest.spyOn(globalThis, 'fetch')
          .mockResolvedValue(override.response)

        const received = await fetcher.invokeFetch(input)

        expect(received)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('FetchHttpFetcher', () => {
  describe('#createHttpParcelByUnnamedFailure()', () => {
    const cases = [
      {
        input: {
          request: new Request('https://example.com/resource-0001'),
          config: {},
          error: new Error('Failed to fetch'),
        },
      },
      {
        input: {
          request: new Request('https://example.com/resource-0002'),
          config: {},
          error: new DOMException('Failure 0002', 'DataCloneError'),
        },
      },
    ]

    describe('should be the parcel of a network failure', () => {
      test.each(cases)('error: $input.error.message', ({ input }) => {
        const fetcher = FetchHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const received = fetcher.createHttpParcelByUnnamedFailure({
          error: input.error,
        })

        expect(received)
          .toHaveProperty('fetcherError', HTTP_FETCHER_ERROR.NETWORK)
      })
    })

    describe('should be an instance of FetchHttpParcel', () => {
      test.each(cases)('error: $input.error.message', ({ input }) => {
        const fetcher = FetchHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const received = fetcher.createHttpParcelByUnnamedFailure({
          error: input.error,
        })

        expect(received)
          .toBeInstanceOf(FetchHttpParcel)
      })
    })
  })
})

describe('FetchHttpFetcher', () => {
  describe('#receiveHttpParcel()', () => {
    describe('should await the body of the parcel before it resolves', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            response: new Response('text-0001'),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            response: new Response('text-0002'),
          },
        },
      ]

      test.each(cases)('url: $input.request.url', async ({ input }) => {
        const parcel = FetchHttpParcel.create({
          request: input.request,
          config: input.config,
          response: input.response,
        })
        const awaitBodySpy = jest.spyOn(parcel, 'awaitBody')
          .mockResolvedValue(undefined)

        const fetcher = FetchHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        jest.spyOn(fetcher, 'receiveResponse')
          .mockResolvedValue(input.response)
        jest.spyOn(fetcher, 'createHttpParcelByResponse')
          .mockReturnValue(parcel)

        const received = await fetcher.receiveHttpParcel({
          sink: {}, // Neutral value
          signal: new AbortController().signal, // Neutral value
        })

        expect(received)
          .toBe(parcel) // same reference

        expect(awaitBodySpy)
          .toHaveBeenCalledWith()
      })
    })

    describe('should reject where the body cannot be received', () => {
      const cases = [
        {
          input: {
            error: new DOMException('signal timed out', 'TimeoutError'),
          },
          expected: 'signal timed out',
        },
        {
          input: {
            error: new Error('Body download failed'),
          },
          expected: 'Body download failed',
        },
      ]

      test.each(cases)('expected: $expected', async ({ input, expected }) => {
        const request = new Request('https://example.com/neutral') // Neutral value
        const parcel = FetchHttpParcel.create({
          request,
          config: {}, // Neutral value
          response: new Response('neutral'), // Neutral value
        })

        jest.spyOn(parcel, 'awaitBody')
          .mockRejectedValue(input.error)

        const fetcher = FetchHttpFetcher.create({
          request,
          config: {}, // Neutral value
        })

        jest.spyOn(fetcher, 'receiveResponse')
          .mockResolvedValue(new Response('neutral')) // Neutral value
        jest.spyOn(fetcher, 'createHttpParcelByResponse')
          .mockReturnValue(parcel)

        const received = () => fetcher.receiveHttpParcel({
          sink: {}, // Neutral value
          signal: new AbortController().signal, // Neutral value
        })

        await expect(received)
          .rejects
          .toThrow(expected)
      })
    })
  })
})
