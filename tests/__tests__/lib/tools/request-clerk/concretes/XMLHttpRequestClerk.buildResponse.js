import {
  createClerkWithStub,
  createHttpRequestStub,
  createNullBodyCheckingResponse,
} from '~/tests/helpers/xml-http-request-clerk.js'

describe('XMLHttpRequestClerk', () => {
  describe('#buildResponse()', () => {
    describe('should resolve to the response of the load', () => {
      const cases = [
        {
          status: 200,
          statusText: 'OK',
          body: '{"message":"Success"}',
          responseHeaders: 'Content-Type: application/json\r\nContent-Length: 10000\r\n',
        },
        {
          status: 404,
          statusText: 'Not Found',
          body: '{"message":"Not Found"}',
          responseHeaders: 'Content-Type: application/json\r\n',
        },
      ]

      test.each(cases)('status: $status', async ({ status, statusText, body, responseHeaders }) => {
        const { clerk } = createClerkWithStub({
          stub: createHttpRequestStub({
            status,
            statusText,
            response: body,
            responseHeaders,
          }),
        })

        const actual = await clerk.buildResponse()

        expect(actual)
          .toBeInstanceOf(Response)
        expect(actual)
          .toHaveProperty('status', status)
        expect(actual)
          .toHaveProperty('statusText', statusText)
        expect(actual.headers.get('Content-Type'))
          .toBe('application/json')
        await expect(actual.text())
          .resolves
          .toBe(body)
      })
    })

    describe('should build a response without body on a null body status', () => {
      const cases = [
        {
          status: 204,
        },
        {
          status: 205,
        },
        {
          status: 304,
        },
      ]

      test.each(cases)('status: $status', async ({ status }) => {
        jest.spyOn(globalThis, 'Response')
          .mockImplementation(createNullBodyCheckingResponse)

        const { clerk } = createClerkWithStub({
          stub: createHttpRequestStub({
            status,
            response: '',
          }),
        })

        const actual = await clerk.buildResponse()

        expect(actual)
          .toHaveProperty('status', status)
      })
    })

    describe('should create its own XMLHttpRequest with the config', () => {
      test('on every call', async () => {
        const { clerk, createSpy } = createClerkWithStub({
          config: {
            timeout: 3000,
            responseType: 'blob',
            withCredentials: true,
          },
        })

        await clerk.buildResponse()
        await clerk.buildResponse()

        expect(createSpy)
          .toHaveBeenCalledTimes(2)
        expect(createSpy)
          .toHaveBeenNthCalledWith(1, {
            timeout: 3000,
            responseType: 'blob',
            withCredentials: true,
          })
      })
    })

    describe('should open the request asynchronously', () => {
      const cases = [
        {
          method: 'GET',
          url: 'https://example.com/alpha',
        },
        {
          method: 'DELETE',
          url: 'https://example.com/beta?key=value',
        },
      ]

      test.each(cases)('method: $method', async ({ method, url }) => {
        const { clerk, stub } = createClerkWithStub({
          request: new Request(url, {
            method,
          }),
        })

        await clerk.buildResponse()

        expect(stub.openedWith)
          .toStrictEqual([
            [method, url, true],
          ])
      })
    })

    describe('should set the headers of the request', () => {
      test('with every header entry', async () => {
        const { clerk, stub } = createClerkWithStub({
          request: new Request('https://example.com/alpha', {
            headers: {
              'x-first': 'alpha',
              'x-second': 'beta',
            },
          }),
        })

        await clerk.buildResponse()

        expect(stub.headersSet)
          .toStrictEqual([
            ['x-first', 'alpha'],
            ['x-second', 'beta'],
          ])
      })
    })

    describe('should send the body of the request', () => {
      test('as null for a GET', async () => {
        const { clerk, stub } = createClerkWithStub()

        await clerk.buildResponse()

        expect(stub.sentBodies)
          .toStrictEqual([
            null,
          ])
      })

      test('as a Blob for a POST', async () => {
        const { clerk, stub } = createClerkWithStub({
          request: new Request('https://example.com/alpha', {
            method: 'POST',
            body: '{"first":"alpha"}',
          }),
        })

        await clerk.buildResponse()

        const [sentBody] = stub.sentBodies

        expect(sentBody)
          .toBeInstanceOf(Blob)
        const response = new Response(sentBody)

        await expect(response.text())
          .resolves
          .toBe('{"first":"alpha"}')
      })
    })
  })
})
