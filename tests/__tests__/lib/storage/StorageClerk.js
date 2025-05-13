import {
  ConstructorSpy,
} from '@openreachtech/jest-constructor-spy'

import StorageClerk from '~/lib/storage/StorageClerk.js'

describe('StorageClerk', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      describe('#storage', () => {
        const cases = [
          {
            params: {
              storage: 'localStorage',
            },
          },
          {
            params: {
              storage: 'sessionStorage',
            },
          },
        ]

        test.each(cases)('storage: $params.storage', ({ params }) => {
          const storageTally = globalThis[params.storage]
          const args = {
            storage: storageTally,
          }
          const storageClerk = new StorageClerk(args)

          expect(storageClerk)
            .toHaveProperty('storage', storageTally)
        })
      })
    })
  })
})

describe('StorageClerk', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      const cases = [
        {
          params: {
            storage: 'localStorage',
          },
        },
        {
          params: {
            storage: 'sessionStorage',
          },
        },
      ]

      test.each(cases)('storage: $params.storage', ({ params }) => {
        const storageTally = globalThis[params.storage]
        const args = {
          storage: storageTally,
        }
        const storageClerk = StorageClerk.create(args)

        expect(storageClerk)
          .toBeInstanceOf(StorageClerk)
      })
    })

    describe('to call constructor', () => {
      const cases = [
        {
          params: {
            storage: 'localStorage',
          },
        },
        {
          params: {
            storage: 'sessionStorage',
          },
        },
      ]

      test.each(cases)('storage: $params.storage', ({ params }) => {
        const DerivedClass = ConstructorSpy.create({ jest })
          .spyOn(StorageClerk)

        const storageTally = window[params.storage]
        const args = {
          storage: storageTally,
        }

        DerivedClass.create(args)

        expect(DerivedClass.__spy__)
          .toHaveBeenCalledWith(args)
      })
    })
  })
})

describe('StorageClerk', () => {
  describe('.createAsLocal()', () => {
    describe('to be instance of own class', () => {
      test('with no arguments', () => {
        const storageClerk = StorageClerk.createAsLocal()

        expect(storageClerk)
          .toBeInstanceOf(StorageClerk)
      })
    })

    describe('to call .create()', () => {
      test('with no arguments', () => {
        const expected = {
          storage: localStorage,
        }
        const createSpy = jest.spyOn(StorageClerk, 'create')

        StorageClerk.createAsLocal()

        expect(createSpy)
          .toHaveBeenCalledWith(expected)

        createSpy.mockRestore()
      })
    })
  })
})

describe('StorageClerk', () => {
  describe('.createAsSession()', () => {
    describe('to be instance of own class', () => {
      test('with no arguments', () => {
        const storageClerk = StorageClerk.createAsSession()

        expect(storageClerk)
          .toBeInstanceOf(StorageClerk)
      })
    })

    describe('to call .create()', () => {
      test('with no arguments', () => {
        const expected = {
          storage: sessionStorage,
        }
        const createSpy = jest.spyOn(StorageClerk, 'create')

        StorageClerk.createAsSession()

        expect(createSpy)
          .toHaveBeenCalledWith(expected)

        createSpy.mockRestore()
      })
    })
  })
})

describe('StorageClerk', () => {
  describe('#get()', () => {
    describe('to be set value', () => {
      const storageCases = [
        {
          params: {
            storage: 'localStorage',
          },
        },
        {
          params: {
            storage: 'sessionStorage',
          },
        },
      ]

      describe.each(storageCases)('storage: $params.storage', ({ params }) => {
        const storage = window[params.storage]

        const cases = [
          {
            valueHash: {
              key: 'alpha',
            },
            expected: '100',
          },
          {
            valueHash: {
              key: 'beta',
            },
            expected: '200',
          },
        ]

        test.each(cases)('key: $valueHash.key', ({ valueHash, expected }) => {
          storage.clear()
          storage.alpha = '100'
          storage.beta = '200'

          const storageClerk = new StorageClerk({
            storage,
          })

          const actual = storageClerk.get(valueHash.key)

          expect(actual)
            .toBe(expected)
        })
      })
    })

    describe('to call #storage.getItem()', () => {
      const cases = [
        {
          params: {
            key: 'alpha',
          },
        },
        {
          params: {
            key: 'beta',
          },
        },
      ]

      test.each(cases)('key: $params.kay', ({ params }) => {
        /** @type {Storage} */
        const mockStorage = /** @type {*} */ ({
          getItem () {
            return null
          },
        })

        const getItemSpy = jest.spyOn(mockStorage, 'getItem')
        const storageClerk = new StorageClerk({
          storage: mockStorage,
        })

        storageClerk.get(params.key)

        expect(getItemSpy)
          .toHaveBeenCalledWith(params.key)

        getItemSpy.mockRestore()
      })
    })
  })
})

describe('StorageClerk', () => {
  describe('#set()', () => {
    describe('to be set value', () => {
      const storageCases = [
        {
          params: {
            storage: 'localStorage',
          },
        },
        {
          params: {
            storage: 'sessionStorage',
          },
        },
      ]

      describe.each(storageCases)('storage: $params.storage', ({ params }) => {
        const storage = globalThis[params.storage]
        storage.clear()

        const storageClerk = new StorageClerk({
          storage,
        })

        const cases = [
          {
            valueHash: {
              value: '100',
            },
            expected: '100',
          },
          {
            valueHash: {
              value: '200',
            },
            expected: '200',
          },
        ]

        test.each(cases)('value: $valueHash.value', ({ valueHash, expected }) => {
          const key = 'alpha'

          storageClerk.set(
            key,
            valueHash.value
          )
          const actualValue = storage[key]

          expect(actualValue)
            .toBe(expected)
        })
      })
    })

    describe('to call #storage.setItem()', () => {
      const cases = [
        {
          params: {
            key: 'alpha',
            value: '100',
          },
        },
        {
          params: {
            key: 'beta',
            value: '200',
          },
        },
      ]

      test.each(cases)('key: $params.kay', ({ params }) => {
        /** @type {Storage} */
        const mockStorage = /** @type {*} */ ({
          setItem () {
            // noop
          },
        })

        const getItemSpy = jest.spyOn(mockStorage, 'setItem')
        const storageClerk = new StorageClerk({
          storage: mockStorage,
        })

        storageClerk.set(
          params.key,
          params.value
        )

        expect(getItemSpy)
          .toHaveBeenCalledWith(
            params.key,
            params.value
          )

        getItemSpy.mockRestore()
      })
    })

    describe('to return own instance for method chain', () => {
      const storageCases = [
        {
          params: {
            storage: 'localStorage',
          },
        },
        {
          params: {
            storage: 'sessionStorage',
          },
        },
      ]

      describe.each(storageCases)('storage: $params.storage', ({ params }) => {
        const storage = window[params.storage]
        storage.clear()

        const storageClerk = new StorageClerk({
          storage,
        })

        const cases = [
          {
            valueHash: {
              value: '100',
            },
          },
          {
            valueHash: {
              value: '200',
            },
          },
        ]

        test.each(cases)('value: $valueHash.value', ({ valueHash }) => {
          const key = 'beta'

          const actual = storageClerk.set(
            key,
            valueHash.value
          )

          expect(actual)
            .toBe(storageClerk) // same reference
        })
      })
    })
  })
})

describe('StorageClerk', () => {
  describe('#remove()', () => {
    const storageCases = [
      {
        params: {
          storage: 'localStorage',
        },
      },
      {
        params: {
          storage: 'sessionStorage',
        },
      },
    ]

    describe.each(storageCases)('storage: $params.storage', ({ params }) => {
      describe('to be removed value with one key', () => {
        const storage = globalThis[params.storage]

        beforeEach(() => {
          storage.clear()

          storage.alpha = '100'
          storage.beta = '200'
        })

        const storageClerk = new StorageClerk({
          storage,
        })

        const cases = [
          {
            args: {
              key: 'alpha',
            },
          },
          {
            args: {
              key: 'beta',
            },
          },
        ]

        test.each(cases)('key: $args.key', ({ args }) => {
          const beforeValue = storage[args.key]
          expect(beforeValue)
            .toBeDefined()

          storageClerk.remove(args.key)

          const afterValue = storage[args.key]
          expect(afterValue)
            .toBeUndefined()
        })
      })

      describe('to return own instance', () => {
        const storage = globalThis[params.storage]

        beforeEach(() => {
          storage.clear()

          storage.alpha = '100'
          storage.beta = '200'
        })

        const storageClerk = new StorageClerk({
          storage,
        })

        const cases = [
          {
            args: {
              key: 'alpha',
            },
          },
          {
            args: {
              key: 'beta',
            },
          },
        ]

        test.each(cases)('key: $args.key', ({ args }) => {
          const actual = storageClerk.remove(args.key)

          expect(actual)
            .toBeInstanceOf(StorageClerk)
        })
      })
    })
  })
})

describe('StorageClerk', () => {
  describe('#clearAll()', () => {
    const storageCases = [
      {
        params: {
          storage: 'localStorage',
        },
      },
      {
        params: {
          storage: 'sessionStorage',
        },
      },
    ]

    describe.each(storageCases)('storage: $params.storage', ({ params }) => {
      describe('to be removed value with one key', () => {
        const storage = globalThis[params.storage]

        beforeEach(() => {
          storage.clear()

          storage.alpha = '100'
          storage.beta = '200'
        })

        const storageClerk = new StorageClerk({
          storage,
        })

        test('to be cleared all', () => {
          expect(storage.alpha)
            .toBeDefined()
          expect(storage.beta)
            .toBeDefined()

          storageClerk.clearAll()

          expect(storage.alpha)
            .toBeUndefined()
          expect(storage.beta)
            .toBeUndefined()
        })
      })

      describe('to return own instance', () => {
        const storage = globalThis[params.storage]
        storage.clear()

        storage.alpha = '100'
        storage.beta = '200'

        const storageClerk = new StorageClerk({
          storage,
        })

        test('to be cleared all', () => {
          const actual = storageClerk.clearAll()

          expect(actual)
            .toBeInstanceOf(StorageClerk)
        })
      })
    })
  })
})
