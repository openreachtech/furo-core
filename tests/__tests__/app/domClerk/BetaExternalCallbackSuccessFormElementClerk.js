import BetaExternalCallbackSuccessFormElementClerk from '~/app/domClerk/BetaExternalCallbackSuccessFormElementClerk.js'
import BaseFormElementClerk from '~/lib/domClerks/BaseFormElementClerk.js'

describe('BetaExternalCallbackSuccessFormElementClerk', () => {
  describe('inheritance', () => {
    test('to be derived class of BaseFormElementClerk', () => {
      const actual = BetaExternalCallbackSuccessFormElementClerk.prototype

      expect(actual)
        .toBeInstanceOf(BaseFormElementClerk)
    })
  })
})

describe('BetaExternalCallbackSuccessFormElementClerk', () => {
  describe('.get:rules', () => {
    test('to return the correct validation rules', () => {
      const expected = [
        {
          field: 'first',
          ok: expect.any(Function),
          message: 'first must be set',
        },
        {
          field: 'second',
          ok: expect.any(Function),
          message: 'second must be set',
        },
      ]

      const actual = BetaExternalCallbackSuccessFormElementClerk.rules

      expect(actual)
        .toMatchObject(expected)
    })
  })
})
