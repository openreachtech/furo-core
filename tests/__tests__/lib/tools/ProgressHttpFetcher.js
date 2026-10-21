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
  describe('.createRequestBody()', () => {
    describe('when method does not send a body', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/alpha', {
              method: 'GET',
            }),
          },
        },
        {
          input: {
            request: new Request('https://example.com/beta', {
              method: 'DELETE',
            }),
          },
        },
        {
          input: {
            request: new Request('https://example.com/gamma', {
              method: 'HEAD',
            }),
          },
        },
      ]

      test.each(cases)('method: $input.request.method', async ({ input }) => {
        const received = await ProgressHttpFetcher.createRequestBody(input)

        expect(received)
          .toBeNull()
      })
    })

    describe('when method sends a body', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/alpha', {
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
            request: new Request('https://example.com/beta', {
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
            request: new Request('https://example.com/gamma', {
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
          const received = await ProgressHttpFetcher.createRequestBody(input)

          expect(received)
            .toBeInstanceOf(Blob)
        })
      })

      describe('should resolve to the bytes of the body', () => {
        test.each(cases)('method: $input.request.method', async ({ input, expected }) => {
          const received = await ProgressHttpFetcher.createRequestBody(input)

          const response = new Response(received)

          await expect(response.text())
            .resolves
            .toBe(expected)
        })
      })

      describe('should leave the given request unread', () => {
        test.each(cases)('method: $input.request.method', async ({ input }) => {
          await ProgressHttpFetcher.createRequestBody(input)

          const received = input.request.bodyUsed

          expect(received)
            .toBe(false)
        })
      })
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
                  listener
                ) {
                  this[`on${eventName}`] = listener
                },
                upload: {
                  addEventListener (
                    eventName,
                    listener
                  ) {
                    this[`on${eventName}`] = listener
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
                  listener
                ) {
                  this[`on${eventName}`] = listener
                },
                upload: {
                  addEventListener (
                    eventName,
                    listener
                  ) {
                    this[`on${eventName}`] = listener
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

            const createRequestBodySpy = jest.spyOn(ProgressHttpFetcher, 'createRequestBody')
              .mockResolvedValue(formDataTally)
            const setupRequestHeadersSpy = jest.spyOn(parser, 'setupRequestHeaders')
            const createResponseSpy = jest.spyOn(parser, 'createResponse')
              .mockReturnValue(responseTally)

            const actual = await parser.fetchRequest({
              request,
            })

            expect(actual)
              .toBe(responseTally) // same reference

            expect(createRequestBodySpy)
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
                  listener
                ) {
                  this[`on${eventName}`] = listener
                },
                upload: {
                  addEventListener (
                    eventName,
                    listener
                  ) {
                    this[`on${eventName}`] = listener
                  },
                },
                open () {
                  // noop
                },
                setRequestHeader () {
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
                  listener
                ) {
                  this[`on${eventName}`] = listener
                },
                upload: {
                  addEventListener (
                    eventName,
                    listener
                  ) {
                    this[`on${eventName}`] = listener
                  },
                },
                open () {
                  // noop
                },
                setRequestHeader () {
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
                  listener
                ) {
                  this[`on${eventName}`] = listener
                },
                upload: {
                  addEventListener (
                    eventName,
                    listener
                  ) {
                    this[`on${eventName}`] = listener
                  },
                },
                open () {
                  // noop
                },
                setRequestHeader () {
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

            const createRequestBodySpy = jest.spyOn(ProgressHttpFetcher, 'createRequestBody')
              .mockResolvedValue(formDataTally)
            const setupRequestHeadersSpy = jest.spyOn(parser, 'setupRequestHeaders')
            const createResponseSpy = jest.spyOn(parser, 'createResponse')

            await expect(parser.fetchRequest({
              request,
            }))
              .rejects
              .toThrow(expected)

            expect(createRequestBodySpy)
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
                listener
              ) {
                this[`on${eventName}`] = listener
              },
              upload: {
                addEventListener (
                  eventName,
                  listener
                ) {
                  this[`on${eventName}`] = listener
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
                listener
              ) {
                this[`on${eventName}`] = listener
              },
              upload: {
                addEventListener (
                  eventName,
                  listener
                ) {
                  this[`on${eventName}`] = listener
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
              sendArgs: [
                expect.any(Blob),
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
                'Content-Type': 'multipart/form-data',
              }),
            }),
            expected: {
              openArgs: [
                'POST',
                'https://example.com/beta',
                true, // OPENS_AS_ASYNC
              ],
              sendArgs: [
                expect.any(Blob),
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
            .toHaveBeenCalledWith(...expected.sendArgs)
        })
      })
    })

    describe('to send a JSON body as application/json', () => {
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
                return 'Content-Type: application/json\r\n'
              },
              addEventListener (
                eventName,
                listener
              ) {
                this[`on${eventName}`] = listener
              },
              upload: {
                addEventListener (
                  eventName,
                  listener
                ) {
                  this[`on${eventName}`] = listener
                },
              },
              open () {
                // noop
              },
              setRequestHeader () {
                // noop
              },
              send () {
                this.upload.onprogress({
                  loaded: 10,
                  total: 100,
                })
                this.onprogress({
                  loaded: 50,
                  total: 100,
                })
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
            input: {
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
            expected: {
              sendArgs: [
                expect.any(Blob),
              ],
            },
          },
          {
            input: {
              request: new Request('https://example.com/beta', {
                method: 'PUT',
                body: JSON.stringify({
                  name: 'Beta',
                  tags: ['beta'],
                }),
                headers: new Headers({
                  'Content-Type': 'application/json',
                }),
              }),
            },
            expected: {
              sendArgs: [
                expect.any(Blob),
              ],
            },
          },
        ]

        describe('should send the body as a Blob', () => {
          test.each(cases)('URL: $input.request.url', async ({ input, expected }) => {
            const sendSpy = jest.spyOn(parser.httpRequest, 'send')

            await parser.fetchRequest(input)

            expect(sendSpy)
              .toHaveBeenCalledWith(...expected.sendArgs)
          })
        })

        describe('should keep the content type', () => {
          test.each(cases)('URL: $input.request.url', async ({ input }) => {
            const setRequestHeaderSpy = jest.spyOn(parser.httpRequest, 'setRequestHeader')

            await parser.fetchRequest(input)

            expect(setRequestHeaderSpy)
              .toHaveBeenCalledWith('content-type', 'application/json')
          })
        })

        describe('should report upload and download progress', () => {
          test.each(cases)('URL: $input.request.url', async ({ input }) => {
            const sink = {
              onUploadProgress () {
                // noop
              },
              onDownloadProgress () {
                // noop
              },
            }

            const onUploadProgressSpy = jest.spyOn(sink, 'onUploadProgress')
            const onDownloadProgressSpy = jest.spyOn(sink, 'onDownloadProgress')

            await parser.fetchRequest({
              request: input.request,
              sink,
            })

            expect(onUploadProgressSpy)
              .toHaveBeenCalledWith({
                request: input.request,
                progressEvent: {
                  loaded: 10,
                  total: 100,
                },
              })
            expect(onDownloadProgressSpy)
              .toHaveBeenCalledWith({
                request: input.request,
                progressEvent: {
                  loaded: 50,
                  total: 100,
                },
              })
          })
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
              listener
            ) {
              this[`on${eventName}`] = listener
            },
            upload: {
              addEventListener (
                eventName,
                listener
              ) {
                this[`on${eventName}`] = listener
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
              listener
            ) {
              this[`on${eventName}`] = listener
            },
            upload: {
              addEventListener (
                eventName,
                listener
              ) {
                this[`on${eventName}`] = listener
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

    describe('to setup all headers including "content-type"', () => {
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
                'Accept-Language': 'ja-JP',
                'Content-Length': '10000',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0',
              }),
            }),
            expected: {
              times: 4,
              firstArgs: ['accept-language', 'ja-JP'],
              secondArgs: ['content-length', '10000'],
              thirdArgs: ['content-type', 'application/json'],
              fourthArgs: ['user-agent', 'Mozilla/5.0'],
            },
          },
          {
            request: new Request('https://example.com/beta', {
              method: 'PATCH',
              body: JSON.stringify({
                name: 'Beta',
              }),
              headers: new Headers({
                'Accept-Language': 'vi_VN',
                'Content-Length': '20000',
                'content-type': 'application/vnd.api+json',
                'User-Agent': 'WebKit/537.36',
              }),
            }),
            expected: {
              times: 4,
              firstArgs: ['accept-language', 'vi_VN'],
              secondArgs: ['content-length', '20000'],
              thirdArgs: ['content-type', 'application/vnd.api+json'],
              fourthArgs: ['user-agent', 'WebKit/537.36'],
            },
          },
          {
            request: new Request('https://example.com/gamma', {
              method: 'POST',
              body: '--gamma--',
              headers: new Headers({
                'Accept-Language': 'en-US',
                'Content-Length': '30000',
                'content-type': 'multipart/form-data; boundary=gamma',
                'User-Agent': 'Gecko/20100101',
              }),
            }),
            expected: {
              times: 4,
              firstArgs: ['accept-language', 'en-US'],
              secondArgs: ['content-length', '30000'],
              thirdArgs: ['content-type', 'multipart/form-data; boundary=gamma'],
              fourthArgs: ['user-agent', 'Gecko/20100101'],
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
          expect(setRequestHeaderSpy)
            .toHaveBeenNthCalledWith(4, ...expected.fourthArgs)
        })
      })
    })
  })
})

describe('ProgressHttpFetcher', () => {
  describe('.isBodyRequiredMethod()', () => {
    const alphaFormDataBody = new FormData()
    const betaFormDataBody = new FormData()

    alphaFormDataBody.append('alpha', 'alpha value')
    betaFormDataBody.append('beta', 'beta value')

    describe('to be truthy', () => {
      const cases = [
        {
          params: {
            request: new Request('https://example.com/alpha', {
              method: 'POST',
              body: alphaFormDataBody,
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
            }),
          },
        },
        {
          params: {
            request: new Request('https://example.com/beta', {
              method: 'PUT',
              body: betaFormDataBody,
              headers: new Headers({
                'Content-Type': 'multiple/form-data',
              }),
            }),
          },
        },
        {
          params: {
            request: new Request('https://example.com/eta', {
              method: 'PATCH',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
            }),
          },
        },
      ]

      test.each(cases)('method: $params.request.method', ({ params }) => {
        const actual = ProgressHttpFetcher.isBodyRequiredMethod(params)

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to be falsy', () => {
      const cases = [
        {
          params: {
            request: new Request('https://example.com/alpha', {
              method: 'GET',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
            }),
          },
        },
        {
          params: {
            request: new Request('https://example.com/beta', {
              method: 'DELETE',
              headers: new Headers({
                'Content-Type': 'multiple/form-data',
              }),
            }),
          },
        },
        {
          params: {
            request: new Request('https://example.com/gamma', {
              method: 'HEAD',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
            }),
          },
        },
        {
          params: {
            request: new Request('https://example.com/delta', {
              method: 'OPTIONS',
              headers: new Headers({
                'Content-Type': 'multiple/form-data',
              }),
            }),
          },
        },
        {
          params: {
            request: new Request('https://example.com/epsilon', {
              method: 'TRACE',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
            }),
          },
        },
        {
          params: {
            request: new Request('https://example.com/zeta', {
              method: 'CONNECT',
              headers: new Headers({
                'Content-Type': 'multiple/form-data',
              }),
            }),
          },
        },
      ]

      test.each(cases)('method: $params.request.method', ({ params }) => {
        const actual = ProgressHttpFetcher.isBodyRequiredMethod(params)

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})
