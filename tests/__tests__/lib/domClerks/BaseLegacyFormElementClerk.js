import {
  ConstructorSpy,
} from '@openreachtech/jest-constructor-spy'

import BaseLegacyFormElementClerk from '~/lib/domClerks/BaseLegacyFormElementClerk.js'

describe('BaseLegacyFormElementClerk', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      describe('#formElement', () => {
        const cases = [
          {
            args: {
              formElement: document.createElement('form'),
            },
          },
        ]

        test.each(cases)('formElement: $args.formElement', ({ args }) => {
          const instance = new BaseLegacyFormElementClerk(args)

          expect(instance)
            .toHaveProperty('formElement', args.formElement)
        })
      })
    })
  })
})

describe('BaseLegacyFormElementClerk', () => {
  describe('.create()', () => {
    describe('to create an instance of own class', () => {
      const cases = [
        {
          args: {
            formElement: document.createElement('form'),
          },
        },
      ]

      test.each(cases)('formElement: $args.formElement', ({ args }) => {
        const instance = BaseLegacyFormElementClerk.create(args)

        expect(instance)
          .toBeInstanceOf(BaseLegacyFormElementClerk)
      })
    })

    describe('to call constructor', () => {
      const cases = [
        {
          args: {
            formElement: document.createElement('form'),
          },
        },
      ]

      test.each(cases)('formElement: $args.formElement', ({ args }) => {
        const DerivedClass = ConstructorSpy.create({ jest })
          .spyOn(BaseLegacyFormElementClerk)

        DerivedClass.create(args)

        expect(DerivedClass.__spy__)
          .toHaveBeenCalledWith(args)
      })
    })
  })
})

describe('BaseLegacyFormElementClerk', () => {
  describe('.get:rules', () => {
    test('to return fixed value', () => {
      const actual = BaseLegacyFormElementClerk.rules

      expect(actual)
        .toBeInstanceOf(Array)
      expect(actual)
        .toHaveLength(0)
    })
  })
})

describe('BaseLegacyFormElementClerk', () => {
  describe('#isValid()', () => {
    /**
     * @extends {BaseLegacyFormElementClerk<typeof TestFormElementClerk, *, *>}
     */
    class TestFormElementClerk extends BaseLegacyFormElementClerk {
      /** @override */
      static get rules () {
        return [
          {
            field: 'alpha',
            message: 'alpha message',
            ok: () => true,
          },
          {
            field: 'beta',
            message: 'beta message',
            ok: () => true,
          },
        ]
      }
    }

    const formElement = document.createElement('form')

    describe('to be truthy', () => {
      /**
       * @type {Array<{
       *   args: {
       *     validationHash: furo.ValidatorHashType
       *   }
       * }>}
       */
      const cases = [
        {
          args: {
            validationHash: {
              valid: {
                alpha: true,
                beta: true,
              },
              invalid: {
                alpha: false,
                beta: false,
              },
              messages: {
                alpha: [],
                beta: [],
              },
              message: {
                alpha: null,
                beta: null,
              },
            },
          },
        },
        {
          args: {
            validationHash: {
              valid: {
                alpha: true,
              },
              invalid: {
                alpha: false,
              },
              messages: {
                alpha: [],
              },
              message: {
                alpha: null,
              },
            },
          },
        },
        {
          args: {
            validationHash: {
              valid: {},
              invalid: {},
              messages: {},
              message: {},
            },
          },
        },
      ]

      test.each(cases)('valid: $args.validationHash.valid', ({ args }) => {
        const formElementClerk = TestFormElementClerk.create({
          formElement,
        })

        const generateValidationHashSpy = jest.spyOn(formElementClerk, 'generateValidationHash')
          .mockReturnValue(args.validationHash)

        const actual = formElementClerk.isValid()

        expect(actual)
          .toBeTruthy()

        generateValidationHashSpy.mockRestore()
      })
    })

    describe('to be falsy', () => {
      /**
       * @type {Array<{
       *   args: {
       *     validationHash: furo.ValidatorHashType
       *   }
       * }>}
       */
      const cases = [
        {
          args: {
            validationHash: {
              valid: {
                alpha: false,
                beta: true,
              },
              invalid: {
                alpha: true,
                beta: false,
              },
              messages: {
                alpha: [
                  'alpha message',
                ],
                beta: [],
              },
              message: {
                alpha: 'alpha message',
                beta: null,
              },
            },
          },
        },
        {
          args: {
            validationHash: {
              valid: {
                alpha: true,
                beta: false,
              },
              invalid: {
                alpha: false,
                beta: true,
              },
              messages: {
                alpha: [],
                beta: [
                  'beta message',
                ],
              },
              message: {
                alpha: null,
                beta: 'beta message',
              },
            },
          },
        },
        {
          args: {
            validationHash: {
              valid: {
                alpha: false,
                beta: false,
              },
              invalid: {
                alpha: true,
                beta: true,
              },
              messages: {
                alpha: [
                  'alpha message',
                ],
                beta: [
                  'beta message',
                ],
              },
              message: {
                alpha: 'alpha message',
                beta: 'beta message',
              },
            },
          },
        },
      ]

      test.each(cases)('valid: $args.validationHash.valid', ({ args }) => {
        const formElementClerk = TestFormElementClerk.create({
          formElement,
        })

        const generateValidationHashSpy = jest.spyOn(formElementClerk, 'generateValidationHash')
          .mockReturnValue(args.validationHash)

        const actual = formElementClerk.isValid()

        expect(actual)
          .toBeFalsy()

        generateValidationHashSpy.mockRestore()
      })
    })
  })
})
