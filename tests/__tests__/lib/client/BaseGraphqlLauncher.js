import {
  ConstructorSpy,
} from '@openreachtech/jest-constructor-spy'

import BaseGraphqlLauncher from '~/lib/client/BaseGraphqlLauncher.js'
import BaseGraphqlPayload from '~/lib/client/BaseGraphqlPayload.js'
import {
  default as BaseGraphqlCapsule,
  LAUNCH_ABORTED_REASON,
} from '~/lib/client/graphql/BaseGraphqlCapsule'

import ProgressHttpFetcher from '~/lib/tools/ProgressHttpFetcher'

describe('BaseGraphqlLauncher', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      describe('#config', () => {
        const cases = [
          {
            params: {
              config: {
                ENDPOINT_URL: 'http://example.com/graphql-customer',
              },
            },
          },
          {
            params: {
              config: {
                ENDPOINT_URL: 'http://example.com/graphql-admin',
              },
            },
          },
        ]

        test.each(cases)('ENDPOINT_URL: $params.config.ENDPOINT_URL', ({ params }) => {
          const launcher = new BaseGraphqlLauncher(params)

          expect(launcher)
            .toHaveProperty('config', params.config)
        })
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      const cases = [
        {
          params: {
            config: {
              ENDPOINT_URL: 'http://example.com/graphql-customer',
            },
          },
        },
        {
          params: {
            config: {
              ENDPOINT_URL: 'http://example.com/graphql-admin',
            },
          },
        },
      ]

      test.each(cases)('ENDPOINT_URL: $params.config.ENDPOINT_URL', ({ params }) => {
        const launcher = BaseGraphqlLauncher.create(params)

        expect(launcher)
          .toBeInstanceOf(BaseGraphqlLauncher)
      })
    })

    describe('to call constructor', () => {
      const cases = [
        {
          params: {
            config: {
              ENDPOINT_URL: 'http://example.com/graphql-customer',
            },
          },
        },
        {
          params: {
            config: {
              ENDPOINT_URL: 'http://example.com/graphql-admin',
            },
          },
        },
      ]

      test.each(cases)('ENDPOINT_URL: $params.config.ENDPOINT_URL', ({ params }) => {
        const DerivedClass = ConstructorSpy.create({ jest })
          .spyOn(BaseGraphqlLauncher)

        DerivedClass.create(params)

        expect(DerivedClass.__spy__)
          .toHaveBeenCalledWith(params)
      })
    })

    describe('to throw', () => {
      test('without params', () => {
        expect(() => BaseGraphqlLauncher.create())
          .toThrow('this function must be inherited')
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.get:graphqlConfig', () => {
    test('to throw', () => {
      expect(() => BaseGraphqlLauncher.graphqlConfig)
        .toThrow('this function must be inherited')
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('#get:Ctor', () => {
    describe('to be own class', () => {
      const cases = [
        {
          params: {
            config: {
              ENDPOINT_URL: 'http://example.com/graphql-customer',
            },
          },
        },
        {
          params: {
            config: {
              ENDPOINT_URL: 'http://example.com/graphql-admin',
            },
          },
        },
      ]

      test.each(cases)('ENDPOINT_URL: $params.config.ENDPOINT_URL', ({ params }) => {
        const launcher = BaseGraphqlLauncher.create(params)

        expect(launcher.Ctor)
          .toBe(BaseGraphqlLauncher)
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.get:Launcher', () => {
    test('to be own', () => {
      const actual = BaseGraphqlLauncher.Launcher

      expect(actual)
        .toBe(BaseGraphqlLauncher) // same reference
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.get:Payload', () => {
    test('to throw', () => {
      expect(() => BaseGraphqlLauncher.Payload)
        .toThrow('this function must be inherited')
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.get:Capsule', () => {
    test('to throw', () => {
      expect(() => BaseGraphqlLauncher.Capsule)
        .toThrow('this function must be inherited')
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.createCapsuleAsPending()', () => {
    describe('to be instance of BaseGraphqlCapsule', () => {
      const cases = [
        {
          params: {
            CapsuleClass: class AlphaCapsule extends BaseGraphqlCapsule {},
          },
        },
        {
          params: {
            CapsuleClass: class BetaCapsule extends BaseGraphqlCapsule {},
          },
        },
      ]

      test.each(cases)('Capsule: $params.CapsuleClass.name', ({ params }) => {
        class Launcher extends BaseGraphqlLauncher {
          /** @override */
          static get Capsule () {
            return params.CapsuleClass
          }
        }

        const capsule = Launcher.createCapsuleAsPending()

        expect(capsule)
          .toBeInstanceOf(params.CapsuleClass)
      })
    })

    describe('to call Capsule factory method', () => {
      const cases = [
        {
          params: {
            CapsuleClass: class AlphaCapsule extends BaseGraphqlCapsule {},
          },
        },
        {
          params: {
            CapsuleClass: class BetaCapsule extends BaseGraphqlCapsule {},
          },
        },
      ]

      test.each(cases)('Capsule: $params.CapsuleClass.name', ({ params }) => {
        class Launcher extends BaseGraphqlLauncher {
          /** @override */
          static get Capsule () {
            return params.CapsuleClass
          }
        }

        const expected = {
          rawResponse: null,
          payload: null,
          result: null,
        }

        const createSpy = jest.spyOn(params.CapsuleClass, 'create')

        Launcher.createCapsuleAsPending()

        expect(createSpy)
          .toHaveBeenCalledWith(expected)

        createSpy.mockRestore()
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.createCapsuleAsInvalidVariablesError()', () => {
    describe('to be instance of BaseGraphqlCapsule', () => {
      const capsuleCases = [
        {
          params: {
            CapsuleClass: class AlphaCapsule extends BaseGraphqlCapsule {},
          },
        },
        {
          params: {
            CapsuleClass: class BetaCapsule extends BaseGraphqlCapsule {},
          },
        },
      ]

      describe.each(capsuleCases)('Capsule: $params.CapsuleClass.name', ({ params }) => {
        const cases = [
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    customer: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    admin: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
        ]

        test.each(cases)('payload: $args.payload', ({ args }) => {
          class Launcher extends BaseGraphqlLauncher {
            /** @override */
            static get Capsule () {
              return params.CapsuleClass
            }
          }

          const currentArgs = {
            payload: args.payload,
          }

          const capsule = Launcher.createCapsuleAsInvalidVariablesError(currentArgs)

          expect(capsule)
            .toBeInstanceOf(params.CapsuleClass)
        })
      })
    })

    describe('to call Capsule factory method', () => {
      const capsuleCases = [
        {
          params: {
            CapsuleClass: class AlphaCapsule extends BaseGraphqlCapsule {},
          },
        },
        {
          params: {
            CapsuleClass: class BetaCapsule extends BaseGraphqlCapsule {},
          },
        },
      ]

      describe.each(capsuleCases)('Capsule: $params.CapsuleClass.name', ({ params }) => {
        const cases = [
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    customer: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    admin: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
        ]

        test.each(cases)('payload: $args.payload', ({ args }) => {
          class Launcher extends BaseGraphqlLauncher {
            /** @override */
            static get Capsule () {
              return params.CapsuleClass
            }
          }

          const expected = {
            rawResponse: null,
            payload: args.payload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
          }

          const createSpy = jest.spyOn(params.CapsuleClass, 'create')

          const currentArgs = {
            payload: args.payload,
          }

          Launcher.createCapsuleAsInvalidVariablesError(currentArgs)

          expect(createSpy)
            .toHaveBeenCalledWith(expected)

          createSpy.mockRestore()
        })
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.createCapsuleAsAbortedByHooks()', () => {
    describe('to be instance of BaseGraphqlCapsule', () => {
      const capsuleCases = [
        {
          params: {
            CapsuleClass: class AlphaCapsule extends BaseGraphqlCapsule {},
          },
        },
        {
          params: {
            CapsuleClass: class BetaCapsule extends BaseGraphqlCapsule {},
          },
        },
      ]

      describe.each(capsuleCases)('Capsule: $params.CapsuleClass.name', ({ params }) => {
        const cases = [
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    customer: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    admin: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
        ]

        test.each(cases)('payload: $args.payload', ({ args }) => {
          class Launcher extends BaseGraphqlLauncher {
            /** @override */
            static get Capsule () {
              return params.CapsuleClass
            }
          }

          const currentArgs = {
            payload: args.payload,
          }

          const capsule = Launcher.createCapsuleAsAbortedByHooks(currentArgs)

          expect(capsule)
            .toBeInstanceOf(params.CapsuleClass)
        })
      })
    })

    describe('to call Capsule factory method', () => {
      const capsuleCases = [
        {
          params: {
            CapsuleClass: class AlphaCapsule extends BaseGraphqlCapsule {},
          },
        },
        {
          params: {
            CapsuleClass: class BetaCapsule extends BaseGraphqlCapsule {},
          },
        },
      ]

      describe.each(capsuleCases)('Capsule: $params.CapsuleClass.name', ({ params }) => {
        const cases = [
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    customer: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    admin: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    unknown: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
        ]

        test.each(cases)('payload: $args.payload', ({ args }) => {
          class Launcher extends BaseGraphqlLauncher {
            /** @override */
            static get Capsule () {
              return params.CapsuleClass
            }
          }

          const expected = {
            rawResponse: null,
            payload: args.payload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
          }

          const createSpy = jest.spyOn(params.CapsuleClass, 'create')

          const currentArgs = {
            payload: args.payload,
          }

          Launcher.createCapsuleAsAbortedByHooks(currentArgs)

          expect(createSpy)
            .toHaveBeenCalledWith(expected)

          createSpy.mockRestore()
        })
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.createCapsuleAsNetworkError()', () => {
    describe('to be instance of BaseGraphqlCapsule', () => {
      const capsuleCases = [
        {
          params: {
            CapsuleClass: class AlphaCapsule extends BaseGraphqlCapsule {},
          },
        },
        {
          params: {
            CapsuleClass: class BetaCapsule extends BaseGraphqlCapsule {},
          },
        },
      ]

      describe.each(capsuleCases)('Capsule: $params.CapsuleClass.name', ({ params }) => {
        const cases = [
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    customer: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    admin: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
        ]

        test.each(cases)('payload: $args.payload', ({ args }) => {
          class Launcher extends BaseGraphqlLauncher {
            /** @override */
            static get Capsule () {
              return params.CapsuleClass
            }
          }

          const currentArgs = {
            payload: args.payload,
          }

          const capsule = Launcher.createCapsuleAsNetworkError(currentArgs)

          expect(capsule)
            .toBeInstanceOf(params.CapsuleClass)
        })
      })
    })

    describe('to call Capsule factory method', () => {
      const capsuleCases = [
        {
          params: {
            CapsuleClass: class AlphaCapsule extends BaseGraphqlCapsule {},
          },
        },
        {
          params: {
            CapsuleClass: class BetaCapsule extends BaseGraphqlCapsule {},
          },
        },
      ]

      describe.each(capsuleCases)('Capsule: $params.CapsuleClass.name', ({ params }) => {
        const cases = [
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    customer: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
          {
            args: {
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    admin: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
        ]

        test.each(cases)('payload: $args.payload', ({ args }) => {
          class Launcher extends BaseGraphqlLauncher {
            /** @override */
            static get Capsule () {
              return params.CapsuleClass
            }
          }

          const expected = {
            rawResponse: null,
            payload: args.payload,
            result: null,
          }

          const createSpy = jest.spyOn(params.CapsuleClass, 'create')

          const currentArgs = {
            payload: args.payload,
          }

          Launcher.createCapsuleAsNetworkError(currentArgs)

          expect(createSpy)
            .toHaveBeenCalledWith(expected)

          createSpy.mockRestore()
        })
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.createCapsuleAsJsonParseError()', () => {
    describe('to be instance of BaseGraphqlCapsule', () => {
      const capsuleCases = [
        {
          params: {
            CapsuleClass: class AlphaCapsule extends BaseGraphqlCapsule {},
          },
        },
        {
          params: {
            CapsuleClass: class BetaCapsule extends BaseGraphqlCapsule {},
          },
        },
      ]

      describe.each(capsuleCases)('Capsule: $params.CapsuleClass.name', ({ params }) => {
        const cases = [
          {
            args: {
              rawResponse: new Response(),
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    customer: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
          {
            args: {
              rawResponse: new Response(),
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    admin: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
        ]

        test.each(cases)('payload: $args.payload', ({ args }) => {
          class Launcher extends BaseGraphqlLauncher {
            /** @override */
            static get Capsule () {
              return params.CapsuleClass
            }
          }

          const currentArgs = {
            rawResponse: args.rawResponse,
            payload: args.payload,
          }

          const capsule = Launcher.createCapsuleAsJsonParseError(currentArgs)

          expect(capsule)
            .toBeInstanceOf(params.CapsuleClass)
        })
      })
    })

    describe('to call Capsule factory method', () => {
      const capsuleCases = [
        {
          params: {
            CapsuleClass: class AlphaCapsule extends BaseGraphqlCapsule {},
          },
        },
        {
          params: {
            CapsuleClass: class BetaCapsule extends BaseGraphqlCapsule {},
          },
        },
      ]

      describe.each(capsuleCases)('Capsule: $params.CapsuleClass.name', ({ params }) => {
        const cases = [
          {
            args: {
              rawResponse: new Response(),
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    customer: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
          {
            args: {
              rawResponse: new Response(),
              payload: new BaseGraphqlPayload({
                queryTemplate: /* GraphQL */ `
                  query {
                    admin: {
                      id
                    }
                  }
                }`,
                variables: null,
              }),
            },
          },
        ]

        test.each(cases)('payload: $args.payload', ({ args }) => {
          class Launcher extends BaseGraphqlLauncher {
            /** @override */
            static get Capsule () {
              return params.CapsuleClass
            }
          }

          const expected = {
            rawResponse: args.rawResponse,
            payload: args.payload,
            result: null,
          }

          const createSpy = jest.spyOn(params.CapsuleClass, 'create')

          const currentArgs = {
            rawResponse: args.rawResponse,
            payload: args.payload,
          }

          Launcher.createCapsuleAsJsonParseError(currentArgs)

          expect(createSpy)
            .toHaveBeenCalledWith(expected)

          createSpy.mockRestore()
        })
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.get:fetch', () => {
    test('to be fixed value', () => {
      const actual = BaseGraphqlLauncher.fetch

      expect(actual)
        .toBe(fetch) // same reference
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.createHttpFetcher()', () => {
    test('to be fixed value', () => {
      const actual = BaseGraphqlLauncher.createHttpFetcher()

      expect(actual)
        .toBeInstanceOf(ProgressHttpFetcher)
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('#get:endpointUrl', () => {
    const cases = [
      {
        params: {
          config: {
            ENDPOINT_URL: 'http://example.com/graphql-customer',
          },
        },
        expected: 'http://example.com/graphql-customer',
      },
      {
        params: {
          config: {
            ENDPOINT_URL: 'http://example.com/graphql-admin',
          },
        },
        expected: 'http://example.com/graphql-admin',
      },
    ]

    test.each(cases)('ENDPOINT_URL: $params.config.ENDPOINT_URL', ({ params, expected }) => {
      const launcher = BaseGraphqlLauncher.create(params)

      const actual = launcher.endpointUrl

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.createPayload()', () => {
    describe('to be instance of Payload', () => {
      const cases = [
        {
          params: {
            /** @extends {BaseGraphqlPayload<*, *>} */
            Payload: class CustomerPayload extends BaseGraphqlPayload {
              /** @override */
              static get document () {
                return /* GraphQL */ `query {
                  customer (input: $input) {
                    id
                  }
                }`
              }
            },
            variables: {
              input: {
                id: 10001,
              },
            },
            options: {
              mode: 'cors',
            },
          },
        },
        {
          params: {
            /** @extends {BaseGraphqlPayload<*, *>} */
            Payload: class AdminPayload extends BaseGraphqlPayload {
              /** @override */
              static get document () {
                return /* GraphQL */ `query {
                  admin (input: $input) {
                    id
                  }
                }`
              }
            },
            variables: {
              input: {
                id: 20001,
              },
            },
          },
        },
      ]

      test.each(cases)('Payload: $params.Payload.name', ({ params }) => {
        const Launcher = class extends BaseGraphqlLauncher {
          /** @override */
          static get Payload () {
            return params.Payload
          }
        }

        const expected = {
          variables: params.variables,
        }

        const createSpy = jest.spyOn(params.Payload, 'create')

        const args = {
          variables: params.variables,
        }

        const payload = Launcher.createPayload(args)

        expect(payload)
          .toBeInstanceOf(params.Payload)

        expect(createSpy)
          .toHaveBeenCalledWith(expected)

        createSpy.mockRestore()
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.createPayloadWithValueHash()', () => {
    describe('to be instance of Payload', () => {
      /**
       * @type {Array<{
       *   params: {
       *     Payload: furo.PayloadCtor<*>
       *     valueHash: Record<string, *>
       *     options: RequestInit
       *   }
       *   expected: {
       *     valueHash: Record<string, *>
       *     options: RequestInit
       *   }
       * }>}
       */
      const cases = [
        {
          params: {
            /** @extends {BaseGraphqlPayload<*>} */
            Payload: class CustomerPayload extends BaseGraphqlPayload {
              /** @override */
              static get document () {
                return /* GraphQL */ `query {
                  customer (input: $input) {
                    id
                  }
                }`
              }
            },
            valueHash: {
              id: 10001,
            },
            options: {
              headers: new Headers({
                'x-access-token': 'access-token-01',
              }),
            },
          },
          expected: {
            valueHash: {
              id: 10001,
            },
            options: {
              headers: new Headers({
                'x-access-token': 'access-token-01',
              }),
            },
          },
        },
        {
          params: {
            /** @extends {BaseGraphqlPayload<*>} */
            Payload: class AdminPayload extends BaseGraphqlPayload {
              /** @override */
              static get document () {
                return /* GraphQL */ `query {
                  admin (input: $input) {
                    id
                  }
                }`
              }
            },
            valueHash: {
              id: 20001,
            },
            options: {
              mode: 'cors',
            },
          },
          expected: {
            valueHash: {
              id: 20001,
            },
            options: {
              mode: 'cors',
            },
          },
        },
      ]

      test.each(cases)('Payload: $params.Payload.name', ({ params, expected }) => {
        const Launcher = class extends BaseGraphqlLauncher {
          /** @override */
          static get Payload () {
            return params.Payload
          }
        }

        const createWithValueHashSpy = jest.spyOn(params.Payload, 'createWithValueHash')

        const args = {
          valueHash: params.valueHash,
          options: params.options,
        }

        const payload = Launcher.createPayloadWithValueHash(args)

        expect(payload)
          .toBeInstanceOf(params.Payload)

        expect(createWithValueHashSpy)
          .toHaveBeenCalledWith(expected)

        createWithValueHashSpy.mockRestore()
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.createPayloadWithFormValueHash()', () => {
    describe('to be instance of Payload', () => {
      describe('with full parameters', () => {
        /**
         * @type {Array<{
         *   params: {
         *     Payload: furo.PayloadCtor<*>
         *     valueHash: Record<string, *>
         *     extraValueHash: Record<string, *>
         *     options: RequestInit
         *   }
         *   expected: {
         *     valueHash: Record<string, *>
         *     extraValueHash: Record<string, *>
         *     options: RequestInit
         *   }
         * }>}
         */
        const cases = [
          {
            params: {
              /** @extends {BaseGraphqlPayload<*, *>} */
              Payload: class CustomerPayload extends BaseGraphqlPayload {
                /** @override */
                static get document () {
                  return /* GraphQL */ `query {
                    customer (input: $input) {
                      id
                    }
                  }`
                }
              },
              valueHash: {
                id: 10001,
              },
              extraValueHash: {
                label: 'Customer',
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-01',
                }),
              },
            },
            expected: {
              valueHash: {
                id: 10001,
              },
              extraValueHash: {
                label: 'Customer',
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-01',
                }),
              },
            },
          },
          {
            params: {
              /** @extends {BaseGraphqlPayload<*, *>} */
              Payload: class AdminPayload extends BaseGraphqlPayload {
                /** @override */
                static get document () {
                  return /* GraphQL */ `query {
                    admin (input: $input) {
                      id
                    }
                  }`
                }
              },
              valueHash: {
                id: 20001,
              },
              extraValueHash: {
                label: 'Admin',
              },
              options: {
                mode: 'cors',
              },
            },
            expected: {
              valueHash: {
                id: 20001,
              },
              extraValueHash: {
                label: 'Admin',
              },
              options: {
                mode: 'cors',
              },
            },
          },
        ]

        test.each(cases)('Payload: $params.Payload.name', ({ params, expected }) => {
          const Launcher = class extends BaseGraphqlLauncher {
            /** @override */
            static get Payload () {
              return params.Payload
            }
          }

          const createWithFormValueHashSpy = jest.spyOn(params.Payload, 'createWithFormValueHash')

          const args = {
            valueHash: params.valueHash,
            extraValueHash: params.extraValueHash,
            options: params.options,
          }

          const payload = Launcher.createPayloadWithFormValueHash(args)

          expect(payload)
            .toBeInstanceOf(params.Payload)

          expect(createWithFormValueHashSpy)
            .toHaveBeenCalledWith(expected)

          createWithFormValueHashSpy.mockRestore()
        })
      })

      describe('with no extraValueHash', () => {
        /**
         * @type {Array<{
         *   params: {
         *     Payload: furo.PayloadCtor<*>
         *     valueHash: Record<string, *>
         *     options: RequestInit
         *   }
         *   expected: {
         *     valueHash: Record<string, *>
         *     extraValueHash: Record<string, *>
         *     options: RequestInit
         *   }
         * }>}
         */
        const cases = [
          {
            params: {
              /** @extends {BaseGraphqlPayload<*, *>} */
              Payload: class CustomerPayload extends BaseGraphqlPayload {
                /** @override */
                static get document () {
                  return /* GraphQL */ `query {
                    customer (input: $input) {
                      id
                    }
                  }`
                }
              },
              valueHash: {
                id: 10001,
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-01',
                }),
              },
            },
            expected: {
              valueHash: {
                id: 10001,
              },
              extraValueHash: {},
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-01',
                }),
              },
            },
          },
          {
            params: {
              /** @extends {BaseGraphqlPayload<*, *>} */
              Payload: class AdminPayload extends BaseGraphqlPayload {
                /** @override */
                static get document () {
                  return /* GraphQL */ `query {
                    admin (input: $input) {
                      id
                    }
                  }`
                }
              },
              valueHash: {
                id: 20001,
              },
              options: {
                mode: 'cors',
              },
            },
            expected: {
              valueHash: {
                id: 20001,
              },
              extraValueHash: {},
              options: {
                mode: 'cors',
              },
            },
          },
        ]

        test.each(cases)('Payload: $params.Payload.name', ({ params, expected }) => {
          const Launcher = class extends BaseGraphqlLauncher {
            /** @override */
            static get Payload () {
              return params.Payload
            }
          }

          const createWithFormValueHashSpy = jest.spyOn(params.Payload, 'createWithFormValueHash')

          const args = {
            valueHash: params.valueHash,
            options: params.options,
          }

          const payload = Launcher.createPayloadWithFormValueHash(args)

          expect(payload)
            .toBeInstanceOf(params.Payload)

          expect(createWithFormValueHashSpy)
            .toHaveBeenCalledWith(expected)

          createWithFormValueHashSpy.mockRestore()
        })
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('.createCapsule()', () => {
    describe('to be instance of BaseGraphqlCapsule', () => {
      const MockGraphqlCapsule = class extends BaseGraphqlCapsule {}

      const cases = [
        {
          params: {
            rawResponse: new Response(),
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  customer {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  customerId: 10001,
                },
              },
            }),
            result: {
              data: {
                customer: {
                  id: 10001,
                },
              },
            },
          },
        },
        {
          params: {
            rawResponse: new Response(),
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  admin {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  adminId: 20001,
                },
              },
            }),
            result: {
              data: {
                admin: {
                  id: 20001,
                },
              },
            },
          },
        },
        {
          params: {
            rawResponse: new Response(),
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  user {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  userId: 30001,
                },
              },
            }),
            result: {
              data: {
                user: {
                  id: 30001,
                },
              },
            },
          },
        },
        {
          params: {
            rawResponse: new Response(),
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  unknown {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  unknownId: 40001,
                },
              },
            }),
            result: {
              data: {
                user: {
                  id: 40001,
                },
              },
            },
          },
        },
      ]

      test.each(cases)('result: $params.result', ({ params }) => {
        class Launcher extends BaseGraphqlLauncher {
          /** @override */
          static get Capsule () {
            return MockGraphqlCapsule
          }
        }

        const capsule = Launcher.createCapsule(params)

        expect(capsule)
          .toBeInstanceOf(BaseGraphqlCapsule)
      })
    })

    describe('to call Capsule factory method', () => {
      const MockGraphqlCapsule = class extends BaseGraphqlCapsule {}

      const cases = [
        {
          params: {
            rawResponse: new Response(),
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  customer {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  customerId: 10001,
                },
              },
            }),
            result: {
              data: {
                customer: {
                  id: 10001,
                },
              },
            },
            abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
          },
        },
        {
          params: {
            rawResponse: new Response(),
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  admin {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  adminId: 20001,
                },
              },
            }),
            result: {
              data: {
                admin: {
                  id: 20001,
                },
              },
            },
            abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
          },
        },
        {
          params: {
            rawResponse: new Response(),
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  unknown {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  unknownId: 40001,
                },
              },
            }),
            result: {
              data: {
                unknown: {
                  id: 40001,
                },
              },
            },
            abortedReason: LAUNCH_ABORTED_REASON.UNKNOWN,
          },
        },
        {
          params: {
            rawResponse: new Response(),
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  user {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  userId: 30001,
                },
              },
            }),
            result: {
              data: {
                user: {
                  id: 30001,
                },
              },
            },
            // abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      ]

      test.each(cases)('result: $params.result', ({ params }) => {
        class Launcher extends BaseGraphqlLauncher {
          /** @override */
          static get Capsule () {
            return MockGraphqlCapsule
          }
        }

        const createSpy = jest.spyOn(MockGraphqlCapsule, 'create')

        Launcher.createCapsule(params)

        expect(createSpy)
          .toHaveBeenCalledWith(params)

        createSpy.mockRestore()
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('#invokeFetchQuery()', () => {
    describe('to return response', () => {
      const customerQueryTemplate = /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      }`
      const adminQueryTemplate = /* GraphQL */ `
        query {
          admin {
            id
          }
        }
      `

      const cases = [
        {
          params: {
            endpointUrl: 'http://example.com/graphql-customer',
            payload: new BaseGraphqlPayload({
              queryTemplate: customerQueryTemplate,
              variables: null,
            }),
            sink: {
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
          tally: {
            request: new Request('http://example.com/graphql-customer', {
              method: 'POST',
              headers: new Headers({
                'content-type': 'application/json',
                'x-access-token': 'access-token-01',
              }),
              body: JSON.stringify({
                query: customerQueryTemplate,
              }),
            }),
            sink: {
              onUploadProgress: expect.any(Function),
              onDownloadProgress: expect.any(Function),
            },
          },
        },
        {
          params: {
            endpointUrl: 'http://example.com/graphql-admin',
            payload: new BaseGraphqlPayload({
              queryTemplate: adminQueryTemplate,
              variables: null,
            }),
            sink: {
              onUploadProgress: () => {},
              // onDownloadProgress: () => {},
            },
          },
          tally: {
            request: new Request('http://example.com/graphql-admin', {
              method: 'POST',
              headers: new Headers({
                'content-type': 'application/json',
                'x-access-token': 'access-token-02',
              }),
              body: JSON.stringify({
                query: adminQueryTemplate,
              }),
            }),
            sink: {
              onUploadProgress: expect.any(Function),
              onDownloadProgress: expect.any(Function),
            },
          },
        },
      ]

      test.each(cases)('endpointUrl: $params.request.endpointUrl', async ({ params, tally }) => {
        const responseTally = new Response()
        const httpFetcherMock = ProgressHttpFetcher.create()

        const expectedArgsForCreateFetchRequest = {
          url: params.endpointUrl,
        }

        const createFetchRequestSpy = jest.spyOn(params.payload, 'createFetchRequest')
          .mockReturnValue(tally.request)
        const createHttpFetcherSpy = jest.spyOn(BaseGraphqlLauncher, 'createHttpFetcher')
          .mockReturnValue(httpFetcherMock)
        const fetchRequestSpy = jest.spyOn(httpFetcherMock, 'fetchRequest')
          .mockResolvedValue(responseTally)

        const launcher = BaseGraphqlLauncher.create({
          config: {
            ENDPOINT_URL: params.endpointUrl,
          },
        })
        const args = {
          payload: params.payload,
          sink: params.sink,
        }

        const actual = await launcher.invokeFetchQuery(args)

        expect(actual)
          .toBe(responseTally) // same instance

        expect(createFetchRequestSpy)
          .toHaveBeenCalledWith(expectedArgsForCreateFetchRequest)
        expect(createHttpFetcherSpy)
          .toHaveBeenCalledWith()
        expect(fetchRequestSpy)
          .toHaveBeenCalledWith(tally)
      })
    })

    describe('to throw on fetch', () => {
      const customerQueryTemplate = /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      }`
      const adminQueryTemplate = /* GraphQL */ `
        query {
          admin {
            id
          }
        }
      `

      const cases = [
        {
          params: {
            endpointUrl: 'http://example.com/graphql-customer',
            payload: new BaseGraphqlPayload({
              queryTemplate: customerQueryTemplate,
              variables: null,
            }),
            sink: {
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
          tally: {
            request: new Request('http://example.com/graphql-customer', {
              method: 'POST',
              headers: new Headers({
                'content-type': 'application/json',
                'x-access-token': 'access-token-01',
              }),
              body: JSON.stringify({
                query: customerQueryTemplate,
              }),
            }),
            sink: {
              onUploadProgress: expect.any(Function),
              onDownloadProgress: expect.any(Function),
            },
          },
        },
        {
          params: {
            endpointUrl: 'http://example.com/graphql-admin',
            payload: new BaseGraphqlPayload({
              queryTemplate: adminQueryTemplate,
              variables: null,
            }),
            sink: {
              onUploadProgress: () => {},
              // onDownloadProgress: () => {},
            },
          },
          tally: {
            request: new Request('http://example.com/graphql-admin', {
              method: 'POST',
              headers: new Headers({
                'content-type': 'application/json',
                'x-access-token': 'access-token-02',
              }),
              body: JSON.stringify({
                query: adminQueryTemplate,
              }),
            }),
            sink: {
              onUploadProgress: expect.any(Function),
              onDownloadProgress: expect.any(Function),
            },
          },
        },
      ]

      test.each(cases)('endpointUrl: $params.request.endpointUrl', async ({ params, tally }) => {
        const httpFetcherMock = ProgressHttpFetcher.create()

        jest.spyOn(params.payload, 'createFetchRequest')
          .mockReturnValue(tally.request)
        jest.spyOn(BaseGraphqlLauncher, 'createHttpFetcher')
          .mockReturnValue(httpFetcherMock)
        jest.spyOn(httpFetcherMock, 'fetchRequest')
          .mockRejectedValue(new Error('Network Error'))

        const launcher = BaseGraphqlLauncher.create({
          config: {
            ENDPOINT_URL: params.endpointUrl,
          },
        })
        const args = {
          payload: params.payload,
          options: params.options,
        }

        const actual = await launcher.invokeFetchQuery(args)

        expect(actual)
          .toBeNull()
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('#generateFetchResult()', () => {
    describe('to be parsed JSON object', () => {
      const cases = [
        {
          params: {
            response: new Response(`{
              "data": {
                "customer": {
                  "id": 10001
                }
              }
            }`),
          },
          expected: {
            data: {
              customer: {
                id: 10001,
              },
            },
          },
        },
        {
          params: {
            response: new Response(`{
              "data": {
                "customer": {
                  "id": 10002
                }
              }
            }`),
          },
          expected: {
            data: {
              customer: {
                id: 10002,
              },
            },
          },
        },
        {
          params: {
            response: new Response(`{
              "errors": [
                {
                  "message": "Error message 01"
                },
                {
                  "message": "Error message 02"
                }
              ]
            }`),
          },
          expected: {
            errors: [
              {
                message: 'Error message 01',
              },
              {
                message: 'Error message 02',
              },
            ],
          },
        },
        {
          params: {
            response: new Response(`{
              "errors": [
                {
                  "message": "Error message 03"
                }
              ]
            }`),
          },
          expected: {
            errors: [
              {
                message: 'Error message 03',
              },
            ],
          },
        },
      ]

      test.each(cases)('response: $params.response', async ({ params, expected }) => {
        const launcher = BaseGraphqlLauncher.create({
          config: {
            ENDPOINT_URL: 'http://example.com/graphql-customer',
          },
        })

        const actual = await launcher.generateFetchResult(params)

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('on JSON parsed error', () => {
      const cases = [
        {
          params: {
            response: new Response(`{
              "data": {
                "customer": {
                  "id": 10001
                }
              }
            }}`), // ERROR: last } is doubled
          },
        },
        {
          params: {
            response: new Response(`{
              "data": {
                "customer": {
                  "id": 10002
                }
              }
            }}`), // ERROR: last } is doubled
          },
        },
        {
          params: {
            response: new Response(`{
              "errors": [
                {
                  "message": "Error message 01"
                },
                {
                  "message": "Error message 02"
                }
              ]
            }}`), // ERROR: last } is doubled
          },
        },
        {
          params: {
            response: new Response(`{
              "errors": [
                {
                  "message": "Error message 03"
                }
              ]
            }}`), // ERROR: last } is doubled
          },
        },
      ]

      test.each(cases)('response: $params.response', async ({ params }) => {
        const launcher = BaseGraphqlLauncher.create({
          config: {
            ENDPOINT_URL: 'http://example.com/graphql-admin',
          },
        })

        const actual = await launcher.generateFetchResult(params)

        expect(actual)
          .toBeNull()
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('#retrieveCapsule()', () => {
    describe('to return network error capsule on null response', () => {
      const cases = [
        {
          params: {
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  customer {
                    id
                  }
                }
              `,
              variables: null,
            }),
          },
        },
        {
          params: {
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  admin {
                    id
                  }
                }
              `,
              variables: null,
            }),
          },
        },
      ]

      test.each(cases)('payload: $params.payload', async ({ params }) => {
        const expectedArgs = {
          payload: params.payload,
        }

        const capsuleTally = BaseGraphqlCapsule.createAsNetworkError({
          payload: params.payload,
        })

        const launcher = BaseGraphqlLauncher.create({
          config: {
            ENDPOINT_URL: 'http://example.com/graphql',
          },
        })

        const createCapsuleAsNetworkErrorSpy = jest.spyOn(BaseGraphqlLauncher, 'createCapsuleAsNetworkError')
          .mockReturnValue(capsuleTally)

        const args = {
          payload: params.payload,
          response: null,
        }

        const actual = await launcher.retrieveCapsule(args)

        expect(actual)
          .toBe(capsuleTally) // same reference

        expect(createCapsuleAsNetworkErrorSpy)
          .toHaveBeenCalledWith(expectedArgs)
      })
    })

    describe('to return JSON parse error capsule on invalid JSON', () => {
      const cases = [
        {
          params: {
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  customer {
                    id
                  }
                }
              `,
              variables: null,
            }),
          },
        },
        {
          params: {
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  admin {
                    id
                  }
                }
              `,
              variables: null,
            }),
          },
        },
      ]

      test.each(cases)('payload: $params.payload', async ({ params }) => {
        const rawResponseTally = new Response(`{
          "data": {
            "customer": {
              "id": 10001
            }
          }
        }}`) // ERROR: last } is doubled

        const capsuleTally = BaseGraphqlCapsule.createAsJsonParseError({
          rawResponse: rawResponseTally,
          payload: params.payload,
        })

        const expectedArgs = {
          rawResponse: rawResponseTally,
          payload: params.payload,
        }

        const createCapsuleAsJsonParseErrorSpy = jest.spyOn(BaseGraphqlLauncher, 'createCapsuleAsJsonParseError')
          .mockReturnValue(capsuleTally)

        const launcher = BaseGraphqlLauncher.create({
          config: {
            ENDPOINT_URL: 'http://example.com/graphql',
          },
        })

        const args = {
          payload: params.payload,
          response: rawResponseTally,
        }

        const actual = await launcher.retrieveCapsule(args)

        expect(actual)
          .toEqual(capsuleTally)

        expect(createCapsuleAsJsonParseErrorSpy)
          .toHaveBeenCalledWith(expectedArgs)
      })
    })

    describe('to return result capsule on success', () => {
      const cases = [
        {
          params: {
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  customer {
                    id
                  }
                }
              `,
              variables: null,
            }),
            rawResponse: new Response(`{
              "data": {
                "customer": {
                  "id": 10001
                }
              }
            }`),
            result: {
              data: {
                customer: {
                  id: 10001,
                },
              },
            },
          },
        },
        {
          params: {
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  admin {
                    id
                  }
                }
              `,
              variables: null,
            }),
            rawResponse: new Response(`{
              "data": {
                "admin": {
                  "id": 20001
                }
              }
            }`),
            result: {
              data: {
                admin: {
                  id: 20001,
                },
              },
            },
          },
        },
      ]

      test.each(cases)('payload: $params.payload', async ({ params }) => {
        const capsuleTally = BaseGraphqlCapsule.create({
          rawResponse: params.rawResponse,
          payload: params.payload,
          result: params.result,
        })

        const expectedArgsForGenerateFetchResult = {
          response: params.rawResponse,
        }
        const expectedArgsForCreateCapsule = {
          rawResponse: params.rawResponse,
          payload: params.payload,
          result: params.result,
        }

        class Launcher extends BaseGraphqlLauncher {
          /** @override */
          static get Capsule () {
            return BaseGraphqlCapsule
          }
        }

        const launcher = Launcher.create({
          config: {
            ENDPOINT_URL: 'http://example.com/graphql',
          },
        })

        const generateFetchResultSpy = jest.spyOn(launcher, 'generateFetchResult')
          .mockResolvedValue(params.result)
        const createCapsuleSpy = jest.spyOn(Launcher, 'createCapsule')
          .mockReturnValue(capsuleTally)

        const args = {
          payload: params.payload,
          response: params.rawResponse,
        }

        const actual = await launcher.retrieveCapsule(args)

        expect(actual)
          .toBe(capsuleTally)

        expect(generateFetchResultSpy)
          .toHaveBeenCalledWith(expectedArgsForGenerateFetchResult)
        expect(createCapsuleSpy)
          .toHaveBeenCalledWith(expectedArgsForCreateCapsule)
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('#launchRequest()', () => {
    describe('to return result capsule on success', () => {
      const graphqlConfig = {
        ENDPOINT_URL: 'http://example.com/graphql-customer',
      }

      const cases = [
        {
          params: {
            endpointUrl: 'http://example.com/graphql-customer',
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query CustomerQuery ($input: CustomerSearchInput!) {
                  customer (input: $input) {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  id: 10001,
                },
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-01',
                }),
              },
            }),
            Capsule: class CustomerCapsule extends BaseGraphqlCapsule {},
          },
          tally: {
            response: new Response(`{
              "data": {
                "customer": {
                  "id": 10001
                }
              }
            }`),
          },
          expected: {
            customer: {
              id: 10001,
            },
          },
        },
        {
          params: {
            endpointUrl: 'http://example.com/graphql-admin',
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  admin {
                    id
                  }
                }
              `,
              variables: {},
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-02',
                }),
              },
            }),
            Capsule: class AdminCapsule extends BaseGraphqlCapsule {},
          },
          tally: {
            response: new Response(`{
              "data": {
                "admin": {
                  "id": 20001
                }
              }
            }`),
          },
          expected: {
            admin: {
              id: 20001,
            },
          },
        },
      ]

      test.each(cases)('endpointUrl: $params.endpointUrl', async ({
        params,
        tally,
        expected,
      }) => {
        const hooksTally = {
          afterRequest: async () => {},
        }

        class Launcher extends BaseGraphqlLauncher {
          /** @override */
          static get Capsule () {
            return params.Capsule
          }
        }

        const launcher = Launcher.create({
          config: graphqlConfig,
        })

        jest.spyOn(launcher, 'invokeFetchQuery')
          .mockResolvedValue(tally.response)
        const afterRequestSpy = jest.spyOn(hooksTally, 'afterRequest')

        const args = {
          payload: params.payload,
          hooks: hooksTally,
        }

        const actual = await launcher.launchRequest(args)

        expect(actual)
          .toBeInstanceOf(params.Capsule)
        expect(actual.extractContent())
          .toEqual(expected)

        expect(afterRequestSpy)
          .toHaveBeenCalledWith(actual)
      })
    })

    describe('to call #extendRequestHooks()', () => {
      const MockGraphqlLauncher = class extends BaseGraphqlLauncher {
        /** @override */
        static get Capsule () {
          return BaseGraphqlCapsule
        }
      }

      const launcher = MockGraphqlLauncher.create({
        config: {
          ENDPOINT_URL: 'http://example.com/graphql',
        },
      })

      const cases = [
        {
          params: {
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  customer {
                    id
                  }
                }`,
              variables: null,
            }),
            hooks: {
              beforeRequest: async payload => false,
              afterRequest: async capsule => {},
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  admin {
                    id
                  }
                }`,
              variables: null,
            }),
            hooks: {
              beforeRequest: async () => true,
              afterRequest: async capsule => {},
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
      ]

      test.each(cases)('[$#]', async ({ params }) => {
        jest.spyOn(launcher, 'invokeFetchQuery')
          .mockResolvedValue(null)

        const extendRequestHooksSpy = jest.spyOn(launcher, 'extendRequestHooks')

        await launcher.launchRequest(params)

        expect(extendRequestHooksSpy)
          .toHaveBeenCalledWith(params.hooks)
      })

      test('without hooks', async () => {
        const expected = {
          beforeRequest: expect.any(Function),
          afterRequest: expect.any(Function),
          onUploadProgress: expect.any(Function),
          onDownloadProgress: expect.any(Function),
        }

        const extendRequestHooksSpy = jest.spyOn(launcher, 'extendRequestHooks')

        const payload = new BaseGraphqlPayload({
          queryTemplate: /* GraphQL */ `
            query {
              customer {
                id
              }
            }`,
          variables: null,
        })
        const args = {
          payload,
        }

        await launcher.launchRequest(args)

        expect(extendRequestHooksSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('to return Invalid variables error capsule', () => {
      /** @extends {BaseGraphqlCapsule<typeof DerivedCapsule, *>} */
      class DerivedCapsule extends BaseGraphqlCapsule {}

      /** @extends {BaseGraphqlPayload<*>} */
      class DerivedPayload extends BaseGraphqlPayload {
        /** @override */
        static get document () {
          return /* GraphQL */ `
            query {
              customer {
                id
              }
            }
          `
        }

        /** @override */
        static get fieldHash () {
          return {
            input: [
              'username',
              'password',
            ],
          }
        }
      }

      test('to not call #invokeFetchQuery() with invalid variables', async () => {
        const invalidVariablesPayload = DerivedPayload.create({
          variables: {
            input: {
              username: 'JohnDoe',
              password: 'password$01',
              extra: 'extra value', // ❌
            },
          },
        })

        class Launcher extends BaseGraphqlLauncher {
          /** @override */
          static get Capsule () {
            return DerivedCapsule
          }
        }

        const launcher = Launcher.create({
          config: {
            ENDPOINT_URL: 'http://example.com/graphql-customer',
          },
        })

        const expectedCapsule = DerivedCapsule.create({
          rawResponse: null,
          payload: invalidVariablesPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
        })

        const createCapsuleAsInvalidVariablesErrorSpy = jest.spyOn(BaseGraphqlLauncher, 'createCapsuleAsInvalidVariablesError')
        const invokeFetchQuerySpy = jest.spyOn(launcher, 'invokeFetchQuery')
          .mockRejectedValue(null)

        const args = {
          payload: invalidVariablesPayload,
        }

        const actual = await launcher.launchRequest(args)

        expect(actual)
          .toEqual(expectedCapsule)

        expect(createCapsuleAsInvalidVariablesErrorSpy)
          .toHaveBeenCalledWith(args)
        expect(invokeFetchQuerySpy)
          .not
          .toHaveBeenCalledWith()

        createCapsuleAsInvalidVariablesErrorSpy.mockRestore()
        invokeFetchQuerySpy.mockRestore()
      })
    })

    describe('to return Aborted by hooks capsule', () => {
      const cases = [
        {
          params: {
            endpointUrl: 'http://example.com/graphql-customer',
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query CustomerQuery ($input: CustomerSearchInput!) {
                  customer (input: $input) {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  id: 10001,
                },
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-01',
                }),
              },
            }),
            Capsule: class CustomerCapsule extends BaseGraphqlCapsule {},
            hooks: {
              beforeRequest: async () => true, // Will abort the request
              afterRequest: async () => {},
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            endpointUrl: 'http://example.com/graphql-admin',
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  admin {
                    id
                  }
                }
              `,
              variables: {},
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-02',
                }),
              },
            }),
            Capsule: class AdminCapsule extends BaseGraphqlCapsule {},
            hooks: {
              beforeRequest: async () => true, // Will abort the request
              afterRequest: async () => {},
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
      ]

      test.each(cases)('endpointUrl: $params.endpointUrl', async ({ params }) => {
        class Launcher extends BaseGraphqlLauncher {
          /** @override */
          static get Capsule () {
            return params.Capsule
          }
        }

        const launcher = Launcher.create({
          config: {
            ENDPOINT_URL: params.endpointUrl,
          },
        })

        const expectedCapsule = params.Capsule.create({
          rawResponse: null,
          payload: params.payload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
        })

        const createCapsuleAsAbortedByHooksSpy = jest.spyOn(Launcher, 'createCapsuleAsAbortedByHooks')
        const invokeFetchQuerySpy = jest.spyOn(launcher, 'invokeFetchQuery')

        const args = {
          payload: params.payload,
          hooks: params.hooks,
        }

        const actual = await launcher.launchRequest(args)

        expect(actual)
          .toEqual(expectedCapsule)

        expect(createCapsuleAsAbortedByHooksSpy)
          .toHaveBeenCalledWith({
            payload: params.payload,
          })
        expect(invokeFetchQuerySpy)
          .not
          .toHaveBeenCalled()
      })
    })

    describe('to return Network error capsule', () => {
      const cases = [
        {
          params: {
            endpointUrl: 'http://example.com/graphql-customer',
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query CustomerQuery ($input: CustomerSearchInput!) {
                  customer (input: $input) {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  id: 10001,
                },
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-01',
                }),
              },
            }),
            Capsule: class CustomerCapsule extends BaseGraphqlCapsule {},
          },
        },
        {
          params: {
            endpointUrl: 'http://example.com/graphql-admin',
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  admin {
                    id
                  }
                }
              `,
              variables: {
                input: null,
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-02',
                }),
              },
            }),
            Capsule: class AdminCapsule extends BaseGraphqlCapsule {},
          },
        },
      ]

      test.each(cases)('endpointUrl: $params.endpointUrl', async ({ params }) => {
        const hooksTally = {
          afterRequest: async () => {},
        }

        class Launcher extends BaseGraphqlLauncher {
          /** @override */
          static get Capsule () {
            return params.Capsule
          }
        }

        jest.spyOn(globalThis, 'fetch')
          .mockRejectedValue(new Error('Network Error'))
        const afterRequestSpy = jest.spyOn(hooksTally, 'afterRequest')

        const launcher = Launcher.create({
          config: {
            ENDPOINT_URL: params.endpointUrl,
          },
        })
        const args = {
          payload: params.payload,
          hooks: hooksTally,
        }

        const actual = await launcher.launchRequest(args)

        expect(actual)
          .toBeInstanceOf(params.Capsule)
        expect(actual)
          .toHaveProperty('rawResponse', null)
        expect(actual.extractContent())
          .toBeNull()

        expect(afterRequestSpy)
          .toHaveBeenCalledWith(actual)
      })
    })

    describe('to return JSON parse error capsule', () => {
      const cases = [
        {
          params: {
            endpointUrl: 'http://example.com/graphql-customer',
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query CustomerQuery ($input: CustomerSearchInput!) {
                  customer (input: $input) {
                    id
                  }
                }
              `,
              variables: {
                input: {
                  id: 10001,
                },
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-01',
                }),
              },
            }),
            Capsule: class CustomerCapsule extends BaseGraphqlCapsule {},
          },
          tally: {
            response: new Response(`{
              "data": {
                "customer": {
                  "id": 10001
                }
              }
            }}`), // ERROR: last } is doubled
          },
        },
        {
          params: {
            endpointUrl: 'http://example.com/graphql-admin',
            payload: new BaseGraphqlPayload({
              queryTemplate: /* GraphQL */ `
                query {
                  admin {
                    id
                  }
                }
              `,
              variables: {
                input: null,
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-02',
                }),
              },
            }),
            Capsule: class AdminCapsule extends BaseGraphqlCapsule {},
          },
          tally: {
            response: new Response(`{
              "data": {
                "admin": {
                  "id": 20001
                }
              }
            }}`), // ERROR: last } is doubled
          },
        },
      ]

      test.each(cases)('endpointUrl: $params.endpointUrl', async ({
        params,
        tally,
      }) => {
        const hooksTally = {
          afterRequest: async () => {},
        }

        const Launcher = class AdminLauncher extends BaseGraphqlLauncher {
          /** @override */
          static get Capsule () {
            return params.Capsule
          }
        }

        jest.spyOn(globalThis, 'fetch')
          .mockResolvedValue(tally.response)
        const afterRequestSpy = jest.spyOn(hooksTally, 'afterRequest')

        const launcher = Launcher.create({
          config: {
            ENDPOINT_URL: params.endpointUrl,
          },
        })
        const args = {
          payload: params.payload,
          hooks: hooksTally,
        }

        const actual = await launcher.launchRequest(args)

        expect(actual)
          .toBeInstanceOf(params.Capsule)
        expect(actual.extractContent())
          .toBeNull()

        expect(afterRequestSpy)
          .toHaveBeenCalledWith(actual)
      })
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('#extendBeforeRequestHook()', () => {
    const launcher = BaseGraphqlLauncher.create({
      config: {
        ENDPOINT_URL: 'http://example.com/graphql',
      },
    })

    /**
     * @param {BaseGraphqlPayload} payload
     * @returns {Promise<boolean>}
     */
    async function alphaHook (payload) {
      return false
    }

    /**
     * @param {BaseGraphqlPayload} payload
     * @returns {Promise<boolean>}
     */
    async function betaHook (payload) {
      return true
    }

    const cases = [
      {
        params: {
          beforeRequest: alphaHook,
        },
      },
      {
        params: {
          beforeRequest: betaHook,
        },
      },
    ]

    test.each(cases)('beforeRequest: $params.beforeRequest.name', ({ params }) => {
      const actual = launcher.extendBeforeRequestHook(params)

      expect(actual)
        .toBe(params.beforeRequest) // same reference
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('#extendAfterRequestHook()', () => {
    const launcher = BaseGraphqlLauncher.create({
      config: {
        ENDPOINT_URL: 'http://example.com/graphql',
      },
    })

    /**
     * @param {BaseGraphqlCapsule} capsule
     * @returns {Promise<void>}
     */
    async function alphaHook (capsule) {
      // noop
    }

    /**
     * @param {BaseGraphqlCapsule} capsule
     * @returns {Promise<void>}
     */
    async function betaHook (capsule) {
      // noop
    }

    const cases = [
      {
        params: {
          afterRequest: alphaHook,
        },
      },
      {
        params: {
          afterRequest: betaHook,
        },
      },
    ]

    test.each(cases)('afterRequest: $params.afterRequest.name', ({ params }) => {
      const extendedHook = launcher.extendAfterRequestHook(params)

      expect(extendedHook)
        .toBe(params.afterRequest) // same reference
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('#extendOnUploadProgressHook()', () => {
    const launcher = BaseGraphqlLauncher.create({
      config: {
        ENDPOINT_URL: 'http://example.com/graphql',
      },
    })

    /**
     * @param {{
     *   request: Request
     *   progressEvent: ProgressEvent
     * }} args
     * @returns {void}
     */
    function alphaHook (args) {
      // noop
    }

    /**
     * @param {{
     *   request: Request
     *   progressEvent: ProgressEvent
     * }} args
     * @returns {void}
     */
    function betaHook (args) {
      // noop
    }

    const cases = [
      {
        params: {
          onUploadProgress: alphaHook,
        },
      },
      {
        params: {
          onUploadProgress: betaHook,
        },
      },
    ]

    test.each(cases)('onUploadProgress: $params.onUploadProgress.name', ({ params }) => {
      const extendedHook = launcher.extendOnUploadProgressHook(params)

      expect(extendedHook)
        .toBe(params.onUploadProgress) // same reference
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('#extendOnDownloadProgressHook()', () => {
    const launcher = BaseGraphqlLauncher.create({
      config: {
        ENDPOINT_URL: 'http://example.com/graphql',
      },
    })

    /**
     * @param {{
     *   request: Request
     *   progressEvent: ProgressEvent
     * }} args
     * @returns {void}
     */
    function alphaHook (args) {
      // noop
    }

    /**
     * @param {{
     *   request: Request
     *   progressEvent: ProgressEvent
     * }} args
     * @returns {void}
     */
    function betaHook (args) {
      // noop
    }

    const cases = [
      {
        params: {
          onDownloadProgress: alphaHook,
        },
      },
      {
        params: {
          onDownloadProgress: betaHook,
        },
      },
    ]

    test.each(cases)('onDownloadProgress: $params.onDownloadProgress.name', ({ params }) => {
      const extendedHook = launcher.extendOnDownloadProgressHook(params)

      expect(extendedHook)
        .toBe(params.onDownloadProgress) // same reference
    })
  })
})

describe('BaseGraphqlLauncher', () => {
  describe('#extendRequestHooks()', () => {
    const launcher = BaseGraphqlLauncher.create({
      config: {
        ENDPOINT_URL: 'http://example.com/graphql',
      },
    })

    /**
     * @param {BaseGraphqlPayload} payload
     * @returns {Promise<boolean>}
     */
    async function alphaBeforeHook (payload) {
      return false
    }

    /**
     * @param {BaseGraphqlPayload} payload
     * @returns {Promise<boolean>}
     */
    async function betaBeforeHook (payload) {
      return true
    }

    /**
     * @param {BaseGraphqlCapsule} capsule
     * @returns {Promise<void>}
     */
    async function alphaAfterHook (capsule) {
      // noop
    }

    /**
     * @param {BaseGraphqlCapsule} capsule
     * @returns {Promise<void>}
     */
    async function betaAfterHook (capsule) {
      // noop
    }

    /**
     * @param {{
     *   request: Request
     *   progressEvent: ProgressEvent
     * }} args
     * @returns {void}
     */
    function alphaUploadProgressHook (args) {
      // noop
    }

    /**
     * @param {{
     *   request: Request
     *   progressEvent: ProgressEvent
     * }} args
     * @returns {void}
     */
    function betaUploadProgressHook (args) {
      // noop
    }

    /**
     * @param {{
     *   request: Request
     *   progressEvent: ProgressEvent
     * }} args
     * @returns {void}
     */
    function alphaDownloadProgressHook (args) {
      // noop
    }

    /**
     * @param {{
     *   request: Request
     *   progressEvent: ProgressEvent
     * }} args
     * @returns {void}
     */
    function betaDownloadProgressHook (args) {
      // noop
    }

    const cases = [
      {
        params: {
          hooks: {
            beforeRequest: alphaBeforeHook,
            afterRequest: alphaAfterHook,
            onUploadProgress: alphaUploadProgressHook,
            onDownloadProgress: alphaDownloadProgressHook,
          },
        },
      },
      {
        params: {
          hooks: {
            beforeRequest: betaBeforeHook,
            afterRequest: betaAfterHook,
            onUploadProgress: betaUploadProgressHook,
            onDownloadProgress: betaDownloadProgressHook,
          },
        },
      },
    ]

    describe('to have properties', () => {
      test.each(cases)('afterRequest: $params.hooks.afterRequest.name', ({ params }) => {
        const extendedHooks = launcher.extendRequestHooks(params.hooks)

        expect(extendedHooks)
          .toHaveProperty('beforeRequest', params.hooks.beforeRequest)
        expect(extendedHooks)
          .toHaveProperty('afterRequest', params.hooks.afterRequest)
        expect(extendedHooks)
          .toHaveProperty('onUploadProgress', params.hooks.onUploadProgress)
        expect(extendedHooks)
          .toHaveProperty('onDownloadProgress', params.hooks.onDownloadProgress)
      })
    })

    describe('to call members', () => {
      test.each(cases)('afterRequest: $params.hooks.afterRequest.name', ({ params }) => {
        const expectedArgsBeforeRequest = {
          beforeRequest: params.hooks.beforeRequest,
        }
        const expectedArgsAfterRequest = {
          afterRequest: params.hooks.afterRequest,
        }
        const expectedArgsOnUploadProgress = {
          onUploadProgress: params.hooks.onUploadProgress,
        }
        const expectedArgsOnDownloadProgress = {
          onDownloadProgress: params.hooks.onDownloadProgress,
        }

        const extendBeforeRequestHookSpy = jest.spyOn(launcher, 'extendBeforeRequestHook')
        const extendAfterRequestHookSpy = jest.spyOn(launcher, 'extendAfterRequestHook')
        const extendOnUploadProgressHookSpy = jest.spyOn(launcher, 'extendOnUploadProgressHook')
        const extendOnDownloadProgressHookSpy = jest.spyOn(launcher, 'extendOnDownloadProgressHook')

        launcher.extendRequestHooks(params.hooks)

        expect(extendBeforeRequestHookSpy)
          .toHaveBeenCalledWith(expectedArgsBeforeRequest)
        expect(extendAfterRequestHookSpy)
          .toHaveBeenCalledWith(expectedArgsAfterRequest)
        expect(extendOnUploadProgressHookSpy)
          .toHaveBeenCalledWith(expectedArgsOnUploadProgress)
        expect(extendOnDownloadProgressHookSpy)
          .toHaveBeenCalledWith(expectedArgsOnDownloadProgress)
      })
    })

    describe('with partial hooks', () => {
      const partialCases = [
        {
          params: {
            hooks: {
              beforeRequest: async () => false,
              afterRequest: async () => {},
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              beforeRequest: async () => false,
              afterRequest: async () => {},
              onUploadProgress: () => {},
              // onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              beforeRequest: async () => false,
              afterRequest: async () => {},
              // onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              beforeRequest: async () => false,
              // afterRequest: async () => {},
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              // beforeRequest: async () => false,
              afterRequest: async () => {},
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              beforeRequest: async () => false,
              afterRequest: async () => {},
              // onUploadProgress: () => {},
              // onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              beforeRequest: async () => false,
              // afterRequest: async () => {},
              onUploadProgress: () => {},
              // onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              beforeRequest: async () => false,
              // afterRequest: async () => {},
              // onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              // beforeRequest: async () => false,
              afterRequest: async () => {},
              onUploadProgress: () => {},
              // onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              // beforeRequest: async () => false,
              afterRequest: async () => {},
              // onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              // beforeRequest: async () => false,
              // afterRequest: async () => {},
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              beforeRequest: async () => false,
              // afterRequest: async () => {},
              // onUploadProgress: () => {},
              // onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              // beforeRequest: async () => false,
              afterRequest: async () => {},
              // onUploadProgress: () => {},
              // onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              // beforeRequest: async () => false,
              // afterRequest: async () => {},
              onUploadProgress: () => {},
              // onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              // beforeRequest: async () => false,
              // afterRequest: async () => {},
              // onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
        {
          params: {
            hooks: {
              // beforeRequest: async () => false,
              // afterRequest: async () => {},
              // onUploadProgress: () => {},
              // onDownloadProgress: () => {},
            },
          },
        },
      ]

      test.each(partialCases)('with hooks: $params.hooks', ({ params }) => {
        const expected = params.hooks

        const result = launcher.extendRequestHooks(params.hooks)

        // Verify the structure of returned hooks
        expect(result)
          .toEqual(expected)
      })
    })
  })
})
