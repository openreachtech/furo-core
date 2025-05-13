import ProgressHttpFetcher from '../../../../lib/tools/ProgressHttpFetcher.js'

describe('ProgressHttpFetcher', () => {
  describe('constructor', () => {
    describe('to keep properties', () => {
      describe('#httpRequest', () => {
        const cases = [
          {
            params: {
              httpRequest: new XMLHttpRequest(),
            },
          },
        ]

        test.each(cases)('httpRequest: $params.httpRequest', ({ params }) => {
          const parser = ProgressHttpFetcher.create(params)

          expect(parser)
            .toHaveProperty('httpRequest', params.httpRequest)
        })
      })
    })
  })
})

describe('ProgressHttpFetcher', () => {
  describe('.create()', () => {
    const cases = [
      {
        params: {
          httpRequest: new XMLHttpRequest(),
        },
      },
    ]

    describe('to be instance of own class', () => {
      test.each(cases)('httpRequest: $params.httpRequest', ({ params }) => {
        const parser = ProgressHttpFetcher.create(params)

        expect(parser)
          .toBeInstanceOf(ProgressHttpFetcher)
      })

      test('with no arguments', () => {
        const parser = ProgressHttpFetcher.create()

        expect(parser)
          .toBeInstanceOf(ProgressHttpFetcher)
      })
    })

    describe('to call constructor', () => {
      test.each(cases)('httpRequest: $params.httpRequest', ({ params }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(ProgressHttpFetcher)

        SpyClass.create(params)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(params)
      })

      test('with no arguments', () => {
        const expectedParams = {
          httpRequest: expect.any(XMLHttpRequest),
        }

        const createXMLHttpRequestSpy = jest.spyOn(ProgressHttpFetcher, 'createXMLHttpRequest')

        const SpyClass = globalThis.constructorSpy.spyOn(ProgressHttpFetcher)

        SpyClass.create()

        expect(createXMLHttpRequestSpy)
          .toHaveBeenCalledWith()
        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expectedParams)
      })
    })
  })
})

describe('ProgressHttpFetcher', () => {
  describe('.createXMLHttpRequest()', () => {
    test('to be instance of XMLHttpRequest', () => {
      const actual = ProgressHttpFetcher.createXMLHttpRequest()

      expect(actual)
        .toBeInstanceOf(XMLHttpRequest)
    })
  })
})

describe('ProgressHttpFetcher', () => {
  describe('.createFormDataFromRequest()', () => {
    const cases = [
      {
        params: {
          request: new Request('https://example.com/alpha'),
        },
      },
      {
        params: {
          request: new Request('https://example.com/beta'),
        },
      },
    ]

    test.each(cases)('URL: $params.request.url', async ({ params }) => {
      const actual = await ProgressHttpFetcher.createFormDataFromRequest(params)

      expect(actual)
        .toBeInstanceOf(FormData)
    })
  })
})

describe('ProgressHttpFetcher', () => {
  describe('#get:Ctor', () => {
    describe('to be constructor of own class', () => {
      const cases = [
        {
          params: {
            httpRequest: new XMLHttpRequest(),
          },
        },
      ]

      test.each(cases)('httpRequest: $params.httpRequest', ({ params }) => {
        const parser = ProgressHttpFetcher.create(params)

        const actual = parser.Ctor

        expect(actual)
          .toBe(ProgressHttpFetcher) // same reference
      })
    })
  })
})

describe('ProgressHttpFetcher', () => {
  describe('#createResponse()', () => {
    /**
     * @type {Array<{
     *   params: {
     *     httpRequest: XMLHttpRequest
     *   }
     *   expected: Response
     * }>}
     */
    const cases = /** @type {Array<*>} */ ([
      {
        params: {
          httpRequest: {
            status: 200,
            statusText: 'OK',
            responseText: JSON.stringify({
              message: 'Success',
            }),
            getAllResponseHeaders () {
              return 'Content-Type: application/json\r\nContent-Length: 10000\r\n'
            },
          },
        },
        expected: new Response(
          JSON.stringify({
            message: 'Success',
          }),
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
        params: {
          httpRequest: {
            status: 404,
            statusText: 'Not Found',
            responseText: JSON.stringify({
              message: 'Not Found',
            }),
            getAllResponseHeaders () {
              return 'Content-Type: application/json\r\n'
            },
          },
        },
        expected: new Response(
          JSON.stringify({
            message: 'Not Found',
          }),
          {
            status: 404,
            statusText: 'Not Found',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
          }
        ),
      },
    ])

    test.each(cases)('httpRequest: $params.httpRequest', ({ params, expected }) => {
      const parser = ProgressHttpFetcher.create(params)

      const actual = parser.createResponse()

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('ProgressHttpFetcher', () => {
  describe('#fetchRequest()', () => {
    describe('to be instance of Response', () => {
      describe('on load (success)', () => {
        /**
         * @type {Array<{
         *   params: {
         *     httpRequest: XMLHttpRequest
         *   }
         * }>}
         */
        const parserCases = /** @type {Array<*>} */ ([
          {
            params: {
              httpRequest: {
                status: 200,
                statusText: 'OK',
                responseText: JSON.stringify({
                  message: 'Success',
                }),
                getAllResponseHeaders () {
                  return 'Content-Type: application/json\r\nContent-Length: 10000\r\n'
                },
                addEventListener (
                  eventName,
                  callback
                ) {
                  this[`on${eventName}`] = callback
                },
                upload: {
                  addEventListener (
                    eventName,
                    callback
                  ) {
                    this[`on${eventName}`] = callback
                  },
                },
                open () {
                  // noop
                },
                send () {
                  this.onload()
                },
              },
            },
          },
          {
            params: {
              httpRequest: {
                status: 404,
                statusText: 'Not Found',
                responseText: JSON.stringify({
                  message: 'Not Found',
                }),
                getAllResponseHeaders () {
                  return 'Content-Type: application/json\r\n'
                },
                addEventListener (
                  eventName,
                  callback
                ) {
                  this[`on${eventName}`] = callback
                },
                upload: {
                  addEventListener (
                    eventName,
                    callback
                  ) {
                    this[`on${eventName}`] = callback
                  },
                },
                open () {
                  // noop
                },
                send () {
                  this.onload()
                },
              },
            },
          },
        ])

        describe.each(parserCases)('status: $params.httpRequest.status', ({ params }) => {
          const parser = ProgressHttpFetcher.create(params)

          const cases = [
            {
              request: new Request('https://example.com/alpha', {
                method: 'POST',
                body: JSON.stringify({
                  name: 'Alpha',
                }),
                headers: new Headers({
                  'Content-Type': 'application/json',
                }),
              }),
            },
            {
              request: new Request('https://example.com/beta', {
                method: 'POST',
                body: JSON.stringify({
                  name: 'Beta',
                }),
                headers: new Headers({
                  'Content-Type': 'multiple/form-data',
                }),
              }),
            },
          ]

          test.each(cases)('URL: $request.url', async ({ request }) => {
            const expectedArgs = {
              request,
            }

            const formDataTally = new FormData()
            const responseTally = new Response()

            const createFormDataFromRequestSpy = jest.spyOn(ProgressHttpFetcher, 'createFormDataFromRequest')
              .mockResolvedValue(formDataTally)
            const setupRequestHeadersSpy = jest.spyOn(parser, 'setupRequestHeaders')
            const createResponseSpy = jest.spyOn(parser, 'createResponse')
              .mockReturnValue(responseTally)

            const actual = await parser.fetchRequest({
              request,
            })

            expect(actual)
              .toBe(responseTally) // same reference

            expect(createFormDataFromRequestSpy)
              .toHaveBeenCalledWith(expectedArgs)
            expect(setupRequestHeadersSpy)
              .toHaveBeenCalledWith(expectedArgs)
            expect(createResponseSpy)
              .toHaveBeenCalledWith()
          })
        })
      })

      describe('on error (failure)', () => {
        /**
         * @type {Array<{
         *   params: {
         *     httpRequest: XMLHttpRequest
         *   }
         *   expected: TypeError
         * }>}
         */
        const parserCases = /** @type {Array<*>} */ ([
          {
            params: {
              httpRequest: {
                status: 400,
                statusText: 'OK',
                responseText: JSON.stringify({
                  message: 'Success',
                }),
                getAllResponseHeaders () {
                  return 'Content-Type: application/json\r\nContent-Length: 10000\r\n'
                },
                addEventListener (
                  eventName,
                  callback
                ) {
                  this[`on${eventName}`] = callback
                },
                upload: {
                  addEventListener (
                    eventName,
                    callback
                  ) {
                    this[`on${eventName}`] = callback
                  },
                },
                open () {
                  // noop
                },
                send () {
                  this.onabort()
                },
              },
            },
            expected: new TypeError('Network request aborted'),
          },
          {
            params: {
              httpRequest: {
                status: 401,
                statusText: 'Not Found',
                responseText: JSON.stringify({
                  message: 'Not Found',
                }),
                getAllResponseHeaders () {
                  return 'Content-Type: application/json\r\n'
                },
                addEventListener (
                  eventName,
                  callback
                ) {
                  this[`on${eventName}`] = callback
                },
                upload: {
                  addEventListener (
                    eventName,
                    callback
                  ) {
                    this[`on${eventName}`] = callback
                  },
                },
                open () {
                  // noop
                },
                send () {
                  this.onerror()
                },
              },
            },
            expected: new TypeError('Network request failed'),
          },
          {
            params: {
              httpRequest: {
                status: 402,
                statusText: 'Not Found',
                responseText: JSON.stringify({
                  message: 'Not Found',
                }),
                getAllResponseHeaders () {
                  return 'Content-Type: application/json\r\n'
                },
                addEventListener (
                  eventName,
                  callback
                ) {
                  this[`on${eventName}`] = callback
                },
                upload: {
                  addEventListener (
                    eventName,
                    callback
                  ) {
                    this[`on${eventName}`] = callback
                  },
                },
                open () {
                  // noop
                },
                send () {
                  this.ontimeout()
                },
              },
            },
            expected: new TypeError('Network request timed out'),
          },
        ])

        describe.each(parserCases)('status: $params.httpRequest.status', ({ params, expected }) => {
          const parser = ProgressHttpFetcher.create(params)

          const cases = [
            {
              request: new Request('https://example.com/alpha', {
                method: 'POST',
                body: JSON.stringify({
                  name: 'Alpha',
                }),
                headers: new Headers({
                  'Content-Type': 'application/json',
                }),
              }),
            },
            {
              request: new Request('https://example.com/beta', {
                method: 'POST',
                body: JSON.stringify({
                  name: 'Beta',
                }),
                headers: new Headers({
                  'Content-Type': 'multiple/form-data',
                }),
              }),
            },
          ]

          test.each(cases)('URL: $request.url', async ({ request }) => {
            const expectedArgs = {
              request,
            }

            const formDataTally = new FormData()

            const createFormDataFromRequestSpy = jest.spyOn(ProgressHttpFetcher, 'createFormDataFromRequest')
              .mockResolvedValue(formDataTally)
            const setupRequestHeadersSpy = jest.spyOn(parser, 'setupRequestHeaders')
            const createResponseSpy = jest.spyOn(parser, 'createResponse')

            await expect(parser.fetchRequest({
              request,
            }))
              .rejects
              .toThrow(expected)

            expect(createFormDataFromRequestSpy)
              .toHaveBeenCalledWith(expectedArgs)
            expect(setupRequestHeadersSpy)
              .toHaveBeenCalledWith(expectedArgs)
            expect(createResponseSpy)
              .not
              .toHaveBeenCalled()
          })
        })
      })
    })

    describe('to call members of an instance of XMLHttpRequest', () => {
      /**
       * @type {Array<{
       *   params: {
       *     httpRequest: XMLHttpRequest
       *   }
       * }>}
       */
      const parserCases = /** @type {Array<*>} */ ([
        {
          params: {
            httpRequest: {
              status: 200,
              statusText: 'OK',
              responseText: JSON.stringify({
                message: 'Success',
              }),
              getAllResponseHeaders () {
                return 'Content-Type: application/json\r\nContent-Length: 10000\r\n'
              },
              addEventListener (
                eventName,
                callback
              ) {
                this[`on${eventName}`] = callback
              },
              upload: {
                addEventListener (
                  eventName,
                  callback
                ) {
                  this[`on${eventName}`] = callback
                },
              },
              open () {
                // noop
              },
              send () {
                this.onload()
              },
            },
          },
        },
        {
          params: {
            httpRequest: {
              status: 404,
              statusText: 'Not Found',
              responseText: JSON.stringify({
                message: 'Not Found',
              }),
              getAllResponseHeaders () {
                return 'Content-Type: application/json\r\n'
              },
              addEventListener (
                eventName,
                callback
              ) {
                this[`on${eventName}`] = callback
              },
              upload: {
                addEventListener (
                  eventName,
                  callback
                ) {
                  this[`on${eventName}`] = callback
                },
              },
              open () {
                // noop
              },
              send () {
                this.onload()
              },
            },
          },
        },
      ])

      describe.each(parserCases)('status: $params.httpRequest.status', ({ params }) => {
        const parser = ProgressHttpFetcher.create(params)

        const cases = [
          {
            request: new Request('https://example.com/alpha', {
              method: 'POST',
              body: JSON.stringify({
                name: 'Alpha',
              }),
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
            }),
            expected: {
              openArgs: [
                'POST',
                'https://example.com/alpha',
                true, // OPENS_AS_ASYNC
              ],
            },
          },
          {
            request: new Request('https://example.com/beta', {
              method: 'POST',
              body: JSON.stringify({
                name: 'Beta',
              }),
              headers: new Headers({
                'Content-Type': 'multiple/form-data',
              }),
            }),
            expected: {
              openArgs: [
                'POST',
                'https://example.com/beta',
                true, // OPENS_AS_ASYNC
              ],
            },
          },
        ]

        test.each(cases)('URL: $request.url', async ({ request, expected }) => {
          const openSpy = jest.spyOn(parser.httpRequest, 'open')
          const uploadAddEventListenerSpy = jest.spyOn(parser.httpRequest.upload, 'addEventListener')
          const addEventListenerSpy = jest.spyOn(parser.httpRequest, 'addEventListener')
          const sendSpy = jest.spyOn(parser.httpRequest, 'send')

          await parser.fetchRequest({
            request,
          })

          expect(openSpy)
            .toHaveBeenCalledWith(...expected.openArgs)

          expect(uploadAddEventListenerSpy)
            .toHaveBeenCalledWith('progress', expect.any(Function))

          expect(addEventListenerSpy)
            .toHaveBeenCalledWith('progress', expect.any(Function))
          expect(addEventListenerSpy)
            .toHaveBeenCalledWith('load', expect.any(Function))
          expect(addEventListenerSpy)
            .toHaveBeenCalledWith('abort', expect.any(Function))
          expect(addEventListenerSpy)
            .toHaveBeenCalledWith('error', expect.any(Function))
          expect(addEventListenerSpy)
            .toHaveBeenCalledWith('timeout', expect.any(Function))

          expect(sendSpy)
            .toHaveBeenCalledWith(expect.any(FormData))
        })
      })
    })
  })
})

describe('ProgressHttpFetcher', () => {
  describe('#setupRequestHeaders()', () => {
    /**
     * @type {Array<{
     *   params: {
     *     httpRequest: XMLHttpRequest
     *   }
     * }>}
     */
    const parserCases = /** @type {Array<*>} */ ([
      {
        params: {
          httpRequest: {
            status: 200,
            statusText: 'OK',
            responseText: JSON.stringify({
              message: 'Success',
            }),
            getAllResponseHeaders () {
              return 'Content-Type: application/json\r\nContent-Length: 10000\r\n'
            },
            addEventListener (
              eventName,
              callback
            ) {
              this[`on${eventName}`] = callback
            },
            upload: {
              addEventListener (
                eventName,
                callback
              ) {
                this[`on${eventName}`] = callback
              },
            },
            open () {
              // noop
            },
            setRequestHeader () {
              // noop
            },
            send () {
              this.onload()
            },
          },
        },
      },
      {
        params: {
          httpRequest: {
            status: 404,
            statusText: 'Not Found',
            responseText: JSON.stringify({
              message: 'Not Found',
            }),
            getAllResponseHeaders () {
              return 'Content-Type: application/json\r\n'
            },
            addEventListener (
              eventName,
              callback
            ) {
              this[`on${eventName}`] = callback
            },
            upload: {
              addEventListener (
                eventName,
                callback
              ) {
                this[`on${eventName}`] = callback
              },
            },
            open () {
              // noop
            },
            setRequestHeader () {
              // noop
            },
            send () {
              this.onload()
            },
          },
        },
      },
    ])

    describe('to return instance of XMLHttpRequest', () => {
      describe.each(parserCases)('status: $params.httpRequest.status', ({ params }) => {
        const parser = ProgressHttpFetcher.create(params)

        const cases = [
          {
            request: new Request('https://example.com/alpha', {
              method: 'POST',
              body: JSON.stringify({
                name: 'Alpha',
              }),
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
            }),
          },
          {
            request: new Request('https://example.com/beta', {
              method: 'POST',
              body: JSON.stringify({
                name: 'Beta',
              }),
              headers: new Headers({
                'Content-Type': 'multiple/form-data',
              }),
            }),
          },
        ]

        test.each(cases)('URL: $request.url', async ({ request }) => {
          const actual = parser.setupRequestHeaders({
            request,
          })

          expect(actual)
            .toBe(parser.httpRequest) // same reference
        })
      })
    })

    describe('to setup headers except for "content-type"', () => {
      describe.each(parserCases)('status: $params.httpRequest.status', ({ params }) => {
        const parser = ProgressHttpFetcher.create(params)

        const cases = [
          {
            request: new Request('https://example.com/alpha', {
              method: 'POST',
              body: JSON.stringify({
                name: 'Alpha',
              }),
              headers: new Headers({
                'Content-Type': 'application/json', // ❌️
                'Content-Length': '10000',
                'User-Agent': 'Mozilla/5.0',
                'Accept-Language': 'ja-JP',
              }),
            }),
            expected: {
              times: 3,
              firstArgs: ['content-length', '10000'],
              secondArgs: ['user-agent', 'Mozilla/5.0'],
              thirdArgs: ['accept-language', 'ja-JP'],
            },
          },
          {
            request: new Request('https://example.com/beta', {
              method: 'POST',
              body: JSON.stringify({
                name: 'Beta',
              }),
              headers: new Headers({
                'Accept-Language': 'vi_VN',
                'Content-Length': '20000',
                'content-type': 'multiple/form-data', // ❌️
                'User-Agent': 'WebKit/537.36',
              }),
            }),
            expected: {
              times: 3,
              firstArgs: ['accept-language', 'vi_VN'],
              secondArgs: ['content-length', '20000'],
              thirdArgs: ['user-agent', 'WebKit/537.36'],
            },
          },
        ]

        test.each(cases)('URL: $request.url', async ({ request, expected }) => {
          const setRequestHeaderSpy = jest.spyOn(parser.httpRequest, 'setRequestHeader')

          parser.setupRequestHeaders({
            request,
          })

          expect(setRequestHeaderSpy)
            .toHaveBeenCalledTimes(expected.times)
          expect(setRequestHeaderSpy)
            .toHaveBeenNthCalledWith(1, ...expected.firstArgs)
          expect(setRequestHeaderSpy)
            .toHaveBeenNthCalledWith(2, ...expected.secondArgs)
          expect(setRequestHeaderSpy)
            .toHaveBeenNthCalledWith(3, ...expected.thirdArgs)
        })
      })
    })
  })
})
