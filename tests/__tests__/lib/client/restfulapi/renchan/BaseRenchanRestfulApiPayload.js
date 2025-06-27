import BaseRenchanRestfulApiPayload from '~/lib/client/restfulapi/renchan/BaseRenchanRestfulApiPayload.js'

import BaseRestfulApiPayload from '~/lib/client/restfulapi/BaseRestfulApiPayload.js'

describe('BaseRenchanRestfulApiPayload', () => {
  describe('inheritance', () => {
    test('should extend BaseRestfulApiPayload', () => {
      const actual = BaseRenchanRestfulApiPayload.prototype

      expect(actual)
        .toBeInstanceOf(BaseRestfulApiPayload)
    })
  })
})

describe('BaseRenchanRestfulApiPayload', () => {
  describe('.get:ACCESS_TOKEN_HEADER_KEY', () => {
    test('should throw an error', () => {
      expect(() => BaseRenchanRestfulApiPayload.ACCESS_TOKEN_HEADER_KEY)
        .toThrow('this feature must be inherited')
    })
  })
})

describe('BaseRenchanRestfulApiPayload', () => {
  describe('.get:ACCESS_TOKEN_STORAGE_KEY', () => {
    test('should throw an error', () => {
      expect(() => BaseRenchanRestfulApiPayload.ACCESS_TOKEN_STORAGE_KEY)
        .toThrow('this feature must be inherited')
    })
  })
})

describe('BaseRenchanRestfulApiPayload', () => {
  describe('.collectBasedHeadersOptions()', () => {
    const cases = [
      {
        input: {
          accessTokenHeaderKey: 'x-renchan-access-token',
          accessToken: 'test-access-token-01',
        },
        expected: [
          {
            'x-renchan-access-token': 'test-access-token-01',
          },
        ],
      },
      {
        input: {
          accessTokenHeaderKey: 'x-app-renchan-access-token',
          accessToken: null,
        },
        expected: [
          {
            'x-app-renchan-access-token': null,
          },
        ],
      },
    ]

    test.each(cases)('accessTokenHeaderKey: $input.accessTokenHeaderKey', ({ input, expected }) => {
      jest.spyOn(BaseRenchanRestfulApiPayload, 'ACCESS_TOKEN_HEADER_KEY', 'get')
        .mockReturnValue(input.accessTokenHeaderKey)
      jest.spyOn(BaseRenchanRestfulApiPayload, 'loadAccessToken')
        .mockReturnValue(input.accessToken)

      const actual = BaseRenchanRestfulApiPayload.collectBasedHeadersOptions()

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseRenchanRestfulApiPayload', () => {
  describe('.loadAccessToken()', () => {
    const storage = window.sessionStorage

    describe('with set access token', () => {
      const cases = [
        {
          input: {
            storageKey: 'access_token',
            accessToken: 'test-access-token-01',
          },
        },
        {
          input: {
            storageKey: 'app-access-token',
            accessToken: 'test-access-token-02',
          },
        },
      ]

      test.each(cases)('accessToken: $input.accessToken', ({ input }) => {
        storage.clear()
        storage.setItem(
          input.storageKey,
          input.accessToken
        )

        jest.spyOn(BaseRenchanRestfulApiPayload, 'ACCESS_TOKEN_STORAGE_KEY', 'get')
          .mockReturnValue(input.storageKey)

        const actual = BaseRenchanRestfulApiPayload.loadAccessToken()

        expect(actual)
          .toBe(input.accessToken)
      })
    })

    describe('with no access token', () => {
      const cases = [
        {
          input: {
            storageKey: 'access_token',
          },
        },
        {
          input: {
            storageKey: 'app-access-token',
          },
        },
      ]

      test.each(cases)('accessToken: $input.accessToken', ({ input }) => {
        storage.clear()

        jest.spyOn(BaseRenchanRestfulApiPayload, 'ACCESS_TOKEN_STORAGE_KEY', 'get')
          .mockReturnValue(input.storageKey)

        const actual = BaseRenchanRestfulApiPayload.loadAccessToken()

        expect(actual)
          .toBeNull()
      })
    })
  })
})
