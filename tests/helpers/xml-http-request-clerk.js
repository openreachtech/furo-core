import XMLHttpRequestClerk from '~/lib/tools/request-clerk/concretes/XMLHttpRequestClerk.js'

const OriginalResponse = Response

/**
 * Create a response that rejects a body on a null body status, as the Fetch Standard does.
 *
 * @param {BodyInit | null} [body] - Body.
 * @param {ResponseInit} [init] - Options.
 * @returns {Response} Response.
 * @throws {TypeError} When a body comes with a null body status.
 */
export function createNullBodyCheckingResponse (
  body = null,
  init = {}
) {
  if ([204, 205, 304].includes(init.status ?? 200) && body !== null) {
    throw new TypeError('Response with null body status cannot have body')
  }

  return new OriginalResponse(body, init)
}

/**
 * Create a stub of XMLHttpRequest that records calls and settles as `outcome` on send.
 *
 * @param {{
 *   outcome?: 'load' | 'error' | 'timeout' | 'abort' | 'pending'
 *   status?: number
 *   statusText?: string
 *   response?: *
 *   responseHeaders?: string
 * }} [params] - Parameters.
 * @returns {*} Stub of XMLHttpRequest.
 */
export function createHttpRequestStub ({
  outcome = 'load',
  status = 200,
  statusText = 'OK',
  response = '{}',
  responseHeaders = 'Content-Type: application/json\r\n',
} = {}) {
  /** @type {Record<string, Function>} */
  const listeners = {}

  /** @type {Record<string, Function>} */
  const uploadListeners = {}

  return {
    status,
    statusText,
    response,
    listeners,
    uploadListeners,
    openedWith: [],
    headersSet: [],
    sentBodies: [],
    abortCount: 0,
    getAllResponseHeaders () {
      return responseHeaders
    },

    /**
     * @param {string} eventName - Name of the event.
     * @param {Function} listener - Listener of the event.
     */
    addEventListener (
      eventName,
      listener
    ) {
      listeners[eventName] = listener
    },
    upload: {
      /**
       * @param {string} eventName - Name of the event.
       * @param {Function} listener - Listener of the event.
       */
      addEventListener (
        eventName,
        listener
      ) {
        uploadListeners[eventName] = listener
      },
    },

    /**
     * @param {...*} args - Arguments of open().
     */
    open (...args) {
      this.openedWith.push(args)
    },

    /**
     * @param {string} key - Name of the header.
     * @param {string} value - Value of the header.
     */
    setRequestHeader (
      key,
      value
    ) {
      this.headersSet.push([key, value])
    },
    abort () {
      this.abortCount += 1

      listeners.abort?.()
    },

    /**
     * @param {*} body - Body to send.
     */
    send (body) {
      this.sentBodies.push(body)

      if (outcome !== 'pending') {
        listeners[outcome]?.()
      }
    },
  }
}

/**
 * @param {{
 *   request?: Request
 *   config?: Partial<import('~/lib/tools/request-clerk/BaseRequestClerk.js').RequestClerkConfig>
 *   sink?: Record<string, *>
 *   stub?: *
 * }} [params] - Parameters.
 * @returns {{
 *   clerk: XMLHttpRequestClerk
 *   stub: *
 *   createSpy: jest.SpyInstance
 * }} Clerk wired to the stub.
 */
export function createClerkWithStub ({
  request = new Request('https://example.com/alpha'),
  config = {},
  sink = {},
  stub = createHttpRequestStub(),
} = {}) {
  const createSpy = jest.spyOn(XMLHttpRequestClerk, 'createXMLHttpRequest')
    .mockReturnValue(stub)

  const clerk = XMLHttpRequestClerk.create({
    request,
    config,
    sink,
  })

  return {
    clerk,
    stub,
    createSpy,
  }
}
