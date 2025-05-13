import HeadersParser from '../../../../lib/tools/HeadersParser.js'

describe('HeadersParser', () => {
  describe('constructor', () => {
    describe('to keep properties', () => {
      describe('#haystack', () => {
        const cases = [
          {
            params: {
              haystack: 'content-type: application/json; charset=utf-8\r\n',
            },
          },
          {
            params: {
              haystack: 'accept: */*\r\ncontent-length: 256\r\nauthorization: Bearer token123\r\n',
            },
          },
          {
            params: {
              haystack: 'x-requested-with: \r\nuser-agent: Mozilla/5.0\r\n',
            },
          },
        ]

        test.each(cases)('haystack: $params.haystack', ({ params }) => {
          const parser = HeadersParser.create(params)

          expect(parser)
            .toHaveProperty('haystack', params.haystack)
        })
      })
    })
  })
})

describe('HeadersParser', () => {
  describe('.create()', () => {
    const cases = [
      {
        params: {
          haystack: 'content-type: application/json; charset=utf-8\r\n',
        },
      },
      {
        params: {
          haystack: 'accept: */*\r\ncontent-length: 256\r\nauthorization: Bearer token123\r\n',
        },
      },
      {
        params: {
          haystack: 'x-requested-with: \r\nuser-agent: Mozilla/5.0\r\n',
        },
      },
    ]

    describe('to be instance of own class', () => {
      test.each(cases)('haystack: $params.haystack', ({ params }) => {
        const parser = HeadersParser.create(params)

        expect(parser)
          .toBeInstanceOf(HeadersParser)
      })
    })

    describe('to call constructor', () => {
      test.each(cases)('haystack: $params.haystack', ({ params }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(HeadersParser)

        SpyClass.create(params)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(params)
      })
    })
  })
})

describe('HeadersParser', () => {
  describe('#parseHeaderEntries()', () => {
    const cases = [
      {
        params: {
          haystack: 'content-type: application/json; charset=utf-8\r\n',
        },
        expected: [
          ['content-type', 'application/json; charset=utf-8'],
        ],
      },
      {
        params: {
          haystack: 'accept: */*\r\ncontent-length: 256\r\nauthorization: Bearer token123\r\n',
        },
        expected: [
          ['accept', '*/*'],
          ['content-length', '256'],
          ['authorization', 'Bearer token123'],
        ],
      },
      {
        params: {
          haystack: 'x-requested-with: \r\nuser-agent: Mozilla/5.0\r\n',
        },
        expected: [
          ['x-requested-with', ''],
          ['user-agent', 'Mozilla/5.0'],
        ],
      },
      {
        params: {
          haystack: 'x-alpha: includes ": " in value\r\nx-beta: normal value\r\n',
        },
        expected: [
          ['x-alpha', 'includes ": " in value'],
          ['x-beta', 'normal value'],
        ],
      },
    ]

    test.each(cases)('haystack: $params.haystack', ({ params, expected }) => {
      const parser = HeadersParser.create(params)

      const actual = parser.parseHeaderEntries()

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('HeadersParser', () => {
  describe('#createHeaders()', () => {
    const cases = [
      {
        params: {
          haystack: 'content-type: application/json; charset=utf-8\r\n',
        },
        expected: new Headers([
          ['content-type', 'application/json; charset=utf-8'],
        ]),
      },
      {
        params: {
          haystack: 'accept: */*\r\ncontent-length: 256\r\nauthorization: Bearer token123\r\n',
        },
        expected: new Headers([
          ['accept', '*/*'],
          ['content-length', '256'],
          ['authorization', 'Bearer token123'],
        ]),
      },
      {
        params: {
          haystack: 'x-requested-with: \r\nuser-agent: Mozilla/5.0\r\n',
        },
        expected: new Headers([
          ['x-requested-with', ''],
          ['user-agent', 'Mozilla/5.0'],
        ]),
      },
    ]

    test.each(cases)('haystack: $params.haystack', ({ params, expected }) => {
      const parser = HeadersParser.create(params)

      const actual = parser.createHeaders()

      expect(actual)
        .toEqual(expected)
    })
  })
})
