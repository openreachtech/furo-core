import XMLHttpRequestClerk from '../../../../../../lib/tools/http-fetchers/tools/XMLHttpRequestClerk.js'

import { XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP } from '../../../../../../lib/tools/http-fetchers/tools/constants/XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP.js'
import { XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP } from '../../../../../../lib/tools/http-fetchers/tools/constants/XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP.js'

describe('XMLHttpRequestClerk', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#xmlHttpRequest', () => {
        const alphaHttpRequest = new XMLHttpRequest()
        const betaHttpRequest = new XMLHttpRequest()

        const cases = [
          {
            input: {
              xmlHttpRequest: alphaHttpRequest,
            },
            expected: alphaHttpRequest,
          },
          {
            input: {
              xmlHttpRequest: betaHttpRequest,
            },
            expected: betaHttpRequest,
          },
        ]

        test.each(cases)('xmlHttpRequest: $input.xmlHttpRequest', ({ input, expected }) => {
          const clerk = new XMLHttpRequestClerk(input)

          expect(clerk)
            .toHaveProperty('xmlHttpRequest', expected)
        })
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('.create()', () => {
    const cases = [
      {
        tally: {
          xmlHttpRequest: new XMLHttpRequest(),
        },
      },
      {
        tally: {
          xmlHttpRequest: new XMLHttpRequest(),
        },
      },
    ]

    describe('should be an instance of own class', () => {
      test.each(cases)('xmlHttpRequest: $tally.xmlHttpRequest', ({ tally }) => {
        const clerk = XMLHttpRequestClerk.create(tally)

        expect(clerk)
          .toBeInstanceOf(XMLHttpRequestClerk)
      })

      test('with no arguments', () => {
        const clerk = XMLHttpRequestClerk.create()

        expect(clerk)
          .toBeInstanceOf(XMLHttpRequestClerk)
      })
    })

    describe('should call constructor', () => {
      test.each(cases)('xmlHttpRequest: $tally.xmlHttpRequest', ({ tally }) => {
        const SpyClass = constructorSpy.spyOn(XMLHttpRequestClerk)

        SpyClass.create(tally)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(tally)
      })
    })

    describe('should fill default xmlHttpRequest', () => {
      test('with no arguments', () => {
        const expected = {
          xmlHttpRequest: expect.any(XMLHttpRequest),
        }

        const createXMLHttpRequestSpy = jest.spyOn(XMLHttpRequestClerk, 'createXMLHttpRequest')
        const SpyClass = constructorSpy.spyOn(XMLHttpRequestClerk)

        SpyClass.create()

        expect(createXMLHttpRequestSpy)
          .toHaveBeenCalledWith()
        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('.get:XMLHttpRequestCtor', () => {
    describe('when called as is', () => {
      test('should be XMLHttpRequest', () => {
        const received = XMLHttpRequestClerk.XMLHttpRequestCtor

        expect(received)
          .toBe(XMLHttpRequest) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('.get:requestSinkEventNameLookup', () => {
    describe('when called as is', () => {
      test('should be XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP', () => {
        const received = XMLHttpRequestClerk.requestSinkEventNameLookup

        expect(received)
          .toBe(XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('.get:uploadSinkEventNameLookup', () => {
    describe('when called as is', () => {
      test('should be XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP', () => {
        const received = XMLHttpRequestClerk.uploadSinkEventNameLookup

        expect(received)
          .toBe(XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('.createXMLHttpRequest()', () => {
    describe('when called as is', () => {
      test('should be an instance of XMLHttpRequest', () => {
        const received = XMLHttpRequestClerk.createXMLHttpRequest()

        expect(received)
          .toBeInstanceOf(XMLHttpRequest)
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#get:Ctor', () => {
    class AlphaXMLHttpRequestClerk extends XMLHttpRequestClerk {}

    class BetaXMLHttpRequestClerk extends XMLHttpRequestClerk {}

    describe('should be constructor of instance', () => {
      const cases = [
        {
          input: {
            Clerk: XMLHttpRequestClerk,
          },
          expected: XMLHttpRequestClerk,
        },
        {
          input: {
            Clerk: AlphaXMLHttpRequestClerk,
          },
          expected: AlphaXMLHttpRequestClerk,
        },
        {
          input: {
            Clerk: BetaXMLHttpRequestClerk,
          },
          expected: BetaXMLHttpRequestClerk,
        },
      ]

      test.each(cases)('Clerk: $input.Clerk.name', ({ input, expected }) => {
        const clerk = input.Clerk.create()

        const received = clerk.Ctor

        expect(received)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#get:status', () => {
    describe('should be the status code of the response', () => {
      const cases = [
        {
          override: {
            status: 200,
          },
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          expected: 200,
        },
        {
          override: {
            status: 404,
          },
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          expected: 404,
        },
      ]

      test.each(cases)('status: $override.status', ({ override, input, expected }) => {
        jest.spyOn(input.xmlHttpRequest, 'status', 'get')
          .mockReturnValue(override.status)

        const clerk = XMLHttpRequestClerk.create(input)

        const received = clerk.status

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#get:statusText', () => {
    describe('should be the status text of the response', () => {
      const cases = [
        {
          override: {
            statusText: 'OK',
          },
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          expected: 'OK',
        },
        {
          override: {
            statusText: 'Not Found',
          },
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          expected: 'Not Found',
        },
      ]

      test.each(cases)('statusText: $override.statusText', ({ override, input, expected }) => {
        jest.spyOn(input.xmlHttpRequest, 'statusText', 'get')
          .mockReturnValue(override.statusText)

        const clerk = XMLHttpRequestClerk.create(input)

        const received = clerk.statusText

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#get:response', () => {
    describe('should be the response body', () => {
      const alphaBody = Uint8Array.from([116, 101, 120, 116, 45, 48, 48, 48, 49]).buffer // text-0001
      const betaBody = Uint8Array.from([116, 101, 120, 116, 45, 48, 48, 48, 50]).buffer // text-0002

      const cases = [
        {
          override: {
            response: alphaBody,
          },
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          expected: alphaBody,
        },
        {
          override: {
            response: betaBody,
          },
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          expected: betaBody,
        },
      ]

      test.each(cases)('xmlHttpRequest: $input.xmlHttpRequest', ({ override, input, expected }) => {
        jest.spyOn(input.xmlHttpRequest, 'response', 'get')
          .mockReturnValue(override.response)

        const clerk = XMLHttpRequestClerk.create(input)

        const received = clerk.response

        expect(received)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#get:responseUrl', () => {
    describe('should be the URL of the response', () => {
      const cases = [
        {
          override: {
            responseUrl: 'https://example.com/resource-0001',
          },
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          expected: 'https://example.com/resource-0001',
        },
        {
          override: {
            responseUrl: 'https://example.com/resource-0002',
          },
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          expected: 'https://example.com/resource-0002',
        },
      ]

      test.each(cases)('responseUrl: $override.responseUrl', ({ override, input, expected }) => {
        jest.spyOn(input.xmlHttpRequest, 'responseURL', 'get')
          .mockReturnValue(override.responseUrl)

        const clerk = XMLHttpRequestClerk.create(input)

        const received = clerk.responseUrl

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#extractAllResponseHeadersText()', () => {
    describe('should be all the response headers as a text', () => {
      const cases = [
        {
          override: {
            headersText: 'Content-Type: text/plain\r\nX-Header-0001: text-0001\r\n',
          },
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          expected: 'Content-Type: text/plain\r\nX-Header-0001: text-0001\r\n',
        },
        {
          override: {
            headersText: 'Content-Type: application/json\r\nX-Header-0002: text-0002\r\n',
          },
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
          },
          expected: 'Content-Type: application/json\r\nX-Header-0002: text-0002\r\n',
        },
      ]

      test.each(cases)('headersText: $override.headersText', ({ override, input, expected }) => {
        jest.spyOn(input.xmlHttpRequest, 'getAllResponseHeaders')
          .mockReturnValue(override.headersText)

        const clerk = XMLHttpRequestClerk.create(input)

        const received = clerk.extractAllResponseHeadersText()

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#openRequest()', () => {
    const cases = [
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          method: 'GET',
          url: 'https://example.com/resource-0001',
        },
        expected: [
          'GET',
          'https://example.com/resource-0001',
          true,
        ],
      },
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          method: 'POST',
          url: 'https://example.com/resource-0002',
        },
        expected: [
          'POST',
          'https://example.com/resource-0002',
          true,
        ],
      },
    ]

    describe('should open the request asynchronously with the method and the URL', () => {
      test.each(cases)('method: $input.method', ({ input, expected }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const openRequestArgs = {
          method: input.method,
          url: input.url,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)
        const openSpy = jest.spyOn(input.xmlHttpRequest, 'open')

        clerk.openRequest(openRequestArgs)

        expect(openSpy)
          .toHaveBeenCalledWith(...expected)
      })
    })

    describe('should be the clerk itself for method chaining', () => {
      test.each(cases)('method: $input.method', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const openRequestArgs = {
          method: input.method,
          url: input.url,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        const received = clerk.openRequest(openRequestArgs)

        expect(received)
          .toBe(clerk) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#setResponseType()', () => {
    const cases = [
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          responseType: 'arraybuffer',
        },
        expected: 'arraybuffer',
      },
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          responseType: 'blob',
        },
        expected: 'blob',
      },
    ]

    describe('should set the response type to XMLHttpRequest', () => {
      test.each(cases)('responseType: $input.responseType', ({ input, expected }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const setResponseTypeArgs = {
          responseType: input.responseType,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        clerk.setResponseType(setResponseTypeArgs)

        const received = input.xmlHttpRequest.responseType

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be the clerk itself for method chaining', () => {
      test.each(cases)('responseType: $input.responseType', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const setResponseTypeArgs = {
          responseType: input.responseType,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        const received = clerk.setResponseType(setResponseTypeArgs)

        expect(received)
          .toBe(clerk) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#setTimeoutMilliseconds()', () => {
    const cases = [
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          timeoutMilliseconds: 1000,
        },
        expected: 1000,
      },
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          timeoutMilliseconds: 30000,
        },
        expected: 30000,
      },
    ]

    describe('should set the timeout to XMLHttpRequest', () => {
      test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input, expected }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const setTimeoutMillisecondsArgs = {
          timeoutMilliseconds: input.timeoutMilliseconds,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        clerk.setTimeoutMilliseconds(setTimeoutMillisecondsArgs)

        const received = input.xmlHttpRequest.timeout

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be the clerk itself for method chaining', () => {
      test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const setTimeoutMillisecondsArgs = {
          timeoutMilliseconds: input.timeoutMilliseconds,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        const received = clerk.setTimeoutMilliseconds(setTimeoutMillisecondsArgs)

        expect(received)
          .toBe(clerk) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#setWithCredentials()', () => {
    const cases = [
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          withCredentials: true,
        },
        expected: true,
      },
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          withCredentials: false,
        },
        expected: false,
      },
    ]

    describe('should set whether the request carries credentials to XMLHttpRequest', () => {
      test.each(cases)('withCredentials: $input.withCredentials', ({ input, expected }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const setWithCredentialsArgs = {
          withCredentials: input.withCredentials,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        clerk.setWithCredentials(setWithCredentialsArgs)

        const received = input.xmlHttpRequest.withCredentials

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be the clerk itself for method chaining', () => {
      test.each(cases)('withCredentials: $input.withCredentials', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const setWithCredentialsArgs = {
          withCredentials: input.withCredentials,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        const received = clerk.setWithCredentials(setWithCredentialsArgs)

        expect(received)
          .toBe(clerk) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#setRequestHeaders()', () => {
    const cases = [
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          headers: new Headers({
            'X-Header-0001': 'text-0001',
            'X-Header-0002': 'text-0002',
          }),
        },
        expected: {
          first: ['x-header-0001', 'text-0001'],
          second: ['x-header-0002', 'text-0002'],
        },
      },
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          headers: new Headers({
            'X-Header-0003': 'text-0003',
            'X-Header-0004': 'text-0004',
          }),
        },
        expected: {
          first: ['x-header-0003', 'text-0003'],
          second: ['x-header-0004', 'text-0004'],
        },
      },
    ]

    describe('should set each header to XMLHttpRequest', () => {
      test.each(cases)('headers: $input.headers', ({ input, expected }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const setRequestHeadersArgs = {
          headers: input.headers,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)
        const setRequestHeaderSpy = jest.spyOn(input.xmlHttpRequest, 'setRequestHeader')
          .mockImplementation(() => {})

        clerk.setRequestHeaders(setRequestHeadersArgs)

        expect(setRequestHeaderSpy)
          .toHaveBeenCalledTimes(2)
        expect(setRequestHeaderSpy)
          .toHaveBeenNthCalledWith(1, ...expected.first)
        expect(setRequestHeaderSpy)
          .toHaveBeenNthCalledWith(2, ...expected.second)
      })
    })

    describe('should be the clerk itself for method chaining', () => {
      test.each(cases)('headers: $input.headers', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const setRequestHeadersArgs = {
          headers: input.headers,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        jest.spyOn(input.xmlHttpRequest, 'setRequestHeader')
          .mockImplementation(() => {})

        const received = clerk.setRequestHeaders(setRequestHeadersArgs)

        expect(received)
          .toBe(clerk) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#addEventListener()', () => {
    const loadEvent = new ProgressEvent('load')
    const errorEvent = new ProgressEvent('error')

    const cases = [
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          eventName: 'load',
          listener: () => {},
        },
        tally: loadEvent,
      },
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          eventName: 'error',
          listener: () => {},
        },
        tally: errorEvent,
      },
    ]

    describe('should call the listener when the event occurs on XMLHttpRequest', () => {
      test.each(cases)('eventName: $input.eventName', ({ input, tally }) => {
        const listenerSpy = jest.spyOn(input, 'listener')

        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const addEventListenerArgs = {
          eventName: input.eventName,
          listener: input.listener,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        clerk.addEventListener(addEventListenerArgs)
        input.xmlHttpRequest.dispatchEvent(tally)

        expect(listenerSpy)
          .toHaveBeenCalledWith(tally)
      })
    })

    describe('should be the clerk itself for method chaining', () => {
      test.each(cases)('eventName: $input.eventName', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const addEventListenerArgs = {
          eventName: input.eventName,
          listener: input.listener,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        const received = clerk.addEventListener(addEventListenerArgs)

        expect(received)
          .toBe(clerk) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#addUploadEventListener()', () => {
    const progressEvent = new ProgressEvent('progress')
    const loadEvent = new ProgressEvent('load')

    const cases = [
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          eventName: 'progress',
          listener: () => {},
        },
        tally: progressEvent,
      },
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          eventName: 'load',
          listener: () => {},
        },
        tally: loadEvent,
      },
    ]

    describe('should call the listener when the event occurs on the upload', () => {
      test.each(cases)('eventName: $input.eventName', ({ input, tally }) => {
        const listenerSpy = jest.spyOn(input, 'listener')

        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const addUploadEventListenerArgs = {
          eventName: input.eventName,
          listener: input.listener,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        clerk.addUploadEventListener(addUploadEventListenerArgs)
        input.xmlHttpRequest.upload.dispatchEvent(tally)

        expect(listenerSpy)
          .toHaveBeenCalledWith(tally)
      })
    })

    describe('should be the clerk itself for method chaining', () => {
      test.each(cases)('eventName: $input.eventName', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const addUploadEventListenerArgs = {
          eventName: input.eventName,
          listener: input.listener,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        const received = clerk.addUploadEventListener(addUploadEventListenerArgs)

        expect(received)
          .toBe(clerk) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#addSink()', () => {
    const cases = [
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
        },
        tally: {
          sink: {
            onLoad: () => {},
            onUploadProgress: () => {},
          },
        },
      },
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
        },
        tally: {
          sink: {
            onError: () => {},
            onUploadLoadEnd: () => {},
          },
        },
      },
    ]

    describe('should add the members that are notified of the events of the request', () => {
      test.each(cases)('sink: $tally.sink', ({ input, tally }) => {
        const clerk = XMLHttpRequestClerk.create(input)
        const addRequestSinkSpy = jest.spyOn(clerk, 'addRequestSink')
          .mockReturnValue(clerk)

        jest.spyOn(clerk, 'addUploadSink')
          .mockReturnValue(clerk)

        clerk.addSink(tally)

        expect(addRequestSinkSpy)
          .toHaveBeenCalledWith(tally)
      })
    })

    describe('should add the members that are notified of the events of the upload', () => {
      test.each(cases)('sink: $tally.sink', ({ input, tally }) => {
        const clerk = XMLHttpRequestClerk.create(input)

        jest.spyOn(clerk, 'addRequestSink')
          .mockReturnValue(clerk)
        const addUploadSinkSpy = jest.spyOn(clerk, 'addUploadSink')
          .mockReturnValue(clerk)

        clerk.addSink(tally)

        expect(addUploadSinkSpy)
          .toHaveBeenCalledWith(tally)
      })
    })

    describe('should be the clerk itself for method chaining', () => {
      test.each(cases)('sink: $tally.sink', ({ input, tally }) => {
        const clerk = XMLHttpRequestClerk.create(input)

        const received = clerk.addSink(tally)

        expect(received)
          .toBe(clerk) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#addRequestSink()', () => {
    describe('should call the member of the sink with the event when the event occurs on XMLHttpRequest', () => {
      const event01 = new ProgressEvent('loadstart')
      const event02 = new ProgressEvent('progress')
      const event03 = new ProgressEvent('load')
      const event04 = new ProgressEvent('abort')
      const event05 = new ProgressEvent('error')
      const event06 = new ProgressEvent('timeout')
      const event07 = new ProgressEvent('loadend')
      const event08 = new Event('readystatechange')

      const cases = [
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onLoadStart',
            sink: {
              onLoadStart: () => {},
            },
          },
          tally: event01,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onDownloadProgress',
            sink: {
              onDownloadProgress: () => {},
            },
          },
          tally: event02,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onLoad',
            sink: {
              onLoad: () => {},
            },
          },
          tally: event03,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onAbort',
            sink: {
              onAbort: () => {},
            },
          },
          tally: event04,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onError',
            sink: {
              onError: () => {},
            },
          },
          tally: event05,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onTimeout',
            sink: {
              onTimeout: () => {},
            },
          },
          tally: event06,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onLoadEnd',
            sink: {
              onLoadEnd: () => {},
            },
          },
          tally: event07,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onReadyStateChange',
            sink: {
              onReadyStateChange: () => {},
            },
          },
          tally: event08,
        },
      ]

      test.each(cases)('memberName: $input.memberName', ({ input, tally }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const addRequestSinkArgs = {
          sink: input.sink,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)
        const memberSpy = jest.spyOn(input.sink, input.memberName)

        clerk.addRequestSink(addRequestSinkArgs)
        input.xmlHttpRequest.dispatchEvent(tally)

        expect(memberSpy)
          .toHaveBeenCalledWith(tally)
      })
    })

    describe('should not add a member that the sink does not hold', () => {
      const cases = [
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            sink: {},
          },
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            sink: {
              onUnknownMember: () => {}, // a member that no event is named for
            },
          },
        },
      ]

      test.each(cases)('sink: $input.sink', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const addRequestSinkArgs = {
          sink: input.sink,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)
        const addEventListenerSpy = jest.spyOn(clerk, 'addEventListener')

        clerk.addRequestSink(addRequestSinkArgs)

        expect(addEventListenerSpy)
          .not
          .toHaveBeenCalled()
      })
    })

    describe('should not add a member that is not a function', () => {
      const cases = /** @type {Array<*>} */ ([
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            sink: {
              onLoad: null,
            },
          },
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            sink: {
              onError: 'text-0001', // a string, where a function is expected
            },
          },
        },
      ])

      test.each(cases)('sink: $input.sink', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const addRequestSinkArgs = {
          sink: input.sink,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)
        const addEventListenerSpy = jest.spyOn(clerk, 'addEventListener')

        clerk.addRequestSink(addRequestSinkArgs)

        expect(addEventListenerSpy)
          .not
          .toHaveBeenCalled()
      })
    })

    describe('should be the clerk itself for method chaining', () => {
      const cases = [
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            sink: {
              onLoad: () => {},
            },
          },
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            sink: {},
          },
        },
      ]

      test.each(cases)('sink: $input.sink', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const addRequestSinkArgs = {
          sink: input.sink,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        const received = clerk.addRequestSink(addRequestSinkArgs)

        expect(received)
          .toBe(clerk) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#addUploadSink()', () => {
    describe('should call the member of the sink with the event when the event occurs on the upload', () => {
      const event01 = new ProgressEvent('loadstart')
      const event02 = new ProgressEvent('progress')
      const event03 = new ProgressEvent('load')
      const event04 = new ProgressEvent('abort')
      const event05 = new ProgressEvent('error')
      const event06 = new ProgressEvent('timeout')
      const event07 = new ProgressEvent('loadend')

      const cases = [
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onUploadLoadStart',
            sink: {
              onUploadLoadStart: () => {},
            },
          },
          tally: event01,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onUploadProgress',
            sink: {
              onUploadProgress: () => {},
            },
          },
          tally: event02,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onUploadLoad',
            sink: {
              onUploadLoad: () => {},
            },
          },
          tally: event03,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onUploadAbort',
            sink: {
              onUploadAbort: () => {},
            },
          },
          tally: event04,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onUploadError',
            sink: {
              onUploadError: () => {},
            },
          },
          tally: event05,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onUploadTimeout',
            sink: {
              onUploadTimeout: () => {},
            },
          },
          tally: event06,
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            memberName: 'onUploadLoadEnd',
            sink: {
              onUploadLoadEnd: () => {},
            },
          },
          tally: event07,
        },
      ]

      test.each(cases)('memberName: $input.memberName', ({ input, tally }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const addUploadSinkArgs = {
          sink: input.sink,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)
        const memberSpy = jest.spyOn(input.sink, input.memberName)

        clerk.addUploadSink(addUploadSinkArgs)
        input.xmlHttpRequest.upload.dispatchEvent(tally)

        expect(memberSpy)
          .toHaveBeenCalledWith(tally)
      })
    })

    describe('should not add a member that the sink does not hold', () => {
      const cases = [
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            sink: {},
          },
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            sink: {
              onUnknownMember: () => {}, // a member that no event is named for
            },
          },
        },
      ]

      test.each(cases)('sink: $input.sink', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const addUploadSinkArgs = {
          sink: input.sink,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)
        const addUploadEventListenerSpy = jest.spyOn(clerk, 'addUploadEventListener')

        clerk.addUploadSink(addUploadSinkArgs)

        expect(addUploadEventListenerSpy)
          .not
          .toHaveBeenCalled()
      })
    })

    describe('should not add a member that is not a function', () => {
      const cases = /** @type {Array<*>} */ ([
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            sink: {
              onUploadLoad: null,
            },
          },
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            sink: {
              onUploadError: 'text-0001', // a string, where a function is expected
            },
          },
        },
      ])

      test.each(cases)('sink: $input.sink', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const addUploadSinkArgs = {
          sink: input.sink,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)
        const addUploadEventListenerSpy = jest.spyOn(clerk, 'addUploadEventListener')

        clerk.addUploadSink(addUploadSinkArgs)

        expect(addUploadEventListenerSpy)
          .not
          .toHaveBeenCalled()
      })
    })

    describe('should be the clerk itself for method chaining', () => {
      const cases = [
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            sink: {
              onUploadLoad: () => {},
            },
          },
        },
        {
          input: {
            xmlHttpRequest: new XMLHttpRequest(),
            sink: {},
          },
        },
      ]

      test.each(cases)('sink: $input.sink', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const addUploadSinkArgs = {
          sink: input.sink,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        const received = clerk.addUploadSink(addUploadSinkArgs)

        expect(received)
          .toBe(clerk) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#sendRequest()', () => {
    const alphaBlob = new Blob(['text-0001'])

    const cases = [
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          requestBody: null,
        },
        expected: null,
      },
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
          requestBody: alphaBlob,
        },
        expected: alphaBlob,
      },
    ]

    describe('should send the request body through XMLHttpRequest', () => {
      test.each(cases)('requestBody: $input.requestBody', ({ input, expected }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const sendRequestArgs = {
          requestBody: input.requestBody,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)
        const sendSpy = jest.spyOn(input.xmlHttpRequest, 'send')
          .mockImplementation(() => {})

        clerk.sendRequest(sendRequestArgs)

        expect(sendSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should be the clerk itself for method chaining', () => {
      test.each(cases)('requestBody: $input.requestBody', ({ input }) => {
        const createArgs = {
          xmlHttpRequest: input.xmlHttpRequest,
        }
        const sendRequestArgs = {
          requestBody: input.requestBody,
        }

        const clerk = XMLHttpRequestClerk.create(createArgs)

        jest.spyOn(input.xmlHttpRequest, 'send')
          .mockImplementation(() => {})

        const received = clerk.sendRequest(sendRequestArgs)

        expect(received)
          .toBe(clerk) // same reference
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#abortRequest()', () => {
    const cases = [
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
        },
      },
      {
        input: {
          xmlHttpRequest: new XMLHttpRequest(),
        },
      },
    ]

    describe('should abort XMLHttpRequest', () => {
      test.each(cases)('xmlHttpRequest: $input.xmlHttpRequest', ({ input }) => {
        const clerk = XMLHttpRequestClerk.create(input)
        const abortSpy = jest.spyOn(input.xmlHttpRequest, 'abort')
          .mockImplementation(() => {})

        clerk.abortRequest()

        expect(abortSpy)
          .toHaveBeenCalledWith()
      })
    })

    describe('should be the clerk itself for method chaining', () => {
      test.each(cases)('xmlHttpRequest: $input.xmlHttpRequest', ({ input }) => {
        const clerk = XMLHttpRequestClerk.create(input)

        jest.spyOn(input.xmlHttpRequest, 'abort')
          .mockImplementation(() => {})

        const received = clerk.abortRequest()

        expect(received)
          .toBe(clerk) // same reference
      })
    })
  })
})
