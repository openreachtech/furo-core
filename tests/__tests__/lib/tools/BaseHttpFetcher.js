import BaseHttpFetcher from '~/lib/tools/BaseHttpFetcher.js'
import FetchHttpFetcher from '~/lib/tools/FetchHttpFetcher.js'
import ProgressHttpFetcher from '~/lib/tools/ProgressHttpFetcher.js'

describe('BaseHttpFetcher', () => {
  describe('constructor', () => {
    describe('should keep properties', () => {
      describe('#timeout', () => {
        const cases = [
          {
            input: {
              timeout: 3000,
            },
          },
          {
            input: {
              timeout: 0,
            },
          },
        ]

        test.each(cases)('timeout: $input.timeout', ({ input }) => {
          const fetcher = new BaseHttpFetcher(input)

          expect(fetcher)
            .toHaveProperty('timeout', input.timeout)
        })
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      test('with timeout', () => {
        const fetcher = BaseHttpFetcher.create({
          timeout: 3000,
        })

        expect(fetcher)
          .toBeInstanceOf(BaseHttpFetcher)
      })

      test('with no arguments', () => {
        const fetcher = BaseHttpFetcher.create()

        expect(fetcher)
          .toBeInstanceOf(BaseHttpFetcher)
      })
    })

    describe('should call constructor', () => {
      const cases = [
        {
          input: {
            timeout: 3000,
          },
          expected: {
            timeout: 3000,
          },
        },
        {
          input: undefined,
          expected: {
            timeout: 0,
          },
        },
      ]

      test.each(cases)('input: $input', ({ input, expected }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(BaseHttpFetcher)

        SpyClass.create(input)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('#fetchRequest()', () => {
    test('should throw when not inherited', async () => {
      const fetcher = BaseHttpFetcher.create()

      await expect(fetcher.fetchRequest({
        request: new Request('https://example.com/alpha'),
      }))
        .rejects
        .toThrow('BaseHttpFetcher#fetchRequest() must be inherited')
    })
  })
})

describe('BaseHttpFetcher', () => {
  describe('subclasses', () => {
    const cases = [
      {
        fetcher: ProgressHttpFetcher.create(),
      },
      {
        fetcher: FetchHttpFetcher.create(),
      },
    ]

    test.each(cases)('$fetcher.constructor.name should extend BaseHttpFetcher', ({ fetcher }) => {
      expect(fetcher)
        .toBeInstanceOf(BaseHttpFetcher)
    })
  })
})
