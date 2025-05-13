import BaseAppGraphqlPayload from '~/app/graphql/clients/BaseAppGraphqlPayload.js'
import BaseGraphqlPayload from '~/lib/client/BaseGraphqlPayload.js'
import StorageClerk from '~/lib/storage/StorageClerk.js'

beforeEach(() => {
  localStorage.clear()
})

describe('BaseAppGraphqlPayload', () => {
  describe('super class', () => {
    test('to be derived class of BaseGraphqlPayload', () => {
      const actual = BaseAppGraphqlPayload.prototype

      expect(actual)
        .toBeInstanceOf(BaseGraphqlPayload)
    })
  })
})

describe('BaseAppGraphqlPayload', () => {
  describe('.createStorageClerk()', () => {
    describe('to return instance of StorageClerk', () => {
      test('with no params', () => {
        const storageClerk = BaseAppGraphqlPayload.createStorageClerk()

        expect(storageClerk)
          .toBeInstanceOf(StorageClerk)
      })
    })

    describe('to call StorageClerk.createAsLocal()', () => {
      test('with no params', () => {
        const storageClerkTally = /** @type {StorageClerk} */ ({})

        const createAsLocalSpy = jest.spyOn(StorageClerk, 'createAsLocal')
          .mockReturnValue(storageClerkTally)

        const actual = BaseAppGraphqlPayload.createStorageClerk()

        expect(actual)
          .toBe(storageClerkTally) // same reference

        expect(createAsLocalSpy)
          .toHaveBeenCalledWith()

        createAsLocalSpy.mockRestore()
      })
    })
  })
})

describe('BaseAppGraphqlPayload', () => {
  describe('.loadAccessToken()', () => {
    describe('with no params', () => {
      const cases = [
        {
          args: {
            accessToken: 'fc3ff98e8c6a0d308700000000000001',
          },
        },
        {
          args: {
            accessToken: 'fc3ff98e8c6a0d308700000000000002',
          },
        },
      ]

      test.each(cases)('accessToken: $args.accessToken', ({ args }) => {
        localStorage.setItem('access_token', args.accessToken)

        const actual = BaseAppGraphqlPayload.loadAccessToken()

        expect(actual)
          .toBe(args.accessToken)
      })
    })
  })
})

describe('BaseAppGraphqlPayload', () => {
  describe('.collectBasedHeadersOptions()', () => {
    describe('to add `x-renchan-access-token`', () => {
      const cases = [
        {
          args: {
            accessToken: 'fc3ff98e8c6a0d308700000000000001',
          },
          expected: [
            {
              'x-renchan-access-token': 'fc3ff98e8c6a0d308700000000000001',
            },
          ],
        },
        {
          args: {
            accessToken: 'fc3ff98e8c6a0d308700000000000002',
          },
          expected: [
            {
              'x-renchan-access-token': 'fc3ff98e8c6a0d308700000000000002',
            },
          ],
        },
      ]

      test.each(cases)('accessToken: $args.accessToken', ({ args, expected }) => {
        localStorage.setItem('access_token', args.accessToken)

        const actual = BaseAppGraphqlPayload.collectBasedHeadersOptions()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('to not add `x-renchan-access-token`', () => {
      test('with no args', () => {
        localStorage.removeItem('access_token')

        const expected = []

        const actual = BaseAppGraphqlPayload.collectBasedHeadersOptions()

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})
