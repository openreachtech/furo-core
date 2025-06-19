import DerivedClassNameGenerator from '../../../../lib/tools/DerivedClassNameGenerator.js'

describe('DerivedClassNameGenerator', () => {
  describe('constructor', () => {
    describe('to keep properties', () => {
      describe('#className', () => {
        const cases = [
          {
            input: {
              className: 'BaseAlpha',
            },
          },
          {
            input: {
              className: 'BaseBeta',
            },
          },
        ]

        test.each(cases)('to be $input.className', ({ input }) => {
          const args = {
            className: input.className,
            fixedPrefix: '',
          }

          const generator = new DerivedClassNameGenerator(args)

          expect(generator)
            .toHaveProperty('className', input.className)
        })
      })

      describe('#fixedPrefix', () => {
        const cases = [
          {
            input: {
              fixedPrefix: 'Base',
            },
          },
          {
            input: {
              fixedPrefix: 'BaseApp',
            },
          },
        ]

        test.each(cases)('to be $input.fixedPrefix', ({ input }) => {
          const args = {
            className: 'BaseOmega',
            fixedPrefix: input.fixedPrefix,
          }

          const generator = new DerivedClassNameGenerator(args)

          expect(generator)
            .toHaveProperty('fixedPrefix', input.fixedPrefix)
        })
      })
    })
  })
})

describe('DerivedClassNameGenerator', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      const cases = [
        {
          input: {
            className: 'BaseAlpha',
            fixedPrefix: 'Base',
          },
        },
        {
          input: {
            className: 'BaseAppBeta',
            fixedPrefix: 'BaseApp',
          },
        },
        {
          input: {
            className: 'Omega',
            fixedPrefix: '',
          },
        },
      ]

      test.each(cases)('className: $input.className', ({ input }) => {
        const generator = DerivedClassNameGenerator.create(input)

        expect(generator)
          .toBeInstanceOf(DerivedClassNameGenerator)
      })
    })

    describe('to call constructor', () => {
      describe('with full parameters', () => {
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
          const SpyClass = globalThis.constructorSpy.spyOn(DerivedClassNameGenerator)

          SpyClass.create(input)

          expect(SpyClass.__spy__)
            .toHaveBeenCalledWith(expected)
        })
      })

      describe('with omitted parameters', () => {
        const cases = [
          {
            input: {
              className: 'BaseAlpha',
            },
            expected: {
              className: 'BaseAlpha',
              fixedPrefix: '',
            },
          },
          {
            input: {
              className: 'BaseAppBeta',
            },
            expected: {
              className: 'BaseAppBeta',
              fixedPrefix: '',
            },
          },
        ]

        test.each(cases)('className: $input.className', ({ input, expected }) => {
          const SpyClass = globalThis.constructorSpy.spyOn(DerivedClassNameGenerator)

          SpyClass.create(input)

          expect(SpyClass.__spy__)
            .toHaveBeenCalledWith(expected)
        })
      })
    })
  })
})

describe('DerivedClassNameGenerator', () => {
  describe('#generateClassName()', () => {
    const classNameCases = [
      {
        input: {
          className: 'BaseAlpha',
        },
        fixedPrefixCases: [
          {
            fixedPrefix: 'Base',
            cases: [
              { prefix: 'Get', expected: 'BaseGetAlpha' },
              { prefix: 'Post', expected: 'BasePostAlpha' },
              { prefix: '', expected: 'BaseAlpha' },
            ],
          },
          {
            fixedPrefix: '',
            cases: [
              { prefix: 'Get', expected: 'GetBaseAlpha' },
              { prefix: 'Post', expected: 'PostBaseAlpha' },
              { prefix: '', expected: 'BaseAlpha' },
            ],
          },
        ],
      },
      {
        input: {
          className: 'BaseAppBeta',
        },
        fixedPrefixCases: [
          {
            fixedPrefix: 'BaseApp',
            cases: [
              { prefix: 'Get', expected: 'BaseAppGetBeta' },
              { prefix: 'Post', expected: 'BaseAppPostBeta' },
              { prefix: '', expected: 'BaseAppBeta' },
            ],
          },
          {
            fixedPrefix: 'Base',
            cases: [
              { prefix: 'Get', expected: 'BaseGetAppBeta' },
              { prefix: 'Post', expected: 'BasePostAppBeta' },
              { prefix: '', expected: 'BaseAppBeta' },
            ],
          },
          {
            fixedPrefix: '',
            cases: [
              { prefix: 'Get', expected: 'GetBaseAppBeta' },
              { prefix: 'Post', expected: 'PostBaseAppBeta' },
              { prefix: '', expected: 'BaseAppBeta' },
            ],
          },
        ],
      },
    ]

    describe.each(classNameCases)('className: $input.className', ({ input, fixedPrefixCases }) => {
      describe.each(fixedPrefixCases)('fixedPrefix: $fixedPrefix', ({ fixedPrefix, cases }) => {
        const generator = DerivedClassNameGenerator.create({
          className: input.className,
          fixedPrefix,
        })

        test.each(cases)('prefix: $prefix', ({ prefix, expected }) => {
          const actual = generator.generateClassName({
            prefix,
          })

          expect(actual)
            .toBe(expected)
        })
      })
    })
  })
})
