import XMLHttpFetcher from '../../../../../../lib/tools/http-fetchers/concretes/XMLHttpFetcher.js'

import BaseHttpFetcher from '../../../../../../lib/tools/http-fetchers/BaseHttpFetcher.js'
import HeadersParser from '../../../../../../lib/tools/HeadersParser.js'
import XMLHttpParcel from '../../../../../../lib/tools/http-fetchers/parcels/concretes/XMLHttpParcel.js'
import XMLHttpRequestClerk from '../../../../../../lib/tools/http-fetchers/tools/XMLHttpRequestClerk.js'

describe('XMLHttpFetcher', () => {
  describe('inheritance', () => {
    test('should be correct class', () => {
      const received = XMLHttpFetcher.prototype

      expect(received)
        .toBeInstanceOf(BaseHttpFetcher)
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#requestClerk', () => {
        const alphaRequestClerk = XMLHttpRequestClerk.create()
        const betaRequestClerk = XMLHttpRequestClerk.create()

        const cases = [
          {
            input: {
              requestClerk: alphaRequestClerk,
            },
            expected: alphaRequestClerk,
          },
          {
            input: {
              requestClerk: betaRequestClerk,
            },
            expected: betaRequestClerk,
          },
        ]

        test.each(cases)('requestClerk: $input.requestClerk', ({ input, expected }) => {
          const args = {
            request: new Request('https://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
            requestClerk: input.requestClerk,
          }

          const fetcher = new XMLHttpFetcher(args)

          expect(fetcher)
            .toHaveProperty('requestClerk', expected)
        })
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('.create()', () => {
    const cases = [
      {
        tally: {
          request: new Request('https://example.com/resource-0001'),
          config: {
            timeoutMilliseconds: 1000,
          },
          requestClerk: XMLHttpRequestClerk.create(),
        },
      },
      {
        tally: {
          request: new Request('https://example.com/resource-0002'),
          config: {
            timeoutMilliseconds: 0,
          },
          requestClerk: XMLHttpRequestClerk.create(),
        },
      },
    ]

    describe('should be an instance of own class', () => {
      test.each(cases)('url: $tally.request.url', ({ tally }) => {
        const fetcher = XMLHttpFetcher.create(tally)

        expect(fetcher)
          .toBeInstanceOf(XMLHttpFetcher)
      })
    })

    describe('should call constructor', () => {
      test.each(cases)('url: $tally.request.url', ({ tally }) => {
        const SpyClass = constructorSpy.spyOn(XMLHttpFetcher)

        SpyClass.create(tally)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(tally)
      })
    })

    describe('should fill default requestClerk', () => {
      const alphaRequest = new Request('https://example.com/resource-0003')

      test('without requestClerk', () => {
        const input = {
          request: alphaRequest,
          config: {},
        }
        const expected = {
          request: alphaRequest,
          config: {},
          requestClerk: expect.any(XMLHttpRequestClerk),
        }

        const createXMLHttpRequestClerkSpy = jest.spyOn(XMLHttpFetcher, 'createXMLHttpRequestClerk')
        const SpyClass = constructorSpy.spyOn(XMLHttpFetcher)

        SpyClass.create(input)

        expect(createXMLHttpRequestClerkSpy)
          .toHaveBeenCalledWith()
        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('.get:XMLHttpRequestClerkCtor', () => {
    describe('when called as is', () => {
      test('should be XMLHttpRequestClerk', () => {
        const received = XMLHttpFetcher.XMLHttpRequestClerkCtor

        expect(received)
          .toBe(XMLHttpRequestClerk) // same reference
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('.get:HeadersParserCtor', () => {
    describe('when called as is', () => {
      test('should be HeadersParser', () => {
        const received = XMLHttpFetcher.HeadersParserCtor

        expect(received)
          .toBe(HeadersParser) // same reference
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('.get:HttpParcelCtor', () => {
    describe('when called as is', () => {
      test('should be XMLHttpParcel', () => {
        const received = XMLHttpFetcher.HttpParcelCtor

        expect(received)
          .toBe(XMLHttpParcel) // same reference
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('.createXMLHttpRequestClerk()', () => {
    describe('when called as is', () => {
      test('should be an instance of XMLHttpRequestClerk', () => {
        const received = XMLHttpFetcher.createXMLHttpRequestClerk()

        expect(received)
          .toBeInstanceOf(XMLHttpRequestClerk)
      })

      test('should call the factory method of XMLHttpRequestClerk with no arguments', () => {
        const createSpy = jest.spyOn(XMLHttpRequestClerk, 'create')

        XMLHttpFetcher.createXMLHttpRequestClerk()

        expect(createSpy)
          .toHaveBeenCalledWith()
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('.createHeadersParser()', () => {
    describe('should be an instance of HeadersParser', () => {
      const cases = [
        {
          input: {
            haystack: 'Content-Type: application/json\r\n',
          },
        },
        {
          input: {
            haystack: 'Content-Type: text/plain\r\nX-Header-0001: 1\r\n',
          },
        },
      ]

      test.each(cases)('haystack: $input.haystack', ({ input }) => {
        const received = XMLHttpFetcher.createHeadersParser(input)

        expect(received)
          .toBeInstanceOf(HeadersParser)
      })
    })

    describe('should call the factory method of HeadersParser', () => {
      const cases = [
        {
          tally: {
            haystack: 'Content-Type: application/json\r\n',
          },
        },
        {
          tally: {
            haystack: 'Content-Type: text/plain\r\nX-Header-0001: 1\r\n',
          },
        },
      ]

      test.each(cases)('haystack: $tally.haystack', ({ tally }) => {
        const createSpy = jest.spyOn(HeadersParser, 'create')

        XMLHttpFetcher.createHeadersParser(tally)

        expect(createSpy)
          .toHaveBeenCalledWith(tally)
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('.createRequestBody()', () => {
    describe('when method does not send a body', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001', {
              method: 'GET',
            }),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002', {
              method: 'DELETE',
            }),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0003', {
              method: 'HEAD',
            }),
          },
        },
      ]

      test.each(cases)('method: $input.request.method', async ({ input }) => {
        const received = await XMLHttpFetcher.createRequestBody(input)

        expect(received)
          .toBeNull()
      })
    })

    describe('when method sends a body', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001', {
              method: 'POST',
              body: '{"name":"Alpha"}',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
            }),
          },
          expected: '{"name":"Alpha"}',
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002', {
              method: 'PUT',
              body: 'name=Beta',
              headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
              }),
            }),
          },
          expected: 'name=Beta',
        },
        {
          input: {
            request: new Request('https://example.com/resource-0003', {
              method: 'PATCH',
              body: '--alpha--',
              headers: new Headers({
                'Content-Type': 'multipart/form-data; boundary=alpha',
              }),
            }),
          },
          expected: '--alpha--',
        },
      ]

      describe('should resolve to a Blob', () => {
        test.each(cases)('method: $input.request.method', async ({ input }) => {
          const received = await XMLHttpFetcher.createRequestBody(input)

          expect(received)
            .toBeInstanceOf(Blob)
        })
      })

      describe('should resolve to the bytes of the body', () => {
        test.each(cases)('method: $input.request.method', async ({ input, expected }) => {
          const blob = await XMLHttpFetcher.createRequestBody(input)
          const response = new Response(blob)
          const received = await response.text()

          expect(received)
            .toBe(expected)
        })
      })

      describe('should leave the given request unread', () => {
        test.each(cases)('method: $input.request.method', async ({ input }) => {
          await XMLHttpFetcher.createRequestBody(input)

          const received = input.request.bodyUsed

          expect(received)
            .toBe(false)
        })
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('.isBodyRequiredMethod()', () => {
    describe('should be true for a method that sends a body', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001', {
              method: 'POST',
              body: 'text-0001',
            }),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002', {
              method: 'PUT',
              body: 'text-0002',
            }),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0003', {
              method: 'PATCH',
              body: 'text-0003',
            }),
          },
        },
      ]

      test.each(cases)('method: $input.request.method', ({ input }) => {
        const received = XMLHttpFetcher.isBodyRequiredMethod(input)

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false for a method that does not send a body', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001', {
              method: 'GET',
            }),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002', {
              method: 'DELETE',
            }),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0003', {
              method: 'HEAD',
            }),
          },
        },
      ]

      test.each(cases)('method: $input.request.method', ({ input }) => {
        const received = XMLHttpFetcher.isBodyRequiredMethod(input)

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('.isNullBodyStatus()', () => {
    describe('should be true for a status of a response without a body', () => {
      const cases = [
        {
          input: {
            status: 204,
          },
        },
        {
          input: {
            status: 205,
          },
        },
        {
          input: {
            status: 304,
          },
        },
      ]

      test.each(cases)('status: $input.status', ({ input }) => {
        const received = XMLHttpFetcher.isNullBodyStatus(input)

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false for a status of a response with a body', () => {
      const cases = [
        {
          input: {
            status: 200,
          },
        },
        {
          input: {
            status: 201,
          },
        },
        {
          input: {
            status: 404,
          },
        },
        {
          input: {
            status: 500,
          },
        },
      ]

      test.each(cases)('status: $input.status', ({ input }) => {
        const received = XMLHttpFetcher.isNullBodyStatus(input)

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('#get:Ctor', () => {
    class AlphaXMLHttpFetcher extends XMLHttpFetcher {}

    class BetaXMLHttpFetcher extends XMLHttpFetcher {}

    describe('should be constructor of instance', () => {
      const cases = [
        {
          input: {
            Fetcher: XMLHttpFetcher,
          },
          expected: XMLHttpFetcher,
        },
        {
          input: {
            Fetcher: AlphaXMLHttpFetcher,
          },
          expected: AlphaXMLHttpFetcher,
        },
        {
          input: {
            Fetcher: BetaXMLHttpFetcher,
          },
          expected: BetaXMLHttpFetcher,
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

describe('XMLHttpFetcher', () => {
  describe('#receiveResponse()', () => {
    describe('when the whole response is received', () => {
      const cases = [
        {
          override: {
            xmlHttpRequest: new XMLHttpRequest(),
            status: 200,
            statusText: 'OK',
            headersText: 'Content-Type: text/plain\r\n',
            response: Uint8Array.from([116, 101, 120, 116, 45, 48, 48, 48, 49]).buffer, // text-0001
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
          expected: {
            status: 200,
            text: 'text-0001',
          },
        },
        {
          override: {
            xmlHttpRequest: new XMLHttpRequest(),
            status: 404,
            statusText: 'Not Found',
            headersText: 'Content-Type: text/plain\r\n',
            response: Uint8Array.from([116, 101, 120, 116, 45, 48, 48, 48, 50]).buffer, // text-0002
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
          expected: {
            status: 404,
            text: 'text-0002',
          },
        },
      ]

      describe('should resolve the response with the status code and the body', () => {
        test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
          const requestClerk = XMLHttpRequestClerk.create({
            xmlHttpRequest: override.xmlHttpRequest,
          })
          const fetcher = XMLHttpFetcher.create({
            request: input.request,
            config: input.config,
            requestClerk,
          })
          const args = {
            sink: {}, // Neutral value
            signal: new AbortController().signal, // Neutral value
          }

          jest.spyOn(override.xmlHttpRequest, 'status', 'get')
            .mockReturnValue(override.status)
          jest.spyOn(override.xmlHttpRequest, 'statusText', 'get')
            .mockReturnValue(override.statusText)
          jest.spyOn(override.xmlHttpRequest, 'response', 'get')
            .mockReturnValue(override.response)
          jest.spyOn(override.xmlHttpRequest, 'getAllResponseHeaders')
            .mockReturnValue(override.headersText)
          jest.spyOn(fetcher, 'invokeSend')
            .mockImplementation(() => {
              override.xmlHttpRequest.dispatchEvent(new ProgressEvent('load'))
            })

          const received = await fetcher.receiveResponse(args)
          const receivedText = await received.text()

          expect(received)
            .toHaveProperty('status', expected.status)
          expect(receivedText)
            .toBe(expected.text)
        })
      })
    })

    describe('when the request failed', () => {
      const cases = [
        {
          override: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
          },
          expected: 'NetworkError',
        },
        {
          override: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
          },
          expected: 'NetworkError',
        },
      ]

      describe('should reject with an error named NetworkError', () => {
        test.each(cases)('url: $input.request.url', async ({ override, input, expected }) => {
          const requestClerk = XMLHttpRequestClerk.create({
            xmlHttpRequest: override.xmlHttpRequest,
          })
          const fetcher = XMLHttpFetcher.create({
            request: input.request,
            config: input.config,
            requestClerk,
          })
          const args = {
            sink: {}, // Neutral value
            signal: new AbortController().signal, // Neutral value
          }

          jest.spyOn(fetcher, 'invokeSend')
            .mockImplementation(() => {
              override.xmlHttpRequest.dispatchEvent(new ProgressEvent('error'))
            })

          const received = () => fetcher.receiveResponse(args)

          await expect(received)
            .rejects
            .toHaveProperty('name', expected)
        })
      })
    })

    describe('when the signal is already aborted', () => {
      const alphaReason = new DOMException('The operation was aborted.', 'AbortError')
      const betaReason = new DOMException('The operation timed out.', 'TimeoutError')

      const cases = [
        {
          override: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            reason: alphaReason,
          },
          expected: alphaReason,
        },
        {
          override: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            reason: betaReason,
          },
          expected: betaReason,
        },
      ]

      describe('should reject with the reason of the signal', () => {
        test.each(cases)('reason: $input.reason.name', async ({ override, input, expected }) => {
          const requestClerk = XMLHttpRequestClerk.create({
            xmlHttpRequest: override.xmlHttpRequest,
          })
          const fetcher = XMLHttpFetcher.create({
            request: input.request,
            config: input.config,
            requestClerk,
          })
          const controller = new AbortController()

          controller.abort(input.reason)

          const args = {
            sink: {}, // Neutral value
            signal: controller.signal,
          }

          const received = () => fetcher.receiveResponse(args)

          await expect(received)
            .rejects
            .toBe(expected) // same reference
        })
      })

      describe('should not send the request', () => {
        test.each(cases)('reason: $input.reason.name', async ({ override, input }) => {
          const requestClerk = XMLHttpRequestClerk.create({
            xmlHttpRequest: override.xmlHttpRequest,
          })
          const fetcher = XMLHttpFetcher.create({
            request: input.request,
            config: input.config,
            requestClerk,
          })
          const controller = new AbortController()

          controller.abort(input.reason)

          const args = {
            sink: {}, // Neutral value
            signal: controller.signal,
          }

          const invokeSendSpy = jest.spyOn(fetcher, 'invokeSend')

          await fetcher.receiveResponse(args)
            .catch(() => {})

          expect(invokeSendSpy)
            .not
            .toHaveBeenCalled()
        })
      })
    })

    describe('when the signal aborts the request while it is sent', () => {
      const alphaReason = new DOMException('The operation was aborted.', 'AbortError')
      const betaReason = new DOMException('The operation timed out.', 'TimeoutError')

      const cases = [
        {
          override: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            reason: alphaReason,
          },
          expected: alphaReason,
        },
        {
          override: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            reason: betaReason,
          },
          expected: betaReason,
        },
      ]

      describe('should abort the request through the clerk', () => {
        test.each(cases)('reason: $input.reason.name', async ({ override, input }) => {
          const requestClerk = XMLHttpRequestClerk.create({
            xmlHttpRequest: override.xmlHttpRequest,
          })
          const fetcher = XMLHttpFetcher.create({
            request: input.request,
            config: input.config,
            requestClerk,
          })
          const controller = new AbortController()
          const args = {
            sink: {}, // Neutral value
            signal: controller.signal,
          }

          const abortRequestSpy = jest.spyOn(requestClerk, 'abortRequest')
            .mockImplementation(() => {
              override.xmlHttpRequest.dispatchEvent(new ProgressEvent('abort'))
            })
          jest.spyOn(fetcher, 'invokeSend')
            .mockImplementation(() => {
              controller.abort(input.reason)
            })

          await fetcher.receiveResponse(args)
            .catch(() => {})

          expect(abortRequestSpy)
            .toHaveBeenCalledWith()
        })
      })

      describe('should reject with the reason of the signal', () => {
        test.each(cases)('reason: $input.reason.name', async ({ override, input, expected }) => {
          const requestClerk = XMLHttpRequestClerk.create({
            xmlHttpRequest: override.xmlHttpRequest,
          })
          const fetcher = XMLHttpFetcher.create({
            request: input.request,
            config: input.config,
            requestClerk,
          })
          const controller = new AbortController()
          const args = {
            sink: {}, // Neutral value
            signal: controller.signal,
          }

          jest.spyOn(requestClerk, 'abortRequest')
            .mockImplementation(() => {
              override.xmlHttpRequest.dispatchEvent(new ProgressEvent('abort'))
            })
          jest.spyOn(fetcher, 'invokeSend')
            .mockImplementation(() => {
              controller.abort(input.reason)
            })

          const received = () => fetcher.receiveResponse(args)

          await expect(received)
            .rejects
            .toBe(expected) // same reference
        })
      })
    })

    describe('when the upload makes progress', () => {
      const cases = [
        {
          override: {
            xmlHttpRequest: new XMLHttpRequest(),
            progressEvent: new ProgressEvent('progress', {
              lengthComputable: true,
              loaded: 100001,
              total: 200001,
            }),
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            sink: {
              onUploadProgress: () => {},
            },
          },
        },
        {
          override: {
            xmlHttpRequest: new XMLHttpRequest(),
            progressEvent: new ProgressEvent('progress', {
              lengthComputable: true,
              loaded: 100002,
              total: 200002,
            }),
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            sink: {
              onUploadProgress: () => {},
            },
          },
        },
      ]

      describe('should call onUploadProgress of the sink with the request and the event', () => {
        test.each(cases)('url: $input.request.url', async ({ override, input }) => {
          const onUploadProgressSpy = jest.spyOn(input.sink, 'onUploadProgress')

          const requestClerk = XMLHttpRequestClerk.create({
            xmlHttpRequest: override.xmlHttpRequest,
          })
          const fetcher = XMLHttpFetcher.create({
            request: input.request,
            config: input.config,
            requestClerk,
          })
          const args = {
            sink: input.sink,
            signal: new AbortController().signal, // Neutral value
          }

          jest.spyOn(fetcher, 'invokeSend')
            .mockImplementation(() => {
              override.xmlHttpRequest.upload.dispatchEvent(override.progressEvent)
              override.xmlHttpRequest.dispatchEvent(new ProgressEvent('error'))
            })

          await fetcher.receiveResponse(args)
            .catch(() => {})

          expect(onUploadProgressSpy)
            .toHaveBeenCalledWith({
              request: input.request,
              progressEvent: override.progressEvent,
            })
        })
      })
    })

    describe('when the download makes progress', () => {
      const cases = [
        {
          override: {
            xmlHttpRequest: new XMLHttpRequest(),
            progressEvent: new ProgressEvent('progress', {
              lengthComputable: true,
              loaded: 100001,
              total: 200001,
            }),
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            sink: {
              onDownloadProgress: () => {},
            },
          },
        },
        {
          override: {
            xmlHttpRequest: new XMLHttpRequest(),
            progressEvent: new ProgressEvent('progress', {
              lengthComputable: true,
              loaded: 100002,
              total: 200002,
            }),
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            sink: {
              onDownloadProgress: () => {},
            },
          },
        },
      ]

      describe('should call onDownloadProgress of the sink with the request and the event', () => {
        test.each(cases)('url: $input.request.url', async ({ override, input }) => {
          const onDownloadProgressSpy = jest.spyOn(input.sink, 'onDownloadProgress')

          const requestClerk = XMLHttpRequestClerk.create({
            xmlHttpRequest: override.xmlHttpRequest,
          })
          const fetcher = XMLHttpFetcher.create({
            request: input.request,
            config: input.config,
            requestClerk,
          })
          const args = {
            sink: input.sink,
            signal: new AbortController().signal, // Neutral value
          }

          jest.spyOn(fetcher, 'invokeSend')
            .mockImplementation(() => {
              override.xmlHttpRequest.dispatchEvent(override.progressEvent)
              override.xmlHttpRequest.dispatchEvent(new ProgressEvent('error'))
            })

          await fetcher.receiveResponse(args)
            .catch(() => {})

          expect(onDownloadProgressSpy)
            .toHaveBeenCalledWith({
              request: input.request,
              progressEvent: override.progressEvent,
            })
        })
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('#setupRequestClerk()', () => {
    const alphaRequest = new Request('https://example.com/resource-0001', {
      method: 'GET',
      credentials: 'include',
      headers: new Headers({
        'X-Header-0001': 'text-0001',
      }),
    })
    const betaRequest = new Request('https://example.com/resource-0002', {
      method: 'POST',
      body: 'text-0002',
      credentials: 'omit',
      headers: new Headers({
        'X-Header-0002': 'text-0002',
      }),
    })
    const alphaRequestClerk = XMLHttpRequestClerk.create()
    const betaRequestClerk = XMLHttpRequestClerk.create()

    const cases = [
      {
        input: {
          request: alphaRequest,
          requestClerk: alphaRequestClerk,
        },
        expected: {
          requestClerk: alphaRequestClerk,
          openRequest: {
            method: 'GET',
            url: 'https://example.com/resource-0001',
          },
          setResponseType: {
            responseType: 'arraybuffer',
          },
          setWithCredentials: {
            withCredentials: true,
          },
          setRequestHeaders: {
            headers: alphaRequest.headers,
          },
        },
      },
      {
        input: {
          request: betaRequest,
          requestClerk: betaRequestClerk,
        },
        expected: {
          requestClerk: betaRequestClerk,
          openRequest: {
            method: 'POST',
            url: 'https://example.com/resource-0002',
          },
          setResponseType: {
            responseType: 'arraybuffer',
          },
          setWithCredentials: {
            withCredentials: false,
          },
          setRequestHeaders: {
            headers: betaRequest.headers,
          },
        },
      },
    ]

    describe('should open the request with the method and the URL', () => {
      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const createArgs = {
          request: input.request,
          config: {}, // Neutral value
          requestClerk: input.requestClerk,
        }

        const fetcher = XMLHttpFetcher.create(createArgs)
        const openRequestSpy = jest.spyOn(input.requestClerk, 'openRequest')

        fetcher.setupRequestClerk()

        expect(openRequestSpy)
          .toHaveBeenCalledWith(expected.openRequest)
      })
    })

    describe('should receive the response body as an array buffer', () => {
      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const createArgs = {
          request: input.request,
          config: {}, // Neutral value
          requestClerk: input.requestClerk,
        }

        const fetcher = XMLHttpFetcher.create(createArgs)
        const setResponseTypeSpy = jest.spyOn(input.requestClerk, 'setResponseType')

        fetcher.setupRequestClerk()

        expect(setResponseTypeSpy)
          .toHaveBeenCalledWith(expected.setResponseType)
      })
    })

    describe('should set whether the request carries credentials', () => {
      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const createArgs = {
          request: input.request,
          config: {}, // Neutral value
          requestClerk: input.requestClerk,
        }

        const fetcher = XMLHttpFetcher.create(createArgs)
        const setWithCredentialsSpy = jest.spyOn(input.requestClerk, 'setWithCredentials')

        fetcher.setupRequestClerk()

        expect(setWithCredentialsSpy)
          .toHaveBeenCalledWith(expected.setWithCredentials)
      })
    })

    describe('should set the headers of the request', () => {
      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const createArgs = {
          request: input.request,
          config: {}, // Neutral value
          requestClerk: input.requestClerk,
        }

        const fetcher = XMLHttpFetcher.create(createArgs)
        const setRequestHeadersSpy = jest.spyOn(input.requestClerk, 'setRequestHeaders')

        fetcher.setupRequestClerk()

        expect(setRequestHeadersSpy)
          .toHaveBeenCalledWith(expected.setRequestHeaders)
      })
    })

    describe('should be the clerk that has been setup', () => {
      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const createArgs = {
          request: input.request,
          config: {}, // Neutral value
          requestClerk: input.requestClerk,
        }

        const fetcher = XMLHttpFetcher.create(createArgs)

        const received = fetcher.setupRequestClerk()

        expect(received)
          .toBe(expected.requestClerk) // same reference
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('#shouldSendCredentials()', () => {
    describe('should be true when the credentials mode of the request is include', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001', {
              credentials: 'include',
            }),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002', {
              method: 'POST',
              body: 'text-0002',
              credentials: 'include',
            }),
          },
        },
      ]

      test.each(cases)('url: $input.request.url', ({ input }) => {
        const createArgs = {
          request: input.request,
          config: {}, // Neutral value
        }

        const fetcher = XMLHttpFetcher.create(createArgs)

        const received = fetcher.shouldSendCredentials()

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false when the credentials mode of the request is not include', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001', {
              credentials: 'omit',
            }),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002', {
              credentials: 'same-origin',
            }),
          },
        },
      ]

      test.each(cases)('credentials: $input.request.credentials', ({ input }) => {
        const createArgs = {
          request: input.request,
          config: {}, // Neutral value
        }

        const fetcher = XMLHttpFetcher.create(createArgs)

        const received = fetcher.shouldSendCredentials()

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('#buildClerkSink()', () => {
    describe('should call the member of the sink with the request and the event when the upload makes progress', () => {
      const alphaRequest = new Request('https://example.com/resource-0001')
      const betaRequest = new Request('https://example.com/resource-0002')
      const alphaProgressEvent = new ProgressEvent('progress', {
        lengthComputable: true,
        loaded: 100001,
        total: 200001,
      })
      const betaProgressEvent = new ProgressEvent('progress', {
        lengthComputable: true,
        loaded: 100002,
        total: 200002,
      })

      const cases = [
        {
          input: {
            request: alphaRequest,
            config: {},
            sink: {
              onUploadProgress: () => {},
            },
            progressEvent: alphaProgressEvent,
          },
          expected: {
            request: alphaRequest,
            progressEvent: alphaProgressEvent,
          },
        },
        {
          input: {
            request: betaRequest,
            config: {},
            sink: {
              onUploadProgress: () => {},
            },
            progressEvent: betaProgressEvent,
          },
          expected: {
            request: betaRequest,
            progressEvent: betaProgressEvent,
          },
        },
      ]

      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const createArgs = {
          request: input.request,
          config: input.config,
        }
        const buildClerkSinkArgs = {
          sink: input.sink,
          signal: new AbortController().signal, // Neutral value
          resolve: () => {}, // Neutral value
        }

        const fetcher = XMLHttpFetcher.create(createArgs)
        const onUploadProgressSpy = jest.spyOn(input.sink, 'onUploadProgress')

        const clerkSink = fetcher.buildClerkSink(buildClerkSinkArgs)

        clerkSink.onUploadProgress(input.progressEvent)

        expect(onUploadProgressSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should call the member of the sink with the request and the event when the download makes progress', () => {
      const alphaRequest = new Request('https://example.com/resource-0001')
      const betaRequest = new Request('https://example.com/resource-0002')
      const alphaProgressEvent = new ProgressEvent('progress', {
        lengthComputable: true,
        loaded: 100003,
        total: 200003,
      })
      const betaProgressEvent = new ProgressEvent('progress', {
        lengthComputable: true,
        loaded: 100004,
        total: 200004,
      })

      const cases = [
        {
          input: {
            request: alphaRequest,
            config: {},
            sink: {
              onDownloadProgress: () => {},
            },
            progressEvent: alphaProgressEvent,
          },
          expected: {
            request: alphaRequest,
            progressEvent: alphaProgressEvent,
          },
        },
        {
          input: {
            request: betaRequest,
            config: {},
            sink: {
              onDownloadProgress: () => {},
            },
            progressEvent: betaProgressEvent,
          },
          expected: {
            request: betaRequest,
            progressEvent: betaProgressEvent,
          },
        },
      ]

      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const createArgs = {
          request: input.request,
          config: input.config,
        }
        const buildClerkSinkArgs = {
          sink: input.sink,
          signal: new AbortController().signal, // Neutral value
          resolve: () => {}, // Neutral value
        }

        const fetcher = XMLHttpFetcher.create(createArgs)
        const onDownloadProgressSpy = jest.spyOn(input.sink, 'onDownloadProgress')

        const clerkSink = fetcher.buildClerkSink(buildClerkSinkArgs)

        clerkSink.onDownloadProgress(input.progressEvent)

        expect(onDownloadProgressSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should not throw for a progress when the sink holds no member for it', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            sink: {},
            progressEvent: new ProgressEvent('progress'),
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            sink: undefined,
            progressEvent: new ProgressEvent('progress'),
          },
        },
      ]

      test.each(cases)('sink: $input.sink', ({ input }) => {
        const createArgs = {
          request: input.request,
          config: input.config,
        }
        const buildClerkSinkArgs = {
          sink: input.sink,
          signal: new AbortController().signal, // Neutral value
          resolve: () => {}, // Neutral value
        }

        const fetcher = XMLHttpFetcher.create(createArgs)

        const clerkSink = fetcher.buildClerkSink(buildClerkSinkArgs)

        expect(() => clerkSink.onUploadProgress(input.progressEvent))
          .not
          .toThrow()
        expect(() => clerkSink.onDownloadProgress(input.progressEvent))
          .not
          .toThrow()
      })
    })

    describe('should resolve the response when the whole response is received', () => {
      const alphaResponse = new Response('text-0001')
      const betaResponse = new Response('text-0002')

      const cases = [
        {
          override: {
            response: alphaResponse,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            resolve: () => {},
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
            resolve: () => {},
          },
          expected: betaResponse,
        },
      ]

      test.each(cases)('url: $input.request.url', ({ override, input, expected }) => {
        const resolveSpy = jest.spyOn(input, 'resolve')

        const buildClerkSinkArgs = {
          sink: {}, // Neutral value
          signal: new AbortController().signal, // Neutral value
          resolve: input.resolve,
          reject: () => {}, // Neutral value
        }

        const fetcher = XMLHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        jest.spyOn(fetcher, 'createResponse')
          .mockReturnValue(override.response)
        const clerkSink = fetcher.buildClerkSink(buildClerkSinkArgs)

        clerkSink.onLoad(new ProgressEvent('load'))

        expect(resolveSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should reject with the error when the response cannot be built', () => {
      const alphaError = new Error('Error 0001')
      const betaError = new Error('Error 0002')

      const cases = [
        {
          override: {
            error: alphaError,
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            reject: () => {},
          },
          expected: alphaError,
        },
        {
          override: {
            error: betaError,
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            reject: () => {},
          },
          expected: betaError,
        },
      ]

      test.each(cases)('url: $input.request.url', ({ override, input, expected }) => {
        const rejectSpy = jest.spyOn(input, 'reject')

        const buildClerkSinkArgs = {
          sink: {}, // Neutral value
          signal: new AbortController().signal, // Neutral value
          resolve: () => {}, // Neutral value
          reject: input.reject,
        }

        const fetcher = XMLHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        jest.spyOn(fetcher, 'createResponse')
          .mockImplementation(() => {
            throw override.error
          })
        const clerkSink = fetcher.buildClerkSink(buildClerkSinkArgs)

        clerkSink.onLoad(new ProgressEvent('load'))

        expect(rejectSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should reject with the reason of the signal when the request is aborted', () => {
      const alphaReason = new DOMException('The operation was aborted.', 'AbortError')
      const betaReason = new DOMException('The operation timed out.', 'TimeoutError')

      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            reason: alphaReason,
            reject: () => {},
          },
          expected: alphaReason,
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            reason: betaReason,
            reject: () => {},
          },
          expected: betaReason,
        },
      ]

      test.each(cases)('reason: $input.reason.name', ({ input, expected }) => {
        const rejectSpy = jest.spyOn(input, 'reject')

        const controller = new AbortController()

        controller.abort(input.reason)

        const buildClerkSinkArgs = {
          sink: {}, // Neutral value
          signal: controller.signal,
          resolve: () => {}, // Neutral value
          reject: input.reject,
        }

        const fetcher = XMLHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const clerkSink = fetcher.buildClerkSink(buildClerkSinkArgs)

        clerkSink.onAbort(new ProgressEvent('abort'))

        expect(rejectSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should reject with an error named AbortError when the request is aborted without the signal aborted', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            reject: () => {},
          },
          expected: 'AbortError',
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            reject: () => {},
          },
          expected: 'AbortError',
        },
      ]

      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const rejectSpy = jest.spyOn(input, 'reject')

        const buildClerkSinkArgs = {
          sink: {}, // Neutral value
          signal: new AbortController().signal, // Neutral value: not aborted
          resolve: () => {}, // Neutral value
          reject: input.reject,
        }

        const fetcher = XMLHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const clerkSink = fetcher.buildClerkSink(buildClerkSinkArgs)

        clerkSink.onAbort(new ProgressEvent('abort'))

        expect(rejectSpy)
          .toHaveBeenCalledWith(expect.objectContaining({
            name: expected,
          }))
      })
    })

    describe('should reject with an error named NetworkError when the request fails', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            reject: () => {},
          },
          expected: 'NetworkError',
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            reject: () => {},
          },
          expected: 'NetworkError',
        },
      ]

      test.each(cases)('url: $input.request.url', ({ input, expected }) => {
        const rejectSpy = jest.spyOn(input, 'reject')

        const buildClerkSinkArgs = {
          sink: {}, // Neutral value
          signal: new AbortController().signal, // Neutral value
          resolve: () => {}, // Neutral value
          reject: input.reject,
        }

        const fetcher = XMLHttpFetcher.create({
          request: input.request,
          config: input.config,
        })

        const clerkSink = fetcher.buildClerkSink(buildClerkSinkArgs)

        clerkSink.onError(new ProgressEvent('error'))

        expect(rejectSpy)
          .toHaveBeenCalledWith(expect.objectContaining({
            name: expected,
          }))
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('#createResponse()', () => {
    const cases = [
      {
        override: {
          status: 200,
          statusText: 'OK',
          headersText: 'Content-Type: application/json\r\nContent-Length: 10000\r\n',
          response: Uint8Array.from([116, 101, 120, 116, 45, 48, 48, 48, 49]).buffer, // text-0001
        },
        input: {
          requestClerk: XMLHttpRequestClerk.create(),
        },
        expected: new Response(
          Uint8Array.from([116, 101, 120, 116, 45, 48, 48, 48, 49]).buffer, // text-0001
          {
            status: 200,
            statusText: 'OK',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Content-Length': '10000',
            }),
          }
        ),
      },
      {
        override: {
          status: 404,
          statusText: 'Not Found',
          headersText: 'Content-Type: text/plain\r\n',
          response: Uint8Array.from([116, 101, 120, 116, 45, 48, 48, 48, 50]).buffer, // text-0002
        },
        input: {
          requestClerk: XMLHttpRequestClerk.create(),
        },
        expected: new Response(
          Uint8Array.from([116, 101, 120, 116, 45, 48, 48, 48, 50]).buffer, // text-0002
          {
            status: 404,
            statusText: 'Not Found',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          }
        ),
      },
      {
        override: {
          status: 204,
          statusText: 'No Content',
          headersText: 'X-Header-0001: text-0001\r\n',
          response: Uint8Array.from([]).buffer,
        },
        input: {
          requestClerk: XMLHttpRequestClerk.create(),
        },
        expected: new Response(
          null,
          {
            status: 204,
            statusText: 'No Content',
            headers: new Headers({
              'X-Header-0001': 'text-0001',
            }),
          }
        ),
      },
    ]

    describe('should be a response of what the clerk received', () => {
      test.each(cases)('status: $override.status', ({ override, input, expected }) => {
        const createArgs = {
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          requestClerk: input.requestClerk,
        }

        const fetcher = XMLHttpFetcher.create(createArgs)

        jest.spyOn(input.requestClerk, 'status', 'get')
          .mockReturnValue(override.status)
        jest.spyOn(input.requestClerk, 'statusText', 'get')
          .mockReturnValue(override.statusText)
        jest.spyOn(input.requestClerk, 'response', 'get')
          .mockReturnValue(override.response)
        jest.spyOn(input.requestClerk, 'extractAllResponseHeadersText')
          .mockReturnValue(override.headersText)

        const received = fetcher.createResponse()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('#extractResponseBody()', () => {
    describe('when the status is of a response without a body', () => {
      const cases = [
        {
          override: {
            status: 204,
            response: Uint8Array.from([]).buffer,
          },
          input: {
            requestClerk: XMLHttpRequestClerk.create(),
          },
        },
        {
          override: {
            status: 205,
            response: Uint8Array.from([]).buffer,
          },
          input: {
            requestClerk: XMLHttpRequestClerk.create(),
          },
        },
        {
          override: {
            status: 304,
            response: Uint8Array.from([]).buffer,
          },
          input: {
            requestClerk: XMLHttpRequestClerk.create(),
          },
        },
      ]

      describe('should be null', () => {
        test.each(cases)('status: $override.status', ({ override, input }) => {
          const createArgs = {
            request: new Request('https://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
            requestClerk: input.requestClerk,
          }

          const fetcher = XMLHttpFetcher.create(createArgs)

          jest.spyOn(input.requestClerk, 'status', 'get')
            .mockReturnValue(override.status)
          jest.spyOn(input.requestClerk, 'response', 'get')
            .mockReturnValue(override.response)

          const received = fetcher.extractResponseBody()

          expect(received)
            .toBeNull()
        })
      })
    })

    describe('when the status is of a response with a body', () => {
      const alphaBody = Uint8Array.from([116, 101, 120, 116, 45, 48, 48, 48, 49]).buffer // text-0001
      const betaBody = Uint8Array.from([116, 101, 120, 116, 45, 48, 48, 48, 50]).buffer // text-0002
      const gammaBody = Uint8Array.from([116, 101, 120, 116, 45, 48, 48, 48, 51]).buffer // text-0003

      const cases = [
        {
          override: {
            status: 200,
            response: alphaBody,
          },
          input: {
            requestClerk: XMLHttpRequestClerk.create(),
          },
          expected: alphaBody,
        },
        {
          override: {
            status: 404,
            response: betaBody,
          },
          input: {
            requestClerk: XMLHttpRequestClerk.create(),
          },
          expected: betaBody,
        },
        {
          override: {
            status: 500,
            response: gammaBody,
          },
          input: {
            requestClerk: XMLHttpRequestClerk.create(),
          },
          expected: gammaBody,
        },
      ]

      describe('should be the response of the clerk', () => {
        test.each(cases)('status: $override.status', ({ override, input, expected }) => {
          const createArgs = {
            request: new Request('https://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
            requestClerk: input.requestClerk,
          }

          const fetcher = XMLHttpFetcher.create(createArgs)

          jest.spyOn(input.requestClerk, 'status', 'get')
            .mockReturnValue(override.status)
          jest.spyOn(input.requestClerk, 'response', 'get')
            .mockReturnValue(override.response)

          const received = fetcher.extractResponseBody()

          expect(received)
            .toBe(expected) // same reference
        })
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('#resolveResponseUrl()', () => {
    describe('should be the URL of the response that the clerk reports', () => {
      const cases = [
        {
          override: {
            responseUrl: 'https://example.com/resource-0003',
          },
          input: {
            request: new Request('https://example.com/resource-0001'),
            config: {},
            requestClerk: XMLHttpRequestClerk.create(),
          },
          expected: 'https://example.com/resource-0003',
        },
        {
          override: {
            responseUrl: 'https://example.com/resource-0004',
          },
          input: {
            request: new Request('https://example.com/resource-0002'),
            config: {},
            requestClerk: XMLHttpRequestClerk.create(),
          },
          expected: 'https://example.com/resource-0004',
        },
      ]

      test.each(cases)('responseUrl: $override.responseUrl', ({ override, input, expected }) => {
        const args = {
          response: new Response(''), // Neutral value: the response built from XMLHttpRequest holds no URL
        }

        const fetcher = XMLHttpFetcher.create(input)

        jest.spyOn(input.requestClerk, 'responseUrl', 'get')
          .mockReturnValue(override.responseUrl)

        const received = fetcher.resolveResponseUrl(args)

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('XMLHttpFetcher', () => {
  describe('#invokeSend()', () => {
    const alphaBlob = new Blob(['text-0001'])

    describe('should send the request body through the clerk', () => {
      const cases = [
        {
          input: {
            requestClerk: XMLHttpRequestClerk.create(),
            requestBody: null,
          },
          expected: {
            requestBody: null,
          },
        },
        {
          input: {
            requestClerk: XMLHttpRequestClerk.create(),
            requestBody: alphaBlob,
          },
          expected: {
            requestBody: alphaBlob,
          },
        },
      ]

      test.each(cases)('requestBody: $input.requestBody', ({ input, expected }) => {
        const createArgs = {
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          requestClerk: input.requestClerk,
        }
        const invokeSendArgs = {
          requestBody: input.requestBody,
        }

        const fetcher = XMLHttpFetcher.create(createArgs)
        const sendRequestSpy = jest.spyOn(input.requestClerk, 'sendRequest')
          .mockReturnValue(input.requestClerk)

        fetcher.invokeSend(invokeSendArgs)

        expect(sendRequestSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should be the clerk that sent the request', () => {
      const alphaRequestClerk = XMLHttpRequestClerk.create()
      const betaRequestClerk = XMLHttpRequestClerk.create()

      const cases = [
        {
          input: {
            requestClerk: alphaRequestClerk,
            requestBody: null,
          },
          expected: alphaRequestClerk,
        },
        {
          input: {
            requestClerk: betaRequestClerk,
            requestBody: alphaBlob,
          },
          expected: betaRequestClerk,
        },
      ]

      test.each(cases)('requestBody: $input.requestBody', ({ input, expected }) => {
        const createArgs = {
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          requestClerk: input.requestClerk,
        }
        const invokeSendArgs = {
          requestBody: input.requestBody,
        }

        const fetcher = XMLHttpFetcher.create(createArgs)

        jest.spyOn(input.requestClerk, 'sendRequest')
          .mockReturnValue(input.requestClerk)

        const received = fetcher.invokeSend(invokeSendArgs)

        expect(received)
          .toBe(expected) // same reference
      })
    })
  })
})
