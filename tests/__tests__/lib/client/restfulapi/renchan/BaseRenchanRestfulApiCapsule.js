import BaseRenchanRestfulApiCapsule from '~/lib/client/restfulapi/renchan/BaseRenchanRestfulApiCapsule.js'

import {
  default as BaseRestfulApiCapsule,
  LAUNCH_ABORTED_REASON,
} from '~/lib/client/restfulapi/BaseRestfulApiCapsule.js'

import BaseRenchanRestfulApiPayload from '~/lib/client/restfulapi/renchan/BaseRenchanRestfulApiPayload.js'
import XMLHttpParcel from '~/lib/tools/http-fetchers/parcels/concretes/XMLHttpParcel.js'

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
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
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
          responseParcel: mockResponseParcel,
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
            responseParcel: null,
            result: null,
          },
        },
        // on response body parse error
        {
          input: {
            responseParcel: mockResponseParcel,
            result: null,
          },
        },
        // on query error
        {
          input: {
            responseParcel: mockResponseParcel,
            result: {
              error: {
                code: '190.X000.001',
              },
            },
          },
        },
        {
          input: {
            responseParcel: mockResponseParcel,
            result: {
              error: {
                code: null,
              },
            },
          },
        },
      ]

      test.each(cases)('responseParcel: $input.responseParcel; result: $input.result', ({ input }) => {
        const args = {
          responseParcel: input.responseParcel,
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
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = BaseRenchanRestfulApiPayload.create()

    const cases = [
      {
        input: {
          responseParcel: mockResponseParcel,
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
          responseParcel: mockResponseParcel,
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
          responseParcel: null,
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
          responseParcel: null,
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
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
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
          responseParcel: mockResponseParcel,
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
            result: null, // network error or response body parse error, etc.
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
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
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
          responseParcel: mockResponseParcel,
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
            result: null, // network error or response body parse error, etc.
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
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
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
          responseParcel: mockResponseParcel,
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
          responseParcel: mockResponseParcel,
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
