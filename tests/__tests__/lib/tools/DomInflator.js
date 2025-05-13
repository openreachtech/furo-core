import {
  ConstructorSpy,
} from '@openreachtech/jest-constructor-spy'

import DomInflator from '~/lib/tools/DomInflator.js'

describe('DomInflator', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      describe('#html', () => {
        const cases = [
          {
            args: {
              html: '<div>alpha</div>',
            },
          },
          {
            args: {
              html: '<div>beta</div>',
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args }) => {
          const actual = new DomInflator(args)

          expect(actual)
            .toHaveProperty('html', args.html)
        })
      })
    })
  })
})

describe('DomInflator', () => {
  describe('.create()', () => {
    const cases = [
      {
        args: {
          html: '<div>alpha</div>',
        },
      },
      {
        args: {
          html: '<div>beta</div>',
        },
      },
    ]

    describe('to create an instance of own class', () => {
      test.each(cases)('html: $args.html', ({ args }) => {
        const actual = DomInflator.create(args)

        expect(actual)
          .toBeInstanceOf(DomInflator)
      })
    })

    describe('to call constructor', () => {
      test.each(cases)('html: $args.html', ({ args }) => {
        const SpyClass = ConstructorSpy.create({ jest })
          .spyOn(DomInflator)

        SpyClass.create(args)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(args)
      })
    })
  })
})

describe('DomInflator', () => {
  describe('.get:htmlDocument', () => {
    test('to be fixed value', () => {
      const actual = DomInflator.htmlDocument

      expect(actual)
        .toBe(window.document) // same reference
    })
  })
})

describe('DomInflator', () => {
  describe('#get:Ctor', () => {
    const cases = [
      {
        args: {
          html: '<div>alpha</div>',
        },
      },
      {
        args: {
          html: '<div>beta</div>',
        },
      },
    ]

    test.each(cases)('html: $args.html', ({ args }) => {
      const actual = new DomInflator(args)

      expect(actual.Ctor)
        .toBe(DomInflator) // same reference
    })
  })
})

describe('DomInflator', () => {
  describe('#inflateElements()', () => {
    const cases = [
      {
        args: {
          html: '<div>alpha</div>',
        },
        expected: [
          expect.any(HTMLDivElement),
        ],
      },
      {
        args: {
          html: '<span>beta</span>',
        },
        expected: [
          expect.any(HTMLSpanElement),
        ],
      },
    ]

    test.each(cases)('html: $args.html', ({ args, expected }) => {
      const actual = new DomInflator(args)

      const elements = actual.inflateElements()

      expect(elements)
        .toEqual(expected)
    })
  })
})
