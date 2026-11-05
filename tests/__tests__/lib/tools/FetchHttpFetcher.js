import FetchHttpFetcher from '../../../../lib/tools/FetchHttpFetcher.js'

/**
 * @param {number} milliseconds - Time to wait.
 * @returns {Promise<void>} Promise resolved after the time.
 */
function waitFor (milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}

/**
 * Settle like fetch() that gets no answer, rejecting once the signal aborts.
 *
 * @param {RequestInfo | URL} input - Request.
 * @param {RequestInit} [init] - Options of fetch().
 * @returns {Promise<Response>} Promise that rejects on abort.
 */
function fetchUntilAbort (
  input,
  {
    signal,
  } = {}
) {
  if (!signal) {
    return Promise.reject(new TypeError('fetch() received no signal'))
  }

  if (signal.aborted) {
    return Promise.reject(signal.reason)
  }

  return new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => {
      reject(signal.reason)
    })
  })
}

describe('FetchHttpFetcher', () => {
  describe('constructor', () => {
    describe('to keep properties', () => {
      describe('#timeout', () => {
        const cases = [
          {
            params: {
              timeout: 3000,
            },
            expected: 3000,
          },
          {
            params: {
              timeout: 0,
            },
            expected: 0,
          },
        ]

        test.each(cases)('timeout: $params.timeout', ({ params, expected }) => {
          const fetcher = new FetchHttpFetcher(params)

          expect(fetcher)
            .toHaveProperty('timeout', expected)
        })
      })
    })
  })
})

describe('FetchHttpFetcher', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      test('with timeout', () => {
        const fetcher = FetchHttpFetcher.create({
          timeout: 3000,
        })

        expect(fetcher)
          .toBeInstanceOf(FetchHttpFetcher)
      })

      test('with no arguments', () => {
        const fetcher = FetchHttpFetcher.create()

        expect(fetcher)
          .toBeInstanceOf(FetchHttpFetcher)
      })
    })

    describe('to call constructor', () => {
      const cases = [
        {
          params: {
            timeout: 3000,
          },
          expected: {
            timeout: 3000,
          },
        },
        {
          params: undefined,
          expected: {
            timeout: 0,
          },
        },
      ]

      test.each(cases)('params: $params', ({ params, expected }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(FetchHttpFetcher)

        SpyClass.create(params)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('FetchHttpFetcher', () => {
  describe('#get:Ctor', () => {
    test('to be constructor of own class', () => {
      const fetcher = FetchHttpFetcher.create()

      expect(fetcher.Ctor)
        .toBe(FetchHttpFetcher)
    })
  })
})

describe('FetchHttpFetcher', () => {
  describe('#fetchRequest()', () => {
    describe('to resolve to the response of fetch()', () => {
      const cases = [
        {
          response: new Response('{}', {
            status: 200,
          }),
        },
        {
          response: new Response('{}', {
            status: 404,
          }),
        },
      ]

      test.each(cases)('status: $response.status', async ({ response }) => {
        jest.spyOn(globalThis, 'fetch')
          .mockResolvedValue(response)

        const fetcher = FetchHttpFetcher.create()

        const actual = await fetcher.fetchRequest({
          request: new Request('https://example.com/alpha'),
        })

        expect(actual)
          .toBe(response)
      })
    })

    describe('to keep credentials of the request', () => {
      const cases = [
        {
          credentials: 'omit',
        },
        {
          credentials: 'same-origin',
        },
        {
          credentials: 'include',
        },
      ]

      test.each(cases)('credentials: $credentials', async ({ credentials }) => {
        const fetchSpy = jest.spyOn(globalThis, 'fetch')
          .mockResolvedValue(new Response('{}'))

        const fetcher = FetchHttpFetcher.create({
          timeout: 3000,
        })

        await fetcher.fetchRequest({
          request: new Request('https://example.com/alpha', {
            method: 'POST',
            body: '{}',
            credentials: /** @type {RequestCredentials} */ (credentials),
          }),
        })

        const [[input, init]] = fetchSpy.mock.calls
        const sentRequest = new Request(input, init)

        expect(sentRequest)
          .toHaveProperty('credentials', credentials)
      })
    })

    describe('to reject when fetch() rejects', () => {
      test('with a network failure', async () => {
        const expected = new TypeError('Network request failed')

        jest.spyOn(globalThis, 'fetch')
          .mockRejectedValue(expected)

        const fetcher = FetchHttpFetcher.create()

        await expect(fetcher.fetchRequest({
          request: new Request('https://example.com/alpha'),
        }))
          .rejects
          .toBe(expected)
      })
    })

    describe('to reject when the signal given to fetch() aborts', () => {
      test('after the timeout', async () => {
        jest.spyOn(globalThis, 'fetch')
          .mockImplementation(fetchUntilAbort)

        const fetcher = FetchHttpFetcher.create({
          timeout: 10,
        })

        await expect(fetcher.fetchRequest({
          request: new Request('https://example.com/alpha'),
        }))
          .rejects
          .toHaveProperty('name', 'TimeoutError')
      })

      test('with the request already aborted', async () => {
        jest.spyOn(globalThis, 'fetch')
          .mockImplementation(fetchUntilAbort)

        const abortController = new AbortController()

        abortController.abort()

        const fetcher = FetchHttpFetcher.create({
          timeout: 3000,
        })

        await expect(fetcher.fetchRequest({
          request: new Request('https://example.com/alpha', {
            signal: abortController.signal,
          }),
        }))
          .rejects
          .toHaveProperty('name', 'AbortError')
      })
    })

    describe('to give the signal to fetch()', () => {
      /**
       * @param {{
       *   timeout: number
       *   request: Request
       * }} params - Parameters.
       * @returns {Promise<AbortSignal>} Signal given to fetch().
       */
      async function captureSignal ({
        timeout,
        request,
      }) {
        const fetchSpy = jest.spyOn(globalThis, 'fetch')
          .mockResolvedValue(new Response('{}'))

        await FetchHttpFetcher.create({
          timeout,
        })
          .fetchRequest({
            request,
          })

        const [[, init]] = fetchSpy.mock.calls

        return /** @type {AbortSignal} */ (init?.signal)
      }

      describe('should abort as timed out after the timeout', () => {
        const cases = [
          {
            timeout: 10,
          },
          {
            timeout: 30,
          },
        ]

        test.each(cases)('timeout: $timeout', async ({ timeout }) => {
          const signal = await captureSignal({
            timeout,
            request: new Request('https://example.com/alpha'),
          })

          expect(signal.aborted)
            .toBe(false)

          await waitFor(timeout + 50)

          expect(signal.aborted)
            .toBe(true)
          expect(signal.reason)
            .toHaveProperty('name', 'TimeoutError')
        })
      })

      describe('should not abort by itself without timeout', () => {
        test('timeout: 0', async () => {
          const signal = await captureSignal({
            timeout: 0,
            request: new Request('https://example.com/alpha'),
          })

          await waitFor(50)

          expect(signal.aborted)
            .toBe(false)
        })
      })

      describe('should abort when the signal of the request aborts', () => {
        const cases = [
          {
            timeout: 0,
          },
          {
            timeout: 3000,
          },
        ]

        test.each(cases)('timeout: $timeout', async ({ timeout }) => {
          const abortController = new AbortController()

          const signal = await captureSignal({
            timeout,
            request: new Request('https://example.com/alpha', {
              signal: abortController.signal,
            }),
          })

          expect(signal.aborted)
            .toBe(false)

          abortController.abort()

          expect(signal.aborted)
            .toBe(true)
          expect(signal.reason)
            .toHaveProperty('name', 'AbortError')
        })
      })
    })
  })
})
