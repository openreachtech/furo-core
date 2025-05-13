import {
  ConstructorSpy,
} from '@openreachtech/jest-constructor-spy'

import FieldValidator from '~/lib/validator/FieldValidator.js'

describe('FieldValidator', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      describe('#field', () => {
        const cases = [
          {
            args: {
              field: 'customer',
            },
            expected: 'customer',
          },
          {
            args: {
              field: 'message',
            },
            expected: 'message',
          },
        ]

        test.each(cases)('field: $args.field', ({ args, expected }) => {
          const constructorArgs = {
            field: args.field,
            ok: () => true,
          }

          const actual = new FieldValidator(constructorArgs)

          expect(actual)
            .toHaveProperty('field', expected)
        })
      })

      describe('#okFunction', () => {
        const cases = [
          {
            args: {
              field: 'customer',
              ok: () => true,
            },
          },
          {
            args: {
              field: 'customer',
              ok: () => false,
            },
          },
        ]

        test.each(cases)('field: $args.field', ({ args }) => {
          const constructorArgs = {
            field: args.field,
            ok: args.ok,
          }

          const actual = new FieldValidator(constructorArgs)

          expect(actual)
            .toHaveProperty('okFunction', args.ok)
          expect(actual.okFunction)
            .toBe(args.ok) // same reference
        })
      })

      describe('#message', () => {
        const cases = [
          {
            args: {
              message: 'error message',
            },
            expected: 'error message',
          },
          {
            args: {
              message: 'error message-01',
            },
            expected: 'error message-01',
          },
        ]

        test.each(cases)('message: $args.message', ({ args, expected }) => {
          const constructorArgs = {
            field: 'extra',
            ok: () => true,
            message: args.message,
          }

          const actual = new FieldValidator(constructorArgs)

          expect(actual)
            .toHaveProperty('message', expected)
        })
      })
    })
  })
})

describe('FieldValidator', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      const cases = [
        {
          params: {
            field: 'customer',
            ok: () => true,
          },
        },
        {
          params: {
            field: 'message',
            ok: () => false,
          },
        },
      ]

      test.each(cases)('field: $params.field', ({ params }) => {
        const actual = FieldValidator.create(params)

        expect(actual)
          .toBeInstanceOf(FieldValidator)
      })
    })

    describe('to call constructor', () => {
      const cases = [
        {
          args: {
            field: 'customer',
            ok: () => true,
          },
        },
        {
          args: {
            field: 'message',
            ok: () => false,
          },
        },
      ]

      test.each(cases)('field: $args.field', ({ args }) => {
        const DerivedClass = ConstructorSpy.create({ jest })
          .spyOn(FieldValidator)

        DerivedClass.create(args)

        expect(DerivedClass.__spy__)
          .toHaveBeenCalledWith(args)
      })
    })
  })
})

describe('FieldValidator', () => {
  describe('#accepts()', () => {
    describe('to be truthy', () => {
      const cases = [
        {
          args: {
            field: 'customer',
            ok: () => true,
          },
          fieldCases: [
            { field: 'customer' },
          ],
        },
        {
          args: {
            field: 'message',
            ok: () => false,
          },
          fieldCases: [
            { field: 'message' },
          ],
        },
      ]

      describe.each(cases)('field: $args.field', ({ args, fieldCases }) => {
        const validator = FieldValidator.create(args)

        test.each(fieldCases)('field: $field', ({ field }) => {
          const actual = validator.accepts({ field })

          expect(actual)
            .toBeTruthy()
        })
      })
    })

    describe('to be falsy', () => {
      const cases = [
        {
          args: {
            field: 'customer',
            ok: () => true,
          },
          fieldCases: [
            { field: 'notCustomer' },
            { field: 'extraCustomer' },
          ],
        },
        {
          args: {
            field: 'message',
            ok: () => false,
          },
          fieldCases: [
            { field: 'notMessage' },
            { field: 'extraMessage' },
          ],
        },
      ]

      describe.each(cases)('field: $args.field', ({ args, fieldCases }) => {
        const validator = FieldValidator.create(args)

        test.each(fieldCases)('field: $field', ({ field }) => {
          const actual = validator.accepts({ field })

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('FieldValidator', () => {
  describe('#rejects()', () => {
    describe('to be truthy', () => {
      const cases = [
        {
          args: {
            field: 'customer',
            ok: () => true,
          },
          fieldCases: [
            { field: 'notCustomer' },
            { field: 'extraCustomer' },
          ],
        },
        {
          args: {
            field: 'message',
            ok: () => false,
          },
          fieldCases: [
            { field: 'notMessage' },
            { field: 'extraMessage' },
          ],
        },
      ]

      describe.each(cases)('field: $args.field', ({ args, fieldCases }) => {
        const validator = FieldValidator.create(args)

        test.each(fieldCases)('field: $field', ({ field }) => {
          const actual = validator.rejects({ field })

          expect(actual)
            .toBeTruthy()
        })
      })
    })

    describe('to be falsy', () => {
      const cases = [
        {
          args: {
            field: 'customer',
            ok: () => true,
          },
          fieldCases: [
            { field: 'customer' },
          ],
        },
        {
          args: {
            field: 'message',
            ok: () => false,
          },
          fieldCases: [
            { field: 'message' },
          ],
        },
      ]

      describe.each(cases)('field: $args.field', ({ args, fieldCases }) => {
        const validator = FieldValidator.create(args)

        test.each(fieldCases)('field: $field', ({ field }) => {
          const actual = validator.rejects({ field })

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('FieldValidator', () => {
  describe('#isValid()', () => {
    /**
     * @type {Array<{
     *   args: {
     *     field: string
     *     ok: (
     *       it: any,
     *       variables: {
     *         [key: string]: any
     *       }) => boolean
     *     message?: string | null
     *   }
     *   truthyCases: Array<{
     *     target: any
     *     variables: {
     *       [key: string]: any
     *     }
     *   }>
     *   falsyCases: Array<{
     *     target: any
     *     variables: {
     *       [key: string]: any
     *     }
     *   }>
     * }>} cases - Test cases.
     */
    const cases = [
      {
        args: {
          field: 'username',
          ok: (it, valueHash) => it,
        },
        truthyCases: [
          {
            target: 'alpha',
            variables: {},
          },
          {
            target: 'beta',
            variables: {},
          },
        ],
        falsyCases: [
          {
            target: '',
            variables: {},
          },
          {
            target: null,
            variables: {},
          },
          {
            target: undefined,
            variables: {},
          },
        ],
      },
      {
        args: {
          field: 'password',
          ok: (it, valueHash) =>
            it
            && it === valueHash.passwordConfirmation
          ,
        },
        truthyCases: [
          {
            target: 'alpha',
            variables: {
              passwordConfirmation: 'alpha',
            },
          },
          {
            target: 'beta',
            variables: {
              passwordConfirmation: 'beta',
            },
          },
        ],
        falsyCases: [
          {
            target: 'alpha',
            variables: {
              passwordConfirmation: 'notAlpha',
            },
          },
          {
            target: 'beta',
            variables: {
              passwordConfirmation: 'notBeta',
            },
          },
          {
            target: '',
            variables: {
              passwordConfirmation: '',
            },
          },
          {
            target: null,
            variables: {
              passwordConfirmation: null,
            },
          },
          {
            target: undefined,
            variables: {
              passwordConfirmation: undefined,
            },
          },
        ],
      },
    ]

    describe.each(cases)('field: $args.field', ({ args, truthyCases, falsyCases }) => {
      const validator = FieldValidator.create(args)

      describe('to be truthy', () => {
        test.each(truthyCases)('target: $target', ({ target, variables }) => {
          const actual = validator.isValid({
            target,
            variables,
          })

          expect(actual)
            .toBeTruthy()
        })
      })

      describe('to be falsy', () => {
        test.each(falsyCases)('target: $target', ({ target, variables }) => {
          const actual = validator.isValid({
            target,
            variables,
          })

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('FieldValidator', () => {
  describe('#isInvalid()', () => {
    /**
     * @type {Array<{
     *   args: {
     *     field: string
     *     ok: (
     *       it: any,
     *       variables: {
     *         [key: string]: any
     *       }) => boolean
     *     message?: string | null
     *   }
     *   truthyCases: Array<{
     *     target: any
     *     variables: {
     *       [key: string]: any
     *     }
     *   }>
     *   falsyCases: Array<{
     *     target: any
     *     variables: {
     *       [key: string]: any
     *     }
     *   }>
     * }>} cases - Test cases.
     */
    const cases = [
      {
        args: {
          field: 'username',
          ok: (it, valueHash) => it,
        },
        truthyCases: [
          {
            target: '',
            variables: {},
          },
          {
            target: null,
            variables: {},
          },
          {
            target: undefined,
            variables: {},
          },
        ],
        falsyCases: [
          {
            target: 'alpha',
            variables: {},
          },
          {
            target: 'beta',
            variables: {},
          },
        ],
      },
      {
        args: {
          field: 'password',
          ok: (it, valueHash) =>
            it
            && it === valueHash.passwordConfirmation
          ,
        },
        truthyCases: [
          {
            target: 'alpha',
            variables: {
              passwordConfirmation: 'notAlpha',
            },
          },
          {
            target: 'beta',
            variables: {
              passwordConfirmation: 'notBeta',
            },
          },
          {
            target: '',
            variables: {
              passwordConfirmation: '',
            },
          },
          {
            target: null,
            variables: {
              passwordConfirmation: null,
            },
          },
          {
            target: undefined,
            variables: {
              passwordConfirmation: undefined,
            },
          },
        ],
        falsyCases: [
          {
            target: 'alpha',
            variables: {
              passwordConfirmation: 'alpha',
            },
          },
          {
            target: 'beta',
            variables: {
              passwordConfirmation: 'beta',
            },
          },
        ],
      },
    ]

    describe.each(cases)('field: $args.field', ({ args, truthyCases, falsyCases }) => {
      const validator = FieldValidator.create(args)

      describe('to be truthy', () => {
        test.each(truthyCases)('target: $target', ({ target, variables }) => {
          const actual = validator.isInvalid({
            target,
            variables,
          })

          expect(actual)
            .toBeTruthy()
        })
      })

      describe('to be falsy', () => {
        test.each(falsyCases)('target: $target', ({ target, variables }) => {
          const actual = validator.isInvalid({
            target,
            variables,
          })

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('FieldValidator', () => {
  describe('#getMessage()', () => {
    describe('to return #message', () => {
      const cases = [
        {
          args: {
            field: 'username',
            ok: () => true,
            message: 'error message 01',
          },
          expected: 'error message 01',
        },
        {
          args: {
            field: 'password',
            ok: () => false,
            message: 'error message-02',
          },
          expected: 'error message-02',
        },
        {
          args: {
            field: 'gender',
            ok: () => false,
          },
          expected: null,
        },
      ]

      test.each(cases)('message: $args.message', ({ args, expected }) => {
        const validator = FieldValidator.create(args)

        const actual = validator.getMessage()

        expect(actual)
          .toBe(expected)
      })
    })
  })
})
