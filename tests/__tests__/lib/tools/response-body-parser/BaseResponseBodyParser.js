import BaseResponseBodyParser from '~/lib/tools/response-body-parser/BaseResponseBodyParser.js'
import BaseHttpParcel from '~/lib/tools/http-fetchers/parcels/BaseHttpParcel.js'

/**
 * Create a parcel of a response.
 *
 * @param {{
 *   response: Response
 * }} params - Parameters.
 * @returns {BaseHttpParcel} Parcel of the response.
 */
const createParcel = ({ response }) => BaseHttpParcel.create({
  request: new Request('https://example.com/neutral'), // Neutral value
  config: {}, // Neutral value
  response,
})

describe('BaseResponseBodyParser', () => {
  describe('constructor', () => {
    describe('should keep properties', () => {
      describe('#responseParcel', () => {
        const cases = [
          {
            input: {
              responseParcel: createParcel({
                response: new Response(`{
                "content": {
                  "user": {
                    "id": 10001
                  }
                }
              }`),
              }),
            },
          },
          {
            input: {
              responseParcel: createParcel({
                response: new Response(`{
                "content": {
                  "user": {
                    "id": 10002
                  }
                }
              }`),
              }),
            },
          },
        ]

        test.each(cases)('url: $input.responseParcel.request.url', ({ input }) => {
          const parser = new BaseResponseBodyParser(input)

          expect(parser)
            .toHaveProperty('responseParcel', input.responseParcel)
        })
      })
    })
  })
})

describe('BaseResponseBodyParser', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            responseParcel: createParcel({
              response: new Response(`{
              "content": {
                "user": {
                  "id": 10001
                }
              }
            }`),
            }),
          },
        },
        {
          input: {
            responseParcel: createParcel({
              response: new Response(`{
              "content": {
                "user": {
                  "id": 10002
                }
              }
            }`),
            }),
          },
        },
      ]

      test.each(cases)('url: $input.responseParcel.request.url', ({ input }) => {
        const parser = BaseResponseBodyParser.create(input)

        expect(parser)
          .toBeInstanceOf(BaseResponseBodyParser)
      })
    })

    describe('should call constructor', () => {
      const cases = [
        {
          input: {
            responseParcel: createParcel({
              response: new Response(`{
              "content": {
                "user": {
                  "id": 10001
                }
              }
            }`),
            }),
          },
        },
        {
          input: {
            responseParcel: createParcel({
              response: new Response(`{
              "content": {
                "user": {
                  "id": 10002
                }
              }
            }`),
            }),
          },
        },
      ]

      test.each(cases)('url: $input.responseParcel.request.url', ({ input }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(BaseResponseBodyParser)

        SpyClass.create(input)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(input)
      })
    })
  })
})

describe('BaseResponseBodyParser', () => {
  describe('#parseBody()', () => {
    describe('should throw an error', () => {
      const cases = [
        {
          input: {
            responseParcel: createParcel({
              response: new Response(`{
              "content": {
                "user": {
                  "id": 10001
                }
              }
            }`),
            }),
          },
        },
        {
          input: {
            responseParcel: createParcel({
              response: new Response(`{
              "content": {
                "user": {
                  "id": 10002
                }
              }
            }`),
            }),
          },
        },
      ]

      test.each(cases)('url: $input.responseParcel.request.url', async ({ input }) => {
        const parser = BaseResponseBodyParser.create(input)

        await expect(() => parser.parseBody())
          .rejects
          .toThrow('this method must be inherited in subclass')
      })
    })
  })
})
