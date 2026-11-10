import JsonResponseBodyParser from '~/lib/tools/response-body-parser/concretes/JsonResponseBodyParser.js'

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

describe('JsonResponseBodyParser', () => {
  describe('inheritance', () => {
    test('to be a subclass of BaseResponseBodyParser', () => {
      const actual = JsonResponseBodyParser.prototype

      expect(actual)
        .toBeInstanceOf(BaseResponseBodyParser)
    })
  })
})

describe('JsonResponseBodyParser', () => {
  describe('#parseBody()', () => {
    describe('should be parsed content', () => {
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
          expected: {
            content: {
              user: {
                id: 10001,
              },
            },
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
          expected: {
            content: {
              user: {
                id: 10002,
              },
            },
          },
        },
      ]

      test.each(cases)('url: $input.responseParcel.request.url', async ({ input, expected }) => {
        const parser = JsonResponseBodyParser.create(input)

        const actual = await parser.parseBody()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('should read through the parcel, so that the parcel can be read again', () => {
      const cases = [
        {
          input: {
            responseParcel: createParcel({
              response: new Response('{"id":10001}'),
            }),
          },
          expected: {
            id: 10001,
          },
        },
        {
          input: {
            responseParcel: createParcel({
              response: new Response('{"id":10002}'),
            }),
          },
          expected: {
            id: 10002,
          },
        },
      ]

      test.each(cases)('url: $input.responseParcel.request.url', async ({ input, expected }) => {
        const toJsonSpy = jest.spyOn(input.responseParcel, 'toJson')
        const parser = JsonResponseBodyParser.create(input)

        await parser.parseBody()

        expect(toJsonSpy)
          .toHaveBeenCalledWith()

        const actual = await input.responseParcel.toJson()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('should decode the body with the charset of the response', () => {
      const cases = [
        {
          input: {
            responseParcel: createParcel({
              response: new Response(
                Uint8Array.from([0x7B, 0x22, 0x69, 0x64, 0x22, 0x3A, 0x22, 0x82, 0xB1, 0x22, 0x7D]), // {"id":"こ"} in Shift_JIS
                {
                  headers: {
                    'Content-Type': 'application/json; charset=Shift_JIS',
                  },
                }
              ),
            }),
          },
          expected: {
            id: 'こ',
          },
        },
        {
          input: {
            responseParcel: createParcel({
              response: new Response(
                Uint8Array.from([0x7B, 0x22, 0x69, 0x64, 0x22, 0x3A, 0x22, 0x82, 0xF1, 0x22, 0x7D]), // {"id":"ん"} in Shift_JIS
                {
                  headers: {
                    'Content-Type': 'application/json; charset=shift_jis',
                  },
                }
              ),
            }),
          },
          expected: {
            id: 'ん',
          },
        },
      ]

      test.each(cases)('url: $input.responseParcel.request.url', async ({ input, expected }) => {
        const parser = JsonResponseBodyParser.create(input)

        const actual = await parser.parseBody()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('should be null where the body is not JSON', () => {
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
            }}`),
            }), // ❌️ excess closing brace
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
            `),
            }), // ❌️ missing closing brace
          },
        },
      ]

      test.each(cases)('url: $input.responseParcel.request.url', async ({ input, expected }) => {
        const parser = JsonResponseBodyParser.create(input)

        const received = await parser.parseBody()

        expect(received)
          .toBeNull()
      })
    })
  })
})
