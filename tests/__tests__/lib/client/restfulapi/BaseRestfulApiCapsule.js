import {
  RESTFUL_API_METHOD,
} from '~/lib/client/restfulapi/constants.js'

import BaseRestfulApiCapsule, {
  LAUNCH_ABORTED_REASON,
} from '~/lib/client/restfulapi/BaseRestfulApiCapsule.js'

import BaseRestfulApiPayload from '~/lib/client/restfulapi/BaseRestfulApiPayload.js'

describe('BaseRestfulApiCapsule', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      const mockResponse = new Response()
      const mockPayload = new BaseRestfulApiPayload({
        query: {},
        body: {},
        pathParameterHash: {},
        options: {},
      })

      describe('#rawResponse', () => {
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
            rawResponse: input.response,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }

          const actual = new BaseRestfulApiCapsule(args)

          expect(actual)
            .toHaveProperty('rawResponse', input.response)
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
            rawResponse: mockResponse,
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
            rawResponse: mockResponse,
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
            rawResponse: null,
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
      const cases = [
        {
          input: {
            rawResponse: new Response(),
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
            rawResponse: new Response(),
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
        const cases = [
          {
            input: {
              rawResponse: new Response(),
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
              rawResponse: new Response(),
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
        const cases = [
          {
            input: {
              rawResponse: new Response(),
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
              rawResponse: new Response(),
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
          rawResponse: null,
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
          rawResponse: null,
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
          rawResponse: null,
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
        const actual = BaseRestfulApiCapsule.createAsNetworkError(input)

        expect(actual)
          .toBeInstanceOf(BaseRestfulApiCapsule)
      })
    })

    describe('to call .create()', () => {
      test.each(cases)('payload: $input.payload', ({ input }) => {
        const expectedArgs = {
          rawResponse: null,
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
  describe('.createAsJsonParseError()', () => {
    const cases = [
      {
        input: {
          rawResponse: new Response(),
          payload: BaseRestfulApiPayload.create({
            query: {
              id: 10001,
            },
          }),
        },
      },
      {
        input: {
          rawResponse: new Response(),
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
        const actual = BaseRestfulApiCapsule.createAsJsonParseError(input)

        expect(actual)
          .toBeInstanceOf(BaseRestfulApiCapsule)
      })
    })

    describe('to call constructor', () => {
      test.each(cases)('payload: $input.payload', ({ input }) => {
        const expected = {
          rawResponse: input.rawResponse,
          payload: input.payload,
          result: null,
        }

        const createSpy = jest.spyOn(BaseRestfulApiCapsule, 'create')

        BaseRestfulApiCapsule.createAsJsonParseError(input)

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
  describe('.get:jsonParseErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '192.X000.002'

      const actual = BaseRestfulApiCapsule.jsonParseErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#get:Ctor', () => {
    const mockResponse = new Response()
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
            rawResponse: mockResponse,
            payload: mockPayload,
            result: mockResult,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
      {
        input: {
          args: {
            rawResponse: mockResponse,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
      {
        input: {
          args: {
            rawResponse: null,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
      {
        input: {
          args: {
            rawResponse: null,
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
  describe('#get:content', () => {
    const mockResponse = new Response()
    const mockPayload = BaseRestfulApiPayload.create()

    describe('when has content', () => {
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
          expected: {
            customer: {
              id: 10001,
            },
          },
        },
        {
          input: {
            result: {
              content: {
                customer: {
                  id: 10002,
                },
              },
            },
          },
          expected: {
            customer: {
              id: 10002,
            },
          },
        },
      ]

      test.each(cases)('result: $input.result', ({ input, expected }) => {
        const args = {
          rawResponse: mockResponse,
          payload: mockPayload,
          result: input.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.content

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('when has no content (returns null)', () => {
      const cases = [
        // on network error
        {
          input: {
            rawResponse: null,
            result: null,
          },
        },
        // on JSON parse error
        {
          input: {
            rawResponse: mockResponse,
            result: null,
          },
        },
        // on query error
        {
          input: {
            rawResponse: mockResponse,
            result: {
              error: {
                code: '190.X000.001',
              },
            },
          },
        },
        {
          input: {
            rawResponse: mockResponse,
            result: {
              error: {
                code: null,
              },
            },
          },
        },
      ]

      test.each(cases)('rawResponse: $input.rawResponse; result: $input.result', ({ input }) => {
        const args = {
          rawResponse: input.rawResponse,
          payload: mockPayload,
          result: input.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.content

        expect(actual)
          .toBeNull()
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#get:error', () => {
    const mockResponse = new Response()
    const mockPayload = BaseRestfulApiPayload.create()

    const cases = [
      {
        input: {
          rawResponse: mockResponse,
          payload: mockPayload,
          result: {
            error: {
              code: '190.X000.001',
            },
          },
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        },
        expected: {
          code: '190.X000.001',
        },
      },
      {
        input: {
          rawResponse: mockResponse,
          payload: mockPayload,
          result: {
            error: {
              code: '190.X000.002',
            },
          },
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        },
        expected: {
          code: '190.X000.002',
        },
      },
      {
        input: {
          rawResponse: null,
          payload: mockPayload,
          result: {
            error: {
              code: '190.X000.003',
            },
          },
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        },
        expected: {
          code: '190.X000.003',
        },
      },
      {
        input: {
          rawResponse: null,
          payload: null,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        },
        expected: null,
      },
    ]

    test.each(cases)('result: $input.result', ({ input, expected }) => {
      const capsule = new BaseRestfulApiCapsule(input)

      const actual = capsule.error

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#get:statusCode', () => {
    describe('with existing response', () => {
      const cases = [
        {
          input: {
            rawResponse: new Response('{}', {
              status: 200,
              statusText: 'OK',
            }),
          },
          expected: 200,
        },
        {
          input: {
            rawResponse: new Response('{}', {
              status: 400,
              statusText: 'Bad Request',
            }),
          },
          expected: 400,
        },
        {
          input: {
            rawResponse: new Response('{}', {
              status: 404,
              statusText: 'Not Found',
            }),
          },
          expected: 404,
        },
      ]

      test.each(cases)('rawResponse: $input.rawResponse', ({ input, expected }) => {
        const capsule = new BaseRestfulApiCapsule({
          rawResponse: input.rawResponse,
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
            rawResponse: null, // network error
          },
        },
      ]

      test.each(cases)('rawResponse: $input.rawResponse', ({ input }) => {
        const capsule = new BaseRestfulApiCapsule({
          rawResponse: input.rawResponse,
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
            rawResponse: new Response('{}', {
              status: 200,
              statusText: 'OK',
            }),
          },
          expected: 'OK',
        },
        {
          input: {
            rawResponse: new Response('{}', {
              status: 400,
              statusText: 'Bad Request',
            }),
          },
          expected: 'Bad Request',
        },
        {
          input: {
            rawResponse: new Response('{}', {
              status: 404,
              statusText: 'Not Found',
            }),
          },
          expected: 'Not Found',
        },
      ]

      test.each(cases)('rawResponse: $input.rawResponse', ({ input, expected }) => {
        const capsule = new BaseRestfulApiCapsule({
          rawResponse: input.rawResponse,
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
            rawResponse: null, // network error
          },
        },
      ]

      test.each(cases)('rawResponse: $input.rawResponse', ({ input }) => {
        const capsule = new BaseRestfulApiCapsule({
          rawResponse: input.rawResponse,
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
  describe('#hasContent()', () => {
    const mockResponse = new Response()
    const mockPayload = BaseRestfulApiPayload.create()

    describe('to has content (truthy)', () => {
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
              content: {
                customer: {
                  id: 10002,
                },
              },
            },
          },
        },
      ]

      test.each(cases)('result: $input.result', ({ input }) => {
        const args = {
          rawResponse: mockResponse,
          payload: mockPayload,
          result: input.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasContent()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to has no content (falsy)', () => {
      const cases = [
        {
          input: {
            result: {
              error: {
                code: '190.X000.001',
              },
            },
          },
        },
        {
          input: {
            result: null, // network error or json parse error, etc.
          },
        },
      ]

      test.each(cases)('result: $input.result', ({ input }) => {
        const args = {
          rawResponse: mockResponse,
          payload: mockPayload,
          result: input.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasContent()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#hasError()', () => {
    const mockResponse = new Response()
    const mockPayload = BaseRestfulApiPayload.create()

    describe('to has error (truthy)', () => {
      const cases = [
        {
          input: {
            hasInvalidParameterHashError: true,
            // hasNetworkError: true,
            // hasJsonParseError: true,
            // hasStatusCodeError: true,
            // hasResultError: true,
          },
        },
        {
          input: {
            // hasInvalidParameterHashError: true,
            hasNetworkError: true,
            // hasJsonParseError: true,
            // hasStatusCodeError: true,
            // hasResultError: true,
          },
        },
        {
          input: {
            // hasInvalidParameterHashError: true,
            // hasNetworkError: true,
            hasJsonParseError: true,
            // hasStatusCodeError: true,
            // hasResultError: true,
          },
        },
        {
          input: {
            // hasInvalidParameterHashError: true,
            // hasNetworkError: true,
            // hasJsonParseError: true,
            hasStatusCodeError: true,
            // hasResultError: true,
          },
        },
        {
          input: {
            // hasInvalidParameterHashError: true,
            // hasNetworkError: true,
            // hasJsonParseError: true,
            // hasStatusCodeError: true,
            hasResultError: true,
          },
        },
      ]

      test.each(cases)('input: $input', ({ input }) => {
        const args = {
          rawResponse: mockResponse,
          payload: mockPayload,
          result: {},
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        jest.spyOn(capsule, 'hasInvalidParameterHashError')
          .mockReturnValue(input.hasInvalidParameterHashError)
        jest.spyOn(capsule, 'hasNetworkError')
          .mockReturnValue(input.hasNetworkError)
        jest.spyOn(capsule, 'hasJsonParseError')
          .mockReturnValue(input.hasJsonParseError)
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
            hasJsonParseError: false,
            hasStatusCodeError: false,
            hasResultError: false,
          },
        },
      ]

      test.each(cases)('input: $input', ({ input }) => {
        const args = {
          rawResponse: mockResponse,
          payload: mockPayload,
          result: {},
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }

        const capsule = new BaseRestfulApiCapsule(args)

        jest.spyOn(capsule, 'hasInvalidParameterHashError')
          .mockReturnValue(input.hasInvalidParameterHashError)
        jest.spyOn(capsule, 'hasNetworkError')
          .mockReturnValue(input.hasNetworkError)
        jest.spyOn(capsule, 'hasJsonParseError')
          .mockReturnValue(input.hasJsonParseError)
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
    const mockResponse = new Response()
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
            rawResponse: null,
            payload: null,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      ]

      test.each(cases)('rawResponse: $input.rawResponse; result: $input.result', ({ input }) => {
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
            rawResponse: mockResponse,
            payload: mockPayload,
            result: mockResult,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          input: {
            rawResponse: mockResponse,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          input: {
            rawResponse: null,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      ]

      test.each(cases)('rawResponse: $input.rawResponse; result: $input.result', ({ input }) => {
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
            rawResponse: null,
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
            rawResponse: null,
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
            rawResponse: null,
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
  describe('#hasNetworkError()', () => {
    const mockPayload = BaseRestfulApiPayload.create()

    describe('to has no rawResponse (truthy)', () => {
      const cases = [
        {
          input: {
            rawResponse: null,
          },
        },
      ]

      test.each(cases)('rawResponse: $input.rawResponse', ({ input }) => {
        const args = {
          rawResponse: input.rawResponse,
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

    describe('to has rawResponse (falsy)', () => {
      const cases = [
        {
          input: {
            rawResponse: new Response(),
          },
        },
      ]

      test.each(cases)('rawResponse: $input.rawResponse', ({ input }) => {
        const args = {
          rawResponse: input.rawResponse,
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
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#hasJsonParseError()', () => {
    const mockResponse = new Response()
    const mockPayload = BaseRestfulApiPayload.create()

    describe('when has rawResponse', () => {
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
            rawResponse: mockResponse,
            payload: mockPayload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.hasJsonParseError()

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
            rawResponse: mockResponse,
            payload: mockPayload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.hasJsonParseError()

          expect(actual)
            .toBeFalsy()
        })
      })
    })

    describe('when has no rawResponse', () => {
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
            rawResponse: null,
            payload: mockPayload,
            result: input.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseRestfulApiCapsule(args)

          const actual = capsule.hasJsonParseError()

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('BaseRestfulApiCapsule', () => {
  describe('#hasQueryError()', () => {
    const mockResponse = new Response()
    const mockPayload = BaseRestfulApiPayload.create()

    describe('to has error (truthy)', () => {
      const cases = [
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
          rawResponse: mockResponse,
          payload: mockPayload,
          result: input.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasQueryError()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to has no error (falsy)', () => {
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
            result: null, // network error or json parse error, etc.
          },
        },
      ]

      test.each(cases)('result: $input.result', ({ input }) => {
        const args = {
          rawResponse: mockResponse,
          payload: mockPayload,
          result: input.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRestfulApiCapsule(args)

        const actual = capsule.hasQueryError()

        expect(actual)
          .toBeFalsy()
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
            rawResponse: new Response(null, {
              status: 400,
              statusText: 'Bad Request',
            }),
            result: {},
          },
        },
        {
          input: {
            rawResponse: new Response(null, {
              status: 401,
              statusText: 'Unauthorized',
            }),
            result: {},
          },
        },
        {
          input: {
            rawResponse: new Response(null, {
              status: 404,
              statusText: 'Not Found',
            }),
            result: {},
          },
        },
        {
          input: {
            rawResponse: new Response(null, {
              status: 500,
              statusText: 'Internal Server Error',
            }),
            result: {},
          },
        },
      ]

      test.each(cases)('rawResponse: $input.rawResponse', ({ input }) => {
        const args = {
          rawResponse: input.rawResponse,
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
            rawResponse: new Response('{}', {
              status: 200,
              statusText: 'OK',
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
            rawResponse: new Response('{}', {
              status: 201,
              statusText: 'Created',
            }),
            result: {},
          },
        },
      ]

      test.each(cases)('rawResponse: $input.rawResponse', ({ input }) => {
        const args = {
          rawResponse: input.rawResponse,
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
            rawResponse: new Response('{}', {
              status: 200,
              statusText: 'OK',
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
            rawResponse: new Response('{}', {
              status: 201,
              statusText: 'Created',
            }),
            result: {},
          },
        },
      ]

      test.each(cases)('rawResponse: $input.rawResponse', ({ input }) => {
        const args = {
          rawResponse: input.rawResponse,
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
    const mockResponse = new Response()
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
              rawResponse: null,
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
              rawResponse: null,
              result: null,
            },
          },
        ]

        test.each(cases)('query: $input.payload.query', ({ input }) => {
          const expected = '191.X000.001'

          const args = {
            rawResponse: input.rawResponse,
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
              rawResponse: null,
              result: null,
            },
          },
          {
            input: {
              payload: PostRequestRestfulApiPayload.create(),
              rawResponse: null,
              result: null,
            },
          },
          {
            input: {
              payload: DeleteRequestRestfulApiPayload.create(),
              rawResponse: null,
              result: null,
            },
          },
        ]

        test.each(cases)('payload: $input.payload.constructor.name', ({ input }) => {
          const expected = '192.X000.001'

          const args = {
            rawResponse: input.rawResponse,
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

      describe('on JSON parse error', () => {
        const cases = [
          {
            input: {
              payload: GetRequestRestfulApiPayload.create(),
              rawResponse: mockResponse,
              result: null,
            },
          },
          {
            input: {
              payload: PostRequestRestfulApiPayload.create(),
              rawResponse: mockResponse,
              result: null,
            },
          },
          {
            input: {
              payload: DeleteRequestRestfulApiPayload.create(),
              rawResponse: mockResponse,
              result: null,
            },
          },
        ]

        test.each(cases)('payload: $input.payload.constructor.name', ({ input }) => {
          const expected = '192.X000.002'

          const args = {
            rawResponse: input.rawResponse,
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
              rawResponse: new Response(null, {
                status: 400,
                statusText: 'Bad Request',
              }),
              result: {},
            },
            expected: '193.X000.400',
          },
          {
            input: {
              payload: PostRequestRestfulApiPayload.create(),
              rawResponse: new Response(null, {
                status: 401,
                statusText: 'Unauthorized',
              }),
              result: {},
            },
            expected: '193.X000.401',
          },
          {
            input: {
              payload: DeleteRequestRestfulApiPayload.create(),
              rawResponse: new Response(null, {
                status: 404,
                statusText: 'Not Found',
              }),
              result: {},
            },
            expected: '193.X000.404',
          },
        ]

        test.each(cases)('rawResponse: $input.rawResponse', ({ input, expected }) => {
          const args = {
            rawResponse: input.rawResponse,
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
              rawResponse: mockResponse,
              result: {
                errorCode: '200.G001.001',
              },
            },
            expected: '200.G001.001',
          },
          {
            input: {
              payload: PostRequestRestfulApiPayload.create(),
              rawResponse: mockResponse,
              result: {
                errorCode: '200.P001.001',
              },
            },
            expected: '200.P001.001',
          },
          {
            input: {
              payload: DeleteRequestRestfulApiPayload.create(),
              rawResponse: mockResponse,
              result: {
                errorCode: '200.D001.001',
              },
            },
            expected: '200.D001.001',
          },
        ]

        test.each(cases)('result: $input.result', ({ input, expected }) => {
          const args = {
            rawResponse: input.rawResponse,
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
              rawResponse: mockResponse,
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
            rawResponse: input.rawResponse,
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
          rawResponse: mockResponse,
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
          rawResponse: null,
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
      const mockResponse = new Response()
      const mockPayload = BaseRestfulApiPayload.create()

      const cases = [
        {
          name: 'on result error',
          input: {
            rawResponse: mockResponse,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          name: 'on network error',
          input: {
            rawResponse: null,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          name: 'on JSON parse error',
          input: {
            rawResponse: mockResponse,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          name: 'on status code error',
          input: {
            rawResponse: new Response(null, {
              status: 400,
              statusText: 'Bad Request',
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
