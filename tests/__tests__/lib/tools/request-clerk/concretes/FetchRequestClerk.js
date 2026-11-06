import BaseRequestClerk from '~/lib/tools/request-clerk/BaseRequestClerk.js'
import FetchRequestClerk from '~/lib/tools/request-clerk/concretes/FetchRequestClerk.js'

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

describe('FetchRequestClerk', () => {
  describe('inheritance', () => {
    test('to extend BaseRequestClerk', () => {
      const clerk = FetchRequestClerk.create({
        request: new Request('https://example.com/alpha'),
      })

      expect(clerk)
        .toBeInstanceOf(BaseRequestClerk)
    })
  })
})

describe('FetchRequestClerk', () => {
  describe('.fetch()', () => {
    describe('should delegate to the native fetch()', () => {
      test('with the same arguments and the same result', async () => {
        const response = new Response('{}')
        const input = new Request('https://example.com/alpha')
        const init = {
          credentials: /** @type {RequestCredentials} */ ('include'),
        }

        const fetchSpy = jest.spyOn(globalThis, 'fetch')
          .mockResolvedValue(response)

        const actual = await FetchRequestClerk.fetch(input, init)

        expect(actual)
          .toBe(response)
        expect(fetchSpy)
          .toHaveBeenCalledWith(input, init)
      })
    })
  })
})

describe('FetchRequestClerk', () => {
  describe('.buildTimeoutSignal()', () => {
    test('should abort with TimeoutError after the timeout', async () => {
      const signal = FetchRequestClerk.buildTimeoutSignal({
        timeout: 10,
      })

      expect(signal.aborted)
        .toBe(false)

      await waitFor(60)

      expect(signal.aborted)
        .toBe(true)
      expect(signal.reason)
        .toHaveProperty('name', 'TimeoutError')
    })
  })

  describe('.buildAnySignal()', () => {
    test('should abort when one of the signals aborts', () => {
      const abortController = new AbortController()
      const otherController = new AbortController()

      const signal = FetchRequestClerk.buildAnySignal({
        signals: [
          abortController.signal,
          otherController.signal,
        ],
      })

      expect(signal.aborted)
        .toBe(false)

      otherController.abort()

      expect(signal.aborted)
        .toBe(true)
    })
  })
})

describe('FetchRequestClerk', () => {
  describe('#get:Ctor', () => {
    test('to be constructor of own class', () => {
      const clerk = FetchRequestClerk.create({
        request: new Request('https://example.com/alpha'),
      })

      expect(clerk.Ctor)
        .toBe(FetchRequestClerk)
    })
  })
})

describe('FetchRequestClerk', () => {
  describe('#buildResponse()', () => {
    describe('should resolve to the response of .fetch()', () => {
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
        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockResolvedValue(response)

        const clerk = FetchRequestClerk.create({
          request: new Request('https://example.com/alpha'),
        })

        const actual = await clerk.buildResponse()

        expect(actual)
          .toBe(response)
      })
    })

    describe('should give the request itself to .fetch()', () => {
      test('with the same instance', async () => {
        const fetchSpy = jest.spyOn(FetchRequestClerk, 'fetch')
          .mockResolvedValue(new Response('{}'))

        const request = new Request('https://example.com/alpha')

        await FetchRequestClerk.create({
          request,
        })
          .buildResponse()

        const [[input]] = fetchSpy.mock.calls

        expect(input)
          .toBe(request)
      })
    })

    describe('should give credentials to .fetch()', () => {
      const cases = [
        {
          title: 'inherits include from the request',
          requestCredentials: 'include',
          config: {},
          expected: 'include',
        },
        {
          title: 'keeps same-origin of the request',
          requestCredentials: 'same-origin',
          config: {},
          expected: 'same-origin',
        },
        {
          title: 'keeps omit of the request',
          requestCredentials: 'omit',
          config: {},
          expected: 'omit',
        },
        {
          title: 'raises omit to include by withCredentials',
          requestCredentials: 'omit',
          config: {
            withCredentials: true,
          },
          expected: 'include',
        },
        {
          title: 'keeps same-origin when withCredentials is false',
          requestCredentials: 'same-origin',
          config: {
            withCredentials: false,
          },
          expected: 'same-origin',
        },
      ]

      test.each(cases)('$title', async ({ requestCredentials, config, expected }) => {
        const fetchSpy = jest.spyOn(FetchRequestClerk, 'fetch')
          .mockResolvedValue(new Response('{}'))

        await FetchRequestClerk.create({
          request: new Request('https://example.com/alpha', {
            credentials: /** @type {RequestCredentials} */ (requestCredentials),
          }),
          config,
        })
          .buildResponse()

        const [[, init]] = fetchSpy.mock.calls

        expect(init)
          .toHaveProperty('credentials', expected)
      })
    })

    describe('should report no progress', () => {
      test('to leave the sink unread', async () => {
        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockResolvedValue(new Response('{}'))

        const sink = {
          onUploadProgress: jest.fn(),
          onDownloadProgress: jest.fn(),
        }

        await FetchRequestClerk.create({
          request: new Request('https://example.com/alpha'),
          sink,
        })
          .buildResponse()

        expect(sink.onUploadProgress)
          .not
          .toHaveBeenCalled()
        expect(sink.onDownloadProgress)
          .not
          .toHaveBeenCalled()
      })
    })

    describe('should reject when .fetch() rejects', () => {
      test('with a network failure', async () => {
        const expected = new TypeError('Network request failed')

        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockRejectedValue(expected)

        const clerk = FetchRequestClerk.create({
          request: new Request('https://example.com/alpha'),
        })

        await expect(clerk.buildResponse())
          .rejects
          .toBe(expected)
      })
    })

    describe('should reject when the signal given to .fetch() aborts', () => {
      test('after the timeout', async () => {
        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockImplementation(fetchUntilAbort)

        const clerk = FetchRequestClerk.create({
          request: new Request('https://example.com/alpha'),
          config: {
            timeout: 10,
          },
        })

        await expect(clerk.buildResponse())
          .rejects
          .toHaveProperty('name', 'TimeoutError')
      })

      test('with the request already aborted', async () => {
        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockImplementation(fetchUntilAbort)

        const abortController = new AbortController()

        abortController.abort()

        const clerk = FetchRequestClerk.create({
          request: new Request('https://example.com/alpha', {
            signal: abortController.signal,
          }),
          config: {
            timeout: 3000,
          },
        })

        await expect(clerk.buildResponse())
          .rejects
          .toHaveProperty('name', 'AbortError')
      })

      test('with the request aborted while it waits', async () => {
        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockImplementation(fetchUntilAbort)

        const abortController = new AbortController()

        const clerk = FetchRequestClerk.create({
          request: new Request('https://example.com/alpha', {
            signal: abortController.signal,
          }),
        })

        const promise = clerk.buildResponse()

        abortController.abort()

        await expect(promise)
          .rejects
          .toHaveProperty('name', 'AbortError')
      })
    })

    describe('should leave the request unchanged after a failure', () => {
      test('with the body unread and the properties kept', async () => {
        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockRejectedValue(new TypeError('Network request failed'))

        const request = new Request('https://example.com/alpha', {
          method: 'POST',
          body: '{"first":"alpha"}',
        })
        const config = {
          timeout: 3000,
          responseType: /** @type {XMLHttpRequestResponseType} */ (''),
          withCredentials: false,
        }

        const clerk = FetchRequestClerk.create({
          request,
          config,
        })

        await expect(clerk.buildResponse())
          .rejects
          .toThrow('Network request failed')

        expect(request.bodyUsed)
          .toBe(false)
        expect(clerk)
          .toHaveProperty('request', request)
        expect(clerk.config)
          .toStrictEqual(config)
      })
    })

    describe('to give the signal to .fetch()', () => {
      /**
       * @param {{
       *   timeout: number
       *   request: Request
       * }} params - Parameters.
       * @returns {Promise<AbortSignal>} Signal given to .fetch().
       */
      async function captureSignal ({
        timeout,
        request,
      }) {
        const fetchSpy = jest.spyOn(FetchRequestClerk, 'fetch')
          .mockResolvedValue(new Response('{}'))

        await FetchRequestClerk.create({
          request,
          config: {
            timeout,
          },
        })
          .buildResponse()

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
