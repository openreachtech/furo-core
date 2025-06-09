import BaseRestfulApiPayload from '~/lib/client/restfulapi/BaseRestfulApiPayload.js'

describe('BaseRestfulApiPayload', () => {
  describe('constructor', () => {
    const mockQuery = {}
    const mockBody = {}
    const mockPathParameterHash = {}
    const mockOptions = {}

    describe('to keep property', () => {
      describe('#query', () => {
        const cases = [
          {
            args: {
              query: {
                alpha: '111',
                beta: '222',
              },
            },
          },
          {
            args: {
              query: {
                gamma: '333',
                delta: '444',
              },
            },
          },
          {
            args: {
              query: {},
            },
          },
        ]

        test.each(cases)('query: $args.query', ({ args }) => {
          const actual = new BaseRestfulApiPayload({
            query: args.query,
            body: mockBody,
            pathParameterHash: mockPathParameterHash,
            options: mockOptions,
          })

          expect(actual)
            .toHaveProperty('query', args.query)
        })
      })

      describe('#body', () => {
        const cases = [
          {
            args: {
              body: {
                alpha: '111',
                beta: '222',
              },
            },
          },
          {
            args: {
              body: {
                gamma: '333',
                delta: '444',
              },
            },
          },
          {
            args: {
              body: {},
            },
          },
        ]

        test.each(cases)('body: $args.body', ({ args }) => {
          const actual = new BaseRestfulApiPayload({
            query: mockQuery,
            body: args.body,
            pathParameterHash: mockPathParameterHash,
            options: mockOptions,
          })

          expect(actual)
            .toHaveProperty('body', args.body)
        })
      })

      describe('#pathParameterHash', () => {
        const cases = [
          {
            args: {
              pathParameterHash: {
                alpha: '111',
                beta: '222',
              },
            },
          },
          {
            args: {
              pathParameterHash: {
                gamma: '333',
                delta: '444',
              },
            },
          },
          {
            args: {
              pathParameterHash: {},
            },
          },
        ]

        test.each(cases)('pathParameterHash: $args.pathParameterHash', ({ args }) => {
          const actual = new BaseRestfulApiPayload({
            query: mockQuery,
            body: mockBody,
            pathParameterHash: args.pathParameterHash,
            options: mockOptions,
          })

          expect(actual)
            .toHaveProperty('pathParameterHash', args.pathParameterHash)
        })
      })

      describe('#headers', () => {
        describe('with givin headers', () => {
          const cases = [
            {
              args: {
                options: {
                  headers: new Headers({
                    alpha: '111',
                    beta: '222',
                  }),
                },
              },
            },
            {
              args: {
                options: {
                  headers: new Headers({
                    gamma: '333',
                    delta: '444',
                  }),
                },
              },
            },
            {
              args: {
                options: {
                  headers: new Headers(),
                },
              },
            },
          ]

          test.each(cases)('headers: $args.options.headers', ({ args }) => {
            const actual = new BaseRestfulApiPayload({
              query: mockQuery,
              body: mockBody,
              pathParameterHash: mockPathParameterHash,
              options: args.options,
            })

            expect(actual)
              .toHaveProperty('headers', args.options.headers)
          })
        })

        describe('without givin headers', () => {
          /**
           * @type {Array<{
           *   args: {
           *     options: RequestInit
           *   }
           * }>}
           */
          const cases = [
            {
              args: {
                options: {
                  mode: 'cors',
                },
              },
            },
            {
              args: {
                options: {
                  credentials: 'omit',
                },
              },
            },
            {
              args: {
                options: {},
              },
            },
          ]

          test.each(cases)('options: $args.options', ({ args }) => {
            const expected = {
              ...args.options,
              headers: new Headers(),
            }

            const actual = new BaseRestfulApiPayload({
              query: mockQuery,
              body: mockBody,
              pathParameterHash: mockPathParameterHash,
              options: args.options,
            })

            expect(actual)
              .toHaveProperty('options', expected)
          })
        })
      })

      describe('#restOptions', () => {
        /**
         * @type {Array<{
         *   args: {
         *     options: RequestInit
         *   }
         *   expected: RequestInit
         * }>}
         */
        const cases = [
          {
            args: {
              options: {
                headers: new Headers({
                  alpha: '111',
                  beta: '222',
                }),
                mode: 'cors',
              },
            },
            expected: {
              mode: 'cors',
            },
          },
          {
            args: {
              options: {
                headers: new Headers(),
                credentials: 'omit',
              },
            },
            expected: {
              credentials: 'omit',
            },
          },
          {
            args: {
              options: {
                priority: 'high',
              },
            },
            expected: {
              priority: 'high',
            },
          },
        ]

        test.each(cases)('options: $args.options', ({ args, expected }) => {
          const actual = new BaseRestfulApiPayload({
            query: mockQuery,
            body: mockBody,
            pathParameterHash: mockPathParameterHash,
            options: args.options,
          })

          expect(actual)
            .toHaveProperty('restOptions', expected)
        })
      })
    })

    describe('to set property', () => {
      describe('#options', () => {
        /**
         * @type {Array<{
         *   args: {
         *     options: RequestInit
         *   }
         *   expected: RequestInit
         * }>}
         */
        const cases = [
          {
            args: {
              options: {
                headers: new Headers({
                  alpha: '111',
                  beta: '222',
                }),
                mode: 'cors',
              },
            },
            expected: {
              headers: new Headers({
                alpha: '111',
                beta: '222',
              }),
              mode: 'cors',
            },
          },
          {
            args: {
              options: {
                headers: new Headers(),
                credentials: 'omit',
              },
            },
            expected: {
              headers: new Headers(),
              credentials: 'omit',
            },
          },
          {
            args: {
              options: {
                priority: 'high',
              },
            },
            expected: {
              headers: new Headers(),
              priority: 'high',
            },
          },
        ]

        test.each(cases)('args: $args.options', ({ args, expected }) => {
          const actual = new BaseRestfulApiPayload({
            query: mockQuery,
            body: mockBody,
            pathParameterHash: mockPathParameterHash,
            options: args.options,
          })

          expect(actual)
            .toHaveProperty('options', expected)
        })
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.create()', () => {
    describe('to be an instance of own class', () => {
      /**
       * @type {Array<{
       *   args: {
       *     query?: Record<string, unknown>
       *     body?: Record<string, unknown>
       *     pathParameterHash?: Record<string, unknown>
       *     options?: RequestInit
       *   }
       * }>}
       */
      const cases = [
        {
          args: {
            query: { alpha: 'alpha-query' },
            body: { alpha: 'alpha-body' },
            pathParameterHash: { alpha: 'alpha-pathParameterHash' },
            options: { mode: 'cors' },
          },
        },
        {
          args: {
            // query: { beta: 'beta-query' },
            body: { beta: 'beta-body' },
            pathParameterHash: { beta: 'beta-pathParameterHash' },
            options: { credentials: 'omit' },
          },
        },
        {
          args: {
            query: { gamma: 'gamma-query' },
            // body: { gamma: 'gamma-body' },
            pathParameterHash: { gamma: 'gamma-pathParameterHash' },
            options: { priority: 'high' },
          },
        },
        {
          args: {
            query: { delta: 'delta-query' },
            body: { delta: 'delta-body' },
            // pathParameterHash: { delta: 'delta-pathParameterHash' },
            options: { keepalive: true },
          },
        },
        {
          args: {
            query: { epsilon: 'epsilon-query' },
            body: { epsilon: 'epsilon-body' },
            pathParameterHash: { epsilon: 'epsilon-pathParameterHash' },
            // options: { mode: 'cors' },
          },
        },
      ]

      test.each(cases)('query: $args.query', ({ args }) => {
        const actual = BaseRestfulApiPayload.create(args)

        expect(actual)
          .toBeInstanceOf(BaseRestfulApiPayload)
      })
    })

    describe('to call constructor', () => {
      /**
       * @type {Array<{
       *   args: {
       *     query?: Record<string, unknown>
       *     body?: Record<string, unknown>
       *     pathParameterHash?: Record<string, unknown>
       *     options?: RequestInit
       *   }
       *   expected: {
       *     query: Record<string, unknown>
       *     body: Record<string, unknown>
       *     pathParameterHash: Record<string, unknown>
       *     options: RequestInit
       *   }
       * }>}
       */
      const cases = [
        {
          args: {
            query: { alpha: 'alpha-query' },
            body: { alpha: 'alpha-body' },
            pathParameterHash: { alpha: 'alpha-pathParameterHash' },
            options: { mode: 'cors' },
          },
          expected: {
            query: { alpha: 'alpha-query' },
            body: { alpha: 'alpha-body' },
            pathParameterHash: { alpha: 'alpha-pathParameterHash' },
            options: { mode: 'cors' },
          },
        },
        {
          args: {
            // query: { beta: 'beta-query' },
            body: { beta: 'beta-body' },
            pathParameterHash: { beta: 'beta-pathParameterHash' },
            options: { credentials: 'omit' },
          },
          expected: {
            query: {},
            body: { beta: 'beta-body' },
            pathParameterHash: { beta: 'beta-pathParameterHash' },
            options: { credentials: 'omit' },
          },
        },
        {
          args: {
            query: { gamma: 'gamma-query' },
            // body: { gamma: 'gamma-body' },
            pathParameterHash: { gamma: 'gamma-pathParameterHash' },
            options: { priority: 'high' },
          },
          expected: {
            query: { gamma: 'gamma-query' },
            body: {},
            pathParameterHash: { gamma: 'gamma-pathParameterHash' },
            options: { priority: 'high' },
          },
        },
        {
          args: {
            query: { delta: 'delta-query' },
            body: { delta: 'delta-body' },
            // pathParameterHash: { delta: 'delta-pathParameterHash' },
            options: { keepalive: true },
          },
          expected: {
            query: { delta: 'delta-query' },
            body: { delta: 'delta-body' },
            pathParameterHash: {},
            options: { keepalive: true },
          },
        },
        {
          args: {
            query: { epsilon: 'epsilon-query' },
            body: { epsilon: 'epsilon-body' },
            pathParameterHash: { epsilon: 'epsilon-pathParameterHash' },
            // options: { mode: 'cors' },
          },
          expected: {
            query: { epsilon: 'epsilon-query' },
            body: { epsilon: 'epsilon-body' },
            pathParameterHash: { epsilon: 'epsilon-pathParameterHash' },
            options: {},
          },
        },
      ]

      test.each(cases)('query: $args.query', ({ args, expected }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(BaseRestfulApiPayload)

        SpyClass.create(args)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.createWithFormValueHash()', () => {
    describe('to return instance of own class', () => {
      /**
       * @type {Array<{
       *   args: {
       *     valueHash: Record<string, furo.FormControlElementValueType>
       *     extraValueHash?: Record<string, furo.FormControlElementValueType>
       *     options?: RequestInit
       *   }
       * }>}
       */
      const cases = [
        {
          args: {
            valueHash: {
              id: 10001,
            },
          },
        },
        {
          args: {
            valueHash: {
              id: 20001,
              username: 'John Doe',
            },
          },
        },
        {
          args: {
            valueHash: {
              id: 30001,
            },
            extraValueHash: {
              bio: 'Who am I?',
            },
          },
        },
        {
          args: {
            valueHash: {
              id: 40001,
            },
            extraValueHash: {
              bio: 'Who are you?',
            },
            options: {
              mode: 'cors',
            },
          },
        },
      ]

      test.each(cases)('id: $args.valueHash.id', ({ args }) => {
        jest.spyOn(BaseRestfulApiPayload, 'generateRequestParameterHash')
          .mockReturnValue({})

        const actual = BaseRestfulApiPayload.createWithFormValueHash(args)

        expect(actual)
          .toBeInstanceOf(BaseRestfulApiPayload)
      })
    })

    describe('to call other members', () => {
      const queryTally = { tally: Symbol('query-tally') }
      const bodyTally = { tally: Symbol('body-tally') }
      const pathParameterHashTally = { tally: Symbol('path-parameter-hash-tally') }

      /**
       * @type {Array<{
       *   args: {
       *     valueHash: Record<string, furo.FormControlElementValueType>
       *     extraValueHash?: Record<string, furo.FormControlElementValueType>
       *     options?: RequestInit
       *   }
       *   generateRequestParameterHashTally: {
       *     query?: Record<string, unknown>
       *     body?: Record<string, unknown>
       *     pathParameterHash?: Record<string, unknown>
       *   }
       *   expected: {
       *     buildFormBasedValueHashArgs: {
       *       valueHash: Record<string, furo.FormControlElementValueType>
       *       extraValueHash: Record<string, furo.FormControlElementValueType>
       *     }
       *     generateRequestParameterHashArgs: {
       *       valueHash: Record<string, furo.FormControlElementValueType>
       *     }
       *     createArgs: {
       *       query: Record<string, unknown>
       *       body: Record<string, unknown>
       *       pathParameterHash: Record<string, unknown>
       *       options: RequestInit
       *     }
       *   }
       * }>}
       */
      const cases = [
        {
          args: {
            valueHash: {
              id: 10001,
            },
          },
          generateRequestParameterHashTally: {
            query: queryTally,
            body: bodyTally,
            pathParameterHash: pathParameterHashTally,
          },
          expected: {
            buildFormBasedValueHashArgs: {
              valueHash: {
                id: 10001,
              },
              extraValueHash: {},
            },
            generateRequestParameterHashArgs: {
              valueHash: {
                id: 10001,
              },
            },
            createArgs: {
              query: queryTally,
              body: bodyTally,
              pathParameterHash: pathParameterHashTally,
              options: {},
            },
          },
        },
        {
          args: {
            valueHash: {
              id: 20001,
              username: 'John Doe',
            },
            options: {
              mode: 'cors',
            },
          },
          generateRequestParameterHashTally: {
            query: queryTally,
            body: bodyTally,
            // pathParameterHash: pathParameterHashTally,
          },
          expected: {
            buildFormBasedValueHashArgs: {
              valueHash: {
                id: 20001,
                username: 'John Doe',
              },
              extraValueHash: {},
            },
            generateRequestParameterHashArgs: {
              valueHash: {
                id: 20001,
                username: 'John Doe',
              },
            },
            createArgs: {
              query: queryTally,
              body: bodyTally,
              pathParameterHash: {},
              options: {
                mode: 'cors',
              },
            },
          },
        },
        {
          args: {
            valueHash: {
              id: 30001,
            },
            extraValueHash: {
              bio: 'Who am I?',
            },
          },
          generateRequestParameterHashTally: {
            query: queryTally,
            // body: bodyTally,
            pathParameterHash: pathParameterHashTally,
          },
          expected: {
            buildFormBasedValueHashArgs: {
              valueHash: {
                id: 30001,
              },
              extraValueHash: {
                bio: 'Who am I?',
              },
            },
            generateRequestParameterHashArgs: {
              valueHash: {
                id: 30001,
                bio: 'Who am I?',
              },
            },
            createArgs: {
              query: queryTally,
              body: {},
              pathParameterHash: pathParameterHashTally,
              options: {},
            },
          },
        },
        {
          args: {
            valueHash: {
              id: 40001,
            },
            extraValueHash: {
              bio: 'Who are you?',
            },
            options: {
              credentials: 'omit',
            },
          },
          generateRequestParameterHashTally: {
            // query: queryTally,
            body: bodyTally,
            pathParameterHash: pathParameterHashTally,
          },
          expected: {
            buildFormBasedValueHashArgs: {
              valueHash: {
                id: 40001,
              },
              extraValueHash: {
                bio: 'Who are you?',
              },
            },
            generateRequestParameterHashArgs: {
              valueHash: {
                id: 40001,
                bio: 'Who are you?',
              },
            },
            createArgs: {
              query: {},
              body: bodyTally,
              pathParameterHash: pathParameterHashTally,
              options: {
                credentials: 'omit',
              },
            },
          },
        },
      ]

      test.each(cases)('id: $args.valueHash.id', ({ args, generateRequestParameterHashTally, expected }) => {
        const buildFormBasedValueHashSpy = jest.spyOn(BaseRestfulApiPayload, 'buildFormBasedValueHash')
        const generateRequestParameterHashSpy = jest.spyOn(BaseRestfulApiPayload, 'generateRequestParameterHash')
          .mockReturnValue(generateRequestParameterHashTally)
        const createSpy = jest.spyOn(BaseRestfulApiPayload, 'create')

        BaseRestfulApiPayload.createWithFormValueHash(args)

        expect(buildFormBasedValueHashSpy)
          .toHaveBeenCalledWith(expected.buildFormBasedValueHashArgs)
        expect(generateRequestParameterHashSpy)
          .toHaveBeenCalledWith(expected.generateRequestParameterHashArgs)
        expect(createSpy)
          .toHaveBeenCalledWith(expected.createArgs)
      })
    })

    describe('to throw on called directly', () => {
      /**
       * @type {Array<{
       *   args: {
       *     valueHash: Record<string, furo.FormControlElementValueType>
       *     extraValueHash?: Record<string, furo.FormControlElementValueType>
       *     options?: RequestInit
       *   }
       * }>}
       */
      const cases = [
        {
          args: {
            valueHash: {
              id: 10001,
            },
          },
        },
        {
          args: {
            valueHash: {
              id: 20001,
              username: 'John Doe',
            },
          },
        },
        {
          args: {
            valueHash: {
              id: 30001,
            },
            extraValueHash: {
              bio: 'Who am I?',
            },
          },
        },
        {
          args: {
            valueHash: {
              id: 40001,
            },
            extraValueHash: {
              bio: 'Who are you?',
            },
            options: {
              mode: 'cors',
            },
          },
        },
      ]

      test.each(cases)('id: $args.valueHash.id', ({ args }) => {
        const expected = 'this function must be inherited'

        expect(() => BaseRestfulApiPayload.createWithFormValueHash(args))
          .toThrow(expected)
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.buildFormBasedValueHash()', () => {
    describe('to be merged object hash', () => {
      const cases = [
        {
          params: {
            valueHash: {
              id: 10001,
            },
            extraValueHash: {
              username: 'John Doe',
            },
          },
          expected: {
            id: 10001,
            username: 'John Doe',
          },
        },
        {
          params: {
            valueHash: {
              id: 20001,
            },
            extraValueHash: {
              username: 'Jane Smith',
            },
          },
          expected: {
            id: 20001,
            username: 'Jane Smith',
          },
        },
      ]

      test.each(cases)('id: $params.valueHash.id', ({ params, expected }) => {
        const actual = BaseRestfulApiPayload.buildFormBasedValueHash(params)

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('to call .normalizeFormBasedValueHash()', () => {
      const cases = [
        {
          params: {
            valueHash: {
              id: 10001,
            },
            extraValueHash: {
              username: 'John Doe',
            },
          },
          expected: {
            id: 10001,
            username: 'John Doe',
          },
        },
        {
          params: {
            valueHash: {
              id: 20001,
            },
            extraValueHash: {
              username: 'Jane Smith',
            },
          },
          expected: {
            id: 20001,
            username: 'Jane Smith',
          },
        },
      ]

      test.each(cases)('id: $params.valueHash.id', ({ params, expected }) => {
        const expectedArgs = {
          valueHash: params.valueHash,
        }

        const normalizeFormBasedValueHashSpy = jest.spyOn(BaseRestfulApiPayload, 'normalizeFormBasedValueHash')

        const actual = BaseRestfulApiPayload.buildFormBasedValueHash(params)

        expect(actual)
          .toEqual(expected)

        expect(normalizeFormBasedValueHashSpy)
          .toHaveBeenCalledWith(expectedArgs)
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.normalizeFormBasedValueHash()', () => {
    const cases = [
      {
        params: {
          valueHash: {
            id: 10001,
          },
        },
      },
      {
        params: {
          valueHash: {
            id: 20001,
          },
        },
      },
    ]

    test.each(cases)('id: $params.valueHash.id', ({ params }) => {
      const actual = BaseRestfulApiPayload.normalizeFormBasedValueHash(params)

      expect(actual)
        .toEqual(params.valueHash)
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.generateRequestParameterHash()', () => {
    const cases = [
      {
        args: {
          valueHash: {
            id: 10001,
          },
        },
      },
      {
        args: {
          valueHash: {},
        },
      },
    ]

    test.each(cases)('valueHash: $args.valueHash', ({ args }) => {
      const expected = 'this function must be inherited'

      expect(() => BaseRestfulApiPayload.generateRequestParameterHash(args))
        .toThrow(expected)
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.get:method', () => {
    test('to throw Error', () => {
      const expected = 'this function must be inherited'

      expect(() => BaseRestfulApiPayload.method)
        .toThrow(expected)
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.get:pathname', () => {
    test('to throw Error', () => {
      const expected = 'this function must be inherited'

      expect(() => BaseRestfulApiPayload.pathname)
        .toThrow(expected)
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.get:prefixPathname', () => {
    test('to be fixed value', () => {
      const expected = ''

      const actual = BaseRestfulApiPayload.prefixPathname

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.get:queryRequiredFields', () => {
    test('to be fixed value', () => {
      const expected = []

      const actual = BaseRestfulApiPayload.queryRequiredFields

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.get:bodyRequiredFields', () => {
    test('to be fixed value', () => {
      const expected = []

      const actual = BaseRestfulApiPayload.bodyRequiredFields

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.get:pathParameterRequiredFields', () => {
    test('to be fixed value', () => {
      const expected = []

      const actual = BaseRestfulApiPayload.pathParameterRequiredFields

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.collectBasedHeadersOptions()', () => {
    describe('to be fixed array', () => {
      test('with no arguments', () => {
        const expected = []

        const actual = BaseRestfulApiPayload.collectBasedHeadersOptions()

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.collectBasedFetchOptions()', () => {
    describe('to be fixed array', () => {
      test('with no arguments', () => {
        const actual = BaseRestfulApiPayload.collectBasedFetchOptions()

        expect(actual)
          .toBeInstanceOf(Array)
        expect(actual)
          .toHaveLength(0)
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.resolveBaseUrl()', () => {
    const cases = [
      {
        args: {
          baseUrl: 'https://alpha.example.com',
        },
        expected: 'https://alpha.example.com',
      },
      {
        args: {
          baseUrl: new URL('https://beta.example.com'),
        },
        expected: 'https://beta.example.com',
      },
      {
        args: {
          baseUrl: new Request('https://gamma.example.com'),
        },
        expected: 'https://gamma.example.com',
      },
    ]

    test.each(cases)('baseUrl: $args.baseUrl', ({ args, expected }) => {
      const actual = BaseRestfulApiPayload.resolveBaseUrl(args)

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.isBodyRequiredMethod()', () => {
    describe('to be truthy', () => {
      const cases = [
        {
          args: {
            Payload: class extends BaseRestfulApiPayload {
              /** @override */
              static get method () {
                return /** @type {RestfulApiType.METHOD} */ ('POST')
              }
            },
          },
        },
        {
          args: {
            Payload: class extends BaseRestfulApiPayload {
              /** @override */
              static get method () {
                return /** @type {RestfulApiType.METHOD} */ ('PUT')
              }
            },
          },
        },
        {
          args: {
            Payload: class extends BaseRestfulApiPayload {
              /** @override */
              static get method () {
                return /** @type {RestfulApiType.METHOD} */ ('PATCH')
              }
            },
          },
        },
      ]

      test.each(cases)('Payload: $args.Payload.name', ({ args }) => {
        const actual = args.Payload.isBodyRequiredMethod()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to be falsy', () => {
      const cases = [
        {
          args: {
            Payload: class extends BaseRestfulApiPayload {
              /** @override */
              static get method () {
                return /** @type {RestfulApiType.METHOD} */ ('GET')
              }
            },
          },
        },
        {
          args: {
            Payload: class extends BaseRestfulApiPayload {
              /** @override */
              static get method () {
                return /** @type {RestfulApiType.METHOD} */ ('DELETE')
              }
            },
          },
        },
      ]

      test.each(cases)('Payload: $args.Payload.name', ({ args }) => {
        const actual = args.Payload.isBodyRequiredMethod()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.createFormDataInstance()', () => {
    test('to return new FormData instance', () => {
      const actual = BaseRestfulApiPayload.createFormDataInstance()

      expect(actual)
        .toBeInstanceOf(FormData)
    })

    test('to return independent instances', () => {
      const formData1 = BaseRestfulApiPayload.createFormDataInstance()
      const formData2 = BaseRestfulApiPayload.createFormDataInstance()

      formData1.append('test', 'value')

      const actual1 = [...formData1.entries()]
      const actual2 = [...formData2.entries()]

      expect(actual1)
        .toHaveLength(1)
      expect(actual2)
        .toHaveLength(0)
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#get:Ctor', () => {
    describe('to be own class', () => {
      /**
       * @type {Array<{
       *   args: {
       *     query: Record<string, unknown>
       *     body: Record<string, unknown>
       *     pathParameterHash: Record<string, unknown>
       *     options: RequestInit
       *   }
       * }>}
       */
      const cases = [
        {
          args: {
            query: { alpha: 'alpha-query' },
            body: { alpha: 'alpha-body' },
            pathParameterHash: { alpha: 'alpha-pathParameterHash' },
            options: { mode: 'cors' },
          },
        },
        {
          args: {
            query: { beta: 'beta-query' },
            body: { beta: 'beta-body' },
            pathParameterHash: { beta: 'beta-pathParameterHash' },
            options: { credentials: 'omit' },
          },
        },
        {
          args: {
            query: { gamma: 'gamma-query' },
            body: { gamma: 'gamma-body' },
            pathParameterHash: { gamma: 'gamma-pathParameterHash' },
            options: { priority: 'high' },
          },
        },
        {
          args: {
            query: { delta: 'delta-query' },
            body: { delta: 'delta-body' },
            pathParameterHash: { delta: 'delta-pathParameterHash' },
            options: { keepalive: true },
          },
        },
        {
          args: {
            query: { epsilon: 'epsilon-query' },
            body: { epsilon: 'epsilon-body' },
            pathParameterHash: { epsilon: 'epsilon-pathParameterHash' },
            options: { mode: 'cors' },
          },
        },
      ]

      test.each(cases)('args: $args.query', ({ args }) => {
        const payload = new BaseRestfulApiPayload(args)

        expect(payload.Ctor)
          .toBe(BaseRestfulApiPayload)
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#createFetchRequest()', () => {
    describe('to be instance of Request', () => {
      /**
       * @type {Array<{
       *   args: {
       *     baseUrl: string
       *   }
       *   tally: {
       *     method: RestfulApiType.METHOD
       *     pathname: string
       *   }
       * }>}
       */
      const cases = [
        {
          args: {
            baseUrl: 'https://alpha.example.com',
          },
          tally: {
            method: 'GET',
            pathname: '/graphql-customer',
          },
        },
        {
          args: {
            baseUrl: 'https://beta.example.com',
          },
          tally: {
            method: 'POST',
            pathname: '/graphql-admin',
          },
        },
      ]

      test.each(cases)('baseUrl: $args.baseUrl', ({ args, tally }) => {
        jest.spyOn(BaseRestfulApiPayload, 'method', 'get')
          .mockReturnValue(tally.method)
        jest.spyOn(BaseRestfulApiPayload, 'pathname', 'get')
          .mockReturnValue(tally.pathname)

        const payload = new BaseRestfulApiPayload({
          query: {},
          body: {},
          pathParameterHash: {},
          options: {},
        })

        const actual = payload.createFetchRequest(args)

        expect(actual)
          .toBeInstanceOf(Request)
      })
    })

    describe('to call members', () => {
      /**
       * @type {Array<{
       *   args: {
       *     baseUrl: string
       *   }
       *   tally: {
       *     method: RestfulApiType.METHOD
       *     pathname: string
       *   }
       * }>}
       */
      const cases = [
        {
          args: {
            baseUrl: 'https://alpha.example.com',
          },
          tally: {
            method: 'GET',
            pathname: '/graphql-customer',
          },
        },
        {
          args: {
            baseUrl: 'https://beta.example.com',
          },
          tally: {
            method: 'POST',
            pathname: '/graphql-admin',
          },
        },
      ]

      test.each(cases)('baseUrl: $args.baseUrl', ({ args, tally }) => {
        jest.spyOn(BaseRestfulApiPayload, 'method', 'get')
          .mockReturnValue(tally.method)
        jest.spyOn(BaseRestfulApiPayload, 'pathname', 'get')
          .mockReturnValue(tally.pathname)

        const payload = new BaseRestfulApiPayload({
          query: {},
          body: {},
          pathParameterHash: {},
          options: {},
        })

        const createFetchRequestArgs = {
          baseUrl: args.baseUrl,
        }

        const actual = payload.createFetchRequest(createFetchRequestArgs)

        expect(actual)
          .toBeInstanceOf(Request)
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#createRequestURL()', () => {
    describe('to return URL instance', () => {
      /**
       * @type {Array<{
       *   args: {
       *     baseUrl: string
       *     query: Record<string, unknown>
       *   }
       *   tally: {
       *     method: RestfulApiType.METHOD
       *     pathname: string
       *   }
       *   expected: URL
       * }>}
       */
      const cases = [
        {
          args: {
            baseUrl: 'https://alpha.example.com',
            query: {
              alpha: 111,
              beta: 222,
            },
          },
          tally: {
            method: 'GET',
            pathname: '/alpha-endpoint',
          },
          expected: new URL(
            '/alpha-endpoint?alpha=111&beta=222',
            'https://alpha.example.com'
          ),
        },
        {
          args: {
            baseUrl: 'https://beta.example.com',
            query: {
              gamma: 333,
              delta: 444,
            },
          },
          tally: {
            method: 'POST',
            pathname: '/beta-endpoint',
          },
          expected: new URL(
            '/beta-endpoint?gamma=333&delta=444',
            'https://beta.example.com'
          ),
        },
        {
          args: {
            baseUrl: 'https://gamma.example.com',
            query: {},
          },
          tally: {
            method: 'GET',
            pathname: '/gamma-endpoint',
          },
          expected: new URL(
            '/gamma-endpoint',
            'https://gamma.example.com'
          ),
        },
      ]

      test.each(cases)('baseUrl: $args.baseUrl', ({ args, tally, expected }) => {
        jest.spyOn(BaseRestfulApiPayload, 'method', 'get')
          .mockReturnValue(tally.method)
        jest.spyOn(BaseRestfulApiPayload, 'pathname', 'get')
          .mockReturnValue(tally.pathname)

        const payload = new BaseRestfulApiPayload({
          query: args.query,
          body: {},
          pathParameterHash: {},
          options: {},
        })

        const actual = payload.createRequestURL(args)

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#buildRequestUri()', () => {
    describe('without query and pathParameterHash', () => {
      const cases = [
        {
          args: {
            pathname: '/alpha-endpoint',
            prefixPathname: '/v1',
          },
          expected: '/v1/alpha-endpoint',
        },
        {
          args: {
            pathname: '/beta-endpoint',
            prefixPathname: '/v2',
          },
          expected: '/v2/beta-endpoint',
        },
      ]

      test.each(cases)('pathname: $args.pathname', ({ args, expected }) => {
        jest.spyOn(BaseRestfulApiPayload, 'pathname', 'get')
          .mockReturnValue(args.pathname)
        jest.spyOn(BaseRestfulApiPayload, 'prefixPathname', 'get')
          .mockReturnValue(args.prefixPathname)

        const payload = new BaseRestfulApiPayload({
          query: {},
          body: {},
          pathParameterHash: {},
          options: {},
        })

        const actual = payload.buildRequestUri()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('with query', () => {
      const cases = [
        {
          args: {
            pathname: '/alpha-endpoint',
            prefixPathname: '/v1',
            query: {
              alpha: 111,
              beta: 222,
            },
          },
          expected: '/v1/alpha-endpoint?alpha=111&beta=222',
        },
        {
          args: {
            pathname: '/beta-endpoint',
            prefixPathname: '/v2',
            query: {
              gamma: 333,
              delta: 444,
            },
          },
          expected: '/v2/beta-endpoint?delta=444&gamma=333', // sorted query parameters
        },
      ]

      test.each(cases)('pathname: $args.pathname', ({ args, expected }) => {
        jest.spyOn(BaseRestfulApiPayload, 'pathname', 'get')
          .mockReturnValue(args.pathname)
        jest.spyOn(BaseRestfulApiPayload, 'prefixPathname', 'get')
          .mockReturnValue(args.prefixPathname)

        const payload = new BaseRestfulApiPayload({
          query: args.query,
          body: {},
          pathParameterHash: {},
          options: {},
        })

        const actual = payload.buildRequestUri()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('with pathParameterHash', () => {
      const cases = [
        {
          args: {
            pathname: '/alpha-endpoint/:id',
            prefixPathname: '/v1',
            pathParameterHash: {
              id: 10001,
            },
          },
          expected: '/v1/alpha-endpoint/10001',
        },
        {
          args: {
            pathname: '/beta-endpoint/:id/:name',
            prefixPathname: '/v2',
            pathParameterHash: {
              id: 20002,
              name: 'John Doe',
            },
          },
          expected: '/v2/beta-endpoint/20002/John Doe', // encoded path parameter
        },
      ]

      test.each(cases)('pathname: $args.pathname', ({ args, expected }) => {
        jest.spyOn(BaseRestfulApiPayload, 'pathname', 'get')
          .mockReturnValue(args.pathname)
        jest.spyOn(BaseRestfulApiPayload, 'prefixPathname', 'get')
          .mockReturnValue(args.prefixPathname)

        const payload = new BaseRestfulApiPayload({
          query: {},
          body: {},
          pathParameterHash: args.pathParameterHash,
          options: {},
        })

        const actual = payload.buildRequestUri()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('with query and pathParameterHash', () => {
      const cases = [
        {
          args: {
            pathname: '/alpha-endpoint/:id',
            prefixPathname: '/v1',
            query: {
              alpha: 111,
              beta: 222,
            },
            pathParameterHash: {
              id: 10001,
            },
          },
          expected: '/v1/alpha-endpoint/10001?alpha=111&beta=222',
        },
        {
          args: {
            pathname: '/beta-endpoint/:id/:name',
            prefixPathname: '/v2',
            query: {
              gamma: 333,
              delta: 444,
            },
            pathParameterHash: {
              id: 20002,
              name: 'John Doe',
            },
          },
          expected: '/v2/beta-endpoint/20002/John Doe?delta=444&gamma=333', // sorted query parameters
        },
      ]

      test.each(cases)('pathname: $args.pathname', ({ args, expected }) => {
        jest.spyOn(BaseRestfulApiPayload, 'pathname', 'get')
          .mockReturnValue(args.pathname)
        jest.spyOn(BaseRestfulApiPayload, 'prefixPathname', 'get')
          .mockReturnValue(args.prefixPathname)

        const payload = new BaseRestfulApiPayload({
          query: args.query,
          body: {},
          pathParameterHash: args.pathParameterHash,
          options: {},
        })

        const actual = payload.buildRequestUri()

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#buildPathname()', () => {
    const cases = [
      {
        args: {
          pathname: '/alpha-endpoint',
          prefixPathname: '/v1',
          pathParameterHash: {},
        },
        expected: '/v1/alpha-endpoint',
      },
      {
        args: {
          pathname: '/beta-endpoint/:id/:name',
          prefixPathname: '/v2',
          pathParameterHash: {
            id: 10002,
            name: 'John Doe',
          },
        },
        expected: '/v2/beta-endpoint/10002/John Doe',
      },
      {
        args: {
          pathname: '/gamma-endpoint/:documentId/edit',
          prefixPathname: '/v3',
          pathParameterHash: {
            documentId: 20003,
          },
        },
        expected: '/v3/gamma-endpoint/20003/edit',
      },
    ]

    test.each(cases)('pathname: $args.pathname', ({ args, expected }) => {
      jest.spyOn(BaseRestfulApiPayload, 'pathname', 'get')
        .mockReturnValue(args.pathname)
      jest.spyOn(BaseRestfulApiPayload, 'prefixPathname', 'get')
        .mockReturnValue(args.prefixPathname)

      const payload = new BaseRestfulApiPayload({
        query: {},
        body: {},
        pathParameterHash: args.pathParameterHash,
        options: {},
      })

      const actual = payload.buildPathname()

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#generateSearchQuery()', () => {
    const cases = [
      {
        args: {
          query: {
            key: 'alpha',
            page: 1,
          },
        },
        expected: 'key=alpha&page=1',
      },
      {
        args: {
          query: {
            search: 'example',
            limit: 10,
          },
        },
        expected: 'limit=10&search=example',
      },
      {
        args: {
          query: {},
        },
        expected: '',
      },
    ]

    test.each(cases)('query: $args.query', ({ args, expected }) => {
      const payload = new BaseRestfulApiPayload({
        query: args.query,
        body: {},
        pathParameterHash: {},
        options: {},
      })

      const actual = payload.generateSearchQuery()

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#generateRequestOptionHash()', () => {
    const AlphaGetRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('GET')
      }

      /** @override */
      static collectBasedHeadersOptions () {
        return /** @type {Array<Record<string, string>>} */ ([
          { 'Content-Type': 'application/json' },
          { 'X-APP-KEY': 'alpha' },
        ])
      }

      /** @override */
      static collectBasedFetchOptions () {
        return /** @type {Array<RequestInit>} */ ([
          { mode: 'cors' },
          { credentials: 'include' },
        ])
      }
    }

    const BetaPostRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('POST')
      }

      /** @override */
      static collectBasedHeadersOptions () {
        return /** @type {Array<Record<string, string>>} */ ([
          { 'Content-Type': 'multipart/form-data' },
          { 'X-APP-KEY': 'beta' },
        ])
      }

      /** @override */
      static collectBasedFetchOptions () {
        return /** @type {Array<RequestInit>} */ ([
          {
            mode: 'navigate',
            credentials: 'same-origin',
          },
        ])
      }
    }

    const GammaPutRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('PUT')
      }

      /** @override */
      static collectBasedHeadersOptions () {
        return /** @type {Array<Record<string, string>>} */ ([
          { 'Content-Type': 'x-www-form-urlencoded' },
          { 'X-APP-KEY': 'gamma' },
        ])
      }

      /** @override */
      static collectBasedFetchOptions () {
        return /** @type {Array<RequestInit>} */ ([
          { mode: 'no-cors' },
          { credentials: 'omit' },
        ])
      }
    }

    describe('to set payload based options', () => {
      const payloadCases = [
        {
          args: {
            Payload: AlphaGetRestfulApiPayload,
          },
          expected: expect.objectContaining({
            mode: 'cors',
            credentials: 'include',
          }),
        },
        {
          args: {
            Payload: BetaPostRestfulApiPayload,
          },
          expected: expect.objectContaining({
            mode: 'navigate',
            credentials: 'same-origin',
          }),
        },
      ]

      test.each(payloadCases)('Payload: $args.Payload.name', ({ args, expected }) => {
        const constructorArgs = {
          query: {},
          body: {},
          pathParameterHash: {},
          options: {},
        }
        const payload = new args.Payload(constructorArgs)

        const actual = payload.generateRequestOptionHash()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('to set given options via #restOptions', () => {
      /**
       * @type {Array<{
       *   args: {
       *     Payload: typeof BaseRestfulApiPayload
       *     options: RequestInit
       *   }
       *   expected: RequestInit
       * }>}
       */
      const payloadCases = [
        {
          args: {
            Payload: AlphaGetRestfulApiPayload,
            options: {
              mode: 'navigate',
            },
          },
          expected: expect.objectContaining({
            mode: 'navigate', // overrides 'cors'
            credentials: 'include',
          }),
        },
        {
          args: {
            Payload: BetaPostRestfulApiPayload,
            options: {
              credentials: 'omit',
            },
          },
          expected: expect.objectContaining({
            mode: 'navigate',
            credentials: 'omit', // overrides 'same-origin'
          }),
        },
      ]

      test.each(payloadCases)('Payload: $args.Payload.name', ({ args, expected }) => {
        const constructorArgs = {
          query: {},
          body: {},
          pathParameterHash: {},
          options: args.options,
        }
        const payload = new args.Payload(constructorArgs)

        const actual = payload.generateRequestOptionHash()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('to set method', () => {
      /**
       * @type {Array<{
       *   args: {
       *     Payload: typeof BaseRestfulApiPayload
       *   }
       *   expected: RestfulApiType.METHOD
       * }>}
       */
      const payloadCases = [
        {
          args: {
            Payload: AlphaGetRestfulApiPayload,
          },
          expected: 'GET',
        },
        {
          args: {
            Payload: BetaPostRestfulApiPayload,
          },
          expected: 'POST',
        },
        {
          args: {
            Payload: GammaPutRestfulApiPayload,
          },
          expected: 'PUT',
        },
      ]

      test.each(payloadCases)('Payload: $args.Payload.name', ({ args, expected }) => {
        const constructorArgs = {
          query: {},
          body: {},
          pathParameterHash: {},
          options: {
            method: 'OPTIONS', // this will be overridden
          },
        }
        const payload = new args.Payload(constructorArgs)

        const actual = payload.generateRequestOptionHash()

        expect(actual)
          .toHaveProperty('method', expected)
      })
    })

    describe('to set merged headers', () => {
      /**
       * @type {Array<{
       *   args: {
       *     Payload: typeof BaseRestfulApiPayload
       *     options: RequestInit
       *   }
       *   expected: Headers
       * }>}
       */
      const payloadCases = [
        {
          args: {
            Payload: AlphaGetRestfulApiPayload,
            options: {
              headers: new Headers({
                'X-APP-KEY': 'custom-alpha',
              }),
            },
          },
          expected: new Headers({
            'Content-Type': 'application/json',
            'X-APP-KEY': 'custom-alpha', // overrides 'alpha'
          }),
        },
        {
          args: {
            Payload: BetaPostRestfulApiPayload,
            options: {
              headers: new Headers({
                'X-APP-KEY': 'custom-beta',
              }),
            },
          },
          expected: new Headers({
            'Content-Type': 'multipart/form-data',
            'X-APP-KEY': 'custom-beta', // overrides 'beta'
          }),
        },
      ]

      test.each(payloadCases)('Payload: $args.Payload.name', ({ args, expected }) => {
        const constructorArgs = {
          query: {},
          body: {},
          pathParameterHash: {},
          options: args.options,
        }
        const payload = new args.Payload(constructorArgs)

        const actual = payload.generateRequestOptionHash()

        expect(actual)
          .toHaveProperty('headers', expected)
      })
    })

    describe('to set body', () => {
      describe('for body required method', () => {
        const postFormDataBody = new FormData()
        const putFormDataBody = new FormData()

        postFormDataBody.append('first', 'first value')
        putFormDataBody.append('second', 'second value')

        const cases = [
          {
            args: {
              Payload: BetaPostRestfulApiPayload,
              body: {
                first: 'first value',
              },
            },
            expected: postFormDataBody,
          },
          {
            args: {
              Payload: GammaPutRestfulApiPayload,
              body: {
                second: 'second value',
              },
            },
            expected: putFormDataBody,
          },
        ]

        test.each(cases)('Payload: $args.Payload.name', ({ args, expected }) => {
          const constructorArgs = {
            query: {},
            body: args.body,
            pathParameterHash: {},
            options: {},
          }
          const payload = new args.Payload(constructorArgs)

          const actual = payload.generateRequestOptionHash()

          expect(actual)
            .toHaveProperty('body', expected)
        })
      })

      describe('for body not-required method', () => {
        const cases = [
          {
            args: {
              Payload: AlphaGetRestfulApiPayload,
              body: {
                unknown: 'unknown value',
              },
            },
          },
        ]

        test.each(cases)('Payload: $args.Payload.name', ({ args }) => {
          const constructorArgs = {
            query: {},
            body: args.body,
            pathParameterHash: {},
            options: {},
          }
          const payload = new args.Payload(constructorArgs)

          const actual = payload.generateRequestOptionHash()

          expect(actual)
            .not
            .toHaveProperty('body')
        })
      })
    })

    describe('to be return options object', () => {
      const firstPostFormDataBody = new FormData()
      const secondPostFormDataBody = new FormData()
      const thirdPutFormDataBody = new FormData()
      const fourthPutFormDataBody = new FormData()

      firstPostFormDataBody.append('first', 'first value')
      secondPostFormDataBody.append('second', 'second value')

      thirdPutFormDataBody.append('third', 'third value')
      fourthPutFormDataBody.append('fourth', 'fourth value')

      describe('for body required method', () => {
        const payloadCases = [
          {
            args: {
              Payload: BetaPostRestfulApiPayload,
            },
            cases: [
              {
                constructorArgs: {
                  query: {
                    order: '1st',
                  },
                  body: /** @type {Record<string, *>} */ ({
                    first: 'first value',
                  }),
                  options: /** @type {RequestInit} */ ({
                    headers: new Headers({
                      'X-APP-KEY': 'overridden-beta',
                    }),
                    mode: 'no-cors',
                  }),
                },
                expected: /** @type {RequestInit} */ ({
                  method: 'POST',
                  mode: 'no-cors',
                  credentials: 'same-origin',
                  headers: new Headers({
                    'Content-Type': 'multipart/form-data',
                    'X-APP-KEY': 'overridden-beta',
                  }),
                  body: firstPostFormDataBody,
                }),
              },
              {
                constructorArgs: {
                  query: {
                    order: '2nd',
                  },
                  body: /** @type {Record<string, *>} */ ({
                    second: 'second value',
                  }),
                  options: /** @type {RequestInit} */ ({
                    headers: new Headers(),
                    cache: 'reload',
                  }),
                },
                expected: /** @type {RequestInit} */ ({
                  method: 'POST',
                  mode: 'navigate',
                  cache: 'reload',
                  credentials: 'same-origin',
                  headers: new Headers({
                    'Content-Type': 'multipart/form-data',
                    'X-APP-KEY': 'beta',
                  }),
                  body: secondPostFormDataBody,
                }),
              },
            ],
          },
          {
            args: {
              Payload: GammaPutRestfulApiPayload,
            },
            cases: [
              {
                constructorArgs: {
                  query: {
                    order: '3rd',
                  },
                  body: /** @type {Record<string, *>} */ ({
                    third: 'third value',
                  }),
                  options: /** @type {RequestInit} */ ({
                    headers: new Headers({
                      'X-APP-KEY': 'overridden-gamma',
                    }),
                    priority: 'high',
                  }),
                },
                expected: /** @type {RequestInit} */ ({
                  method: 'PUT',
                  mode: 'no-cors',
                  credentials: 'omit',
                  priority: 'high',
                  headers: new Headers({
                    'Content-Type': 'x-www-form-urlencoded',
                    'X-APP-KEY': 'overridden-gamma',
                  }),
                  body: thirdPutFormDataBody,
                }),
              },
              {
                constructorArgs: {
                  query: {
                    order: '4th',
                  },
                  body: /** @type {Record<string, *>} */ ({
                    fourth: 'fourth value',
                  }),
                  options: /** @type {RequestInit} */ ({
                    headers: new Headers(),
                    redirect: 'manual',
                  }),
                },
                expected: /** @type {RequestInit} */ ({
                  method: 'PUT',
                  mode: 'no-cors',
                  credentials: 'omit',
                  redirect: 'manual',
                  headers: new Headers({
                    'Content-Type': 'x-www-form-urlencoded',
                    'X-APP-KEY': 'gamma',
                  }),
                  body: fourthPutFormDataBody,
                }),
              },
            ],
          },
        ]

        describe.each(payloadCases)('Payload: $args.Payload.name', ({ args, cases }) => {
          test.each(cases)('query: $constructorArgs.query', ({ constructorArgs, expected }) => {
            const fulfilledArgs = {
              pathParameterHash: {},

              ...constructorArgs,
            }
            const payload = new args.Payload(fulfilledArgs)

            const actual = payload.generateRequestOptionHash()

            expect(actual)
              .toEqual(expected)
          })
        })
      })

      describe('for body not-required method', () => {
        const payloadCases = [
          {
            args: {
              Payload: AlphaGetRestfulApiPayload,
            },
            cases: [
              {
                constructorArgs: {
                  query: {
                    order: '1st',
                  },
                  body: /** @type {Record<string, *>} */ ({
                    unknown: 'unknown value',
                  }),
                  options: /** @type {RequestInit} */ ({
                    headers: new Headers({
                      'X-APP-KEY': 'overridden-alpha',
                    }),
                    priority: 'high',
                  }),
                },
                expected: /** @type {RequestInit} */ ({
                  method: 'GET',
                  priority: 'high',
                  headers: new Headers({
                    'Content-Type': 'application/json',
                    'X-APP-KEY': 'overridden-alpha',
                  }),
                }),
              },
              {
                constructorArgs: {
                  query: {
                    order: '2nd',
                  },
                  body: /** @type {Record<string, *>} */ ({
                    unknown: 'unknown value',
                  }),
                  options: /** @type {RequestInit} */ ({
                    headers: new Headers(),
                    redirect: 'manual',
                  }),
                },
                expected: /** @type {RequestInit} */ ({
                  method: 'GET',
                  redirect: 'manual',
                  headers: new Headers({
                    'Content-Type': 'application/json',
                    'X-APP-KEY': 'gamma',
                  }),
                }),
              },
            ],
          },
        ]

        describe.each(payloadCases)('Payload: $args.Payload.name', ({ args, cases }) => {
          test.each(cases)('query: $constructorArgs.query', ({ constructorArgs, expected }) => {
            const fulfilledArgs = {
              query: {},
              pathParameterHash: {},

              ...constructorArgs,
            }
            const payload = new args.Payload(fulfilledArgs)

            const actual = payload.generateRequestOptionHash()

            expect(actual)
              .toBeInstanceOf(Object)
          })
        })
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#createMergedHeaders()', () => {
    const AlphaGetRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('GET')
      }

      /** @override */
      static collectBasedHeadersOptions () {
        return /** @type {Array<Record<string, string>>} */ ([
          { 'Content-Type': 'application/json' },
          { 'X-APP-KEY': 'alpha' },
        ])
      }
    }

    const BetaPostRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('POST')
      }

      /** @override */
      static collectBasedHeadersOptions () {
        return /** @type {Array<Record<string, string>>} */ ([
          { 'Content-Type': 'multipart/form-data' },
          { 'X-APP-KEY': 'beta' },
        ])
      }
    }

    const GammaPutRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('PUT')
      }

      /** @override */
      static collectBasedHeadersOptions () {
        return /** @type {Array<Record<string, string>>} */ ([
          { 'Content-Type': 'x-www-form-urlencoded' },
          { 'X-APP-KEY': 'gamma' },
        ])
      }
    }

    const DeltaDeleteRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('DELETE')
      }

      /** @override */
      static collectBasedHeadersOptions () {
        return []
      }
    }

    describe('with based headers', () => {
      const cases = [
        {
          args: {
            Payload: AlphaGetRestfulApiPayload,
          },
          expected: new Headers({
            'Content-Type': 'application/json',
            'X-APP-KEY': 'alpha',
          }),
        },
        {
          args: {
            Payload: BetaPostRestfulApiPayload,
          },
          expected: new Headers({
            'Content-Type': 'multipart/form-data',
            'X-APP-KEY': 'beta',
          }),
        },
        {
          args: {
            Payload: GammaPutRestfulApiPayload,
          },
          expected: new Headers({
            'Content-Type': 'x-www-form-urlencoded',
            'X-APP-KEY': 'gamma',
          }),
        },
        {
          args: {
            Payload: DeltaDeleteRestfulApiPayload,
          },
          expected: new Headers(),
        },
      ]

      test.each(cases)('Payload: $args.Payload.name', ({ args, expected }) => {
        const payload = new args.Payload({
          query: {},
          body: {},
          pathParameterHash: {},
          options: {},
        })

        const actual = payload.createMergedHeaders()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('with given headers via .create()', () => {
      const cases = [
        {
          args: {
            headers: new Headers({
              'X-APP-KEY': 'alpha',
            }),
          },
        },
        {
          args: {
            headers: new Headers({
              'X-APP-KEY': 'beta',
            }),
          },
        },
        {
          args: {
            headers: new Headers({
              'X-APP-KEY': 'gamma',
            }),
          },
        },
      ]

      test.each(cases)('headers: $args.headers', ({ args }) => {
        const payload = new BaseRestfulApiPayload({
          query: {},
          body: {},
          pathParameterHash: {},
          options: {
            headers: args.headers,
          },
        })

        const actual = payload.createMergedHeaders()

        expect(actual)
          .toEqual(args.headers)
      })
    })

    describe('with both based headers and given headers', () => {
      const payloadCases = [
        {
          args: {
            Payload: AlphaGetRestfulApiPayload,
          },
          cases: [
            {
              headers: new Headers({
                'X-APP-KEY': 'custom-alpha',
              }),
              expected: new Headers({
                'Content-Type': 'application/json',
                'X-APP-KEY': 'custom-alpha', // overrides 'alpha'
              }),
            },
            {
              headers: new Headers({
                'X-APP-KEY': 'overridden-alpha',
              }),
              expected: new Headers({
                'Content-Type': 'application/json',
                'X-APP-KEY': 'overridden-alpha', // overrides 'alpha'
              }),
            },
          ],
        },
        {
          args: {
            Payload: BetaPostRestfulApiPayload,
          },
          cases: [
            {
              headers: new Headers({
                'X-APP-KEY': 'custom-beta',
              }),
              expected: new Headers({
                'Content-Type': 'multipart/form-data',
                'X-APP-KEY': 'custom-beta', // overrides 'beta'
              }),
            },
            {
              headers: new Headers({
                'X-APP-KEY': 'overridden-beta',
              }),
              expected: new Headers({
                'Content-Type': 'multipart/form-data',
                'X-APP-KEY': 'overridden-beta', // overrides 'beta'
              }),
            },
          ],
        },
        {
          args: {
            Payload: GammaPutRestfulApiPayload,
          },
          cases: [
            {
              headers: new Headers({
                'X-APP-KEY': 'custom-gamma',
              }),
              expected: new Headers({
                'Content-Type': 'x-www-form-urlencoded',
                'X-APP-KEY': 'custom-gamma', // overrides 'gamma'
              }),
            },
            {
              headers: new Headers({
                'X-APP-KEY': 'overridden-gamma',
              }),
              expected: new Headers({
                'Content-Type': 'x-www-form-urlencoded',
                'X-APP-KEY': 'overridden-gamma', // overrides 'gamma'
              }),
            },
          ],
        },
        {
          args: {
            Payload: DeltaDeleteRestfulApiPayload,
          },
          cases: [
            {
              headers: new Headers({
                'X-APP-KEY': 'custom-delta',
              }),
              expected: new Headers({
                'X-APP-KEY': 'custom-delta', // no based headers
              }),
            },
            {
              headers: new Headers({
                'X-APP-KEY': 'overridden-delta',
              }),
              expected: new Headers({
                'X-APP-KEY': 'overridden-delta', // no based headers
              }),
            },
          ],
        },
      ]

      describe.each(payloadCases)('Payload: $args.Payload.name', ({ args, cases }) => {
        test.each(cases)('headers: $args.headers', ({ headers, expected }) => {
          const payload = new args.Payload({
            query: {},
            body: {},
            pathParameterHash: {},
            options: {
              headers,
            },
          })

          const actual = payload.createMergedHeaders()

          expect(actual)
            .toEqual(expected)
        })
      })
    })

    describe('with no headers', () => {
      test('without given headers', () => {
        const expected = new Headers()

        const payload = new BaseRestfulApiPayload({
          query: {},
          body: {},
          pathParameterHash: {},
          options: {},
        })

        const actual = payload.createMergedHeaders()

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#generateBodyEntry()', () => {
    const AlphaGetRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('GET')
      }

      /** @override */
      static collectBasedHeadersOptions () {
        return /** @type {Array<Record<string, string>>} */ ([
          { 'Content-Type': 'application/json' },
          { 'X-APP-KEY': 'alpha' },
        ])
      }
    }

    const BetaPostRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('POST')
      }

      /** @override */
      static collectBasedHeadersOptions () {
        return /** @type {Array<Record<string, string>>} */ ([
          { 'Content-Type': 'multipart/form-data' },
          { 'X-APP-KEY': 'beta' },
        ])
      }
    }

    const GammaPutRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('PUT')
      }

      /** @override */
      static collectBasedHeadersOptions () {
        return /** @type {Array<Record<string, string>>} */ ([
          { 'Content-Type': 'x-www-form-urlencoded' },
          { 'X-APP-KEY': 'gamma' },
        ])
      }
    }

    const DeltaDeleteRestfulApiPayload = class extends BaseRestfulApiPayload {
      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('DELETE')
      }

      /** @override */
      static collectBasedHeadersOptions () {
        return []
      }
    }

    const firstPostFormDataBody = new FormData()
    const secondPostFormDataBody = new FormData()
    const thirdPutFormDataBody = new FormData()
    const fourthPutFormDataBody = new FormData()

    firstPostFormDataBody.append('first', 'first value')
    secondPostFormDataBody.append('second', 'second value')

    thirdPutFormDataBody.append('third', 'third value')
    fourthPutFormDataBody.append('fourth', 'fourth value')

    describe('for body required method', () => {
      const cases = [
        {
          args: {
            Payload: BetaPostRestfulApiPayload,
            body: {
              first: 'first value',
            },
          },
          expected: [
            ['body', firstPostFormDataBody],
          ],
        },
        {
          args: {
            Payload: GammaPutRestfulApiPayload,
            body: {
              second: 'second value',
            },
          },
          expected: [
            ['body', secondPostFormDataBody],
          ],
        },
        {
          args: {
            Payload: BetaPostRestfulApiPayload,
            body: {
              third: 'third value',
            },
          },
          expected: [
            ['body', thirdPutFormDataBody],
          ],
        },
        {
          args: {
            Payload: GammaPutRestfulApiPayload,
            body: {
              fourth: 'fourth value',
            },
          },
          expected: [
            ['body', fourthPutFormDataBody],
          ],
        },
      ]

      test.each(cases)('Payload: $args.Payload.name', ({ args, expected }) => {
        const payload = new args.Payload({
          query: {},
          body: args.body,
          pathParameterHash: {},
          options: {},
        })

        const actual = payload.generateBodyEntry()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('for body not-required method', () => {
      const cases = [
        {
          args: {
            Payload: AlphaGetRestfulApiPayload,
            body: {
              unknown: 'unknown value',
            },
          },
        },
        {
          args: {
            Payload: DeltaDeleteRestfulApiPayload,
            body: {
              unknown: 'unknown value',
            },
          },
        },
      ]

      test.each(cases)('Payload: $args.Payload.name', ({ args }) => {
        const expected = []

        const payload = new args.Payload({
          query: {},
          body: args.body,
          pathParameterHash: {},
          options: {},
        })

        const actual = payload.generateBodyEntry()

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#buildFormDataBody()', () => {
    describe('to create FormData with correct structure', () => {
      const alphaFile = new File(['alpha'], 'alpha.txt', { type: 'text/plain' })

      const alphaFormDataHub = new FormData()
      const betaFormDataHub = new FormData()

      alphaFormDataHub.append('first', 'alpha value')
      alphaFormDataHub.append('second', 'beta value')

      betaFormDataHub.append('first', 'gamma value')
      betaFormDataHub.append('second', 'delta value')
      betaFormDataHub.append('file', alphaFile)

      const cases = [
        {
          args: {
            body: {
              first: 'alpha value',
              second: 'beta value',
            },
          },
          expected: alphaFormDataHub,
        },
        {
          args: {
            body: {
              first: 'gamma value',
              second: 'delta value',
              file: alphaFile,
            },
          },
          expected: betaFormDataHub,
        },
      ]

      test.each(cases)('first: $args.body.first', ({ args, expected }) => {
        const constructorArgs = {
          query: {},
          body: args.body,
          pathParameterHash: {},
          options: {},
        }
        const payload = new BaseRestfulApiPayload(constructorArgs)

        const actual = payload.buildFormDataBody()

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#extractFilteredRequestBody()', () => {
    const alphaFile = new File(['alpha'], 'alpha.txt', { type: 'text/plain' })

    const cases = [
      {
        args: {
          body: {
            first: 'alpha value',
            second: 'beta value',
          },
        },
      },
      {
        args: {
          body: {
            first: 'gamma value',
            second: 'delta value',
            file: alphaFile,
          },
        },
      },
    ]

    test.each(cases)('body: $args.body', ({ args }) => {
      const payload = new BaseRestfulApiPayload({
        query: {},
        body: args.body,
        pathParameterHash: {},
        options: {},
      })

      const actual = payload.extractFilteredRequestBody()

      expect(actual)
        .toBe(args.body) // same reference
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#isInvalidAllParameterHash()', () => {
    class AlphaRestfulApiPayload extends BaseRestfulApiPayload {
      /** @override */
      static get pathname () {
        return '/alpha-endpoint'
      }

      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('GET')
      }

      /** @override */
      static get queryRequiredFields () {
        return [
          'first',
        ]
      }

      /** @override */
      static get bodyRequiredFields () {
        return [
          'second',
          'third',
        ]
      }

      /** @override */
      static get pathParameterRequiredFields () {
        return []
      }
    }

    class BetaRestfulApiPayload extends BaseRestfulApiPayload {
      /** @override */
      static get pathname () {
        return '/beta-endpoint'
      }

      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('POST')
      }

      /** @override */
      static get queryRequiredFields () {
        return [
          'first',
          'second',
        ]
      }

      /** @override */
      static get bodyRequiredFields () {
        return [
          'third',
          'fourth',
        ]
      }

      /** @override */
      static get pathParameterRequiredFields () {
        return [
          'fifth',
        ]
      }
    }

    /**
     * @type {Array<{
     *   args: {
     *     Payload: RestfulApiType.PayloadCtor<*>
     *   }
     *   truthyCases: Array<RestfulApiType.xxxxx>,
     *   falsyCases: Array<RestfulApiType.xxxxx>,
     * }>}
     */
    const cases = [
      {
        args: {
          Payload: AlphaRestfulApiPayload,
        },
        truthyCases: [
          {
            query: {
              // first: '1st value',
            },
            body: {
              second: '2nd value',
              third: '3rd value',
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '1st value',
            },
            body: {
              // second: '2nd value',
              third: '3rd value',
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '1st value',
            },
            body: {
              second: '2nd value',
              // third: '3rd value',
            },
            pathParameterHash: {},
          },
        ],
        falsyCases: [
          {
            query: {
              first: '1st value',
            },
            body: {
              second: '2nd value',
              third: '3rd value',
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '(1)',
              extra: 'unknown value', // ✅️ unnecessary field
            },
            body: {
              second: '(2)',
              third: '(3)',
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '(1)',
            },
            body: {
              second: '(2)',
              third: '(3)',
              extra: 'unknown value', // ✅️ unnecessary field
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '(1)',
            },
            body: {
              second: '(2)',
              third: '(3)',
            },
            pathParameterHash: {
              extra: 'unknown value', // ✅️ unnecessary field
            },
          },
        ],
      },
      {
        args: {
          Payload: BetaRestfulApiPayload,
        },
        truthyCases: [
          {
            query: {
              // first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              // second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              // third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              // fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              // fifth: '5th value',
            },
          },
        ],
        falsyCases: [
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              extra: 'unknown value', // ✅️ unnecessary field
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              extra: 'unknown value', // ✅️ unnecessary field
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              extra: 'unknown value', // ✅️ unnecessary field
              fifth: '5th value',
            },
          },
        ],
      },
    ]

    describe.each(cases)('Payload: $args.Payload.name', ({ args, truthyCases, falsyCases }) => {
      describe('to be truthy', () => {
        test.each(truthyCases)('query: $query', ({ query, body, pathParameterHash }) => {
          const payload = args.Payload.create({
            query,
            body,
            pathParameterHash,
          })

          const actual = payload.isInvalidAllParameterHash()

          expect(actual)
            .toBeTruthy()
        })
      })

      describe('to be falsy', () => {
        test.each(falsyCases)('query: $query', ({ query, body, pathParameterHash }) => {
          const payload = args.Payload.create({
            query,
            body,
            pathParameterHash,
          })

          const actual = payload.isInvalidAllParameterHash()

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('#isValidAllParameterHash()', () => {
    class AlphaRestfulApiPayload extends BaseRestfulApiPayload {
      /** @override */
      static get pathname () {
        return '/alpha-endpoint'
      }

      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('GET')
      }

      /** @override */
      static get queryRequiredFields () {
        return [
          'first',
        ]
      }

      /** @override */
      static get bodyRequiredFields () {
        return [
          'second',
          'third',
        ]
      }

      /** @override */
      static get pathParameterRequiredFields () {
        return []
      }
    }

    class BetaRestfulApiPayload extends BaseRestfulApiPayload {
      /** @override */
      static get pathname () {
        return '/beta-endpoint'
      }

      /** @override */
      static get method () {
        return /** @type {RestfulApiType.METHOD} */ ('POST')
      }

      /** @override */
      static get queryRequiredFields () {
        return [
          'first',
          'second',
        ]
      }

      /** @override */
      static get bodyRequiredFields () {
        return [
          'third',
          'fourth',
        ]
      }

      /** @override */
      static get pathParameterRequiredFields () {
        return [
          'fifth',
        ]
      }
    }

    /**
     * @type {Array<{
     *   args: {
     *     Payload: RestfulApiType.PayloadCtor<*>
     *   }
     *   truthyCases: Array<RestfulApiType.xxxxx>,
     *   falsyCases: Array<RestfulApiType.xxxxx>,
     * }>}
     */
    const cases = [
      {
        args: {
          Payload: AlphaRestfulApiPayload,
        },
        truthyCases: [
          {
            query: {
              first: '1st value',
            },
            body: {
              second: '2nd value',
              third: '3rd value',
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '(1)',
              extra: 'unknown value', // ✅️ unnecessary field
            },
            body: {
              second: '(2)',
              third: '(3)',
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '(1)',
            },
            body: {
              second: '(2)',
              third: '(3)',
              extra: 'unknown value', // ✅️ unnecessary field
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '(1)',
            },
            body: {
              second: '(2)',
              third: '(3)',
            },
            pathParameterHash: {
              extra: 'unknown value', // ✅️ unnecessary field
            },
          },
        ],
        falsyCases: [
          {
            query: {
              // first: '1st value',
            },
            body: {
              second: '2nd value',
              third: '3rd value',
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '1st value',
            },
            body: {
              // second: '2nd value',
              third: '3rd value',
            },
            pathParameterHash: {},
          },
          {
            query: {
              first: '1st value',
            },
            body: {
              second: '2nd value',
              // third: '3rd value',
            },
            pathParameterHash: {},
          },
        ],
      },
      {
        args: {
          Payload: BetaRestfulApiPayload,
        },
        truthyCases: [
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              extra: 'unknown value', // ✅️ unnecessary field
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              extra: 'unknown value', // ✅️ unnecessary field
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              extra: 'unknown value', // ✅️ unnecessary field
              fifth: '5th value',
            },
          },
        ],
        falsyCases: [
          {
            query: {
              // first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              // second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              // third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              // fourth: '4th value',
            },
            pathParameterHash: {
              fifth: '5th value',
            },
          },
          {
            query: {
              first: '1st value',
              second: '2nd value',
            },
            body: {
              third: '3rd value',
              fourth: '4th value',
            },
            pathParameterHash: {
              // fifth: '5th value',
            },
          },
        ],
      },
    ]

    describe.each(cases)('Payload: $args.Payload.name', ({ args, truthyCases, falsyCases }) => {
      describe('to be truthy', () => {
        test.each(truthyCases)('query: $query', ({ query, body, pathParameterHash }) => {
          const payload = args.Payload.create({
            query,
            body,
            pathParameterHash,
          })

          const actual = payload.isValidAllParameterHash()

          expect(actual)
            .toBeTruthy()
        })
      })

      describe('to be falsy', () => {
        test.each(falsyCases)('query: $query', ({ query, body, pathParameterHash }) => {
          const payload = args.Payload.create({
            query,
            body,
            pathParameterHash,
          })

          const actual = payload.isValidAllParameterHash()

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('BaseRestfulApiPayload', () => {
  describe('.isValidValueHash()', () => {
    describe('with some required fields', () => {
      /**
       * @type {Array<{
       *   args: {
       *     requiredFields: Array<string>
       *   }
       *   truthyCases: Array<{
       *     valueHash: Record<string, *>
       *   }>
       *   falsyCases: Array<{
       *     valueHash: Record<string, *>
       *   }>
       * }>}
       */
      const requiredFieldsCases = [
        {
          args: {
            requiredFields: [
              'first',
              'second',
            ],
          },
          truthyCases: [
            {
              valueHash: {
                first: '1st value',
                second: '2nd value',
              },
            },
            {
              valueHash: {
                first: '1st value',
                second: '2nd value',
                extra: 'unknown value', // ✅️ unnecessary field
              },
            },
          ],
          falsyCases: [
            {
              valueHash: {
                // first: '1st value',
                second: '2nd value',
              },
            },
            {
              valueHash: {
                first: '1st value',
                // second: '2nd value',
              },
            },
            {
              valueHash: {
                // first: '1st value',
                // second: '2nd value',
              },
            },
          ],
        },
        {
          args: {
            requiredFields: [
              'alpha',
              'beta',
              'gamma',
            ],
          },
          truthyCases: [
            {
              valueHash: {
                alpha: 'alpha value',
                beta: 'beta value',
                gamma: 'gamma value',
              },
            },
            {
              valueHash: {
                alpha: 'alpha value',
                beta: 'beta value',
                gamma: 'gamma value',
                extra: 'unknown value', // ✅️ unnecessary field
              },
            },
          ],
          falsyCases: [
            {
              valueHash: {
                // alpha: 'alpha value',
                beta: 'beta value',
                gamma: 'gamma value',
              },
            },
            {
              valueHash: {
                alpha: 'alpha value',
                // beta: 'beta value',
                gamma: 'gamma value',
              },
            },
            {
              valueHash: {
                alpha: 'alpha value',
                beta: 'beta value',
                // gamma: 'gamma value',
              },
            },
            {
              valueHash: {
                // alpha: 'alpha value',
                // beta: 'beta value',
                // gamma: 'gamma value',
              },
            },
          ],
        },
      ]

      describe.each(requiredFieldsCases)('required fields: $args.requiredFields', ({ args, truthyCases, falsyCases }) => {
        describe('to be truthy', () => {
          test.each(truthyCases)('valueHash: $valueHash', ({ valueHash }) => {
            const actual = BaseRestfulApiPayload.isValidValueHash({
              requiredFields: args.requiredFields,
              valueHash,
            })

            expect(actual)
              .toBeTruthy()
          })
        })

        describe('to be falsy', () => {
          test.each(falsyCases)('valueHash: $valueHash', ({ valueHash }) => {
            const actual = BaseRestfulApiPayload.isValidValueHash({
              valueHash,
              requiredFields: args.requiredFields,
            })

            expect(actual)
              .toBeFalsy()
          })
        })
      })
    })
  })
})
