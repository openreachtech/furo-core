import CharsetResolver from '../../../../../../lib/tools/http-fetchers/tools/CharsetResolver.js'

describe('CharsetResolver', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#headerHash', () => {
        const alphaHeaderHash = {
          'content-type': 'application/json; charset=Shift_JIS',
        }
        const betaHeaderHash = {
          'content-type': 'text/plain',
        }

        const cases = [
          {
            input: {
              headerHash: alphaHeaderHash,
            },
            expected: alphaHeaderHash,
          },
          {
            input: {
              headerHash: betaHeaderHash,
            },
            expected: betaHeaderHash,
          },
          {
            input: {
              headerHash: null,
            },
            expected: null,
          },
        ]

        test.each(cases)('headerHash: $input.headerHash', ({ input, expected }) => {
          const resolver = new CharsetResolver(input)

          expect(resolver)
            .toHaveProperty('headerHash', expected)
        })
      })
    })
  })
})

describe('CharsetResolver', () => {
  describe('.create()', () => {
    const cases = [
      {
        input: {
          headerHash: {
            'content-type': 'application/json; charset=Shift_JIS',
          },
        },
      },
      {
        input: {
          headerHash: null,
        },
      },
    ]

    describe('should be an instance of own class', () => {
      test.each(cases)('headerHash: $input.headerHash', ({ input }) => {
        const resolver = CharsetResolver.create(input)

        expect(resolver)
          .toBeInstanceOf(CharsetResolver)
      })
    })

    describe('should call constructor', () => {
      test.each(cases)('headerHash: $input.headerHash', ({ input }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(CharsetResolver)

        SpyClass.create(input)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(input)
      })
    })
  })
})

describe('CharsetResolver', () => {
  describe('.get:DEFAULT_CHARSET', () => {
    describe('when called as is', () => {
      test('should be utf-8', () => {
        const received = CharsetResolver.DEFAULT_CHARSET

        expect(received)
          .toBe('utf-8')
      })
    })
  })
})

describe('CharsetResolver', () => {
  describe('#get:Ctor', () => {
    class AlphaResolver extends CharsetResolver {}

    class BetaResolver extends CharsetResolver {}

    describe('should be constructor of instance', () => {
      const cases = [
        {
          input: {
            Class: CharsetResolver,
          },
          expected: CharsetResolver,
        },
        {
          input: {
            Class: AlphaResolver,
          },
          expected: AlphaResolver,
        },
        {
          input: {
            Class: BetaResolver,
          },
          expected: BetaResolver,
        },
      ]

      test.each(cases)('Class: $input.Class.name', ({ input, expected }) => {
        const resolver = input.Class.create({
          headerHash: null,
        })

        expect(resolver.Ctor)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('CharsetResolver', () => {
  describe('#resolveCharset()', () => {
    describe('should be the charset that the Content-Type declares', () => {
      const cases = [
        {
          input: {
            contentType: 'application/json; charset=Shift_JIS',
          },
          expected: 'Shift_JIS',
        },
        {
          input: {
            contentType: 'text/html;charset=euc-jp',
          },
          expected: 'euc-jp',
        },
        {
          input: {
            contentType: 'text/plain; charset="utf-16le"',
          },
          expected: 'utf-16le',
        },
        {
          input: {
            contentType: 'text/plain; CHARSET=ISO-8859-1; format=flowed',
          },
          expected: 'ISO-8859-1',
        },
        {
          input: {
            contentType: 'text/plain; charset=" Shift_JIS "',
          },
          expected: 'Shift_JIS',
        },
        {
          input: {
            contentType: 'text/plain; charset="utf-16le"; format=flowed',
          },
          expected: 'utf-16le',
        },
      ]

      test.each(cases)('content-type: $input.contentType', ({ input, expected }) => {
        const resolver = CharsetResolver.create({
          headerHash: {
            'content-type': input.contentType,
          },
        })

        const received = resolver.resolveCharset()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be the default charset where the Content-Type declares no charset', () => {
      const cases = [
        {
          input: {
            contentType: 'application/json',
          },
        },
        {
          input: {
            contentType: 'text/plain; format=flowed',
          },
        },
      ]

      test.each(cases)('content-type: $input.contentType', ({ input }) => {
        const resolver = CharsetResolver.create({
          headerHash: {
            'content-type': input.contentType,
          },
        })

        const received = resolver.resolveCharset()

        expect(received)
          .toBe('utf-8')
      })
    })

    describe('should be the default charset where the declared charset is empty', () => {
      const cases = [
        {
          input: {
            contentType: 'text/plain; charset=""',
          },
        },
        {
          input: {
            contentType: 'text/plain; charset="  "',
          },
        },
      ]

      test.each(cases)('content-type: $input.contentType', ({ input }) => {
        const resolver = CharsetResolver.create({
          headerHash: {
            'content-type': input.contentType,
          },
        })

        const received = resolver.resolveCharset()

        expect(received)
          .toBe('utf-8')
      })
    })

    describe('should be the default charset where there is no Content-Type', () => {
      const cases = [
        {
          input: {
            headerHash: {
              'x-neutral': 'neutral',
            },
          },
        },
        {
          input: {
            headerHash: {
              'content-type': '',
            },
          },
        },
        {
          input: {
            headerHash: null,
          },
        },
      ]

      test.each(cases)('headerHash: $input.headerHash', ({ input }) => {
        const resolver = CharsetResolver.create(input)

        const received = resolver.resolveCharset()

        expect(received)
          .toBe('utf-8')
      })
    })

    describe('should be the default charset of the subclass', () => {
      test('DEFAULT_CHARSET: shift_jis', () => {
        class AlphaResolver extends CharsetResolver {
          /** @override */
          static get DEFAULT_CHARSET () {
            return 'shift_jis'
          }
        }

        const resolver = AlphaResolver.create({
          headerHash: null,
        })

        const received = resolver.resolveCharset()

        expect(received)
          .toBe('shift_jis')
      })
    })
  })
})

describe('CharsetResolver', () => {
  describe('#extractDeclaredCharset()', () => {
    describe('should be the trimmed charset that the Content-Type declares', () => {
      const cases = [
        {
          input: {
            contentType: 'application/json; charset=Shift_JIS',
          },
          expected: 'Shift_JIS',
        },
        {
          input: {
            contentType: 'text/plain; charset=" utf-8 "',
          },
          expected: 'utf-8',
        },
        {
          input: {
            contentType: 'text/plain; charset=""',
          },
          expected: '',
        },
      ]

      test.each(cases)('content-type: $input.contentType', ({ input, expected }) => {
        const resolver = CharsetResolver.create({
          headerHash: null, // Neutral value
        })

        const received = resolver.extractDeclaredCharset(input)

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be null where the Content-Type declares no charset', () => {
      const cases = [
        {
          input: {
            contentType: 'application/json',
          },
        },
        {
          input: {
            contentType: 'text/plain; format=flowed',
          },
        },
      ]

      test.each(cases)('content-type: $input.contentType', ({ input }) => {
        const resolver = CharsetResolver.create({
          headerHash: null, // Neutral value
        })

        const received = resolver.extractDeclaredCharset(input)

        expect(received)
          .toBeNull()
      })
    })
  })
})
