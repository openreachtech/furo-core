import {
  RESTFUL_API_METHOD,
} from '~/lib/client/restfulapi/constants.js'

import BaseRestfulApiCapsule, {
  LAUNCH_ABORTED_REASON,
} from '~/lib/client/restfulapi/BaseRestfulApiCapsule.js'

import BaseRestfulApiPayload from '~/lib/client/restfulapi/BaseRestfulApiPayload.js'
import XMLHttpParcel from '~/lib/tools/http-fetchers/parcels/concretes/XMLHttpParcel.js'

describe('BaseRestfulApiCapsule', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      const mockResponseParcel = XMLHttpParcel.create({
        request: new Request('http://example.com/neutral'), // Neutral value
        config: {}, // Neutral value
        response: new Response(),
      })
      const mockPayload = new BaseRestfulApiPayload({
        query: {},
        body: {},
        pathParameterHash: {},
        options: {},
      })

      describe('#responseParcel', () => {
        const cases = [
          {
            input: {
              response: new Response(),
            },
          },
          {
            input: {
              response: new Response('{}', {
                status: 400,
                statusText: 'Bad Request',
                headers: {
                  'Content-Type': 'application/json',
                },
              }),
            },
          },
        ]

        test.each(cases)('response: $input.response', ({ input }) => {
          const args = {
            responseParcel: input.response,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }

          const actual = new BaseRestfulApiCapsule(args)

          expect(actual)
            .toHaveProperty('responseParcel', input.response)
        })
      })

      describe('#payload', () => {
        const cases = [
          {
            input: {
              payload: new BaseRestfulApiPayload({
                query: {
                  alpha: 'alpha value',
                },
                body: {},
                pathParameterHash: {},
                options: {},
              }),
            },
          },
          {
            input: {
              payload: new BaseRestfulApiPayload({
                query: {
                  beta: 'beta value',
                },
                body: {},
                pathParameterHash: {},
                options: {},
              }),
            },
          },
        ]

        test.each(cases)('payload: $input.payload', ({ input }) => {
          const args = {
            responseParcel: mockResponseParcel,
            payload: input.payload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }

          const actual = new BaseRestfulApiCapsule(args)

          expect(actual)
            .toHaveProperty('payload', input.payload)
        })
      })

      describe('#result', () => {
        const cases = [
          {
            input: {
              result: {
                content: {
                  customer: {
                    id: 10001,
                  },
                },
              },
            },
          },
          {
            input: {
              result: {
                error: {
                  code: '190.X000.001',
                },
              },
            },
          },
        ]

        test.each(cases)('result: $input.result', ({ input }) => {
          const args = {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }

          const actual = new BaseRestfulApiCapsule(args)

          expect(actual)
            .toHaveProperty('result', input.result)
        })
      })

      describe('#abortedReason', () => {
        const cases = [
          {
            input: {
              abortedReason: LAUNCH_ABORTED_REASON.NONE,
            },
          },
          {
            input: {
              abortedReason: LAUNCH_ABORTED_REASON.UNKNOWN,
            },
          },
          {
            input: {
              abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
            },
          },
          {
            input: {
              abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
            },
          },
        ]

        test.each(cases)('abortedReason: $input.abortedReason', ({ input }) => {
          const args = {
            responseParcel: null,
            payload: mockPayload,
            result: null,
            abortedReason: input.abortedReason,
          }

          const actual = new BaseRestfulApiCapsule(args)

          expect(actual)
            .toHaveProperty('abortedReason', input.abortedReason)
        })
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      /**
       * @type {Array<{
       *   input: {
       *     responseParcel: Response | null
       *     payload: BaseRestfulApiPayload | null
       *     result: * | null
       *   }
       * }>}
       */
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
            payload: BaseRestfulApiPayload.create({
              query: {
                alpha: 'alpha value',
              },
            }),
            result: {
              content: {
                customer: {
                  id: 10001,
                },
              },
            },
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
            payload: BaseRestfulApiPayload.create({
              query: {
                beta: 'beta value',
              },
            }),
            result: {
              error: {
                code: '190.X000.001',
              },
            },
          },
        },
      ]

      test.each(cases)('result: $input.result', ({ input }) => {
        const actual = BaseRestfulApiCapsule.create(input)

        expect(actual)
          .toBeInstanceOf(BaseRestfulApiCapsule)
      })
    })

    describe('to call constructor', () => {
      describe('with abortedReason', () => {
        /**
         * @type {Array<{
         *   input: {
         *     responseParcel: Response | null
         *     payload: BaseRestfulApiPayload | null
         *     result: * | null
         *     abortedReason: LAUNCH_ABORTED_REASON
         *   }
         * }>}
         */
        const cases = [
          {
            input: {
              responseParcel: XMLHttpParcel.create({
                request: new Request('http://example.com/neutral'), // Neutral value
                config: {}, // Neutral value
                response: new Response(),
              }),
              payload: BaseRestfulApiPayload.create({
                query: {
                  alpha: 'alpha value',
                },
              }),
              result: {
                content: {
                  customer: {
                    id: 10001,
                  },
                },
              },
              abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
            },
          },
          {
            input: {
              responseParcel: XMLHttpParcel.create({
                request: new Request('http://example.com/neutral'), // Neutral value
                config: {}, // Neutral value
                response: new Response(),
              }),
              payload: BaseRestfulApiPayload.create({
                query: {
                  beta: 'beta value',
                },
              }),
              result: {
                error: {
                  code: '190.X000.001',
                },
              },
              abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
            },
          },
        ]

        test.each(cases)('result: $input.result', ({ input }) => {
          const DerivedClass = globalThis.constructorSpy.spyOn(BaseRestfulApiCapsule)

          DerivedClass.create(input)

          expect(DerivedClass.__spy__)
            .toHaveBeenCalledWith(input)
        })
      })

      describe('with no abortedReason', () => {
        /**
         * @type {Array<{
         *   input: {
         *     responseParcel: Response | null
         *     payload: BaseRestfulApiPayload | null
         *     result: * | null
         *   }
         * }>}
         */
        const cases = [
          {
            input: {
              responseParcel: XMLHttpParcel.create({
                request: new Request('http://example.com/neutral'), // Neutral value
                config: {}, // Neutral value
                response: new Response(),
              }),
              payload: BaseRestfulApiPayload.create({
                query: {
                  id: 10001,
                },
              }),
              result: {
                content: {
                  customer: {
                    id: 10001,
                  },
                },
              },
            },
          },
          {
            input: {
              responseParcel: XMLHttpParcel.create({
                request: new Request('http://example.com/neutral'), // Neutral value
                config: {}, // Neutral value
                response: new Response(),
              }),
              payload: BaseRestfulApiPayload.create({
                query: {
                  id: 10002,
                },
              }),
              result: {
                error: {
                  code: '190.X000.001',
                },
              },
            },
          },
        ]

        test.each(cases)('result: $input.result', ({ input }) => {
          const expected = {
            ...input,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }

          const DerivedClass = globalThis.constructorSpy.spyOn(BaseRestfulApiCapsule)

          DerivedClass.create(input)

          expect(DerivedClass.__spy__)
            .toHaveBeenCalledWith(expected)
        })
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('.createAsPending()', () => {
    describe('to be instance of own class', () => {
      test('with no args', () => {
        const actual = BaseRestfulApiCapsule.createAsPending()

        expect(actual)
          .toBeInstanceOf(BaseRestfulApiCapsule)
      })
    })

    describe('to call .create()', () => {
      test('with no args', () => {
        const expectedArgs = {
          responseParcel: null,
          payload: null,
          result: null,
        }

        const createSpy = jest.spyOn(BaseRestfulApiCapsule, 'create')

        BaseRestfulApiCapsule.createAsPending()

        expect(createSpy)
          .toHaveBeenCalledWith(expectedArgs)

        createSpy.mockRestore()
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('.createAsInvalidParametersError()', () => {
    const cases = [
      {
        input: {
          payload: BaseRestfulApiPayload.create({
            query: {
              id: 10001,
            },
          }),
        },
      },
      {
        input: {
          payload: BaseRestfulApiPayload.create({
            query: {
              id: 10002,
            },
          }),
        },
      },
    ]

    describe('to be instance of own class', () => {
      test.each(cases)('payload: $input.payload', ({ input }) => {
        const actual = BaseRestfulApiCapsule.createAsInvalidParametersError(input)

        expect(actual)
          .toBeInstanceOf(BaseRestfulApiCapsule)
      })
    })

    describe('to call .create()', () => {
      test.each(cases)('payload: $input.payload', ({ input }) => {
        const expectedArgs = {
          responseParcel: null,
          payload: input.payload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
        }

        const createSpy = jest.spyOn(BaseRestfulApiCapsule, 'create')

        BaseRestfulApiCapsule.createAsInvalidParametersError(input)

        expect(createSpy)
          .toHaveBeenCalledWith(expectedArgs)
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('.createAsAbortedByHooks()', () => {
    const cases = [
      {
        input: {
          payload: BaseRestfulApiPayload.create({
            query: {
              id: 10001,
            },
          }),
        },
      },
      {
        input: {
          payload: BaseRestfulApiPayload.create({
            query: {
              id: 10002,
            },
          }),
        },
      },
    ]

    describe('to be instance of own class', () => {
      test.each(cases)('payload: $input.payload', ({ input }) => {
        const actual = BaseRestfulApiCapsule.createAsAbortedByHooks(input)

        expect(actual)
          .toBeInstanceOf(BaseRestfulApiCapsule)
      })
    })

    describe('to call .create()', () => {
      test.each(cases)('payload: $input.payload', ({ input }) => {
        const expectedArgs = {
          responseParcel: null,
          payload: input.payload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
        }

        const createSpy = jest.spyOn(BaseRestfulApiCapsule, 'create')

        BaseRestfulApiCapsule.createAsAbortedByHooks(input)

        expect(createSpy)
          .toHaveBeenCalledWith(expectedArgs)

        createSpy.mockRestore()
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('.createAsNetworkError()', () => {
    const cases = [
      {
        input: {
          responseParcel: XMLHttpParcel.createAsNetworkError({
            request: new Request('http://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
          }),
          payload: BaseRestfulApiPayload.create({
            query: {
              id: 10001,
            },
          }),
        },
      },
      {
        input: {
          responseParcel: XMLHttpParcel.createAsNetworkError({
            request: new Request('http://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
          }),
          payload: BaseRestfulApiPayload.create({
            query: {
              id: 10002,
            },
          }),
        },
      },
    ]

    describe('to be instance of own class', () => {
      test.each(cases)('payload: $input.payload', ({ input }) => {
        const actual = BaseRestfulApiCapsule.createAsNetworkError(input)

        expect(actual)
          .toBeInstanceOf(BaseRestfulApiCapsule)
      })
    })

    describe('to call .create()', () => {
      test.each(cases)('payload: $input.payload', ({ input }) => {
        const expectedArgs = {
          responseParcel: input.responseParcel,
          payload: input.payload,
          result: null,
        }

        const createSpy = jest.spyOn(BaseRestfulApiCapsule, 'create')

        BaseRestfulApiCapsule.createAsNetworkError(input)

        expect(createSpy)
          .toHaveBeenCalledWith(expectedArgs)
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('.createAsResponseBodyParseError()', () => {
    const cases = [
      {
        input: {
          responseParcel: XMLHttpParcel.create({
            request: new Request('http://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
            response: new Response(),
          }),
          payload: BaseRestfulApiPayload.create({
            query: {
              id: 10001,
            },
          }),
        },
      },
      {
        input: {
          responseParcel: XMLHttpParcel.create({
            request: new Request('http://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
            response: new Response(),
          }),
          payload: BaseRestfulApiPayload.create({
            query: {
              id: 10002,
            },
          }),
        },
      },
    ]

    describe('to be instance of own class', () => {
      test.each(cases)('payload: $input.payload', ({ input }) => {
        const actual = BaseRestfulApiCapsule.createAsResponseBodyParseError(input)

        expect(actual)
          .toBeInstanceOf(BaseRestfulApiCapsule)
      })
    })

    describe('to call constructor', () => {
      test.each(cases)('payload: $input.payload', ({ input }) => {
        const expected = {
          responseParcel: input.responseParcel,
          payload: input.payload,
          result: null,
        }

        const createSpy = jest.spyOn(BaseRestfulApiCapsule, 'create')

        BaseRestfulApiCapsule.createAsResponseBodyParseError(input)

        expect(createSpy)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('.get:unknownErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '190.X000.001'

      const actual = BaseRestfulApiCapsule.unknownErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('.get:invalidParameterHashErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '191.X000.001'

      const actual = BaseRestfulApiCapsule.invalidParameterHashErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('.get:abortErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '192.X000.004'

      const actual = BaseRestfulApiCapsule.abortErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('.get:timeoutErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '192.X000.003'

      const actual = BaseRestfulApiCapsule.timeoutErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('.get:networkErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '192.X000.001'

      const actual = BaseRestfulApiCapsule.networkErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('.get:responseBodyParseErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '192.X000.002'

      const actual = BaseRestfulApiCapsule.responseBodyParseErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#get:Ctor', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = BaseRestfulApiPayload.create()
    const mockResult = {
      content: {
        customer: {
          id: 10001,
        },
      },
    }

    const cases = [
      {
        input: {
          args: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: mockResult,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
      {
        input: {
          args: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
      {
        input: {
          args: {
            responseParcel: null,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
      {
        input: {
          args: {
            responseParcel: null,
            payload: null,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
    ]

    test.each(cases)('args: $input.args', ({ input }) => {
      const capsule = new BaseRestfulApiCapsule(input.args)

      const actual = capsule.Ctor

      expect(actual)
        .toBe(BaseRestfulApiCapsule) // same reference
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#get:statusCode', () => {
    describe('with existing response', () => {
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response('{}', {
                status: 200,
                statusText: 'OK',
              }),
            }),
          },
          expected: 200,
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response('{}', {
                status: 400,
                statusText: 'Bad Request',
              }),
            }),
          },
          expected: 400,
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response('{}', {
                status: 404,
                statusText: 'Not Found',
              }),
            }),
          },
          expected: 404,
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel', ({ input, expected }) => {
        const capsule = new BaseRestfulApiCapsule({
          responseParcel: input.responseParcel,
          payload: null,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        })

        const actual = capsule.statusCode

        expect(actual)
          .toBe(expected)
      })
    })

    describe('without response', () => {
      const cases = [
        {
          input: {
            responseParcel: null, // network error
          },
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel', ({ input }) => {
        const capsule = new BaseRestfulApiCapsule({
          responseParcel: input.responseParcel,
          payload: null,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        })

        const actual = capsule.statusCode

        expect(actual)
          .toBeNull()
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#get:statusText', () => {
    describe('with existing response', () => {
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response('{}', {
                status: 200,
                statusText: 'OK',
              }),
            }),
          },
          expected: 'OK',
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response('{}', {
                status: 400,
                statusText: 'Bad Request',
              }),
            }),
          },
          expected: 'Bad Request',
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response('{}', {
                status: 404,
                statusText: 'Not Found',
              }),
            }),
          },
          expected: 'Not Found',
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel', ({ input, expected }) => {
        const capsule = new BaseRestfulApiCapsule({
          responseParcel: input.responseParcel,
          payload: null,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        })

        const actual = capsule.statusText

        expect(actual)
          .toBe(expected)
      })
    })

    describe('without response', () => {
      const cases = [
        {
          input: {
            responseParcel: null, // network error
          },
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel', ({ input }) => {
        const capsule = new BaseRestfulApiCapsule({
          responseParcel: input.responseParcel,
          payload: null,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        })

        const actual = capsule.statusCode

        expect(actual)
          .toBeNull()
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#hasError()', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = BaseRestfulApiPayload.create()

    describe('to has error (truthy)', () => {
      const cases = [
        {
          input: {
            hasInvalidParameterHashError: true,
            // hasNetworkError: true,
            // hasResponseBodyParseError: true,
            // hasStatusCodeError: true,
            // hasResultError: true,
          },
        },
        {
          input: {
            // hasInvalidParameterHashError: true,
            hasNetworkError: true,
            // hasResponseBodyParseError: true,
            // hasStatusCodeError: true,
            // hasResultError: true,
          },
        },
        {
          input: {
            // hasInvalidParameterHashError: true,
            // hasNetworkError: true,
            hasResponseBodyParseError: true,
            // hasStatusCodeError: true,
            // hasResultError: true,
          },
        },
        {
          input: {
            // hasInvalidParameterHashError: true,
            // hasNetworkError: true,
            // hasResponseBodyParseError: true,
            hasStatusCodeError: true,
            // hasResultError: true,
          },
        },
        {
          input: {
            // hasInvalidParameterHashError: true,
            // hasNetworkError: true,
            // hasResponseBodyParseError: true,
            // hasStatusCodeError: true,
            hasResultError: true,
          },
        },
      ]

      test.each(cases)('input: $input', ({ input }) => {
        const args = {
          responseParcel: mockResponseParcel,
          payload: mockPayload,
          result: {},
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        jest.spyOn(capsule, 'hasInvalidParameterHashError')
          .mockReturnValue(input.hasInvalidParameterHashError)
        jest.spyOn(capsule, 'hasNetworkError')
          .mockReturnValue(input.hasNetworkError)
        jest.spyOn(capsule, 'hasResponseBodyParseError')
          .mockReturnValue(input.hasResponseBodyParseError)
        jest.spyOn(capsule, 'hasStatusCodeError')
          .mockReturnValue(input.hasStatusCodeError)
        jest.spyOn(capsule, 'hasResultError')
          .mockReturnValue(input.hasResultError)

        const actual = capsule.hasError()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to has no error (falsy)', () => {
      const cases = [
        {
          input: {
            hasInvalidParameterHashError: false,
            hasNetworkError: false,
            hasResponseBodyParseError: false,
            hasStatusCodeError: false,
            hasResultError: false,
          },
        },
      ]

      test.each(cases)('input: $input', ({ input }) => {
        const args = {
          responseParcel: mockResponseParcel,
          payload: mockPayload,
          result: {},
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }

        const capsule = new BaseRestfulApiCapsule(args)

        jest.spyOn(capsule, 'hasInvalidParameterHashError')
          .mockReturnValue(input.hasInvalidParameterHashError)
        jest.spyOn(capsule, 'hasNetworkError')
          .mockReturnValue(input.hasNetworkError)
        jest.spyOn(capsule, 'hasResponseBodyParseError')
          .mockReturnValue(input.hasResponseBodyParseError)
        jest.spyOn(capsule, 'hasStatusCodeError')
          .mockReturnValue(input.hasStatusCodeError)
        jest.spyOn(capsule, 'hasResultError')
          .mockReturnValue(input.hasResultError)

        const actual = capsule.hasError()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#isPending()', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockResult = {
      content: {
        customer: {
          id: 10001,
        },
      },
    }

    describe('to be pending (truthy)', () => {
      const cases = [
        {
          input: {
            responseParcel: null,
            payload: null,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel; result: $input.result', ({ input }) => {
        const capsule = new BaseRestfulApiCapsule(input)

        const actual = capsule.isPending()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to be not pending (falsy)', () => {
      const mockPayload = BaseRestfulApiPayload.create()

      const cases = [
        {
          input: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: mockResult,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          input: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          input: {
            responseParcel: null,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel; result: $input.result', ({ input }) => {
        const capsule = new BaseRestfulApiCapsule(input)

        const actual = capsule.isPending()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#hasInvalidParameterHashError()', () => {
    class AlphaRestfulApiPayload extends BaseRestfulApiPayload {
      /** @override */
      static get pathname () {
        return '/alpha-endpoint'
      }

      /** @override */
      static get method () {
        return RESTFUL_API_METHOD.GET
      }

      /** @override */
      static get queryRequiredFields () {
        return [
          'first',
        ]
      }

      /** @override */
      static get bodyRequiredFields () {
        return [
          'second',
          'third',
        ]
      }

      /** @override */
      static get pathParameterRequiredFields () {
        return []
      }
    }

    class BetaRestfulApiPayload extends BaseRestfulApiPayload {
      /** @override */
      static get pathname () {
        return '/beta-endpoint'
      }

      /** @override */
      static get method () {
        return RESTFUL_API_METHOD.POST
      }

      /** @override */
      static get queryRequiredFields () {
        return [
          'first',
          'second',
        ]
      }

      /** @override */
      static get bodyRequiredFields () {
        return [
          'third',
          'fourth',
        ]
      }

      /** @override */
      static get pathParameterRequiredFields () {
        return [
          'fifth',
        ]
      }
    }

    /**
     * @type {Array<{
     *   input: {
     *     Payload: RestfulApiType.PayloadCtor<*>
     *   }
     *   truthyCases: Array<Omit<ConstructorParameters<RestfulApiType.PayloadCtor<*>>[0], 'options'>>,
     *   falsyCases: Array<Omit<ConstructorParameters<RestfulApiType.PayloadCtor<*>>[0], 'options'>>,
     * }>}
     */
    const cases = [
      {
        input: {
          Payload: AlphaRestfulApiPayload,
        },
        truthyCases: [
          {
            query: {
              // first: '1st value',
            },
            body: {
              second: '2nd value',
              third: '3rd value',
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '1st value',
            },
            body: {
              // second: '2nd value',
              third: '3rd value',
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '1st value',
            },
            body: {
              second: '2nd value',
              // third: '3rd value',
            },
            pathParameterHash: {},
          },
        ],
        falsyCases: [
          {
            query: {
              first: '1st value',
            },
            body: {
              second: '2nd value',
              third: '3rd value',
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '(1)',
              extra: 'unknown value', // ✅️ unnecessary field
            },
            body: {
              second: '(2)',
              third: '(3)',
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '(1)',
            },
            body: {
              second: '(2)',
              third: '(3)',
              extra: 'unknown value', // ✅️ unnecessary field
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '(1)',
            },
            body: {
              second: '(2)',
              third: '(3)',
            },
            pathParameterHash: {
              extra: 'unknown value', // ✅️ unnecessary field
            },
          },
        ],
      },
      {
        input: {
          Payload: BetaRestfulApiPayload,
        },
        truthyCases: [
          {
            query: {
              // first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              // second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              // third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              // fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              // fifth: '5th value',
            },
          },
        ],
        falsyCases: [
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              extra: 'unknown value', // ✅️ unnecessary field
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              extra: 'unknown value', // ✅️ unnecessary field
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              extra: 'unknown value', // ✅️ unnecessary field
              fifth: '5th value',
            },
          },
        ],
      },
    ]

    describe.each(cases)('Payload: $input.Payload.name', ({ input, truthyCases, falsyCases }) => {
      describe('to be truthy', () => {
        test.each(truthyCases)('query: $query', ({ query, body, pathParameterHash }) => {
          const payload = input.Payload.create({
            query,
            body,
            pathParameterHash,
          })

          const args = {
            responseParcel: null,
            payload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.hasInvalidParameterHashError()

          expect(actual)
            .toBeTruthy()
        })
      })

      describe('to be falsy', () => {
        test.each(falsyCases)('query: $query', ({ query, body, pathParameterHash }) => {
          const payload = input.Payload.create({
            query,
            body,
            pathParameterHash,
          })

          const args = {
            responseParcel: null,
            payload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.hasInvalidParameterHashError()

          expect(actual)
            .toBeFalsy()
        })

        test('when payload is null', () => {
          const args = {
            responseParcel: null,
            payload: null,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.hasInvalidParameterHashError()

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#hasAbortError()', () => {
    const mockPayload = BaseRestfulApiPayload.create({
      query: {
        id: 10001,
      },
    })

    describe('to be true where the parcel is of the abort', () => {
      const cases = [
        {
          params: {
            responseParcel: XMLHttpParcel.createAsAbortError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsAbortError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasAbortError()

        expect(actual)
          .toBe(true)
      })
    })

    describe('to be false where the parcel is not of the abort', () => {
      const cases = [
        {
          params: {
            responseParcel: null,
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsTimeoutError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/resource-0003'),
              config: {},
              response: new Response(),
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasAbortError()

        expect(actual)
          .toBe(false)
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#hasTimeoutError()', () => {
    const mockPayload = BaseRestfulApiPayload.create({
      query: {
        id: 10001,
      },
    })

    describe('to be true where the parcel is of the timeout', () => {
      const cases = [
        {
          params: {
            responseParcel: XMLHttpParcel.createAsTimeoutError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsTimeoutError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasTimeoutError()

        expect(actual)
          .toBe(true)
      })
    })

    describe('to be false where the parcel is not of the timeout', () => {
      const cases = [
        {
          params: {
            responseParcel: null,
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsAbortError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/resource-0003'),
              config: {},
              response: new Response(),
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasTimeoutError()

        expect(actual)
          .toBe(false)
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#hasNetworkError()', () => {
    const mockPayload = BaseRestfulApiPayload.create()

    describe('to has no responseParcel (truthy)', () => {
      const cases = [
        {
          input: {
            responseParcel: null,
          },
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel', ({ input }) => {
        const args = {
          responseParcel: input.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasNetworkError()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to has responseParcel (falsy)', () => {
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel', ({ input }) => {
        const args = {
          responseParcel: input.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasNetworkError()

        expect(actual)
          .toBeFalsy()
      })
    })

    describe('to has a failed parcel other than the abortion and the timeout (true)', () => {
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.createAsError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel', ({ input }) => {
        const args = {
          responseParcel: input.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasNetworkError()

        expect(actual)
          .toBe(true)
      })
    })

    describe('to has a parcel of the abortion or the timeout (false)', () => {
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.createAsAbortError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.createAsTimeoutError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel', ({ input }) => {
        const args = {
          responseParcel: input.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasNetworkError()

        expect(actual)
          .toBe(false)
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#hasResponseBodyParseError()', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = BaseRestfulApiPayload.create()

    describe('when has responseParcel', () => {
      describe('to has no result (truthy)', () => {
        const cases = [
          {
            input: {
              result: null,
            },
          },
        ]

        test.each(cases)('result: $input.result', ({ input }) => {
          const args = {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.hasResponseBodyParseError()

          expect(actual)
            .toBeTruthy()
        })
      })

      describe('to has result (falsy)', () => {
        const cases = [
          {
            input: {
              result: {
                content: {
                  customer: {
                    id: 10001,
                  },
                },
              },
            },
          },
          {
            input: {
              result: {
                error: {
                  code: '190.X000.001',
                },
              },
            },
          },
        ]

        test.each(cases)('result: $input.result', ({ input }) => {
          const args = {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.hasResponseBodyParseError()

          expect(actual)
            .toBeFalsy()
        })
      })
    })

    describe('when has no responseParcel', () => {
      describe('to be falsy always', () => {
        const cases = [
          {
            input: {
              result: null,
            },
          },
          {
            input: {
              result: {
                content: {
                  customer: {
                    id: 10001,
                  },
                },
              },
            },
          },
          {
            input: {
              result: {
                error: {
                  code: '190.X000.001',
                },
              },
            },
          },
        ]

        test.each(cases)('result: $input.result', ({ input }) => {
          const args = {
            responseParcel: null,
            payload: mockPayload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.hasResponseBodyParseError()

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#hasStatusCodeError()', () => {
    const mockPayload = BaseRestfulApiPayload.create()

    describe('to has error (truthy)', () => {
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(null, {
                status: 400,
                statusText: 'Bad Request',
              }),
            }),
            result: {},
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(null, {
                status: 401,
                statusText: 'Unauthorized',
              }),
            }),
            result: {},
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(null, {
                status: 404,
                statusText: 'Not Found',
              }),
            }),
            result: {},
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(null, {
                status: 500,
                statusText: 'Internal Server Error',
              }),
            }),
            result: {},
          },
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel', ({ input }) => {
        const args = {
          responseParcel: input.responseParcel,
          payload: mockPayload,
          result: input.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasStatusCodeError()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to has no error (falsy)', () => {
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response('{}', {
                status: 200,
                statusText: 'OK',
              }),
            }),
            result: {
              content: {
                customer: {
                  id: 10001,
                },
              },
            },
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response('{}', {
                status: 201,
                statusText: 'Created',
              }),
            }),
            result: {},
          },
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel', ({ input }) => {
        const args = {
          responseParcel: input.responseParcel,
          payload: mockPayload,
          result: input.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasStatusCodeError()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#hasResultError()', () => {
    const mockPayload = BaseRestfulApiPayload.create()

    describe('to be fixed value', () => {
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response('{}', {
                status: 200,
                statusText: 'OK',
              }),
            }),
            result: {
              content: {
                customer: {
                  id: 10001,
                },
              },
            },
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response('{}', {
                status: 201,
                statusText: 'Created',
              }),
            }),
            result: {},
          },
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel', ({ input }) => {
        const args = {
          responseParcel: input.responseParcel,
          payload: mockPayload,
          result: input.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasResultError()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#getErrorMessage()', () => {
    describe('when the response was not received', () => {
      const neutralPayload = BaseRestfulApiPayload.create({
        query: {
          id: 10001,
        },
      })

      const cases = [
        {
          params: {
            responseParcel: XMLHttpParcel.createAsTimeoutError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
          expected: BaseRestfulApiCapsule.timeoutErrorCode,
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsTimeoutError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
          expected: BaseRestfulApiCapsule.timeoutErrorCode,
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsAbortError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
          expected: BaseRestfulApiCapsule.abortErrorCode,
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsAbortError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
          expected: BaseRestfulApiCapsule.abortErrorCode,
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
          expected: BaseRestfulApiCapsule.networkErrorCode,
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
          expected: BaseRestfulApiCapsule.networkErrorCode,
        },
      ]

      test.each(cases)('expected: $expected', ({ params, expected }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: neutralPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.getErrorMessage()

        expect(actual)
          .toBe(expected)
      })
    })

    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = BaseRestfulApiPayload.create()

    const GetRequestRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return RESTFUL_API_METHOD.GET
      }
    }
    const PostRequestRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return RESTFUL_API_METHOD.POST
      }
    }
    const DeleteRequestRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return RESTFUL_API_METHOD.DELETE
      }
    }

    describe('when has error', () => {
      describe('on invalid parameters error', () => {
        class InvalidParameterErrorRestfulApiPayload extends BaseRestfulApiPayload {
          /** @override */
          static get pathname () {
            return '/alpha-endpoint'
          }

          /** @override */
          static get method () {
            return RESTFUL_API_METHOD.GET
          }

          /** @override */
          static get queryRequiredFields () {
            return [
              'first',
              'second',
            ]
          }
        }

        const cases = [
          {
            input: {
              payload: InvalidParameterErrorRestfulApiPayload.create({
                query: {
                  // first: '1st value',
                  second: '2nd value',
                },
              }),
              responseParcel: null,
              result: null,
            },
          },
          {
            input: {
              payload: InvalidParameterErrorRestfulApiPayload.create({
                query: {
                  first: '1st value',
                  // second: '2nd value',
                },
              }),
              responseParcel: null,
              result: null,
            },
          },
        ]

        test.each(cases)('query: $input.payload.query', ({ input }) => {
          const expected = '191.X000.001'

          const args = {
            responseParcel: input.responseParcel,
            payload: input.payload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.getErrorMessage()

          expect(actual)
            .toBe(expected)
        })
      })

      describe('on network error', () => {
        const cases = [
          {
            input: {
              payload: GetRequestRestfulApiPayload.create(),
              responseParcel: null,
              result: null,
            },
          },
          {
            input: {
              payload: PostRequestRestfulApiPayload.create(),
              responseParcel: null,
              result: null,
            },
          },
          {
            input: {
              payload: DeleteRequestRestfulApiPayload.create(),
              responseParcel: null,
              result: null,
            },
          },
        ]

        test.each(cases)('payload: $input.payload.constructor.name', ({ input }) => {
          const expected = '192.X000.001'

          const args = {
            responseParcel: input.responseParcel,
            payload: input.payload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.getErrorMessage()

          expect(actual)
            .toBe(expected)
        })
      })

      describe('on response body parse error', () => {
        const cases = [
          {
            input: {
              payload: GetRequestRestfulApiPayload.create(),
              responseParcel: mockResponseParcel,
              result: null,
            },
          },
          {
            input: {
              payload: PostRequestRestfulApiPayload.create(),
              responseParcel: mockResponseParcel,
              result: null,
            },
          },
          {
            input: {
              payload: DeleteRequestRestfulApiPayload.create(),
              responseParcel: mockResponseParcel,
              result: null,
            },
          },
        ]

        test.each(cases)('payload: $input.payload.constructor.name', ({ input }) => {
          const expected = '192.X000.002'

          const args = {
            responseParcel: input.responseParcel,
            payload: input.payload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.getErrorMessage()

          expect(actual)
            .toBe(expected)
        })
      })

      describe('on status code error', () => {
        const cases = [
          {
            input: {
              payload: GetRequestRestfulApiPayload.create(),
              responseParcel: XMLHttpParcel.create({
                request: new Request('http://example.com/neutral'), // Neutral value
                config: {}, // Neutral value
                response: new Response(null, {
                  status: 400,
                  statusText: 'Bad Request',
                }),
              }),
              result: {},
            },
            expected: '193.X000.400',
          },
          {
            input: {
              payload: PostRequestRestfulApiPayload.create(),
              responseParcel: XMLHttpParcel.create({
                request: new Request('http://example.com/neutral'), // Neutral value
                config: {}, // Neutral value
                response: new Response(null, {
                  status: 401,
                  statusText: 'Unauthorized',
                }),
              }),
              result: {},
            },
            expected: '193.X000.401',
          },
          {
            input: {
              payload: DeleteRequestRestfulApiPayload.create(),
              responseParcel: XMLHttpParcel.create({
                request: new Request('http://example.com/neutral'), // Neutral value
                config: {}, // Neutral value
                response: new Response(null, {
                  status: 404,
                  statusText: 'Not Found',
                }),
              }),
              result: {},
            },
            expected: '193.X000.404',
          },
        ]

        test.each(cases)('responseParcel: $input.responseParcel', ({ input, expected }) => {
          const args = {
            responseParcel: input.responseParcel,
            payload: input.payload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.getErrorMessage()

          expect(actual)
            .toBe(expected)
        })
      })

      describe('on result error', () => {
        const cases = [
          {
            input: {
              payload: GetRequestRestfulApiPayload.create(),
              responseParcel: mockResponseParcel,
              result: {
                errorCode: '200.G001.001',
              },
            },
            expected: '200.G001.001',
          },
          {
            input: {
              payload: PostRequestRestfulApiPayload.create(),
              responseParcel: mockResponseParcel,
              result: {
                errorCode: '200.P001.001',
              },
            },
            expected: '200.P001.001',
          },
          {
            input: {
              payload: DeleteRequestRestfulApiPayload.create(),
              responseParcel: mockResponseParcel,
              result: {
                errorCode: '200.D001.001',
              },
            },
            expected: '200.D001.001',
          },
        ]

        test.each(cases)('result: $input.result', ({ input, expected }) => {
          const args = {
            responseParcel: input.responseParcel,
            payload: input.payload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          jest.spyOn(capsule, 'hasResultError')
            .mockReturnValue(true)
          jest.spyOn(capsule, 'generateResultErrorCode')
            .mockReturnValue(input.result.errorCode)

          const actual = capsule.getErrorMessage()

          expect(actual)
            .toBe(expected)
        })
      })

      describe('on unknown error', () => {
        const cases = [
          {
            input: {
              payload: GetRequestRestfulApiPayload.create(),
              responseParcel: mockResponseParcel,
              result: {
                error: {
                  code: null,
                },
              },
            },
          },
        ]

        test.each(cases)('payload: $input.payload.constructor.name', ({ input }) => {
          const args = {
            responseParcel: input.responseParcel,
            payload: input.payload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.getErrorMessage()

          expect(actual)
            .toBeNull()
        })
      })
    })

    describe('when has no error on post-fetch', () => {
      const cases = [
        {
          input: {
            result: {
              content: {
                customer: {
                  id: 10001,
                },
              },
            },
          },
        },
        {
          input: {
            result: {},
          },
        },
      ]

      test.each(cases)('result: $input.result', ({ input }) => {
        const args = {
          responseParcel: mockResponseParcel,
          payload: mockPayload,
          result: input.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.getErrorMessage()

        expect(actual)
          .toBeNull()
      })
    })

    describe('when has no error on pre-fetch', () => {
      test('all args are null', () => {
        const args = {
          responseParcel: null,
          payload: null,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.getErrorMessage()

        expect(actual)
          .toBeNull()
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#generateResultErrorCode()', () => {
    describe('should throw an error', () => {
      const mockResponseParcel = XMLHttpParcel.create({
        request: new Request('http://example.com/neutral'), // Neutral value
        config: {}, // Neutral value
        response: new Response(),
      })
      const mockPayload = BaseRestfulApiPayload.create()

      const cases = [
        {
          name: 'on result error',
          input: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          name: 'on network error',
          input: {
            responseParcel: null,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          name: 'on response body parse error',
          input: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          name: 'on status code error',
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(null, {
                status: 400,
                statusText: 'Bad Request',
              }),
            }),
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      ]

      test.each(cases)('$name', ({ input }) => {
        const expected = 'this feature must be inherited'

        const capsule = new BaseRestfulApiCapsule(input)

        expect(() => {
          capsule.generateResultErrorCode()
        })
          .toThrow(expected)
      })
    })
  })
})
