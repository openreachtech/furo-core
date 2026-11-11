import XMLHttpParcel from '../../../../../../../lib/tools/http-fetchers/parcels/concretes/XMLHttpParcel.js'

import BaseHttpParcel from '../../../../../../../lib/tools/http-fetchers/parcels/BaseHttpParcel.js'

describe('XMLHttpParcel', () => {
  describe('inheritance', () => {
    test('should be correct class', () => {
      const received = XMLHttpParcel.prototype

      expect(received)
        .toBeInstanceOf(BaseHttpParcel)
    })
  })
})

describe('XMLHttpParcel', () => {
  describe('#isRedirected()', () => {
    describe('should be true when the URL of the response differs from the URL of the request', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            responseUrl: 'https://example.com/resource-0003',
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002#fragment-0001'),
            responseUrl: 'https://example.com/resource-0004',
          },
        },
      ]

      test.each(cases)('responseUrl: $input.responseUrl', ({ input }) => {
        const parcel = XMLHttpParcel.create({
          request: input.request,
          config: {}, // Neutral value
          response: new Response(''), // Neutral value
          responseUrl: input.responseUrl,
        })

        const received = parcel.isRedirected()

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false when the URL of the response is the URL of the request', () => {
      const cases = [
        {
          input: {
            request: new Request('https://example.com/resource-0001'),
            responseUrl: 'https://example.com/resource-0001',
          },
        },
        {
          input: {
            request: new Request('https://example.com/resource-0002#fragment-0001'), // XMLHttpRequest reports the URL without the fragment
            responseUrl: 'https://example.com/resource-0002',
          },
        },
      ]

      test.each(cases)('responseUrl: $input.responseUrl', ({ input }) => {
        const parcel = XMLHttpParcel.create({
          request: input.request,
          config: {}, // Neutral value
          response: new Response(''), // Neutral value
          responseUrl: input.responseUrl,
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
            parcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: XMLHttpParcel.createAsTimeoutError({
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

describe('XMLHttpParcel', () => {
  describe('#extractResponseType()', () => {
    describe('should be basic for a response of the same origin as the page', () => {
      const cases = [
        {
          input: {
            responseUrl: 'http://localhost/resource-0001', // the origin of the page in the test environment
          },
        },
        {
          input: {
            responseUrl: 'http://localhost/resource-0002',
          },
        },
      ]

      test.each(cases)('responseUrl: $input.responseUrl', ({ input }) => {
        const parcel = XMLHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: new Response(''), // Neutral value
          responseUrl: input.responseUrl,
        })

        const received = parcel.extractResponseType()

        expect(received)
          .toBe('basic')
      })
    })

    describe('should be cors for a response of another origin', () => {
      const cases = [
        {
          input: {
            responseUrl: 'https://example.com/resource-0001',
          },
        },
        {
          input: {
            responseUrl: 'https://example.org/resource-0002',
          },
        },
      ]

      test.each(cases)('responseUrl: $input.responseUrl', ({ input }) => {
        const parcel = XMLHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: new Response(''), // Neutral value
          responseUrl: input.responseUrl,
        })

        const received = parcel.extractResponseType()

        expect(received)
          .toBe('cors')
      })
    })

    describe('should be cors when the page has an opaque origin, as in a sandboxed frame', () => {
      const cases = [
        {
          input: {
            responseUrl: 'http://localhost/resource-0001', // the URL of the page in the test environment
          },
        },
        {
          input: {
            responseUrl: 'https://example.com/resource-0002',
          },
        },
      ]

      test.each(cases)('responseUrl: $input.responseUrl', ({ input }) => {
        jest.spyOn(globalThis, 'origin', 'get')
          .mockReturnValue('null')

        const parcel = XMLHttpParcel.create({
          request: new Request('https://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: new Response(''), // Neutral value
          responseUrl: input.responseUrl,
        })

        const received = parcel.extractResponseType()

        expect(received)
          .toBe('cors')
      })
    })

    describe('should be null when the response was not received', () => {
      const cases = [
        {
          input: {
            parcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            parcel: XMLHttpParcel.createAsAbortError({
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
