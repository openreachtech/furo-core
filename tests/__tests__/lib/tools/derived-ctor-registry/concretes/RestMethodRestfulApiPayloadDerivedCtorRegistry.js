import RestMethodRestfulApiPayloadDerivedCtorRegistry from '~/lib/tools/derived-ctor-registry/concretes/RestMethodRestfulApiPayloadDerivedCtorRegistry.js'

import BaseRestfulApiPayload from '~/lib/client/restfulapi/BaseRestfulApiPayload'

import DerivedClassNameGenerator from '~/lib/tools/DerivedClassNameGenerator'
import DynamicDerivedCtorPool from '~/lib/tools/DynamicDerivedCtorPool'

describe('RestMethodRestfulApiPayloadDerivedCtorRegistry', () => {
  describe('constructor', () => {
    describe('to keep properties', () => {
      const mockSuperCtor = BaseRestfulApiPayload
      const mockDynamicDerivedCtorPool = DynamicDerivedCtorPool.create()
      const mockClassNameGenerator = DerivedClassNameGenerator.create({
        className: 'BaseClass',
        fixedPrefix: 'Base',
      })

      /**
       * @type {Array<{
       *   input: {
       *     method: import('~/types/restfulapi.js').METHOD
       *   }
       * }>}
       */
      const cases = [
        {
          input: {
            method: 'GET',
          },
        },
        {
          input: {
            method: 'POST',
          },
        },
        {
          input: {
            method: 'DELETE',
          },
        },
        {
          input: {
            method: 'PUT',
          },
        },
        {
          input: {
            method: 'PATCH',
          },
        },
        {
          input: {
            method: 'HEAD',
          },
        },
        {
          input: {
            method: 'OPTIONS',
          },
        },
        {
          input: {
            method: 'CONNECT',
          },
        },
        {
          input: {
            method: 'TRACE',
          },
        },
      ]

      describe('#method', () => {
        test.each(cases)('method: $input.method', ({ input }) => {
          const args = {
            SuperCtor: mockSuperCtor,
            pool: mockDynamicDerivedCtorPool,
            classNameGenerator: mockClassNameGenerator,
            method: input.method,
          }

          const registry = new RestMethodRestfulApiPayloadDerivedCtorRegistry(args)

          expect(registry)
            .toHaveProperty('method', input.method)
        })
      })
    })
  })
})

describe('RestMethodRestfulApiPayloadDerivedCtorRegistry', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      describe('with full parameters', () => {
        /**
         * @type {Array<{
         *   input: Parameters<typeof RestMethodRestfulApiPayloadDerivedCtorRegistry['create']>[0]
         * }>}
         */
        const cases = [
          {
            input: {
              SuperCtor: BaseRestfulApiPayload,
              pool: DynamicDerivedCtorPool.create(),
              fixedPrefix: 'Base',
              method: 'GET',
            },
          },
          {
            input: {
              SuperCtor: class extends BaseRestfulApiPayload {},
              pool: DynamicDerivedCtorPool.create(),
              fixedPrefix: 'BaseApp',
              method: 'POST',
            },
          },
        ]

        test.each(cases)('fixedPrefix: $input.fixedPrefix', ({ input }) => {
          const registry = RestMethodRestfulApiPayloadDerivedCtorRegistry.create(input)

          expect(registry)
            .toBeInstanceOf(RestMethodRestfulApiPayloadDerivedCtorRegistry)
        })
      })

      describe('with omitted parameters', () => {
        /**
         * @type {Array<{
         *   input: Parameters<typeof RestMethodRestfulApiPayloadDerivedCtorRegistry['create']>[0]
         * }>}
         */
        const cases = [
          {
            input: {
              SuperCtor: BaseRestfulApiPayload,
              fixedPrefix: 'Base',
              method: 'GET',
            },
          },
          {
            input: {
              SuperCtor: class extends BaseRestfulApiPayload {},
              fixedPrefix: 'BaseApp',
              method: 'POST',
            },
          },
        ]

        test.each(cases)('fixedPrefix: $input.fixedPrefix', ({ input }) => {
          const registry = RestMethodRestfulApiPayloadDerivedCtorRegistry.create(input)

          expect(registry)
            .toBeInstanceOf(RestMethodRestfulApiPayloadDerivedCtorRegistry)
        })
      })
    })

    describe('to call constructor', () => {
      const BaseAlpha = class extends BaseRestfulApiPayload {}
      const BaseAppBeta = class extends BaseRestfulApiPayload {}

      const alphaCtorPool = DynamicDerivedCtorPool.create()
      const betaCtorPool = DynamicDerivedCtorPool.create()

      describe('with full parameters', () => {
        /**
         * @type {Array<{
         *   input: Parameters<typeof RestMethodRestfulApiPayloadDerivedCtorRegistry['create']>[0]
         *   expected: {
         *     constructorArgs: ConstructorParameters<typeof RestMethodRestfulApiPayloadDerivedCtorRegistry>[0]
         *     createDerivedClassNameGeneratorArgs: Parameters<typeof RestMethodRestfulApiPayloadDerivedCtorRegistry['createDerivedClassNameGenerator']>[0]
         *   }
         * }>}
         */
        const cases = [
          {
            input: {
              SuperCtor: BaseAlpha,
              pool: alphaCtorPool,
              fixedPrefix: 'Base',
              method: 'GET',
            },
            expected: {
              constructorArgs: {
                SuperCtor: BaseAlpha,
                pool: alphaCtorPool,
                classNameGenerator: DerivedClassNameGenerator.create({
                  className: 'BaseAlpha',
                  fixedPrefix: 'Base',
                }),
                method: 'GET',
              },
              createDerivedClassNameGeneratorArgs: {
                className: 'BaseAlpha',
                fixedPrefix: 'Base',
              },
            },
          },
          {
            input: {
              SuperCtor: BaseAppBeta,
              pool: betaCtorPool,
              fixedPrefix: 'BaseApp',
              method: 'POST',
            },
            expected: {
              constructorArgs: {
                SuperCtor: BaseAppBeta,
                pool: betaCtorPool,
                classNameGenerator: DerivedClassNameGenerator.create({
                  className: 'BaseAppBeta',
                  fixedPrefix: 'BaseApp',
                }),
                method: 'POST',
              },
              createDerivedClassNameGeneratorArgs: {
                className: 'BaseAppBeta',
                fixedPrefix: 'BaseApp',
              },
            },
          },
        ]

        test.each(cases)('fixedPrefix: $input.fixedPrefix', ({ input, expected }) => {
          const createDynamicDerivedCtorPoolSpy = jest.spyOn(RestMethodRestfulApiPayloadDerivedCtorRegistry, 'createDynamicDerivedCtorPool')
          const createDerivedClassNameGeneratorSpy = jest.spyOn(RestMethodRestfulApiPayloadDerivedCtorRegistry, 'createDerivedClassNameGenerator')

          const SpyClass = globalThis.constructorSpy.spyOn(RestMethodRestfulApiPayloadDerivedCtorRegistry)

          SpyClass.create(input)

          expect(SpyClass.__spy__)
            .toHaveBeenCalledWith(expected.constructorArgs)

          expect(createDynamicDerivedCtorPoolSpy)
            .not
            .toHaveBeenCalledWith()
          expect(createDerivedClassNameGeneratorSpy)
            .toHaveBeenCalledWith(expected.createDerivedClassNameGeneratorArgs)
        })
      })

      describe('with omitted parameters', () => {
        /**
         * @type {Array<{
         *   input: Parameters<typeof RestMethodRestfulApiPayloadDerivedCtorRegistry['create']>[0]
         *   expected: {
         *     constructorArgs: ConstructorParameters<typeof RestMethodRestfulApiPayloadDerivedCtorRegistry>[0]
         *     createDerivedClassNameGeneratorArgs: Parameters<typeof RestMethodRestfulApiPayloadDerivedCtorRegistry['createDerivedClassNameGenerator']>[0]
         *   }
         * }>}
         */
        const cases = [
          {
            input: {
              SuperCtor: BaseAlpha,
              // pool: alphaCtorPool,
              fixedPrefix: 'Base',
              method: 'GET',
            },
            expected: {
              constructorArgs: {
                SuperCtor: BaseAlpha,
                pool: expect.any(DynamicDerivedCtorPool),
                classNameGenerator: DerivedClassNameGenerator.create({
                  className: 'BaseAlpha',
                  fixedPrefix: 'Base',
                }),
                method: 'GET',
              },
              createDerivedClassNameGeneratorArgs: {
                className: 'BaseAlpha',
                fixedPrefix: 'Base',
              },
            },
          },
          {
            input: {
              SuperCtor: BaseAppBeta,
              // pool: betaCtorPool,
              fixedPrefix: 'BaseApp',
              method: 'POST',
            },
            expected: {
              constructorArgs: {
                SuperCtor: BaseAppBeta,
                pool: expect.any(DynamicDerivedCtorPool),
                classNameGenerator: DerivedClassNameGenerator.create({
                  className: 'BaseAppBeta',
                  fixedPrefix: 'BaseApp',
                }),
                method: 'POST',
              },
              createDerivedClassNameGeneratorArgs: {
                className: 'BaseAppBeta',
                fixedPrefix: 'BaseApp',
              },
            },
          },
        ]

        test.each(cases)('fixedPrefix: $input.fixedPrefix', ({ input, expected }) => {
          const createDynamicDerivedCtorPoolSpy = jest.spyOn(RestMethodRestfulApiPayloadDerivedCtorRegistry, 'createDynamicDerivedCtorPool')
          const createDerivedClassNameGeneratorSpy = jest.spyOn(RestMethodRestfulApiPayloadDerivedCtorRegistry, 'createDerivedClassNameGenerator')

          const SpyClass = globalThis.constructorSpy.spyOn(RestMethodRestfulApiPayloadDerivedCtorRegistry)

          SpyClass.create(input)

          expect(SpyClass.__spy__)
            .toHaveBeenCalledWith(expected.constructorArgs)

          expect(createDynamicDerivedCtorPoolSpy)
            .toHaveBeenCalledWith()
          expect(createDerivedClassNameGeneratorSpy)
            .toHaveBeenCalledWith(expected.createDerivedClassNameGeneratorArgs)
        })
      })
    })
  })
})

describe('RestMethodRestfulApiPayloadDerivedCtorRegistry', () => {
  describe('#generatePrefix()', () => {
    const inputCases = [
      {
        input: {
          SuperCtor: BaseRestfulApiPayload,
          fixedPrefix: 'Base',
        },
      },
      {
        input: {
          SuperCtor: class BaseAppRestfulApiPayload extends BaseRestfulApiPayload {},
          fixedPrefix: 'BaseApp',
        },
      },
    ]

    describe.each(inputCases)('fixedPrefix: $input.fixedPrefix', ({ input }) => {
      /**
       * @type {Array<{
       *   method: import('~/types/restfulapi.js').METHOD
       *   expected: string
       * }>}
       */
      const cases = [
        {
          method: 'GET',
          expected: 'Get',
        },
        {
          method: 'POST',
          expected: 'Post',
        },
        {
          method: 'DELETE',
          expected: 'Delete',
        },
        {
          method: 'PUT',
          expected: 'Put',
        },
        {
          method: 'PATCH',
          expected: 'Patch',
        },
        {
          method: 'HEAD',
          expected: 'Head',
        },
        {
          method: 'OPTIONS',
          expected: 'Options',
        },
        {
          method: 'CONNECT',
          expected: 'Connect',
        },
        {
          method: 'TRACE',
          expected: 'Trace',
        },
      ]

      test.each(cases)('method: $method', ({ method, expected }) => {
        const args = {
          SuperCtor: input.SuperCtor,
          fixedPrefix: input.fixedPrefix,
          method,
        }
        const registry = RestMethodRestfulApiPayloadDerivedCtorRegistry.create(args)

        const actual = registry.generatePrefix()

        expect(actual)
          .toBe(expected)
      })
    })
  })
})

describe('RestMethodRestfulApiPayloadDerivedCtorRegistry', () => {
  describe('#declareCtor()', () => {
    const inputCases = [
      {
        input: {
          SuperCtor: BaseRestfulApiPayload,
          fixedPrefix: 'Base',
        },
      },
      {
        input: {
          SuperCtor: class BaseAppRestfulApiPayload extends BaseRestfulApiPayload {},
          fixedPrefix: 'BaseApp',
        },
      },
    ]

    describe.each(inputCases)('fixedPrefix: $input.fixedPrefix', ({ input }) => {
      /**
       * @type {Array<{
       *   method: import('~/types/restfulapi.js').METHOD
       *   expected: string
       * }>}
       */
      const cases = [
        {
          method: 'GET',
          expected: 'Get',
        },
        {
          method: 'POST',
          expected: 'Post',
        },
        {
          method: 'DELETE',
          expected: 'Delete',
        },
        {
          method: 'PUT',
          expected: 'Put',
        },
        {
          method: 'PATCH',
          expected: 'Patch',
        },
        {
          method: 'HEAD',
          expected: 'Head',
        },
        {
          method: 'OPTIONS',
          expected: 'Options',
        },
        {
          method: 'CONNECT',
          expected: 'Connect',
        },
        {
          method: 'TRACE',
          expected: 'Trace',
        },
      ]

      describe('to be derived class from SuperCtor', () => {
        test.each(cases)('method: $method', ({ method }) => {
          const args = {
            SuperCtor: input.SuperCtor,
            fixedPrefix: input.fixedPrefix,
            method,
          }
          const registry = RestMethodRestfulApiPayloadDerivedCtorRegistry.create(args)

          const DerivedClass = registry.declareCtor()

          expect(DerivedClass.prototype)
            .toBeInstanceOf(input.SuperCtor)
        })
      })

      describe('to be the same method', () => {
        test.each(cases)('method: $method', ({ method }) => {
          const args = {
            SuperCtor: input.SuperCtor,
            fixedPrefix: input.fixedPrefix,
            method,
          }
          const registry = RestMethodRestfulApiPayloadDerivedCtorRegistry.create(args)

          const DerivedClass = registry.declareCtor()
          const actual = DerivedClass.method

          expect(actual)
            .toBe(method)
        })
      })
    })
  })
})
