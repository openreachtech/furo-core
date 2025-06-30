import SignUpFormElementClerk from '~/app/domClerk/SignUpFormElementClerk.js'
import BaseFormElementClerk from '~/lib/domClerks/BaseFormElementClerk.js'

describe('SignUpFormElementClerk', () => {
  describe('inheritance', () => {
    test('to be derived class of BaseFormElementClerk', () => {
      const actual = SignUpFormElementClerk.prototype

      expect(actual)
        .toBeInstanceOf(BaseFormElementClerk)
    })
  })
})

describe('SignUpFormElementClerk', () => {
  describe('.get:rules', () => {
    test('to return the correct validation rules', () => {
      const expected = [
        {
          field: 'email',
          ok: expect.any(Function),
          message: 'email must be valid',
        },
        {
          field: 'username',
          ok: expect.any(Function),
          message: 'username must be set',
        },
        {
          field: 'username',
          ok: expect.any(Function),
          message: 'username must be alphanumeric',
        },
        {
          field: 'firstName',
          ok: expect.any(Function),
          message: 'firstName must be set',
        },
        {
          field: 'lastName',
          ok: expect.any(Function),
          message: 'lastName must be set',
        },
        {
          field: 'password',
          ok: expect.any(Function),
          message: 'password must be set with at least 1 character and no more than 16 characters',
        },
        {
          field: 'password-confirmation',
          ok: expect.any(Function),
          message: 'please re-enter password for confirmation',
        },
        {
          field: 'password-confirmation',
          ok: expect.any(Function),
          message: 'passwords do not match',
        },
      ]

      const actual = SignUpFormElementClerk.rules

      expect(actual)
        .toMatchObject(expected)
    })
  })
})
