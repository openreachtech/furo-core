import {
  createClerkWithStub,
  createHttpRequestStub,
} from '~/tests/helpers/xml-http-request-clerk.js'

describe('XMLHttpRequestClerk', () => {
  describe('#buildResponse()', () => {
    describe('should report progress to the sink', () => {
      test('with the upload progress of the request', async () => {
        const onUploadProgress = jest.fn()
        const request = new Request('https://example.com/alpha')
        const progressEvent = new ProgressEvent('progress')

        const { clerk, stub } = createClerkWithStub({
          request,
          stub: createHttpRequestStub({
            outcome: 'pending',
          }),
          sink: {
            onUploadProgress,
          },
        })

        const promise = clerk.buildResponse()

        await Promise.resolve()

        stub.uploadListeners.progress(progressEvent)
        stub.listeners.load()

        await promise

        expect(onUploadProgress)
          .toHaveBeenCalledWith({
            request,
            progressEvent,
          })
      })

      test('with the download progress of the request', async () => {
        const onDownloadProgress = jest.fn()
        const request = new Request('https://example.com/alpha')
        const progressEvent = new ProgressEvent('progress')

        const { clerk, stub } = createClerkWithStub({
          request,
          stub: createHttpRequestStub({
            outcome: 'pending',
          }),
          sink: {
            onDownloadProgress,
          },
        })

        const promise = clerk.buildResponse()

        await Promise.resolve()

        stub.listeners.progress(progressEvent)
        stub.listeners.load()

        await promise

        expect(onDownloadProgress)
          .toHaveBeenCalledWith({
            request,
            progressEvent,
          })
      })

      test('without callbacks in the sink', async () => {
        const { clerk, stub } = createClerkWithStub({
          stub: createHttpRequestStub({
            outcome: 'pending',
          }),
        })

        const promise = clerk.buildResponse()

        await Promise.resolve()

        stub.uploadListeners.progress(new ProgressEvent('progress'))
        stub.listeners.progress(new ProgressEvent('progress'))
        stub.listeners.load()

        await expect(promise)
          .resolves
          .toBeInstanceOf(Response)
      })
    })

    describe('should reject with a TypeError', () => {
      const cases = [
        {
          outcome: 'error',
          message: 'Network request failed',
        },
        {
          outcome: 'timeout',
          message: 'Network request timed out',
        },
        {
          outcome: 'abort',
          message: 'Network request aborted',
        },
      ]

      test.each(cases)('on $outcome', async ({ outcome, message }) => {
        const { clerk } = createClerkWithStub({
          stub: createHttpRequestStub({
            outcome: /** @type {'error' | 'timeout' | 'abort'} */ (outcome),
          }),
        })

        const promise = clerk.buildResponse()

        await expect(promise)
          .rejects
          .toBeInstanceOf(TypeError)
        await expect(promise)
          .rejects
          .toThrow(message)
      })
    })

    describe('should abort with the signal of the request', () => {
      test('when the request is already aborted', async () => {
        const abortController = new AbortController()

        abortController.abort()

        const { clerk, stub } = createClerkWithStub({
          request: new Request('https://example.com/alpha', {
            signal: abortController.signal,
          }),
        })

        await expect(clerk.buildResponse())
          .rejects
          .toThrow('Network request aborted')

        expect(stub.sentBodies)
          .toStrictEqual([])
      })

      test('when the request aborts while it waits', async () => {
        const abortController = new AbortController()

        const { clerk, stub } = createClerkWithStub({
          request: new Request('https://example.com/alpha', {
            signal: abortController.signal,
          }),
          stub: createHttpRequestStub({
            outcome: 'pending',
          }),
        })

        const promise = clerk.buildResponse()

        await Promise.resolve()

        abortController.abort()

        await expect(promise)
          .rejects
          .toThrow('Network request aborted')

        expect(stub.abortCount)
          .toBe(1)
      })

      test('not after the load', async () => {
        const abortController = new AbortController()

        const { clerk, stub } = createClerkWithStub({
          request: new Request('https://example.com/alpha', {
            signal: abortController.signal,
          }),
        })

        await clerk.buildResponse()

        abortController.abort()

        expect(stub.abortCount)
          .toBe(0)
      })
    })

    describe('should leave the state unchanged after a failure', () => {
      test('with the request body unread and the properties kept', async () => {
        const request = new Request('https://example.com/alpha', {
          method: 'POST',
          body: '{"first":"alpha"}',
        })
        const config = {
          timeout: 3000,
          responseType: /** @type {XMLHttpRequestResponseType} */ (''),
          withCredentials: false,
        }
        const sink = {
          onUploadProgress: jest.fn(),
        }

        const { clerk } = createClerkWithStub({
          request,
          config,
          sink,
          stub: createHttpRequestStub({
            outcome: 'error',
          }),
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
        expect(clerk)
          .toHaveProperty('sink', sink)
      })

      test('with a retry that builds a response', async () => {
        const { clerk, createSpy } = createClerkWithStub({
          stub: createHttpRequestStub({
            outcome: 'error',
          }),
        })

        await expect(clerk.buildResponse())
          .rejects
          .toThrow('Network request failed')

        createSpy.mockReturnValue(createHttpRequestStub())

        await expect(clerk.buildResponse())
          .resolves
          .toHaveProperty('status', 200)
      })
    })
  })
})
