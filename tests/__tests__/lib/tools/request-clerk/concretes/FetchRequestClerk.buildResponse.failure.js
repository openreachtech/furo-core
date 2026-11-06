import FetchRequestClerk from '~/lib/tools/request-clerk/concretes/FetchRequestClerk.js'

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

/**
 * Answer the headers at once with a body that loads until the signal aborts.
 *
 * @param {RequestInfo | URL} input - Request.
 * @param {RequestInit} [init] - Options of fetch().
 * @returns {Promise<Response>} Promise of the response.
 */
async function fetchHeadersUntilAbort (
  input,
  {
    signal,
  } = {}
) {
  const loadBodyUntilAbort = () => new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason)

      return
    }

    signal?.addEventListener('abort', () => {
      reject(signal.reason)
    })
  })

  const response = {
    clone: () => response,
    arrayBuffer: loadBodyUntilAbort,
    blob: loadBodyUntilAbort,
    text: loadBodyUntilAbort,
  }

  return /** @type {Response} */ (/** @type {*} */ (response))
}

/**
 * @param {Promise<Response>} promise - Promise of the response.
 * @returns {Promise<*>} Reason of the rejection.
 */
async function captureRejection (promise) {
  try {
    await promise
  } catch (error) {
    return error
  }

  throw new Error('the promise resolved')
}

describe('FetchRequestClerk', () => {
  describe('#buildResponse()', () => {
    describe('should reject with TypeError as XMLHttpRequestClerk does', () => {
      test('with a network failure', async () => {
        const cause = new TypeError('fetch failed')

        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockRejectedValue(cause)

        const clerk = FetchRequestClerk.create({
          request: new Request('https://example.com/alpha'),
        })

        const actual = await captureRejection(clerk.buildResponse())

        expect(actual)
          .toBeInstanceOf(TypeError)
        expect(actual)
          .toHaveProperty('message', 'Network request failed')
        expect(actual)
          .toHaveProperty('cause', cause)
      })

      test('after the timeout', async () => {
        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockImplementation(fetchUntilAbort)

        const clerk = FetchRequestClerk.create({
          request: new Request('https://example.com/alpha'),
          config: {
            timeout: 10,
          },
        })

        const actual = await captureRejection(clerk.buildResponse())

        expect(actual)
          .toBeInstanceOf(TypeError)
        expect(actual)
          .toHaveProperty('message', 'Network request timed out')
        expect(actual.cause)
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

        const actual = await captureRejection(clerk.buildResponse())

        expect(actual)
          .toBeInstanceOf(TypeError)
        expect(actual)
          .toHaveProperty('message', 'Network request aborted')
      })

      test('with the request aborted by a custom reason while it waits', async () => {
        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockImplementation(fetchUntilAbort)

        const abortController = new AbortController()

        const clerk = FetchRequestClerk.create({
          request: new Request('https://example.com/alpha', {
            signal: abortController.signal,
          }),
        })

        const promise = clerk.buildResponse()

        abortController.abort(new Error('user left the page'))

        const actual = await captureRejection(promise)

        expect(actual)
          .toBeInstanceOf(TypeError)
        expect(actual)
          .toHaveProperty('message', 'Network request aborted')
      })
    })

    describe('should reject with TypeError when the body stops after the headers', () => {
      const cases = [
        {
          title: 'past the timeout',
          timeout: 10,
          leaveRequest: (/** @type {AbortController} */ abortController) => {},
          expected: 'Network request timed out',
        },
        {
          title: 'with the request aborted',
          timeout: 0,
          leaveRequest: (/** @type {AbortController} */ abortController) => {
            abortController.abort()
          },
          expected: 'Network request aborted',
        },
      ]

      test.each(cases)('$title', async ({ timeout, leaveRequest, expected }) => {
        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockImplementation(fetchHeadersUntilAbort)

        const abortController = new AbortController()

        const clerk = FetchRequestClerk.create({
          request: new Request('https://example.com/alpha', {
            signal: abortController.signal,
          }),
          config: {
            timeout,
          },
        })

        const promise = clerk.buildResponse()

        leaveRequest(abortController)

        const actual = await captureRejection(promise)

        expect(actual)
          .toBeInstanceOf(TypeError)
        expect(actual)
          .toHaveProperty('message', expected)
      })
    })

    describe('should leave the body of the request unread after a failure', () => {
      test('with .fetch() reading the body it receives', async () => {
        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockImplementation(async input => {
            await /** @type {Request} */ (input).text()

            throw new TypeError('fetch failed')
          })

        const request = new Request('https://example.com/alpha', {
          method: 'POST',
          body: '{"first":"alpha"}',
        })

        await expect(
          FetchRequestClerk.create({
            request,
          })
            .buildResponse()
        )
          .rejects
          .toThrow('Network request failed')

        expect(request.bodyUsed)
          .toBe(false)
      })
    })

    describe('should leave the request unchanged after a failure', () => {
      test('with the body unread and the properties kept', async () => {
        jest.spyOn(FetchRequestClerk, 'fetch')
          .mockRejectedValue(new TypeError('fetch failed'))

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
  })
})
