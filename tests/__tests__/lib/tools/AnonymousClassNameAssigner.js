import AnonymousClassNameAssigner from '~/lib/tools/AnonymousClassNameAssigner.js'

describe('AnonymousClassNameAssigner', () => {
  describe('constructor', () => {
    describe('to keep properties', () => {
      class BaseClass {}

      describe('#AnonymousCtor', () => {
        const cases = [
          {
            name: 'extended anonymous class',
            input: {
              AnonymousCtor: class extends BaseClass {},
            },
          },
          {
            name: 'simple anonymous class',
            input: {
              AnonymousCtor: class {},
            },
          },
        ]

        test.each(cases)('$name', ({ input }) => {
          const generator = new AnonymousClassNameAssigner(input)

          expect(generator)
            .toHaveProperty('AnonymousCtor', input.AnonymousCtor)
        })
      })
    })
  })
})

describe('AnonymousClassNameAssigner', () => {
  describe('.create()', () => {
    class BaseClass {}

    const cases = [
      {
        name: 'extended anonymous class',
        input: {
          AnonymousCtor: class extends BaseClass {},
        },
      },
      {
        name: 'simple anonymous class',
        input: {
          AnonymousCtor: class {},
        },
      },
    ]

    describe('to be instance of own class', () => {
      test.each(cases)('$name', ({ input }) => {
        const generator = AnonymousClassNameAssigner.create(input)

        expect(generator)
          .toBeInstanceOf(AnonymousClassNameAssigner)
      })
    })

    describe('to call constructor', () => {
      test.each(cases)('$name', ({ input }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(AnonymousClassNameAssigner)

        SpyClass.create(input)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(input)
      })
    })
  })
})

describe('AnonymousClassNameAssigner', () => {
  describe('#assignClassName()', () => {
    class BaseClass {}

    const classCases = [
      {
        name: 'extended anonymous class',
        input: {
          declareAnonymousCtor: () => class extends BaseClass {},
        },
        cases: [
          { className: 'Alpha' },
          { className: 'Beta' },
          { className: 'Gamma' },
        ],
      },
      {
        name: 'simple anonymous class',
        input: {
          declareAnonymousCtor: () => class {},
        },
        cases: [
          { className: 'First' },
          { className: 'Second' },
          { className: 'Third' },
        ],
      },
    ]

    describe.each(classCases)('$name', ({ input, cases }) => {
      const assigner = AnonymousClassNameAssigner.create({
        AnonymousCtor: input.declareAnonymousCtor(),
      })

      test.each(cases)('className: $className', ({ className }) => {
        const actual = assigner.assignClassName({
          name: className,
        })

        expect(actual)
          .toHaveProperty('name', className)
      })
    })
  })
})
