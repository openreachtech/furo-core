import JsonResponseBodyParser from '~/lib/tools/response-body-parser/concretes/JsonResponseBodyParser.js'

import BaseResponseBodyParser from '~/lib/tools/response-body-parser/BaseResponseBodyParser.js'

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
            response: new Response(`{
              "content": {
                "user": {
                  "id": 10001
                }
              }
            }`),
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
            response: new Response(`{
              "content": {
                "user": {
                  "id": 10002
                }
              }
            }`),
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

      test.each(cases)('response: $input.response', async ({ input, expected }) => {
        const parser = JsonResponseBodyParser.create(input)

        const actual = await parser.parseBody()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('should throw an JSON parse error', () => {
      const cases = [
        {
          input: {
            response: new Response(`{
              "content": {
                "user": {
                  "id": 10001
                }
              }
            }}`), // ❌️ excess closing brace
          },
          expected: 'Unexpected non-whitespace character after JSON at position 132',
        },
        {
          input: {
            response: new Response(`{
              "content": {
                "user": {
                  "id": 10002
                }
              }
            `), // ❌️ missing closing brace
          },
          expected: 'Expected \',\' or \'}\' after property value in JSON at position 131',
        },
      ]

      test.each(cases)('response: $input.response', async ({ input, expected }) => {
        const parser = JsonResponseBodyParser.create(input)

        await expect(parser.parseBody())
          .rejects
          .toThrow(expected)
      })
    })
  })
})
