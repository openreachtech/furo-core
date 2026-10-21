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
              headerEntries: [],
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
              headerEntries: [],
            },
          },
        ]

        test.each(cases)('body: $input.body', ({ input }) => {
          const converter = new BaseRequestBodyConverter(input)

          expect(converter)
            .toHaveProperty('body', input.body)
        })
      })

      describe('#headerEntries', () => {
        const cases = [
          {
            input: {
              body: {
                first: 'alpha value',
              },
              headerEntries: [],
            },
          },
          {
            input: {
              body: {
                second: 'beta value',
              },
              headerEntries: [
                ['content-type', 'text/plain'],
              ],
            },
          },
        ]

        test.each(cases)('headerEntries: $input.headerEntries', ({ input }) => {
          const converter = new BaseRequestBodyConverter(input)

          expect(converter)
            .toHaveProperty('headerEntries', input.headerEntries) // same reference
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
          headerEntries: [],
        },
      },
      {
        input: {
          body: {
            second: 'beta value',
          },
          headerEntries: [
            ['content-type', 'text/plain'],
          ],
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

    describe('should default headerEntries to .collectHeaderEntries()', () => {
      const AlphaConverter = class extends BaseRequestBodyConverter {
        /** @override */
        static collectHeaderEntries () {
          return [
            ['content-type', 'alpha/type'],
          ]
        }
      }
      const BetaConverter = class extends BaseRequestBodyConverter {
        /** @override */
        static collectHeaderEntries () {
          return []
        }
      }

      const subCases = [
        {
          input: {
            Converter: AlphaConverter,
            body: {
              first: 'alpha value',
            },
          },
          expected: [
            ['content-type', 'alpha/type'],
          ],
        },
        {
          input: {
            Converter: BetaConverter,
            body: {
              second: 'beta value',
            },
          },
          expected: [],
        },
      ]

      test.each(subCases)('Converter: $input.Converter.name', ({ input, expected }) => {
        const converter = input.Converter.create({
          body: input.body,
        })

        expect(converter)
          .toHaveProperty('headerEntries', expected)
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
            headerEntries: [],
          },
        },
        {
          input: {
            body: {
              second: 'beta value',
            },
            headerEntries: [],
          },
        },
      ]

      test.each(cases)('body: $input.body', ({ input }) => {
        const converter = BaseRequestBodyConverter.create(input)

        expect(() => converter.convertBody())
          .toThrow('BaseRequestBodyConverter#convertBody() must be inherited')
      })
    })
  })
})

describe('BaseRequestBodyConverter', () => {
  describe('.collectHeaderEntries()', () => {
    describe('should throw an error', () => {
      test('to be inherited in subclass', () => {
        expect(() => BaseRequestBodyConverter.collectHeaderEntries())
          .toThrow('BaseRequestBodyConverter.collectHeaderEntries() must be inherited')
      })
    })
  })
})
