import ResponseTextConverter from '../../../../../../lib/tools/http-fetchers/tools/ResponseTextConverter.js'

import CharsetResolver from '../../../../../../lib/tools/http-fetchers/tools/CharsetResolver.js'
import BaseHttpParcel from '../../../../../../lib/tools/http-fetchers/parcels/BaseHttpParcel.js'

/**
 * Create a parcel of a response.
 *
 * @param {{
 *   response: Response | null
 * }} params - Parameters.
 * @returns {BaseHttpParcel} Parcel of the response.
 */
const createParcel = ({ response }) => BaseHttpParcel.create({
  request: new Request('https://example.com/neutral'), // Neutral value
  config: {}, // Neutral value
  response,
})

describe('ResponseTextConverter', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#responseParcel', () => {
        const alphaParcel = createParcel({
          response: new Response('text-0001'),
        })
        const betaParcel = createParcel({
          response: new Response('text-0002'),
        })

        const cases = [
          {
            input: {
              responseParcel: alphaParcel,
            },
            expected: alphaParcel,
          },
          {
            input: {
              responseParcel: betaParcel,
            },
            expected: betaParcel,
          },
        ]

        test.each(cases)('response: $input.responseParcel.response', ({ input, expected }) => {
          const converter = new ResponseTextConverter(input)

          expect(converter)
            .toHaveProperty('responseParcel', expected)
        })
      })
    })
  })
})

describe('ResponseTextConverter', () => {
  describe('.create()', () => {
    const cases = [
      {
        input: {
          responseParcel: createParcel({
            response: new Response('text-0001'),
          }),
        },
      },
      {
        input: {
          responseParcel: createParcel({
            response: new Response('text-0002'),
          }),
        },
      },
    ]

    describe('should be an instance of own class', () => {
      test.each(cases)('response: $input.responseParcel.response', ({ input }) => {
        const converter = ResponseTextConverter.create(input)

        expect(converter)
          .toBeInstanceOf(ResponseTextConverter)
      })
    })

    describe('should call constructor', () => {
      test.each(cases)('response: $input.responseParcel.response', ({ input }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(ResponseTextConverter)

        SpyClass.create(input)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(input)
      })
    })
  })
})

describe('ResponseTextConverter', () => {
  describe('.get:DEFAULT_CHARSET', () => {
    describe('when called as is', () => {
      test('should be the default charset of the resolver', () => {
        const received = ResponseTextConverter.DEFAULT_CHARSET

        expect(received)
          .toBe('utf-8')
      })
    })
  })
})

describe('ResponseTextConverter', () => {
  describe('.get:CharsetResolverCtor', () => {
    describe('when called as is', () => {
      test('should be CharsetResolver', () => {
        const received = ResponseTextConverter.CharsetResolverCtor

        expect(received)
          .toBe(CharsetResolver) // same reference
      })
    })
  })
})

describe('ResponseTextConverter', () => {
  describe('.createCharsetResolver()', () => {
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

    describe('should be an instance of the resolver class', () => {
      test.each(cases)('headerHash: $input.headerHash', ({ input }) => {
        const received = ResponseTextConverter.createCharsetResolver(input)

        expect(received)
          .toBeInstanceOf(CharsetResolver)
      })
    })

    describe('should call the factory method of the resolver class', () => {
      test.each(cases)('headerHash: $input.headerHash', ({ input }) => {
        const createSpy = jest.spyOn(CharsetResolver, 'create')

        ResponseTextConverter.createCharsetResolver(input)

        expect(createSpy)
          .toHaveBeenCalledWith(input)
      })
    })
  })
})

describe('ResponseTextConverter', () => {
  describe('.get:TextDecoderCtor', () => {
    describe('when called as is', () => {
      test('should be TextDecoder', () => {
        const received = ResponseTextConverter.TextDecoderCtor

        expect(received)
          .toBe(TextDecoder) // same reference
      })
    })
  })
})

describe('ResponseTextConverter', () => {
  describe('.createTextDecoder()', () => {
    describe('should be a decoder of the charset', () => {
      const cases = [
        {
          input: {
            charset: 'Shift_JIS',
          },
          expected: 'shift_jis',
        },
        {
          input: {
            charset: 'utf-16le',
          },
          expected: 'utf-16le',
        },
      ]

      test.each(cases)('charset: $input.charset', ({ input, expected }) => {
        const received = ResponseTextConverter.createTextDecoder(input)

        expect(received)
          .toHaveProperty('encoding', expected)
      })
    })

    describe('should be a decoder of UTF-8 where the charset is unknown', () => {
      const cases = [
        {
          input: {
            charset: 'unknown-charset',
          },
        },
        {
          input: {
            charset: '',
          },
        },
      ]

      test.each(cases)('charset: $input.charset', ({ input }) => {
        const received = ResponseTextConverter.createTextDecoder(input)

        expect(received)
          .toHaveProperty('encoding', 'utf-8')
      })
    })

    describe('should create the decoder through the constructor of the getter', () => {
      test('charset: Shift_JIS', () => {
        const SpyClass = globalThis.constructorSpy.spyOn(TextDecoder)

        class AlphaConverter extends ResponseTextConverter {
          /** @override */
          static get TextDecoderCtor () {
            return SpyClass
          }
        }

        AlphaConverter.createTextDecoder({
          charset: 'Shift_JIS',
        })

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith('Shift_JIS')
      })
    })
  })
})

describe('ResponseTextConverter', () => {
  describe('#get:Ctor', () => {
    class AlphaConverter extends ResponseTextConverter {}

    class BetaConverter extends ResponseTextConverter {}

    describe('should be constructor of instance', () => {
      const cases = [
        {
          input: {
            Class: ResponseTextConverter,
          },
          expected: ResponseTextConverter,
        },
        {
          input: {
            Class: AlphaConverter,
          },
          expected: AlphaConverter,
        },
        {
          input: {
            Class: BetaConverter,
          },
          expected: BetaConverter,
        },
      ]

      test.each(cases)('Class: $input.Class.name', ({ input, expected }) => {
        const converter = input.Class.create({
          responseParcel: createParcel({
            response: null,
          }),
        })

        expect(converter.Ctor)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('ResponseTextConverter', () => {
  describe('#resolveCharset()', () => {
    describe('should resolve the charset through the resolver of the header hash of the parcel', () => {
      const cases = [
        {
          input: {
            contentType: 'application/json; charset=Shift_JIS',
          },
          expected: {
            headerHash: {
              'content-type': 'application/json; charset=Shift_JIS',
            },
            charset: 'Shift_JIS',
          },
        },
        {
          input: {
            contentType: 'text/plain',
          },
          expected: {
            headerHash: {
              'content-type': 'text/plain',
            },
            charset: 'utf-8',
          },
        },
      ]

      test.each(cases)('content-type: $input.contentType', ({ input, expected }) => {
        const converter = ResponseTextConverter.create({
          responseParcel: createParcel({
            response: new Response(Uint8Array.from([]), { // a text body would carry its own charset
              headers: {
                'Content-Type': input.contentType,
              },
            }),
          }),
        })
        const createCharsetResolverSpy = jest.spyOn(ResponseTextConverter, 'createCharsetResolver')

        const received = converter.resolveCharset()

        expect(received)
          .toBe(expected.charset)

        expect(createCharsetResolverSpy)
          .toHaveBeenCalledWith({
            headerHash: expected.headerHash,
          })
      })
    })

    describe('should be the default charset where the response was not received', () => {
      test('response: null', () => {
        const converter = ResponseTextConverter.create({
          responseParcel: createParcel({
            response: null,
          }),
        })

        const received = converter.resolveCharset()

        expect(received)
          .toBe('utf-8')
      })
    })
  })
})

describe('ResponseTextConverter', () => {
  describe('#toText()', () => {
    describe('should be null when the response was not received', () => {
      const cases = [
        {
          input: {
            responseParcel: BaseHttpParcel.createAsNetworkError({
              request: new Request('https://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          input: {
            responseParcel: BaseHttpParcel.createAsTimeoutError({
              request: new Request('https://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('url: $input.responseParcel.request.url', async ({ input }) => {
        const converter = ResponseTextConverter.create(input)

        const received = await converter.toText()

        expect(received)
          .toBeNull()
      })
    })

    describe('should decode the array buffer of the parcel with the charset', () => {
      const cases = [
        {
          input: {
            response: new Response(
              Uint8Array.from([0x82, 0xB1, 0x82, 0xF1]), // こん in Shift_JIS
              {
                headers: {
                  'Content-Type': 'text/plain; charset=Shift_JIS',
                },
              }
            ),
          },
          expected: 'こん',
        },
        {
          input: {
            response: new Response(
              Uint8Array.from([0xE3, 0x81, 0x93]), // こ in UTF-8
              {
                headers: {
                  'Content-Type': 'text/plain; charset=utf-8',
                },
              }
            ),
          },
          expected: 'こ',
        },
      ]

      test.each(cases)('content-type: $input.response.headers', async ({ input, expected }) => {
        const converter = ResponseTextConverter.create({
          responseParcel: createParcel({
            response: input.response,
          }),
        })

        const received = await converter.toText()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should decode as UTF-8 where the charset is unknown or declared nowhere', () => {
      const cases = [
        {
          input: {
            response: new Response(
              Uint8Array.from([0xE3, 0x81, 0x93]), // こ in UTF-8
              {
                headers: {
                  'Content-Type': 'text/plain; charset=unknown-charset',
                },
              }
            ),
          },
          expected: 'こ',
        },
        {
          input: {
            response: new Response(
              Uint8Array.from([0xE3, 0x82, 0x93]), // ん in UTF-8
              {
                headers: {
                  'Content-Type': 'text/plain',
                },
              }
            ),
          },
          expected: 'ん',
        },
        {
          input: {
            response: new Response(
              Uint8Array.from([0xE3, 0x82, 0x93]), // ん in UTF-8
              {
                headers: {
                  'Content-Type': 'text/plain; charset=""',
                },
              }
            ),
          },
          expected: 'ん',
        },
      ]

      test.each(cases)('content-type: $input.response.headers', async ({ input, expected }) => {
        const converter = ResponseTextConverter.create({
          responseParcel: createParcel({
            response: input.response,
          }),
        })

        const received = await converter.toText()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should leave the response of the parcel unread', () => {
      const cases = [
        {
          input: {
            response: new Response('text-0001'),
          },
        },
        {
          input: {
            response: new Response('text-0002'),
          },
        },
      ]

      test.each(cases)('response: $input.response', async ({ input }) => {
        const converter = ResponseTextConverter.create({
          responseParcel: createParcel({
            response: input.response,
          }),
        })

        await converter.toText()

        expect(input.response)
          .toHaveProperty('bodyUsed', false)
      })
    })
  })
})
