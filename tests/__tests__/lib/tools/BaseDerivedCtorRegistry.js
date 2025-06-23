import BaseDerivedCtorRegistry from '~/lib/tools/derived-ctor-registry/BaseDerivedCtorRegistry.js'

import DerivedClassNameGenerator from '~/lib/tools/DerivedClassNameGenerator'
import DynamicDerivedCtorPool from '~/lib/tools/DynamicDerivedCtorPool'

describe('BaseDerivedCtorRegistry', () => {
  describe('constructor', () => {
    describe('to keep properties', () => {
      const cases = [
        {
          input: {
            SuperCtor: class BaseAlpha {},
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['Alpha', class Alpha {}],
                ['Beta', class Beta {}],
              ]),
            }),
            classNameGenerator: DerivedClassNameGenerator.create({
              className: 'BaseAlpha',
              fixedPrefix: 'Base',
            }),
          },
        },
        {
          input: {
            SuperCtor: class BaseBeta {},
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['Gamma', class Gamma {}],
                ['Delta', class Delta {}],
              ]),
            }),
            classNameGenerator: DerivedClassNameGenerator.create({
              className: 'BaseAppBeta',
              fixedPrefix: 'BaseApp',
            }),
          },
        },
      ]

      describe('#SuperCtor', () => {
        test.each(cases)('Ctor: $input.SuperCtor.name', ({ input }) => {
          const registry = new BaseDerivedCtorRegistry(input)

          expect(registry)
            .toHaveProperty('SuperCtor', input.SuperCtor)
        })
      })

      describe('#pool', () => {
        test.each(cases)('pool: $input.pool', ({ input }) => {
          const registry = new BaseDerivedCtorRegistry(input)

          expect(registry)
            .toHaveProperty('pool', input.pool)
        })
      })

      describe('#classNameGenerator', () => {
        test.each(cases)('classNameGenerator: $input.classNameGenerator', ({ input }) => {
          const registry = new BaseDerivedCtorRegistry(input)

          expect(registry)
            .toHaveProperty('classNameGenerator', input.classNameGenerator)
        })
      })
    })
  })
})

describe('BaseDerivedCtorRegistry', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      describe('with full parameters', () => {
        const cases = [
          {
            input: {
              SuperCtor: class BaseAlpha {},
              pool: DynamicDerivedCtorPool.create(),
              fixedPrefix: 'Base',
            },
          },
          {
            input: {
              SuperCtor: class BaseAppBeta {},
              pool: DynamicDerivedCtorPool.create(),
              fixedPrefix: 'BaseApp',
            },
          },
        ]

        test.each(cases)('fixedPrefix: $input.fixedPrefix', ({ input }) => {
          const registry = BaseDerivedCtorRegistry.create(input)

          expect(registry)
            .toBeInstanceOf(BaseDerivedCtorRegistry)
        })
      })

      describe('with omitted parameters', () => {
        const cases = [
          {
            input: {
              SuperCtor: class BaseAlpha {},
              fixedPrefix: 'Base',
            },
          },
          {
            input: {
              SuperCtor: class BaseAppBeta {},
              fixedPrefix: 'BaseApp',
            },
          },
        ]

        test.each(cases)('fixedPrefix: $input.fixedPrefix', ({ input }) => {
          const registry = BaseDerivedCtorRegistry.create(input)

          expect(registry)
            .toBeInstanceOf(BaseDerivedCtorRegistry)
        })
      })
    })

    describe('to call constructor', () => {
      const BaseAlpha = class {}
      const BaseAppBeta = class {}
      const BaseExtraGamma = class {}

      const alphaCtorPool = DynamicDerivedCtorPool.create()
      const betaCtorPool = DynamicDerivedCtorPool.create()

      describe('with full parameters', () => {
        const cases = [
          {
            input: {
              SuperCtor: BaseAlpha,
              pool: alphaCtorPool,
              fixedPrefix: 'Base',
            },
            expected: {
              constructorArgs: {
                SuperCtor: BaseAlpha,
                pool: alphaCtorPool,
                classNameGenerator: DerivedClassNameGenerator.create({
                  className: 'BaseAlpha',
                  fixedPrefix: 'Base',
                }),
              },
              createDerivedClassNameGeneratorArgs: {
                className: 'BaseAlpha',
                fixedPrefix: 'Base',
              },
            },
          },
          {
            input: {
              SuperCtor: BaseAppBeta,
              pool: betaCtorPool,
              fixedPrefix: 'BaseApp',
            },
            expected: {
              constructorArgs: {
                SuperCtor: BaseAppBeta,
                pool: betaCtorPool,
                classNameGenerator: DerivedClassNameGenerator.create({
                  className: 'BaseAppBeta',
                  fixedPrefix: 'BaseApp',
                }),
              },
              createDerivedClassNameGeneratorArgs: {
                className: 'BaseAppBeta',
                fixedPrefix: 'BaseApp',
              },
            },
          },
          {
            input: {
              SuperCtor: BaseExtraGamma,
              pool: DynamicDerivedCtorPool.create(),
              // fixedPrefix: 'BaseExtra',
            },
            expected: {
              constructorArgs: {
                SuperCtor: BaseExtraGamma,
                pool: expect.any(DynamicDerivedCtorPool),
                classNameGenerator: DerivedClassNameGenerator.create({
                  className: 'BaseExtraGamma',
                  fixedPrefix: 'Base',
                }),
              },
              createDerivedClassNameGeneratorArgs: {
                className: 'BaseExtraGamma',
                fixedPrefix: 'Base',
              },
            },
          },
        ]

        test.each(cases)('fixedPrefix: $input.fixedPrefix', ({ input, expected }) => {
          const createDynamicDerivedCtorPoolSpy = jest.spyOn(BaseDerivedCtorRegistry, 'createDynamicDerivedCtorPool')
          const createDerivedClassNameGeneratorSpy = jest.spyOn(BaseDerivedCtorRegistry, 'createDerivedClassNameGenerator')

          const SpyClass = globalThis.constructorSpy.spyOn(BaseDerivedCtorRegistry)

          SpyClass.create(input)

          expect(SpyClass.__spy__)
            .toHaveBeenCalledWith(expected.constructorArgs)

          expect(createDynamicDerivedCtorPoolSpy)
            .not
            .toHaveBeenCalledWith()
          expect(createDerivedClassNameGeneratorSpy)
            .toHaveBeenCalledWith(expected.createDerivedClassNameGeneratorArgs)
        })
      })

      describe('with omitted parameters', () => {
        const cases = [
          {
            input: {
              SuperCtor: BaseAlpha,
              // pool: alphaCtorPool,
              fixedPrefix: 'Base',
            },
            expected: {
              constructorArgs: {
                SuperCtor: BaseAlpha,
                pool: expect.any(DynamicDerivedCtorPool),
                classNameGenerator: DerivedClassNameGenerator.create({
                  className: 'BaseAlpha',
                  fixedPrefix: 'Base',
                }),
              },
              createDerivedClassNameGeneratorArgs: {
                className: 'BaseAlpha',
                fixedPrefix: 'Base',
              },
            },
          },
          {
            input: {
              SuperCtor: BaseAppBeta,
              // pool: betaCtorPool,
              fixedPrefix: 'BaseApp',
            },
            expected: {
              constructorArgs: {
                SuperCtor: BaseAppBeta,
                pool: expect.any(DynamicDerivedCtorPool),
                classNameGenerator: DerivedClassNameGenerator.create({
                  className: 'BaseAppBeta',
                  fixedPrefix: 'BaseApp',
                }),
              },
              createDerivedClassNameGeneratorArgs: {
                className: 'BaseAppBeta',
                fixedPrefix: 'BaseApp',
              },
            },
          },
        ]

        test.each(cases)('fixedPrefix: $input.fixedPrefix', ({ input, expected }) => {
          const createDynamicDerivedCtorPoolSpy = jest.spyOn(BaseDerivedCtorRegistry, 'createDynamicDerivedCtorPool')
          const createDerivedClassNameGeneratorSpy = jest.spyOn(BaseDerivedCtorRegistry, 'createDerivedClassNameGenerator')

          const SpyClass = globalThis.constructorSpy.spyOn(BaseDerivedCtorRegistry)

          SpyClass.create(input)

          expect(SpyClass.__spy__)
            .toHaveBeenCalledWith(expected.constructorArgs)

          expect(createDynamicDerivedCtorPoolSpy)
            .toHaveBeenCalledWith()
          expect(createDerivedClassNameGeneratorSpy)
            .toHaveBeenCalledWith(expected.createDerivedClassNameGeneratorArgs)
        })
      })
    })
  })
})

describe('BaseDerivedCtorRegistry', () => {
  describe('.createDynamicDerivedCtorPool()', () => {
    test('to return an instance of DynamicDerivedCtorPool', () => {
      const pool = BaseDerivedCtorRegistry.createDynamicDerivedCtorPool()

      expect(pool)
        .toBeInstanceOf(DynamicDerivedCtorPool)
    })
  })
})

describe('BaseDerivedCtorRegistry', () => {
  describe('.createDerivedClassNameGenerator()', () => {
    const cases = [
      {
        input: {
          className: 'BaseAlpha',
          fixedPrefix: 'Base',
        },
        expected: {
          className: 'BaseAlpha',
          fixedPrefix: 'Base',
        },
      },
      {
        input: {
          className: 'BaseAppBeta',
          fixedPrefix: 'BaseApp',
        },
        expected: {
          className: 'BaseAppBeta',
          fixedPrefix: 'BaseApp',
        },
      },
    ]

    test.each(cases)('className: $input.className', ({ input, expected }) => {
      const createSpy = jest.spyOn(DerivedClassNameGenerator, 'create')

      const generator = BaseDerivedCtorRegistry.createDerivedClassNameGenerator(input)

      expect(generator)
        .toBeInstanceOf(DerivedClassNameGenerator)

      expect(createSpy)
        .toHaveBeenCalledWith(expected)
    })
  })
})

describe('BaseDerivedCtorRegistry', () => {
  describe('#obtainCtor()', () => {
    describe('to returns new Derived Ctor', () => {
      const BaseAlpha = class {}
      const BaseAppBeta = class {}

      const cases = [
        {
          input: {
            SuperCtor: BaseAlpha,
            fixedPrefix: 'Base',
            pool: DynamicDerivedCtorPool.create({
              pool: new Map(), // Start with empty pool
            }),
            givenPrefix: 'First',
          },
          tallyCtor: class extends BaseAlpha {},
          expected: {
            className: 'BaseFirstAlpha',
          },
        },
        {
          input: {
            SuperCtor: BaseAppBeta,
            fixedPrefix: 'BaseApp',
            pool: DynamicDerivedCtorPool.create({
              pool: new Map(), // Start with empty pool
            }),
            givenPrefix: 'Second',
          },
          tallyCtor: class extends BaseAppBeta {},
          expected: {
            className: 'BaseAppSecondBeta',
          },
        },
      ]

      test.each(cases)('fixedPrefix: $input.fixedPrefix', ({ input, tallyCtor, expected }) => {
        const args = {
          SuperCtor: input.SuperCtor,
          pool: input.pool,
          fixedPrefix: input.fixedPrefix,
        }
        const registry = BaseDerivedCtorRegistry.create(args)

        jest.spyOn(registry, 'generatePrefix')
          .mockReturnValue(input.givenPrefix)

        const generateClassNameSpy = jest.spyOn(registry, 'generateClassName')
        const retrieveCtorSpy = jest.spyOn(registry, 'retrieveCtor')
        const registerDeclaredCtorSpy = jest.spyOn(registry, 'registerDeclaredCtor')
          .mockReturnValue(tallyCtor)

        const actual = registry.obtainCtor()

        expect(actual)
          .toBe(tallyCtor) // same reference

        expect(generateClassNameSpy)
          .toHaveBeenCalledWith()
        expect(retrieveCtorSpy)
          .toHaveBeenCalledWith(expected)
        expect(registerDeclaredCtorSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('to returns existing Ctor', () => {
      const BaseAlpha = class {}
      const BaseAppBeta = class {}
      const BaseExtraGamma = class {}
      const BaseSpecialDelta = class {}

      const BaseFirstAlpha = class extends BaseAlpha {}
      const BaseSecondAlpha = class extends BaseAlpha {}
      const BaseAppThirdBeta = class extends BaseAppBeta {}
      const BaseAppFourthBeta = class extends BaseAppBeta {}
      const BaseExtraFifthGamma = class extends BaseExtraGamma {}
      const BaseExtraSixthGamma = class extends BaseExtraGamma {}
      const BaseSpecialSeventhDelta = class extends BaseSpecialDelta {}
      const BaseSpecialEighthDelta = class extends BaseSpecialDelta {}

      const inputCases = [
        {
          input: {
            SuperCtor: BaseAlpha,
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['BaseFirstAlpha', BaseFirstAlpha],
                ['BaseSecondAlpha', BaseSecondAlpha],
              ]),
            }),
            fixedPrefix: 'Base',
          },
          cases: [
            {
              givenPrefix: 'First',
              expected: {
                retrieveCtorArgs: {
                  className: 'BaseFirstAlpha',
                },
                Ctor: BaseFirstAlpha,
              },
            },
            {
              givenPrefix: 'Second',
              expected: {
                retrieveCtorArgs: {
                  className: 'BaseSecondAlpha',
                },
                Ctor: BaseSecondAlpha,
              },
            },
          ],
        },
        {
          input: {
            SuperCtor: BaseAppBeta,
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['BaseAppThirdBeta', BaseAppThirdBeta],
                ['BaseAppFourthBeta', BaseAppFourthBeta],
              ]),
            }),
            fixedPrefix: 'BaseApp',
          },
          cases: [
            {
              givenPrefix: 'Third',
              expected: {
                retrieveCtorArgs: {
                  className: 'BaseAppThirdBeta',
                },
                Ctor: BaseAppThirdBeta,
              },
            },
            {
              givenPrefix: 'Fourth',
              expected: {
                retrieveCtorArgs: {
                  className: 'BaseAppFourthBeta',
                },
                Ctor: BaseAppFourthBeta,
              },
            },
          ],
        },
        {
          input: {
            SuperCtor: BaseExtraGamma,
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['BaseExtraFifthGamma', BaseExtraFifthGamma],
                ['BaseExtraSixthGamma', BaseExtraSixthGamma],
              ]),
            }),
            fixedPrefix: 'BaseExtra',
          },
          cases: [
            {
              givenPrefix: 'Fifth',
              expected: {
                retrieveCtorArgs: {
                  className: 'BaseExtraFifthGamma',
                },
                Ctor: BaseExtraFifthGamma,
              },
            },
            {
              givenPrefix: 'Sixth',
              expected: {
                retrieveCtorArgs: {
                  className: 'BaseExtraSixthGamma',
                },
                Ctor: BaseExtraSixthGamma,
              },
            },
          ],
        },
        {
          input: {
            SuperCtor: BaseSpecialDelta,
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['BaseSpecialSeventhDelta', BaseSpecialSeventhDelta],
                ['BaseSpecialEighthDelta', BaseSpecialEighthDelta],
              ]),
            }),
            fixedPrefix: 'BaseSpecial',
          },
          cases: [
            {
              givenPrefix: 'Seventh',
              expected: {
                retrieveCtorArgs: {
                  className: 'BaseSpecialSeventhDelta',
                },
                Ctor: BaseSpecialSeventhDelta,
              },
            },
            {
              givenPrefix: 'Eighth',
              expected: {
                retrieveCtorArgs: {
                  className: 'BaseSpecialEighthDelta',
                },
                Ctor: BaseSpecialEighthDelta,
              },
            },
          ],
        },
      ]

      describe.each(inputCases)('fixedPrefix: $input.fixedPrefix', ({ input, cases }) => {
        const registry = BaseDerivedCtorRegistry.create(input)

        test.each(cases)('givenPrefix: $givenPrefix', ({ givenPrefix, expected }) => {
          jest.spyOn(registry, 'generatePrefix')
            .mockReturnValue(givenPrefix)

          const generateClassNameSpy = jest.spyOn(registry, 'generateClassName')
          const retrieveCtorSpy = jest.spyOn(registry, 'retrieveCtor')
          const registerDeclaredCtorSpy = jest.spyOn(registry, 'registerDeclaredCtor')

          const actual = registry.obtainCtor()

          expect(actual)
            .toBe(expected.Ctor) // same reference

          expect(generateClassNameSpy)
            .toHaveBeenCalledWith()
          expect(retrieveCtorSpy)
            .toHaveBeenCalledWith(expected.retrieveCtorArgs)
          expect(registerDeclaredCtorSpy)
            .not
            .toHaveBeenCalled()
        })
      })
    })
  })
})

describe('BaseDerivedCtorRegistry', () => {
  describe('#generateClassName()', () => {
    const mockDynamicDerivedCtorPool = DynamicDerivedCtorPool.create()

    const BaseAlpha = class {}
    const BaseAppBeta = class {}
    const BaseExtraGamma = class {}
    const BaseSpecialDelta = class {}

    const inputCases = [
      {
        input: {
          SuperCtor: BaseAlpha,
          pool: mockDynamicDerivedCtorPool,
          fixedPrefix: 'Base',
        },
        cases: [
          {
            givenPrefix: 'First',
            expected: 'BaseFirstAlpha',
          },
          {
            givenPrefix: 'Second',
            expected: 'BaseSecondAlpha',
          },
        ],
      },
      {
        input: {
          SuperCtor: BaseAppBeta,
          pool: mockDynamicDerivedCtorPool,
          fixedPrefix: 'BaseApp',
        },
        cases: [
          {
            givenPrefix: 'Third',
            expected: 'BaseAppThirdBeta',
          },
          {
            givenPrefix: 'Fourth',
            expected: 'BaseAppFourthBeta',
          },
        ],
      },
      {
        input: {
          SuperCtor: BaseExtraGamma,
          pool: mockDynamicDerivedCtorPool,
          fixedPrefix: 'BaseExtra',
        },
        cases: [
          {
            givenPrefix: 'Fifth',
            expected: 'BaseExtraFifthGamma',
          },
          {
            givenPrefix: 'Sixth',
            expected: 'BaseExtraSixthGamma',
          },
        ],
      },
      {
        input: {
          SuperCtor: BaseSpecialDelta,
          pool: mockDynamicDerivedCtorPool,
          fixedPrefix: 'BaseSpecial',
        },
        cases: [
          {
            givenPrefix: 'Seventh',
            expected: 'BaseSpecialSeventhDelta',
          },
          {
            givenPrefix: 'Eighth',
            expected: 'BaseSpecialEighthDelta',
          },
        ],
      },
    ]

    describe.each(inputCases)('fixedPrefix: $input.fixedPrefix', ({ input, cases }) => {
      const registry = BaseDerivedCtorRegistry.create(input)

      test.each(cases)('givenPrefix: $givenPrefix', ({ givenPrefix, expected }) => {
        jest.spyOn(registry, 'generatePrefix')
          .mockReturnValue(givenPrefix)

        const actual = registry.generateClassName()

        expect(actual)
          .toBe(expected)
      })
    })
  })
})

describe('BaseDerivedCtorRegistry', () => {
  describe('#registerDeclaredCtor()', () => {
    const mockDynamicDerivedCtorPool = DynamicDerivedCtorPool.create()

    const BaseAlpha = class {}
    const BaseAppBeta = class {}
    const BaseExtraGamma = class {}
    const BaseSpecialDelta = class {}

    const inputCases = [
      {
        input: {
          SuperCtor: BaseAlpha,
          pool: mockDynamicDerivedCtorPool,
          fixedPrefix: 'Base',
        },
        cases: [
          {
            className: 'BaseFirstAlpha',
            tallyCtor: class extends BaseAlpha {},
          },
          {
            className: 'BaseSecondAlpha',
            tallyCtor: class extends BaseAlpha {},
          },
        ],
      },
      {
        input: {
          SuperCtor: BaseAppBeta,
          pool: mockDynamicDerivedCtorPool,
          fixedPrefix: 'BaseApp',
        },
        cases: [
          {
            className: 'BaseAppThirdBeta',
            tallyCtor: class extends BaseAppBeta {},
          },
          {
            className: 'BaseAppFourthBeta',
            tallyCtor: class extends BaseAppBeta {},
          },
        ],
      },
      {
        input: {
          SuperCtor: BaseExtraGamma,
          pool: mockDynamicDerivedCtorPool,
          fixedPrefix: 'BaseExtra',
        },
        cases: [
          {
            className: 'BaseExtraFifthGamma',
            tallyCtor: class extends BaseExtraGamma {},
          },
          {
            className: 'BaseExtraSixthGamma',
            tallyCtor: class extends BaseExtraGamma {},
          },
        ],
      },
      {
        input: {
          SuperCtor: BaseSpecialDelta,
          pool: mockDynamicDerivedCtorPool,
          fixedPrefix: 'BaseSpecial',
        },
        cases: [
          {
            className: 'BaseSpecialSeventhDelta',
            tallyCtor: class extends BaseSpecialDelta {},
          },
          {
            className: 'BaseSpecialEighthDelta',
            tallyCtor: class extends BaseSpecialDelta {},
          },
        ],
      },
    ]

    describe.each(inputCases)('fixedPrefix: $input.fixedPrefix', ({ input, cases }) => {
      const registry = BaseDerivedCtorRegistry.create(input)

      test.each(cases)('className: $className', ({ className, tallyCtor }) => {
        jest.spyOn(registry, 'declareCtor')
          .mockReturnValue(tallyCtor)
        const retrieveCtorSpy = jest.spyOn(registry.pool, 'registerCtor')

        const args = {
          className,
        }
        const expectedArgs = {
          name: className,
          Ctor: tallyCtor,
        }

        const actual = registry.registerDeclaredCtor(args)

        expect(actual)
          .toBe(tallyCtor)

        expect(retrieveCtorSpy)
          .toHaveBeenCalledWith(expectedArgs)
      })
    })
  })
})

describe('BaseDerivedCtorRegistry', () => {
  describe('#generatePrefix()', () => {
    describe('to throw an error', () => {
      const mockDynamicDerivedCtorPool = DynamicDerivedCtorPool.create()

      const BaseAlpha = class {}
      const BaseAppBeta = class {}
      const BaseExtraGamma = class {}
      const BaseSpecialDelta = class {}

      const cases = [
        {
          input: {
            SuperCtor: BaseAlpha,
            pool: mockDynamicDerivedCtorPool,
            fixedPrefix: 'Base',
          },
        },
        {
          input: {
            SuperCtor: BaseAppBeta,
            pool: mockDynamicDerivedCtorPool,
            fixedPrefix: 'BaseApp',
          },
        },
        {
          input: {
            SuperCtor: BaseExtraGamma,
            pool: mockDynamicDerivedCtorPool,
            fixedPrefix: 'BaseExtra',
          },
        },
        {
          input: {
            SuperCtor: BaseSpecialDelta,
            pool: mockDynamicDerivedCtorPool,
            fixedPrefix: 'BaseSpecial',
          },
        },
      ]

      test.each(cases)('fixedPrefix: $input.fixedPrefix', ({ input }) => {
        const expected = 'this feature must be inherited'

        const registry = BaseDerivedCtorRegistry.create(input)

        expect(() => registry.generatePrefix())
          .toThrow(expected)
      })
    })
  })
})

describe('BaseDerivedCtorRegistry', () => {
  describe('#retrieveCtor()', () => {
    describe('to returns existing Ctor', () => {
      const BaseAlpha = class {}
      const BaseAppBeta = class {}
      const BaseExtraGamma = class {}
      const BaseSpecialDelta = class {}

      const BaseFirstAlpha = class extends BaseAlpha {}
      const BaseSecondAlpha = class extends BaseAlpha {}
      const BaseAppThirdBeta = class extends BaseAppBeta {}
      const BaseAppFourthBeta = class extends BaseAppBeta {}
      const BaseExtraFifthGamma = class extends BaseExtraGamma {}
      const BaseExtraSixthGamma = class extends BaseExtraGamma {}
      const BaseSpecialSeventhDelta = class extends BaseSpecialDelta {}
      const BaseSpecialEighthDelta = class extends BaseSpecialDelta {}

      const inputCases = [
        {
          input: {
            SuperCtor: BaseAlpha,
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['BaseFirstAlpha', BaseFirstAlpha],
                ['BaseSecondAlpha', BaseSecondAlpha],
              ]),
            }),
            fixedPrefix: 'Base',
          },
          cases: [
            {
              className: 'BaseFirstAlpha',
              expected: BaseFirstAlpha,
            },
            {
              className: 'BaseSecondAlpha',
              expected: BaseSecondAlpha,
            },
          ],
        },
        {
          input: {
            SuperCtor: BaseAppBeta,
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['BaseAppThirdBeta', BaseAppThirdBeta],
                ['BaseAppFourthBeta', BaseAppFourthBeta],
              ]),
            }),
            fixedPrefix: 'BaseApp',
          },
          cases: [
            {
              className: 'BaseAppThirdBeta',
              expected: BaseAppThirdBeta,
            },
            {
              className: 'BaseAppFourthBeta',
              expected: BaseAppFourthBeta,
            },
          ],
        },
        {
          input: {
            SuperCtor: BaseExtraGamma,
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['BaseExtraFifthGamma', BaseExtraFifthGamma],
                ['BaseExtraSixthGamma', BaseExtraSixthGamma],
              ]),
            }),
            fixedPrefix: 'BaseExtra',
          },
          cases: [
            {
              className: 'BaseExtraFifthGamma',
              expected: BaseExtraFifthGamma,
            },
            {
              className: 'BaseExtraSixthGamma',
              expected: BaseExtraSixthGamma,
            },
          ],
        },
        {
          input: {
            SuperCtor: BaseSpecialDelta,
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['BaseSpecialSeventhDelta', BaseSpecialSeventhDelta],
                ['BaseSpecialEighthDelta', BaseSpecialEighthDelta],
              ]),
            }),
            fixedPrefix: 'BaseSpecial',
          },
          cases: [
            {
              className: 'BaseSpecialSeventhDelta',
              expected: BaseSpecialSeventhDelta,
            },
            {
              className: 'BaseSpecialEighthDelta',
              expected: BaseSpecialEighthDelta,
            },
          ],
        },
      ]

      describe.each(inputCases)('fixedPrefix: $input.fixedPrefix', ({ input, cases }) => {
        const registry = BaseDerivedCtorRegistry.create(input)

        test.each(cases)('className: $className', ({ className, expected }) => {
          const args = {
            className,
          }

          const actual = registry.retrieveCtor(args)

          expect(actual)
            .toBe(expected)
        })
      })
    })

    describe('to be null', () => {
      const BaseAlpha = class {}
      const BaseAppBeta = class {}
      const BaseExtraGamma = class {}
      const BaseSpecialDelta = class {}

      const BaseFirstAlpha = class extends BaseAlpha {}
      const BaseSecondAlpha = class extends BaseAlpha {}
      const BaseAppThirdBeta = class extends BaseAppBeta {}
      const BaseAppFourthBeta = class extends BaseAppBeta {}
      const BaseExtraFifthGamma = class extends BaseExtraGamma {}
      const BaseExtraSixthGamma = class extends BaseExtraGamma {}
      const BaseSpecialSeventhDelta = class extends BaseSpecialDelta {}
      const BaseSpecialEighthDelta = class extends BaseSpecialDelta {}

      const inputCases = [
        {
          input: {
            SuperCtor: BaseAlpha,
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['BaseFirstAlpha', BaseFirstAlpha],
                ['BaseSecondAlpha', BaseSecondAlpha],
              ]),
            }),
            fixedPrefix: 'Base',
          },
          cases: [
            {
              className: 'BaseUnknownAlpha',
            },
            {
              className: 'BaseNoneAlpha',
            },
          ],
        },
        {
          input: {
            SuperCtor: BaseAppBeta,
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['BaseAppThirdBeta', BaseAppThirdBeta],
                ['BaseAppFourthBeta', BaseAppFourthBeta],
              ]),
            }),
            fixedPrefix: 'BaseApp',
          },
          cases: [
            {
              className: 'BaseAppUnknownBeta',
            },
            {
              className: 'BaseAppNoneBeta',
            },
          ],
        },
        {
          input: {
            SuperCtor: BaseExtraGamma,
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['BaseExtraFifthGamma', BaseExtraFifthGamma],
                ['BaseExtraSixthGamma', BaseExtraSixthGamma],
              ]),
            }),
            fixedPrefix: 'BaseExtra',
          },
          cases: [
            {
              className: 'BaseExtraUnknownGamma',
            },
            {
              className: 'BaseExtraNoneGamma',
            },
          ],
        },
        {
          input: {
            SuperCtor: BaseSpecialDelta,
            pool: DynamicDerivedCtorPool.create({
              pool: new Map([
                ['BaseSpecialSeventhDelta', BaseSpecialSeventhDelta],
                ['BaseSpecialEighthDelta', BaseSpecialEighthDelta],
              ]),
            }),
            fixedPrefix: 'BaseSpecial',
          },
          cases: [
            {
              className: 'BaseSpecialUnknownDelta',
            },
            {
              className: 'BaseSpecialNoneDelta',
            },
          ],
        },
      ]

      describe.each(inputCases)('fixedPrefix: $input.fixedPrefix', ({ input, cases }) => {
        const registry = BaseDerivedCtorRegistry.create(input)

        test.each(cases)('className: $className', ({ className }) => {
          const args = {
            className,
          }

          const actual = registry.retrieveCtor(args)

          expect(actual)
            .toBeNull()
        })
      })
    })
  })
})

describe('BaseDerivedCtorRegistry', () => {
  describe('#registerDeclaredCtor()', () => {
    describe('to returns new Derived Ctor', () => {
      const BaseAlpha = class {}
      const BaseAppBeta = class {}

      const BaseFirstAlpha = class extends BaseAlpha {}
      const BaseSecondAlpha = class extends BaseAlpha {}

      const BaseAppThirdBeta = class extends BaseAppBeta {}
      const BaseAppFourthBeta = class extends BaseAppBeta {}

      const inputCases = [
        {
          input: {
            SuperCtor: BaseAlpha,
            fixedPrefix: 'Base',
            pool: DynamicDerivedCtorPool.create({
              pool: new Map(), // Start with empty pool
            }),
          },
          cases: [
            {
              className: 'BaseFirstAlpha',
              tallyCtor: BaseFirstAlpha,
            },
            {
              className: 'BaseSecondAlpha',
              tallyCtor: BaseSecondAlpha,
            },
          ],
        },
        {
          input: {
            SuperCtor: BaseAppBeta,
            fixedPrefix: 'BaseApp',
            pool: DynamicDerivedCtorPool.create({
              pool: new Map(), // Start with empty pool
            }),
          },
          cases: [
            {
              className: 'BaseAppThirdBeta',
              tallyCtor: BaseAppThirdBeta,
            },
            {
              className: 'BaseAppFourthBeta',
              tallyCtor: BaseAppFourthBeta,
            },
          ],
        },
      ]

      describe.each(inputCases)('fixedPrefix: $input.fixedPrefix', ({ input, cases }) => {
        const registry = BaseDerivedCtorRegistry.create(input)

        test.each(cases)('className: $className', ({ className, tallyCtor }) => {
          const expectedArgs = {
            name: className,
            Ctor: tallyCtor,
          }

          jest.spyOn(registry, 'declareCtor')
            .mockReturnValue(tallyCtor)

          const registerCtorSpy = jest.spyOn(registry.pool, 'registerCtor')

          const args = {
            className,
          }

          const actual = registry.registerDeclaredCtor(args)

          expect(actual)
            .toBe(tallyCtor) // same reference

          expect(registerCtorSpy)
            .toHaveBeenCalledWith(expectedArgs)
        })
      })
    })
  })
})

describe('BaseDerivedCtorRegistry', () => {
  describe('#declareCtor()', () => {
    describe('to throw an error', () => {
      const mockDynamicDerivedCtorPool = DynamicDerivedCtorPool.create()

      const BaseAlpha = class {}
      const BaseAppBeta = class {}
      const BaseExtraGamma = class {}
      const BaseSpecialDelta = class {}

      const cases = [
        {
          input: {
            SuperCtor: BaseAlpha,
            pool: mockDynamicDerivedCtorPool,
            fixedPrefix: 'Base',
          },
        },
        {
          input: {
            SuperCtor: BaseAppBeta,
            pool: mockDynamicDerivedCtorPool,
            fixedPrefix: 'BaseApp',
          },
        },
        {
          input: {
            SuperCtor: BaseExtraGamma,
            pool: mockDynamicDerivedCtorPool,
            fixedPrefix: 'BaseExtra',
          },
        },
        {
          input: {
            SuperCtor: BaseSpecialDelta,
            pool: mockDynamicDerivedCtorPool,
            fixedPrefix: 'BaseSpecial',
          },
        },
      ]

      test.each(cases)('fixedPrefix: $input.fixedPrefix', ({ input }) => {
        const expected = 'this feature must be inherited'

        const registry = BaseDerivedCtorRegistry.create(input)

        expect(() => registry.declareCtor())
          .toThrow(expected)
      })
    })
  })
})
