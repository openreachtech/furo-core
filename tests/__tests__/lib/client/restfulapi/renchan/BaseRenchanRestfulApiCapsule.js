import BaseRenchanRestfulApiCapsule from '~/lib/client/restfulapi/renchan/BaseRenchanRestfulApiCapsule.js'

import {
  default as BaseRestfulApiCapsule,
  LAUNCH_ABORTED_REASON,
} from '~/lib/client/restfulapi/BaseRestfulApiCapsule.js'

import BaseRenchanRestfulApiPayload from '~/lib/client/restfulapi/renchan/BaseRenchanRestfulApiPayload.js'

describe('BaseRenchanRestfulApiCapsule', () => {
  describe('inheritance', () => {
    test('should extend BaseRestfulApiCapsule', () => {
      const actual = BaseRenchanRestfulApiCapsule.prototype

      expect(actual)
        .toBeInstanceOf(BaseRestfulApiCapsule)
    })
  })
})

describe('BaseRenchanRestfulApiCapsule', () => {
  describe('#get:content', () => {
    const mockResponse = new Response()
    const mockPayload = BaseRenchanRestfulApiPayload.create()

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
        const capsule = new BaseRenchanRestfulApiCapsule(args)

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
        const capsule = new BaseRenchanRestfulApiCapsule(args)

        const actual = capsule.content

        expect(actual)
          .toBeNull()
      })
    })
  })
})

describe('BaseRenchanRestfulApiCapsule', () => {
  describe('#get:error', () => {
    const mockResponse = new Response()
    const mockPayload = BaseRenchanRestfulApiPayload.create()

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
      const capsule = new BaseRenchanRestfulApiCapsule(input)

      const actual = capsule.error

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseRenchanRestfulApiCapsule', () => {
  describe('#hasResultContent()', () => {
    const mockResponse = new Response()
    const mockPayload = BaseRenchanRestfulApiPayload.create()

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
        const capsule = new BaseRenchanRestfulApiCapsule(args)

        const actual = capsule.hasResultContent()

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
        const capsule = new BaseRenchanRestfulApiCapsule(args)

        const actual = capsule.hasResultContent()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseRenchanRestfulApiCapsule', () => {
  describe('#hasResultError()', () => {
    const mockResponse = new Response()
    const mockPayload = BaseRenchanRestfulApiPayload.create()

    describe('to has result error (truthy)', () => {
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
        const capsule = new BaseRenchanRestfulApiCapsule(args)

        const actual = capsule.hasResultError()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to has no result error (falsy)', () => {
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
        const capsule = new BaseRenchanRestfulApiCapsule(args)

        const actual = capsule.hasResultError()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseRenchanRestfulApiCapsule', () => {
  describe('#generateResultErrorCode()', () => {
    const mockResponse = new Response()
    const mockPayload = BaseRenchanRestfulApiPayload.create()

    describe('to return error code of result', () => {
      const cases = [
        {
          input: {
            result: {
              error: {
                code: '191.G000.001',
              },
            },
          },
          expected: '191.G000.001',
        },
        {
          input: {
            result: {
              error: {
                code: '192.P000.002',
              },
            },
          },
          expected: '192.P000.002',
        },
        {
          input: {
            result: {
              error: {
                code: '193.D000.003',
              },
            },
          },
          expected: '193.D000.003',
        },
      ]

      test.each(cases)('result: $input.result', ({ input, expected }) => {
        const args = {
          rawResponse: mockResponse,
          payload: mockPayload,
          result: input.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRenchanRestfulApiCapsule(args)

        const actual = capsule.generateResultErrorCode()

        expect(actual)
          .toBe(expected)
      })
    })

    describe('to return fixed default error code', () => {
      const cases = [
        {
          input: {
            result: {
              content: {},
            },
          },
        },
        {
          input: {
            result: null,
          },
        },
      ]

      test.each(cases)('result: $input.result', ({ input }) => {
        const expected = '190.X000.001' // BaseRenchanRestfulApiCapsule.unknownErrorCode

        const args = {
          rawResponse: mockResponse,
          payload: mockPayload,
          result: input.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseRenchanRestfulApiCapsule(args)

        const actual = capsule.generateResultErrorCode()

        expect(actual)
          .toBe(expected)
      })
    })
  })
})
