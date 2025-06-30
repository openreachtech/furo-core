import {
  ConstructorSpy,
} from '@openreachtech/jest-constructor-spy'

import ValueHashValidator from '~/lib/validator/ValueHashValidator.js'
import FieldValidator from '~/lib/validator/FieldValidator.js'

describe('ValueHashValidator', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      describe('#valueHash', () => {
        const cases = [
          {
            args: {
              valueHash: {
                username: 'Alice',
              },
            },
          },
          {
            args: {
              valueHash: {
                password: 'password$001',
              },
            },
          },
          {
            args: {
              valueHash: {
                email: 'info@example.com',
              },
            },
          },
        ]

        test.each(cases)('valueHash: $args.valueHash', ({ args }) => {
          const constructorArgs = {
            valueHash: args.valueHash,
            validators: [],
          }

          const actual = new ValueHashValidator(constructorArgs)

          expect(actual)
            .toHaveProperty('valueHash', args.valueHash)
          expect(actual.valueHash)
            .toBe(args.valueHash) // same reference
        })
      })

      describe('#validators', () => {
        const cases = [
          {
            args: {
              validators: [
                FieldValidator.create({
                  field: 'username',
                  ok: () => true,
                  message: 'error message 001',
                }),
                FieldValidator.create({
                  field: 'username',
                  ok: () => true,
                  message: 'error message 002',
                }),
              ],
            },
          },
          {
            args: {
              validators: [
                FieldValidator.create({
                  field: 'password',
                  ok: () => true,
                  message: 'error message 003',
                }),
                FieldValidator.create({
                  field: 'password',
                  ok: () => true,
                  message: 'error message 004',
                }),
              ],
            },
          },
          {
            args: {
              validators: [
                FieldValidator.create({
                  field: 'email',
                  ok: () => true,
                  message: 'error message 005',
                }),
                FieldValidator.create({
                  field: 'email',
                  ok: () => true,
                  message: 'error message 006',
                }),
              ],
            },
          },
          {
            args: {
              validators: [],
            },
          },
        ]

        test.each(cases)('message: $args.message', ({ args }) => {
          const constructorArgs = {
            valueHash: {
              password: 'password$001',
              email: 'info@example.com',
              bio: 'Here I am.',
            },
            validators: args.validators,
          }

          const actual = new ValueHashValidator(constructorArgs)

          expect(actual)
            .toHaveProperty('validators', args.validators)
          expect(actual.validators)
            .toBe(args.validators) // same reference
        })
      })
    })
  })
})

describe('ValueHashValidator', () => {
  describe('.create()', () => {
    const cases = [
      {
        args: {
          field: 'username',
          valueHash: {
            username: 'Alice',
          },
          rules: [
            {
              field: 'username',
              ok: () => true,
              message: 'error message 001',
            },
            {
              field: 'username',
              ok: () => true,
              message: 'error message 002',
            },
          ],
        },
        expected: {
          valueHash: {
            username: 'Alice',
          },
          validators: [
            FieldValidator.create({
              field: 'username',
              ok: expect.any(Function),
              message: 'error message 001',
            }),
            FieldValidator.create({
              field: 'username',
              ok: expect.any(Function),
              message: 'error message 002',
            }),
          ],
        },
      },
      {
        args: {
          field: 'password',
          valueHash: {
            password: 'password$001',
          },
          rules: [
            {
              field: 'password',
              ok: () => true,
              message: 'error message 003',
            },
            {
              field: 'password',
              ok: () => true,
              message: 'error message 004',
            },
          ],
        },
        expected: {
          valueHash: {
            password: 'password$001',
          },
          validators: [
            FieldValidator.create({
              field: 'password',
              ok: expect.any(Function),
              message: 'error message 003',
            }),
            FieldValidator.create({
              field: 'password',
              ok: expect.any(Function),
              message: 'error message 004',
            }),
          ],
        },
      },
      {
        args: {
          field: 'email',
          valueHash: {
            email: 'info@example.com',
          },
          rules: [
            {
              field: 'email',
              ok: () => true,
              message: 'error message 005',
            },
            {
              field: 'email',
              ok: () => true,
              message: 'error message 006',
            },
          ],
        },
        expected: {
          valueHash: {
            email: 'info@example.com',
          },
          validators: [
            FieldValidator.create({
              field: 'email',
              ok: expect.any(Function),
              message: 'error message 005',
            }),
            FieldValidator.create({
              field: 'email',
              ok: expect.any(Function),
              message: 'error message 006',
            }),
          ],
        },
      },
      {
        args: {
          field: 'bio',
          valueHash: {
            bio: 'Here I am.',
          },
          rules: [],
        },
        expected: {
          valueHash: {
            bio: 'Here I am.',
          },
          validators: [],
        },
      },
    ]

    describe('to be instance of own class', () => {
      test.each(cases)('field: $params.field', ({ args }) => {
        const actual = ValueHashValidator.create(args)

        expect(actual)
          .toBeInstanceOf(ValueHashValidator)
      })
    })

    describe('to call constructor', () => {
      test.each(cases)('field: $args.field', ({ args, expected }) => {
        const DerivedClass = ConstructorSpy.create({ jest })
          .spyOn(ValueHashValidator)

        DerivedClass.create(args)

        expect(DerivedClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('ValueHashValidator', () => {
  describe('#extractFieldNames()', () => {
    const cases = [
      {
        args: {
          valueHash: {
            username: 'Alice',
            password: 'password$001',
            email: 'info@example.com',
          },
          rules: [],
        },
        expected: [
          'username',
          'password',
          'email',
        ],
      },
      {
        args: {
          valueHash: {
            password: 'password$001',
            'password-confirmation': 'password$001',
          },
          rules: [],
        },
        expected: [
          'password',
          'password-confirmation',
        ],
      },
    ]

    test.each(cases)('valueHash: $args.valueHash', ({ args, expected }) => {
      const validator = ValueHashValidator.create(args)

      const actual = validator.extractFieldNames()

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('ValueHashValidator', () => {
  describe('#extractValidators()', () => {
    const cases = [
      {
        args: {
          valueHash: {
            username: 'Alice',
            password: 'password$001',
            email: 'info@example.com',
            bio: 'Here I am.',
          },
          rules: [
            {
              field: 'username',
              ok: () => true,
              message: 'error message 001',
            },
            {
              field: 'username',
              ok: () => true,
              message: 'error message 002',
            },
            {
              field: 'password',
              ok: () => true,
              message: 'error message 003',
            },
            {
              field: 'email',
              ok: () => true,
              message: 'error message 004',
            },
          ],
        },
        fieldCases: [
          {
            field: 'username',
            expected: [
              FieldValidator.create({
                field: 'username',
                ok: expect.any(Function),
                message: 'error message 001',
              }),
              FieldValidator.create({
                field: 'username',
                ok: expect.any(Function),
                message: 'error message 002',
              }),
            ],
          },
          {
            field: 'password',
            expected: [
              FieldValidator.create({
                field: 'password',
                ok: expect.any(Function),
                message: 'error message 003',
              }),
            ],
          },
          {
            field: 'email',
            expected: [
              FieldValidator.create({
                field: 'email',
                ok: expect.any(Function),
                message: 'error message 004',
              }),
            ],
          },
          {
            field: 'bio',
            expected: [],
          },
        ],
      },
      {
        args: {
          valueHash: {
            password: 'password$001',
            'password-confirmation': 'password$001',
          },
          rules: [
            {
              field: 'password',
              ok: () => true,
              message: 'error message 001',
            },
            {
              field: 'password-confirmation',
              ok: () => true,
              message: 'error message 002',
            },
          ],
        },
        fieldCases: [
          {
            field: 'password',
            expected: [
              FieldValidator.create({
                field: 'password',
                ok: expect.any(Function),
                message: 'error message 001',
              }),
            ],
          },
          {
            field: 'password-confirmation',
            expected: [
              FieldValidator.create({
                field: 'password-confirmation',
                ok: expect.any(Function),
                message: 'error message 002',
              }),
            ],
          },
        ],
      },
      {
        args: {
          valueHash: {
            alpha: 1,
            beta: 2,
          },
          rules: [],
        },
        fieldCases: [
          {
            field: 'alpha',
            expected: [],
          },
          {
            field: 'beta',
            expected: [],
          },
        ],
      },
    ]

    describe.each(cases)('valueHash: $args.valueHash', ({ args, fieldCases }) => {
      const validator = ValueHashValidator.create(args)

      test.each(fieldCases)('field: $field', ({ field, expected }) => {
        const actual = validator.extractValidators({
          field,
        })

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('ValueHashValidator', () => {
  describe('#isValid()', () => {
    /**
     * @type {Array<{
     *   args: {
     *     rules: Array<furo.FieldValidatorFactoryParams>
     *   }
     *   truthyCases: Array<{
     *     valueHash: Record<string, any>
     *   }>
     *   falsyCases: Array<{
     *     valueHash: Record<string, any>
     *   }>
     * }>}
     */
    const cases = [
      {
        args: {
          rules: [
            {
              field: 'username',
              ok: (it, valueHash) => it,
              message: 'username is required',
            },
            {
              field: 'username',
              ok: (it, valueHash) =>
                it
                && it.length >= 1
                && it.length <= 8,
              message: 'username length 1 - 8 characters',
            },
            {
              field: 'password',
              ok: (it, valueHash) => it,
              message: 'password is required',
            },
          ],
        },
        truthyCases: [
          {
            valueHash: {
              username: 'Alice',
              password: 'pass01',
            },
          },
          {
            valueHash: {
              username: 'Bob',
              password: 'pass002',
            },
          },
          {
            valueHash: {
              username: 'Charlie',
              password: 'pass0003',
            },
          },
        ],
        falsyCases: [
          {
            valueHash: {
              username: '',
              password: 'pass0004',
            },
          },
          {
            valueHash: {
              username: 'David',
              password: '',
            },
          },
          {
            valueHash: {
              username: '',
              password: '',
            },
          },
        ],
      },
      {
        args: {
          rules: [
            {
              field: 'password',
              ok: (it, valueHash) => it,
              message: 'password is required',
            },
            {
              field: 'password-confirmation',
              ok: (it, valueHash) => it === valueHash.password,
              message: 'password confirmation must be the same as password',
            },
          ],
        },
        truthyCases: [
          {
            valueHash: {
              password: 'pass0006',
              'password-confirmation': 'pass0006',
            },
          },
          {
            valueHash: {
              password: 'pass0007',
              'password-confirmation': 'pass0007',
            },
          },
        ],
        falsyCases: [
          {
            valueHash: {
              password: 'pass0008',
              'password-confirmation': 'miss0008',
            },
          },
          {
            valueHash: {
              password: 'pass0009',
              'password-confirmation': '',
            },
          },
          {
            valueHash: {
              password: '',
              'password-confirmation': 'miss0010',
            },
          },
        ],
      },
    ]

    describe.each(cases)('rules: $args.rules.length', ({ args, truthyCases, falsyCases }) => {
      describe('to be truthy', () => {
        test.each(truthyCases)('valueHash: $valueHash', ({ valueHash }) => {
          const validator = ValueHashValidator.create({
            valueHash,
            rules: args.rules,
          })

          const actual = validator.isValid()

          expect(actual)
            .toBeTruthy()
        })
      })

      describe('to be falsy', () => {
        test.each(falsyCases)('valueHash: $valueHash', ({ valueHash }) => {
          const validator = ValueHashValidator.create({
            valueHash,
            rules: args.rules,
          })

          const actual = validator.isValid()

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('ValueHashValidator', () => {
  describe('#isInvalid()', () => {
    /**
     * @type {Array<{
     *   args: {
     *     rules: Array<furo.FieldValidatorFactoryParams>
     *   }
     *   truthyCases: Array<{
     *     valueHash: Record<string, any>
     *   }>
     *   falsyCases: Array<{
     *     valueHash: Record<string, any>
     *   }>
     * }>}
     */
    const cases = [
      {
        args: {
          rules: [
            {
              field: 'username',
              ok: (it, valueHash) => it,
              message: 'username is required',
            },
            {
              field: 'username',
              ok: (it, valueHash) =>
                it
                && it.length >= 1
                && it.length <= 8,
              message: 'username length 1 - 8 characters',
            },
            {
              field: 'password',
              ok: (it, valueHash) => it,
              message: 'password is required',
            },
          ],
        },
        truthyCases: [
          {
            valueHash: {
              username: '',
              password: 'pass0004',
            },
          },
          {
            valueHash: {
              username: 'David',
              password: '',
            },
          },
          {
            valueHash: {
              username: '',
              password: '',
            },
          },
        ],
        falsyCases: [
          {
            valueHash: {
              username: 'Alice',
              password: 'pass01',
            },
          },
          {
            valueHash: {
              username: 'Bob',
              password: 'pass002',
            },
          },
          {
            valueHash: {
              username: 'Charlie',
              password: 'pass0003',
            },
          },
        ],
      },
      {
        args: {
          rules: [
            {
              field: 'password',
              ok: (it, valueHash) => it,
              message: 'password is required',
            },
            {
              field: 'password-confirmation',
              ok: (it, valueHash) => it === valueHash.password,
              message: 'password confirmation must be the same as password',
            },
          ],
        },
        truthyCases: [
          {
            valueHash: {
              password: 'pass0008',
              'password-confirmation': 'miss0008',
            },
          },
          {
            valueHash: {
              password: 'pass0009',
              'password-confirmation': '',
            },
          },
          {
            valueHash: {
              password: '',
              'password-confirmation': 'miss0010',
            },
          },
        ],
        falsyCases: [
          {
            valueHash: {
              password: 'pass0006',
              'password-confirmation': 'pass0006',
            },
          },
          {
            valueHash: {
              password: 'pass0007',
              'password-confirmation': 'pass0007',
            },
          },
        ],
      },
    ]

    describe.each(cases)('rules: $args.rules.length', ({ args, truthyCases, falsyCases }) => {
      describe('to be truthy', () => {
        test.each(truthyCases)('valueHash: $valueHash', ({ valueHash }) => {
          const validator = ValueHashValidator.create({
            valueHash,
            rules: args.rules,
          })

          const actual = validator.isInvalid()

          expect(actual)
            .toBeTruthy()
        })
      })

      describe('to be falsy', () => {
        test.each(falsyCases)('valueHash: $valueHash', ({ valueHash }) => {
          const validator = ValueHashValidator.create({
            valueHash,
            rules: args.rules,
          })

          const actual = validator.isInvalid()

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('ValueHashValidator', () => {
  describe('#getAllMessages()', () => {
    /**
     * @type {Array<{
     *   args: {
     *     rules: Array<furo.FieldValidatorFactoryParams>
     *   }
     *   fieldCases: Array<{
     *     field: string
     *     valueHash: Record<string, any>
     *     expected: Array<string>
     *   }>
     * }>}
     */
    const cases = [
      {
        args: {
          rules: [
            {
              field: 'username',
              ok: (it, valueHash) => it,
              message: 'username is required',
            },
            {
              field: 'username',
              ok: (it, valueHash) =>
                it
                && it.length >= 1
                && it.length <= 8,
              message: 'username length 1 - 8 characters',
            },
            {
              field: 'username',
              ok: (it, valueHash) =>
                !it || /^\w+$/u.test(it),
              message: 'username must be alphanumeric',
            },
            {
              field: 'password',
              ok: (it, valueHash) => it,
              message: 'password is required',
            },
          ],
        },
        fieldCases: [
          {
            field: 'username',
            valueHash: {
              username: 'Alice',
              password: 'pass0004',
            },
            expected: [],
          },
          {
            field: 'username',
            valueHash: {
              username: '',
              password: 'pass0004',
            },
            expected: [
              'username is required',
              'username length 1 - 8 characters',
            ],
          },
          {
            field: 'username',
            valueHash: {
              username: 'John Doe',
              password: 'pass0004',
            },
            expected: [
              'username must be alphanumeric',
            ],
          },
          {
            field: 'password',
            valueHash: {
              username: '',
              password: '',
            },
            expected: [
              'password is required',
            ],
          },
        ],
      },
      {
        args: {
          rules: [
            {
              field: 'password',
              ok: (it, valueHash) => it,
              message: 'password is required',
            },
            {
              field: 'password-confirmation',
              ok: (it, valueHash) =>
                !it || it === valueHash.password,
              message: 'password confirmation must be the same as password',
            },
          ],
        },
        fieldCases: [
          {
            field: 'password',
            valueHash: {
              password: 'pass0008',
              'password-confirmation': 'miss0008',
            },
            expected: [],
          },
          {
            field: 'password',
            valueHash: {
              password: '',
              'password-confirmation': '',
            },
            expected: [
              'password is required',
            ],
          },
          {
            field: 'password-confirmation',
            valueHash: {
              password: 'pass0008',
              'password-confirmation': 'miss0008',
            },
            expected: [
              'password confirmation must be the same as password',
            ],
          },
          {
            field: 'password-confirmation',
            valueHash: {
              password: '',
              'password-confirmation': '',
            },
            expected: [],
          },
        ],
      },
    ]

    describe.each(cases)('rules: $args.rules.length', ({ args, fieldCases }) => {
      test.each(fieldCases)('[$#] field: $field', ({ field, valueHash, expected }) => {
        const validator = ValueHashValidator.create({
          valueHash,
          rules: args.rules,
        })

        const actual = validator.getAllMessages({
          field,
        })

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('ValueHashValidator', () => {
  describe('#getOneMessage()', () => {
    /**
     * @type {Array<{
     *   args: {
     *     rules: Array<furo.FieldValidatorFactoryParams>
     *   }
     *   fieldCases: Array<{
     *     field: string
     *     valueHash: Record<string, any>
     *     expected: string | null
     *   }>
     * }>}
     */
    const cases = [
      {
        args: {
          rules: [
            {
              field: 'username',
              ok: (it, valueHash) => it,
              message: 'username is required',
            },
            {
              field: 'username',
              ok: (it, valueHash) =>
                it
                && it.length >= 1
                && it.length <= 8,
              message: 'username length 1 - 8 characters',
            },
            {
              field: 'username',
              ok: (it, valueHash) =>
                !it || /^\w+$/u.test(it),
              message: 'username must be alphanumeric',
            },
            {
              field: 'password',
              ok: (it, valueHash) => it,
              message: 'password is required',
            },
          ],
        },
        fieldCases: [
          {
            field: 'username',
            valueHash: {
              username: 'Alice',
              password: 'pass0004',
            },
            expected: null,
          },
          {
            field: 'username',
            valueHash: {
              username: '',
              password: 'pass0004',
            },
            expected: 'username is required',
          },
          {
            field: 'username',
            valueHash: {
              username: 'John Doe',
              password: 'pass0004',
            },
            expected: 'username must be alphanumeric',
          },
          {
            field: 'password',
            valueHash: {
              username: '',
              password: '',
            },
            expected: 'password is required',
          },
        ],
      },
      {
        args: {
          rules: [
            {
              field: 'password',
              ok: (it, valueHash) => it,
              message: 'password is required',
            },
            {
              field: 'password-confirmation',
              ok: (it, valueHash) =>
                !it || it === valueHash.password,
              message: 'password confirmation must be the same as password',
            },
          ],
        },
        fieldCases: [
          {
            field: 'password',
            valueHash: {
              password: 'pass0008',
              'password-confirmation': 'miss0008',
            },
            expected: null,
          },
          {
            field: 'password',
            valueHash: {
              password: '',
              'password-confirmation': '',
            },
            expected: 'password is required',
          },
          {
            field: 'password-confirmation',
            valueHash: {
              password: 'pass0008',
              'password-confirmation': 'miss0008',
            },
            expected: 'password confirmation must be the same as password',
          },
          {
            field: 'password-confirmation',
            valueHash: {
              password: '',
              'password-confirmation': '',
            },
            expected: null,
          },
        ],
      },
    ]

    describe.each(cases)('rules: $args.rules.length', ({ args, fieldCases }) => {
      test.each(fieldCases)('[$#] field: $field', ({ field, valueHash, expected }) => {
        const validator = ValueHashValidator.create({
          valueHash,
          rules: args.rules,
        })

        const actual = validator.getOneMessage({
          field,
        })

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('ValueHashValidator', () => {
  describe('#isValidField()', () => {
    /**
     * @type {Array<{
     *   args: {
     *     rules: Array<furo.FieldValidatorFactoryParams>
     *   }
     *   fieldCases: Array<{
     *     field: string
     *     valueHash: Record<string, any>
     *     expected: boolean
     *   }>
     * }>}
     */
    const cases = [
      {
        args: {
          rules: [
            {
              field: 'username',
              ok: (it, valueHash) => it,
              message: 'username is required',
            },
            {
              field: 'username',
              ok: (it, valueHash) =>
                it
                && it.length >= 1
                && it.length <= 8,
              message: 'username length 1 - 8 characters',
            },
            {
              field: 'username',
              ok: (it, valueHash) =>
                !it || /^\w+$/u.test(it),
              message: 'username must be alphanumeric',
            },
            {
              field: 'password',
              ok: (it, valueHash) => it,
              message: 'password is required',
            },
          ],
        },
        fieldCases: [
          {
            field: 'username',
            valueHash: {
              username: 'Alice',
              password: 'pass0004',
            },
            expected: true,
          },
          {
            field: 'username',
            valueHash: {
              username: '',
              password: 'pass0004',
            },
            expected: false,
          },
          {
            field: 'username',
            valueHash: {
              username: 'John Doe',
              password: 'pass0004',
            },
            expected: false,
          },
          {
            field: 'password',
            valueHash: {
              username: '',
              password: '',
            },
            expected: false,
          },
        ],
      },
      {
        args: {
          rules: [
            {
              field: 'password',
              ok: (it, valueHash) => it,
              message: 'password is required',
            },
            {
              field: 'password-confirmation',
              ok: (it, valueHash) =>
                !it || it === valueHash.password,
              message: 'password confirmation must be the same as password',
            },
          ],
        },
        fieldCases: [
          {
            field: 'password',
            valueHash: {
              password: 'pass0008',
              'password-confirmation': 'miss0008',
            },
            expected: true,
          },
          {
            field: 'password',
            valueHash: {
              password: '',
              'password-confirmation': '',
            },
            expected: false,
          },
          {
            field: 'password-confirmation',
            valueHash: {
              password: 'pass0008',
              'password-confirmation': 'miss0008',
            },
            expected: false,
          },
          {
            field: 'password-confirmation',
            valueHash: {
              password: '',
              'password-confirmation': '',
            },
            expected: true,
          },
        ],
      },
    ]

    describe.each(cases)('rules: $args.rules.length', ({ args, fieldCases }) => {
      test.each(fieldCases)('[$#] field: $field', ({ field, valueHash, expected }) => {
        const validator = ValueHashValidator.create({
          valueHash,
          rules: args.rules,
        })

        const actual = validator.isValidField({
          field,
        })

        expect(actual)
          .toBe(expected)
      })
    })
  })
})

describe('ValueHashValidator', () => {
  describe('#isInvalidField()', () => {
    /**
     * @type {Array<{
     *   args: {
     *     rules: Array<furo.FieldValidatorFactoryParams>
     *   }
     *   fieldCases: Array<{
     *     field: string
     *     valueHash: Record<string, any>
     *     expected: boolean
     *   }>
     * }>}
     */
    const cases = [
      {
        args: {
          rules: [
            {
              field: 'username',
              ok: (it, valueHash) => it,
              message: 'username is required',
            },
            {
              field: 'username',
              ok: (it, valueHash) =>
                it
                && it.length >= 1
                && it.length <= 8,
              message: 'username length 1 - 8 characters',
            },
            {
              field: 'username',
              ok: (it, valueHash) =>
                !it || /^\w+$/u.test(it),
              message: 'username must be alphanumeric',
            },
            {
              field: 'password',
              ok: (it, valueHash) => it,
              message: 'password is required',
            },
          ],
        },
        fieldCases: [
          {
            field: 'username',
            valueHash: {
              username: 'Alice',
              password: 'pass0004',
            },
            expected: false,
          },
          {
            field: 'username',
            valueHash: {
              username: '',
              password: 'pass0004',
            },
            expected: true,
          },
          {
            field: 'username',
            valueHash: {
              username: 'John Doe',
              password: 'pass0004',
            },
            expected: true,
          },
          {
            field: 'password',
            valueHash: {
              username: '',
              password: '',
            },
            expected: true,
          },
        ],
      },
      {
        args: {
          rules: [
            {
              field: 'password',
              ok: (it, valueHash) => it,
              message: 'password is required',
            },
            {
              field: 'password-confirmation',
              ok: (it, valueHash) =>
                !it || it === valueHash.password,
              message: 'password confirmation must be the same as password',
            },
          ],
        },
        fieldCases: [
          {
            field: 'password',
            valueHash: {
              password: 'pass0008',
              'password-confirmation': 'miss0008',
            },
            expected: false,
          },
          {
            field: 'password',
            valueHash: {
              password: '',
              'password-confirmation': '',
            },
            expected: true,
          },
          {
            field: 'password-confirmation',
            valueHash: {
              password: 'pass0008',
              'password-confirmation': 'miss0008',
            },
            expected: true,
          },
          {
            field: 'password-confirmation',
            valueHash: {
              password: '',
              'password-confirmation': '',
            },
            expected: false,
          },
        ],
      },
    ]

    describe.each(cases)('rules: $args.rules.length', ({ args, fieldCases }) => {
      test.each(fieldCases)('[$#] field: $field', ({ field, valueHash, expected }) => {
        const validator = ValueHashValidator.create({
          valueHash,
          rules: args.rules,
        })

        const actual = validator.isInvalidField({
          field,
        })

        expect(actual)
          .toBe(expected)
      })
    })
  })
})
