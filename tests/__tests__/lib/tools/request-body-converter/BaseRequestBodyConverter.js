import BaseRequestBodyConverter from '~/lib/tools/request-body-converter/BaseRequestBodyConverter.js'

describe('BaseRequestBodyConverter', () => {
  describe('constructor', () => {
    describe('should keep properties', () => {
      describe('#body', () => {
        const cases = [
          {
            input: {
              body: {
                first: 'alpha value',
              },
            },
          },
          {
            input: {
              body: {
                second: 'beta value',
                nested: {
                  numbers: [1, 2],
                },
              },
            },
          },
        ]

        test.each(cases)('body: $input.body', ({ input }) => {
          const converter = new BaseRequestBodyConverter(input)

          expect(converter)
            .toHaveProperty('body', input.body)
        })
      })
    })
  })
})

describe('BaseRequestBodyConverter', () => {
  describe('.create()', () => {
    const cases = [
      {
        input: {
          body: {
            first: 'alpha value',
          },
        },
      },
      {
        input: {
          body: {
            second: 'beta value',
          },
        },
      },
    ]

    describe('should be an instance of own class', () => {
      test.each(cases)('body: $input.body', ({ input }) => {
        const converter = BaseRequestBodyConverter.create(input)

        expect(converter)
          .toBeInstanceOf(BaseRequestBodyConverter)
      })
    })

    describe('should call constructor', () => {
      test.each(cases)('body: $input.body', ({ input }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(BaseRequestBodyConverter)

        SpyClass.create(input)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(input)
      })
    })
  })
})

describe('BaseRequestBodyConverter', () => {
  describe('#convertBody()', () => {
    describe('should throw an error', () => {
      const cases = [
        {
          input: {
            body: {
              first: 'alpha value',
            },
          },
        },
        {
          input: {
            body: {
              second: 'beta value',
            },
          },
        },
      ]

      test.each(cases)('body: $input.body', ({ input }) => {
        const converter = BaseRequestBodyConverter.create(input)

        expect(() => converter.convertBody())
          .toThrow('this method must be inherited in subclass')
      })
    })
  })
})

describe('BaseRequestBodyConverter', () => {
  describe('#generateHeaderEntries()', () => {
    describe('should throw an error', () => {
      const cases = [
        {
          input: {
            body: {
              first: 'alpha value',
            },
          },
        },
        {
          input: {
            body: {
              second: 'beta value',
            },
          },
        },
      ]

      test.each(cases)('body: $input.body', ({ input }) => {
        const converter = BaseRequestBodyConverter.create(input)

        expect(() => converter.generateHeaderEntries())
          .toThrow('this method must be inherited in subclass')
      })
    })
  })
})
