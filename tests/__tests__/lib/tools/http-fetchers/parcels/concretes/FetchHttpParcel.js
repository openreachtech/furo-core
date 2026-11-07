import FetchHttpParcel from '../../../../../../../lib/tools/http-fetchers/parcels/concretes/FetchHttpParcel.js'

import BaseHttpParcel from '../../../../../../../lib/tools/http-fetchers/parcels/BaseHttpParcel.js'

describe('FetchHttpParcel', () => {
  describe('inheritance', () => {
    test('should be correct class', () => {
      const received = FetchHttpParcel.prototype

      expect(received)
        .toBeInstanceOf(BaseHttpParcel)
    })
  })
})

describe('FetchHttpParcel', () => {
  describe('#isRedirected()', () => {
    // The polyfill of Response does not hold the property, so that a response that holds it is defined here.
    class RedirectedResponse extends Response {
      /**
       * get: Whether the response is the result of a redirect.
       *
       * @returns {boolean} Whether the response is the result of a redirect.
       */
      get redirected () {
        return true
      }
    }

    class DirectResponse extends Response {
      /**
       * get: Whether the response is the result of a redirect.
       *
       * @returns {boolean} Whether the response is the result of a redirect.
       */
      get redirected () {
        return false
      }
    }

    describe('should be true when the response is the result of a redirect', () => {
      const cases = [
        {
          input: {
            response: new RedirectedResponse('text-0001'),
          },
        },
        {
          input: {
            response: new RedirectedResponse('text-0002'),
          },
        },
      ]

      test.each(cases)('response: $input.response', ({ input }) => {
        const parcel = FetchHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = parcel.isRedirected()

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false when the response is not the result of a redirect', () => {
      const cases = [
        {
          input: {
            response: new DirectResponse('text-0001'),
          },
        },
        {
          input: {
            response: new DirectResponse('text-0002'),
          },
        },
      ]

      test.each(cases)('response: $input.response', ({ input }) => {
        const parcel = FetchHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = parcel.isRedirected()

        expect(received)
          .toBe(false)
      })
    })

    describe('should be false when the response was not received', () => {
      const cases = [
        {
          input: {
            parcel: FetchHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: FetchHttpParcel.createAsAbortError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.isRedirected()

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('FetchHttpParcel', () => {
  describe('#extractResponseType()', () => {
    describe('should be the type of the response', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
          expected: 'default', // the type that the polyfill of Response gives
        },
        {
          input: {
            response: Response.error(),
          },
          expected: 'error',
        },
      ]

      test.each(cases)('expected: $expected', ({ input, expected }) => {
        const parcel = FetchHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: input.response,
        })

        const received = parcel.extractResponseType()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be null when the response was not received', () => {
      const cases = [
        {
          input: {
            parcel: FetchHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: FetchHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.parcel.request.url', ({ input }) => {
        const received = input.parcel.extractResponseType()

        expect(received)
          .toBeNull()
      })
    })
  })
})
