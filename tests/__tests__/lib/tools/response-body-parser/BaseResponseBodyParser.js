import BaseResponseBodyParser from '~/lib/tools/response-body-parser/BaseResponseBodyParser.js'

describe('BaseResponseBodyParser', () => {
  describe('constructor', () => {
    describe('should keep properties', () => {
      describe('#response', () => {
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
          },
        ]

        test.each(cases)('response: $input.response', ({ input }) => {
          const parser = new BaseResponseBodyParser(input)

          expect(parser)
            .toHaveProperty('response', input.response)
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
            response: new Response(`{
              "content": {
                "user": {
                  "id": 10001
                }
              }
            }`),
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
        },
      ]

      test.each(cases)('response: $input.response', ({ input }) => {
        const parser = BaseResponseBodyParser.create(input)

        expect(parser)
          .toBeInstanceOf(BaseResponseBodyParser)
      })
    })

    describe('should call constructor', () => {
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
        },
      ]

      test.each(cases)('response: $input.response', ({ input }) => {
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
            response: new Response(`{
              "content": {
                "user": {
                  "id": 10001
                }
              }
            }`),
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
        },
      ]

      test.each(cases)('response: $input.response', async ({ input }) => {
        const parser = BaseResponseBodyParser.create(input)

        await expect(() => parser.parseBody())
          .rejects
          .toThrow('this method must be inherited in subclass')
      })
    })
  })
})
