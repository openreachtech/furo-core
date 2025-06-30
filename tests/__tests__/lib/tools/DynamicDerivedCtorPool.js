import DynamicDerivedCtorPool from '~/lib/tools/DynamicDerivedCtorPool.js'

describe('DynamicDerivedCtorPool', () => {
  describe('constructor', () => {
    describe('to keep properties', () => {
      describe('#pool', () => {
        const cases = [
          {
            input: {
              pool: new Map([
                ['Alpha', class {}],
                ['Beta', class {}],
              ]),
            },
          },
          {
            input: {
              pool: new Map(),
            },
          },
        ]

        test.each(cases)('pool: $input.pool', ({ input }) => {
          const pool = new DynamicDerivedCtorPool(input)

          expect(pool)
            .toHaveProperty('pool', input.pool)
        })
      })
    })
  })
})

describe('DynamicDerivedCtorPool', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      const cases = [
        {
          input: {
            pool: new Map([
              ['Alpha', class {}],
              ['Beta', class {}],
            ]),
          },
        },
        {
          input: {
            pool: new Map(),
          },
        },
      ]

      test.each(cases)('pool: $input.pool', ({ input }) => {
        const pool = DynamicDerivedCtorPool.create(input)

        expect(pool)
          .toBeInstanceOf(DynamicDerivedCtorPool)
      })
    })

    describe('to call constructor', () => {
      describe('with given argument', () => {
        const cases = [
          {
            input: {
              pool: new Map([
                ['Alpha', class {}],
                ['Beta', class {}],
              ]),
            },
          },
          {
            input: {
              pool: new Map(),
            },
          },
        ]

        test.each(cases)('pool: $input.pool', ({ input }) => {
          const SpyClass = globalThis.constructorSpy.spyOn(DynamicDerivedCtorPool)

          SpyClass.create(input)

          expect(SpyClass.__spy__)
            .toHaveBeenCalledWith(input)
        })
      })

      describe('with no argument', () => {
        test('given {}', () => {
          const expected = {
            pool: new Map(),
          }

          const SpyClass = globalThis.constructorSpy.spyOn(DynamicDerivedCtorPool)

          SpyClass.create({})

          expect(SpyClass.__spy__)
            .toHaveBeenCalledWith(expected)
        })

        test('given no argument', () => {
          const expected = {
            pool: new Map(),
          }

          const SpyClass = globalThis.constructorSpy.spyOn(DynamicDerivedCtorPool)

          SpyClass.create()

          expect(SpyClass.__spy__)
            .toHaveBeenCalledWith(expected)
        })
      })
    })
  })
})

describe('DynamicDerivedCtorPool', () => {
  describe('#bulkRegisterCtors()', () => {
    describe('with all new Ctors', () => {
      const AlphaCtor = class {}
      const BetaCtor = class {}
      const GammaCtor = class {}
      const DeltaCtor = class {}
      const EpsilonCtor = class {}

      const cases = [
        {
          input: {
            CtorHash: {
              Alpha: AlphaCtor,
              Beta: BetaCtor,
            },
          },
          expected: new Map([
            ['Alpha', AlphaCtor],
            ['Beta', BetaCtor],
          ]),
        },
        {
          input: {
            CtorHash: {
              Gamma: GammaCtor,
              Delta: DeltaCtor,
              Epsilon: EpsilonCtor,
            },
          },
          expected: new Map([
            ['Gamma', GammaCtor],
            ['Delta', DeltaCtor],
            ['Epsilon', EpsilonCtor],
          ]),
        },
      ]

      test.each(cases)('CtorHash: $input.CtorHash', ({ input, expected }) => {
        const pool = new DynamicDerivedCtorPool({
          pool: new Map(),
        })

        const actual = pool.bulkRegisterCtors(input)

        expect(actual)
          .toBe(pool) // same instance

        expect(pool.pool)
          .toEqual(expected)
      })
    })

    describe('with some registered Ctors', () => {
      const AlphaCtor = class {}
      const BetaCtor = class {}
      const GammaCtor = class {}
      const DeltaCtor = class {}
      const EpsilonCtor = class {}
      const ZetaCtor = class {}

      describe('to register new Ctors only', () => {
        /**
         * @template {import('~/lib/tools/DynamicDerivedCtorPool.js').DynamicDerivedCtor} C
         * @type {Array<{
         *   name: string
         *   input: {
         *     pool: Map<string, C>
         *   }
         *   cases: Array<{
         *     CtorHash: {
         *       [name: string]: C
         *     }
         *     expected: Map<string, C>
         *   }>
         * }>}
         */
        const poolCases = /** @type {Array<*>} */ ([
          {
            name: 'registered: { Alpha, Beta }',
            input: {
              pool: new Map([
                ['Alpha', AlphaCtor],
                ['Beta', BetaCtor],
              ]),
            },
            cases: [
              {
                CtorHash: {
                  Gamma: GammaCtor,
                  Delta: DeltaCtor,
                },
                expected: new Map([
                  ['Alpha', AlphaCtor],
                  ['Beta', BetaCtor],
                  ['Gamma', GammaCtor],
                  ['Delta', DeltaCtor],
                ]),
              },
              {
                CtorHash: {
                  Epsilon: EpsilonCtor,
                },
                expected: new Map([
                  ['Alpha', AlphaCtor],
                  ['Beta', BetaCtor],
                  ['Gamma', GammaCtor], // #1 registered
                  ['Delta', DeltaCtor], // #1 registered
                  ['Epsilon', EpsilonCtor],
                ]),
              },
            ],
          },
          {
            name: 'registered { Gamma, Delta, Epsilon }',
            input: {
              pool: new Map([
                ['Gamma', GammaCtor],
                ['Delta', DeltaCtor],
                ['Epsilon', EpsilonCtor],
              ]),
            },
            cases: [
              {
                CtorHash: {
                  Alpha: AlphaCtor,
                  Beta: BetaCtor,
                },
                expected: new Map([
                  ['Gamma', GammaCtor],
                  ['Delta', DeltaCtor],
                  ['Epsilon', EpsilonCtor],
                  ['Alpha', AlphaCtor],
                  ['Beta', BetaCtor],
                ]),
              },
              {
                CtorHash: {
                  Zeta: ZetaCtor,
                },
                expected: new Map([
                  ['Gamma', GammaCtor],
                  ['Delta', DeltaCtor],
                  ['Epsilon', EpsilonCtor],
                  ['Alpha', AlphaCtor], // #1 registered
                  ['Beta', BetaCtor], // #1 registered
                  ['Zeta', ZetaCtor],
                ]),
              },
            ],
          },
        ])

        describe.each(poolCases)('$name', ({ input, cases }) => {
          const pool = new DynamicDerivedCtorPool(input)

          test.each(cases)('CtorHash: $input.CtorHash', ({ CtorHash, expected }) => {
            const args = {
              CtorHash,
            }

            const actual = pool.bulkRegisterCtors(args)

            expect(actual)
              .toBe(pool) // same instance

            expect(pool.pool)
              .toEqual(expected)
          })
        })
      })

      describe('to register existing and new Ctors', () => {
        const MaskCtor = class {}

        /**
         * @template {import('~/lib/tools/DynamicDerivedCtorPool.js').DynamicDerivedCtor} C
         * @type {Array<{
         *   name: string
         *   input: {
         *     pool: Map<string, C>
         *   }
         *   cases: Array<{
         *     CtorHash: {
         *       [name: string]: C
         *     }
         *     expected: Map<string, C>
         *   }>
         * }>}
         */
        const poolCases = /** @type {Array<*>} */ ([
          {
            name: 'registered: { Alpha, Beta }',
            input: {
              pool: new Map([
                ['Alpha', AlphaCtor],
                ['Beta', BetaCtor],
              ]),
            },
            cases: [
              {
                CtorHash: {
                  Alpha: MaskCtor, // existing Ctor name, but different
                  Gamma: GammaCtor,
                },
                expected: new Map([
                  ['Alpha', AlphaCtor],
                  ['Beta', BetaCtor],
                  ['Gamma', GammaCtor],
                ]),
              },
              {
                CtorHash: {
                  Alpha: MaskCtor, // existing Ctor name, but different
                  Beta: MaskCtor, // existing Ctor name, but different
                },
                expected: new Map([
                  ['Alpha', AlphaCtor],
                  ['Beta', BetaCtor],
                  ['Gamma', GammaCtor], // #1 registered
                ]),
              },
            ],
          },
          {
            name: 'registered { Gamma, Delta, Epsilon }',
            input: {
              pool: new Map([
                ['Gamma', GammaCtor],
                ['Delta', DeltaCtor],
              ]),
            },
            cases: [
              {
                CtorHash: {
                  Gamma: MaskCtor, // existing Ctor name, but different
                  Epsilon: EpsilonCtor,
                },
                expected: new Map([
                  ['Gamma', GammaCtor],
                  ['Delta', DeltaCtor],
                  ['Epsilon', EpsilonCtor],
                ]),
              },
              {
                CtorHash: {
                  Gamma: MaskCtor, // existing Ctor name, but different
                  Delta: MaskCtor, // existing Ctor name, but different
                  Epsilon: MaskCtor, // existing Ctor name, but different
                  Zeta: ZetaCtor, // new Ctor
                },
                expected: new Map([
                  ['Gamma', GammaCtor],
                  ['Delta', DeltaCtor],
                  ['Epsilon', EpsilonCtor], // #1 registered
                  ['Zeta', ZetaCtor],
                ]),
              },
            ],
          },
        ])

        describe.each(poolCases)('$name', ({ input, cases }) => {
          const pool = new DynamicDerivedCtorPool(input)

          test.each(cases)('CtorHash: $input.CtorHash', ({ CtorHash, expected }) => {
            const args = {
              CtorHash,
            }

            const actual = pool.bulkRegisterCtors(args)

            expect(actual)
              .toBe(pool) // same instance

            expect(pool.pool)
              .toEqual(expected)
          })
        })
      })
    })
  })
})

describe('DynamicDerivedCtorPool', () => {
  describe('#registerCtor()', () => {
    describe('with all new Ctors', () => {
      const AlphaCtor = class {}
      const BetaCtor = class {}

      const cases = [
        {
          input: {
            name: 'Alpha',
            Ctor: AlphaCtor,
          },
          expected: new Map([
            ['Alpha', AlphaCtor],
          ]),
        },
        {
          input: {
            name: 'Beta',
            Ctor: BetaCtor,
          },
          expected: new Map([
            ['Beta', BetaCtor],
          ]),
        },
      ]

      test.each(cases)('name: $input.name', ({ input, expected }) => {
        const pool = new DynamicDerivedCtorPool({
          pool: new Map(),
        })

        const actual = pool.registerCtor(input)

        expect(actual)
          .toBe(pool) // same instance

        expect(pool.pool)
          .toEqual(expected)
      })
    })

    describe('with some registered Ctors', () => {
      const AlphaCtor = class {}
      const BetaCtor = class {}
      const GammaCtor = class {}
      const DeltaCtor = class {}
      const EpsilonCtor = class {}
      const ZetaCtor = class {}

      describe('to register new Ctors', () => {
        /**
         * @template {import('~/lib/tools/DynamicDerivedCtorPool.js').DynamicDerivedCtor} C
         * @type {Array<{
         *   name: string
         *   input: {
         *     pool: Map<string, C>
         *   }
         *   cases: Array<{
         *     args: {
         *       name: string
         *       Ctor: C
         *     }
         *     expected: Map<string, C>
         *   }>
         * }>}
         */
        const poolCases = /** @type {Array<*>} */ ([
          {
            name: 'registered: { Alpha, Beta }',
            input: {
              pool: new Map([
                ['Alpha', AlphaCtor],
                ['Beta', BetaCtor],
              ]),
            },
            cases: [
              {
                args: {
                  name: 'Gamma',
                  Ctor: GammaCtor,
                },
                expected: new Map([
                  ['Alpha', AlphaCtor],
                  ['Beta', BetaCtor],
                  ['Gamma', GammaCtor],
                ]),
              },
              {
                args: {
                  name: 'Delta',
                  Ctor: DeltaCtor,
                },
                expected: new Map([
                  ['Alpha', AlphaCtor],
                  ['Beta', BetaCtor],
                  ['Gamma', GammaCtor], // #1 registered
                  ['Delta', DeltaCtor],
                ]),
              },
            ],
          },
          {
            name: 'registered { Gamma, Delta, Epsilon }',
            input: {
              pool: new Map([
                ['Gamma', GammaCtor],
                ['Delta', DeltaCtor],
                ['Epsilon', EpsilonCtor],
              ]),
            },
            cases: [
              {
                args: {
                  name: 'Alpha',
                  Ctor: AlphaCtor,
                },
                expected: new Map([
                  ['Gamma', GammaCtor],
                  ['Delta', DeltaCtor],
                  ['Epsilon', EpsilonCtor],
                  ['Alpha', AlphaCtor],
                ]),
              },
              {
                args: {
                  name: 'Zeta',
                  Ctor: ZetaCtor,
                },
                expected: new Map([
                  ['Gamma', GammaCtor],
                  ['Delta', DeltaCtor],
                  ['Epsilon', EpsilonCtor],
                  ['Alpha', AlphaCtor], // #1 registered
                  ['Zeta', ZetaCtor],
                ]),
              },
            ],
          },
        ])

        describe.each(poolCases)('$name', ({ input, cases }) => {
          test.each(cases)('CtorHash: $input.CtorHash', ({ args, expected }) => {
            const pool = new DynamicDerivedCtorPool(input)

            const actual = pool.registerCtor(args)

            expect(actual)
              .toBe(pool) // same instance

            expect(pool.pool)
              .toEqual(expected)
          })
        })
      })

      describe('to register existing and new Ctors', () => {
        const MaskCtor = class {}

        /**
         * @template {import('~/lib/tools/DynamicDerivedCtorPool.js').DynamicDerivedCtor} C
         * @type {Array<{
         *   name: string
         *   input: {
         *     pool: Map<string, C>
         *   }
         *   expected: Map<string, C>
         *   cases: Array<{
         *     args: {
         *       name: string
         *       Ctor: C
         *     }
         *   }>
         * }>}
         */
        const poolCases = /** @type {Array<*>} */ ([
          {
            name: 'registered: { Alpha, Beta }',
            input: {
              pool: new Map([
                ['Alpha', AlphaCtor],
                ['Beta', BetaCtor],
              ]),
            },
            expected: new Map([
              ['Alpha', AlphaCtor],
              ['Beta', BetaCtor],
            ]),
            cases: [
              {
                args: {
                  name: 'Alpha',
                  Ctor: MaskCtor, // existing Ctor name, but different
                },
              },
              {
                args: {
                  name: 'Beta',
                  Ctor: MaskCtor, // existing Ctor name, but different
                },
              },
            ],
          },
          {
            name: 'registered { Gamma, Delta, Epsilon }',
            input: {
              pool: new Map([
                ['Gamma', GammaCtor],
                ['Delta', DeltaCtor],
                ['Epsilon', EpsilonCtor],
              ]),
            },
            expected: new Map([
              ['Gamma', GammaCtor],
              ['Delta', DeltaCtor],
              ['Epsilon', EpsilonCtor],
            ]),
            cases: [
              {
                args: {
                  name: 'Gamma',
                  Ctor: MaskCtor, // existing Ctor name, but different
                },
              },
              {
                args: {
                  name: 'Delta',
                  Ctor: MaskCtor, // existing Ctor name, but different
                },
              },
              {
                args: {
                  name: 'Epsilon',
                  Ctor: MaskCtor, // existing Ctor name, but different
                },
              },
            ],
          },
        ])

        describe.each(poolCases)('$name', ({ input, expected, cases }) => {
          const pool = new DynamicDerivedCtorPool(input)

          test.each(cases)('CtorHash: $input.CtorHash', ({ args }) => {
            const actual = pool.registerCtor(args)

            expect(actual)
              .toBe(pool) // same instance

            expect(pool.pool)
              .toEqual(expected)
          })
        })
      })
    })
  })
})

describe('DynamicDerivedCtorPool', () => {
  describe('#retrieveCtor()', () => {
    describe('from registered Ctors', () => {
      const AlphaCtor = class {}
      const BetaCtor = class {}
      const GammaCtor = class {}
      const DeltaCtor = class {}
      const EpsilonCtor = class {}

      const poolCases = [
        {
          name: 'registered: { Alpha, Beta }',
          input: {
            pool: new Map([
              ['Alpha', AlphaCtor],
              ['Beta', BetaCtor],
            ]),
          },
          existingCases: [
            {
              name: 'Alpha',
              expected: AlphaCtor,
            },
            {
              name: 'Beta',
              expected: BetaCtor,
            },
          ],
          nullCases: [
            {
              name: 'Gamma',
            },
            {
              name: 'Unknown',
            },
          ],
        },
        {
          name: 'registered { Gamma, Delta, Epsilon }',
          input: {
            pool: new Map([
              ['Gamma', GammaCtor],
              ['Delta', DeltaCtor],
              ['Epsilon', EpsilonCtor],
            ]),
          },
          existingCases: [
            {
              name: 'Gamma',
              expected: GammaCtor,
            },
            {
              name: 'Delta',
              expected: DeltaCtor,
            },
            {
              name: 'Epsilon',
              expected: EpsilonCtor,
            },
          ],
          nullCases: [
            {
              name: 'Alpha',
            },
            {
              name: 'Unknown',
            },
          ],
        },
      ]

      describe.each(poolCases)('$name', ({ input, existingCases, nullCases }) => {
        const pool = new DynamicDerivedCtorPool(input)

        describe('to retrieve existing Ctors', () => {
          test.each(existingCases)('name: $name', ({ name, expected }) => {
            const actual = pool.retrieveCtor({ name })

            expect(actual)
              .toBe(expected) // same instance
          })
        })

        describe('to retrieve null', () => {
          test.each(nullCases)('name: $name', ({ name }) => {
            const actual = pool.retrieveCtor({ name })

            expect(actual)
              .toBeNull() // not found
          })
        })
      })
    })

    describe('from no registered Ctors', () => {
      const cases = [
        {
          input: {
            name: 'Alpha',
          },
        },
        {
          input: {
            name: 'Beta',
          },
        },
        {
          input: {
            name: 'Gamma',
          },
        },
      ]

      test.each(cases)('name, $input.name', ({ input }) => {
        const pool = new DynamicDerivedCtorPool({
          pool: new Map(),
        })

        const actual = pool.retrieveCtor(input)

        expect(actual)
          .toBeNull() // not found
      })
    })
  })
})

describe('DynamicDerivedCtorPool', () => {
  describe('#containsCtor()', () => {
    describe('from registered Ctors', () => {
      const AlphaCtor = class {}
      const BetaCtor = class {}
      const GammaCtor = class {}
      const DeltaCtor = class {}
      const EpsilonCtor = class {}

      const poolCases = [
        {
          name: 'registered: { Alpha, Beta }',
          input: {
            pool: new Map([
              ['Alpha', AlphaCtor],
              ['Beta', BetaCtor],
            ]),
          },
          truthyCases: [
            { name: 'Alpha' },
            { name: 'Beta' },
          ],
          falsyCases: [
            { name: 'Gamma' },
            { name: 'Unknown' },
          ],
        },
        {
          name: 'registered { Gamma, Delta, Epsilon }',
          input: {
            pool: new Map([
              ['Gamma', GammaCtor],
              ['Delta', DeltaCtor],
              ['Epsilon', EpsilonCtor],
            ]),
          },
          truthyCases: [
            { name: 'Gamma' },
            { name: 'Delta' },
            { name: 'Epsilon' },
          ],
          falsyCases: [
            { name: 'Alpha' },
            { name: 'Unknown' },
          ],
        },
      ]

      describe.each(poolCases)('$name', ({ input, truthyCases, falsyCases }) => {
        const pool = new DynamicDerivedCtorPool(input)

        describe('to be truthy', () => {
          test.each(truthyCases)('name: $name', ({ name, expected }) => {
            const actual = pool.containsCtor({
              name,
            })

            expect(actual)
              .toBeTruthy()
          })
        })

        describe('to be falsy', () => {
          test.each(falsyCases)('name: $name', ({ name }) => {
            const actual = pool.containsCtor({
              name,
            })

            expect(actual)
              .toBeFalsy()
          })
        })
      })
    })

    describe('from no registered Ctors', () => {
      describe('to be falsy', () => {
        const cases = [
          {
            input: {
              name: 'Alpha',
            },
          },
          {
            input: {
              name: 'Beta',
            },
          },
          {
            input: {
              name: 'Gamma',
            },
          },
        ]

        test.each(cases)('name, $input.name', ({ input }) => {
          const pool = new DynamicDerivedCtorPool({
            pool: new Map(),
          })

          const actual = pool.containsCtor(input)

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})
