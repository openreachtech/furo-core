import {
  RESTFUL_API_METHOD,
} from '~/lib/client/restfulapi/constants.js'

import BaseRestfulApiLauncher from '~/lib/client/restfulapi/BaseRestfulApiLauncher.js'
import BaseRestfulApiPayload from '~/lib/client/restfulapi/BaseRestfulApiPayload.js'
import {
  default as BaseRestfulApiCapsule,
  LAUNCH_ABORTED_REASON,
} from '~/lib/client/restfulapi/BaseRestfulApiCapsule.js'

import XMLHttpFetcher from '~/lib/tools/http-fetchers/concretes/XMLHttpFetcher.js'
import XMLHttpParcel from '~/lib/tools/http-fetchers/parcels/concretes/XMLHttpParcel.js'

import BaseResponseBodyParser from '~/lib/tools/response-body-parser/BaseResponseBodyParser'
import JsonResponseBodyParser from '~/lib/tools/response-body-parser/concretes/JsonResponseBodyParser.js'

describe('BaseRestfulApiLauncher', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      describe('#config', () => {
        const cases = [
          {
            input: {
              config: {
                BASE_URL: 'https://alpha.example.com',
              },
            },
          },
          {
            input: {
              config: {
                BASE_URL: 'https://beta.example.com',
              },
            },
          },
        ]

        test.each(cases)('BASE_URL: $input.config.BASE_URL', ({ input }) => {
          const launcher = new BaseRestfulApiLauncher(input)

          expect(launcher)
            .toHaveProperty('config', input.config)
        })
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.create()', () => {
    const cases = [
      {
        input: {
          config: {
            BASE_URL: 'https://alpha.example.com',
          },
        },
      },
      {
        input: {
          config: {
            BASE_URL: 'https://beta.example.com',
          },
        },
      },
    ]

    describe('to be instance of own class', () => {
      test.each(cases)('BASE_URL: $input.config.BASE_URL', ({ input }) => {
        const launcher = BaseRestfulApiLauncher.create(input)

        expect(launcher)
          .toBeInstanceOf(BaseRestfulApiLauncher)
      })
    })

    describe('to call constructor', () => {
      test.each(cases)('BASE_URL: $input.config.BASE_URL', ({ input }) => {
        const DerivedClass = globalThis.constructorSpy.spyOn(BaseRestfulApiLauncher)

        DerivedClass.create(input)

        expect(DerivedClass.__spy__)
          .toHaveBeenCalledWith(input)
      })
    })

    describe('to throw', () => {
      test('without input', () => {
        expect(() => BaseRestfulApiLauncher.create())
          .toThrow('this function must be inherited')
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.get:restfulApiConfig', () => {
    test('to throw', () => {
      expect(() => BaseRestfulApiLauncher.restfulApiConfig)
        .toThrow('this function must be inherited')
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.get:fetch', () => {
    test('to be fixed value', () => {
      const expected = fetch

      const actual = BaseRestfulApiLauncher.fetch

      expect(actual)
        .toBe(expected) // same reference
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.get:HttpFetcherCtor', () => {
    test('to be fixed value', () => {
      const actual = BaseRestfulApiLauncher.HttpFetcherCtor

      expect(actual)
        .toBe(XMLHttpFetcher) // same reference
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.createHttpFetcher()', () => {
    const cases = [
      {
        input: {
          request: new Request('https://example.com/resource-0001'),
          config: {},
        },
      },
      {
        input: {
          request: new Request('https://example.com/resource-0002'),
          config: {
            timeoutMilliseconds: 1000,
          },
        },
      },
    ]

    describe('should be an instance of the HTTP fetcher class', () => {
      test.each(cases)('url: $input.request.url', ({ input }) => {
        const actual = BaseRestfulApiLauncher.createHttpFetcher(input)

        expect(actual)
          .toBeInstanceOf(XMLHttpFetcher)
      })
    })

    describe('should create the HTTP fetcher with the request and the config', () => {
      test.each(cases)('url: $input.request.url', ({ input }) => {
        const createSpy = jest.spyOn(BaseRestfulApiLauncher.HttpFetcherCtor, 'create')

        BaseRestfulApiLauncher.createHttpFetcher(input)

        expect(createSpy)
          .toHaveBeenCalledWith(input)
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.get:Launcher', () => {
    test('to be own', () => {
      const actual = BaseRestfulApiLauncher.Launcher

      expect(actual)
        .toBe(BaseRestfulApiLauncher) // same reference
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.get:Payload', () => {
    test('to throw', () => {
      expect(() => BaseRestfulApiLauncher.Payload)
        .toThrow('this function must be inherited')
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.get:Capsule', () => {
    test('to throw', () => {
      expect(() => BaseRestfulApiLauncher.Capsule)
        .toThrow('this function must be inherited')
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.get:ResponseBodyParser', () => {
    test('should be JsonResponseBodyParser', () => {
      const actual = BaseRestfulApiLauncher.ResponseBodyParser

      expect(actual)
        .toBe(JsonResponseBodyParser) // same reference
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.createPayload()', () => {
    describe('to be instance of Payload', () => {
      /**
       * @type {Array<{
       *   input: {
       *     Payload: typeof BaseRestfulApiPayload,
       *     query: Record<string, any>,
       *     body: Record<string, any>,
       *     pathParameterHash: Record<string, any>,
       *     options: RequestInit,
       *   }
       * }>}
       */
      const cases = [
        {
          input: {
            Payload: class CustomerRestfulApiPayload extends BaseRestfulApiPayload {
              // noop
            },
            query: {
              id: 10001,
            },
            body: {
              name: 'Customer Name',
            },
            pathParameterHash: {
              id: 210001,
            },
            options: {
              mode: 'cors',
            },
          },
        },
        {
          input: {
            Payload: class AdminRestfulApiPayload extends BaseRestfulApiPayload {
              // noop
            },
            query: {
              id: 20001,
            },
            body: {
              name: 'Admin Name',
            },
            pathParameterHash: {
              id: 210001,
            },
            options: {
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
            },
          },
        },
      ]

      test.each(cases)('Payload: $input.Payload.name', ({ input }) => {
        const Launcher = class extends BaseRestfulApiLauncher {
          /** @override */
          static get Payload () {
            return input.Payload
          }
        }

        const createSpy = jest.spyOn(input.Payload, 'create')

        const args = {
          query: input.query,
          body: input.body,
          pathParameterHash: input.pathParameterHash,
          options: input.options,
        }

        const payload = Launcher.createPayload(args)

        expect(payload)
          .toBeInstanceOf(input.Payload)

        expect(createSpy)
          .toHaveBeenCalledWith(args)
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.createPayloadWithFormValueHash()', () => {
    describe('to be instance of Payload', () => {
      describe('with full parameters', () => {
        /**
         * @type {Array<{
         *   input: {
         *     Payload: typeof BaseRestfulApiPayload<*, *>
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
            input: {
              Payload: class CustomerRestfulApiPayload extends BaseRestfulApiPayload {
                /** @override */
                static generateRequestParameterHash ({
                  valueHash,
                }) {
                  return valueHash
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
            input: {
              Payload: class AdminPayload extends BaseRestfulApiPayload {
                /** @override */
                static generateRequestParameterHash ({
                  valueHash,
                }) {
                  return valueHash
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

        test.each(cases)('Payload: $input.Payload.name', ({ input, expected }) => {
          const Launcher = class extends BaseRestfulApiLauncher {
            /** @override */
            static get Payload () {
              return input.Payload
            }
          }

          const createWithFormValueHashSpy = jest.spyOn(input.Payload, 'createWithFormValueHash')

          const args = {
            valueHash: input.valueHash,
            extraValueHash: input.extraValueHash,
            options: input.options,
          }

          const payload = Launcher.createPayloadWithFormValueHash(args)

          expect(payload)
            .toBeInstanceOf(input.Payload)

          expect(createWithFormValueHashSpy)
            .toHaveBeenCalledWith(expected)
        })
      })

      describe('with no extraValueHash', () => {
        /**
         * @type {Array<{
         *   input: {
         *     Payload: typeof BaseRestfulApiPayload<*, *, *>
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
            input: {
              Payload: class CustomerRestfulApiPayload extends BaseRestfulApiPayload {
                /** @override */
                static generateRequestParameterHash ({
                  valueHash,
                }) {
                  return valueHash
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
            input: {
              Payload: class AdminRestfulApiPayload extends BaseRestfulApiPayload {
                /** @override */
                static generateRequestParameterHash ({
                  valueHash,
                }) {
                  return valueHash
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

        test.each(cases)('Payload: $input.Payload.name', ({ input, expected }) => {
          const Launcher = class extends BaseRestfulApiLauncher {
            /** @override */
            static get Payload () {
              return input.Payload
            }
          }

          const createWithFormValueHashSpy = jest.spyOn(input.Payload, 'createWithFormValueHash')

          const args = {
            valueHash: input.valueHash,
            options: input.options,
          }

          const payload = Launcher.createPayloadWithFormValueHash(args)

          expect(payload)
            .toBeInstanceOf(input.Payload)

          expect(createWithFormValueHashSpy)
            .toHaveBeenCalledWith(expected)
        })
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.createCapsule()', () => {
    describe('to be instance of BaseRestfulApiCapsule', () => {
      const MockGraphqlCapsule = class extends BaseRestfulApiCapsule {}

      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 101,
              },
            }),
            result: {
              content: {
                customer: {
                  id: 10001,
                },
              },
            },
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 201,
              },
            }),
            result: {
              content: {
                admin: {
                  id: 20001,
                },
              },
            },
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 301,
              },
            }),
            result: {
              content: {
                user: {
                  id: 30001,
                },
              },
            },
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 401,
              },
            }),
            result: {
              content: {
                user: {
                  id: 40001,
                },
              },
            },
          },
        },
      ]

      test.each(cases)('result: $input.result', ({ input }) => {
        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return MockGraphqlCapsule
          }
        }

        const capsule = Launcher.createCapsule(input)

        expect(capsule)
          .toBeInstanceOf(BaseRestfulApiCapsule)
      })
    })

    describe('to call Capsule factory method', () => {
      const MockGraphqlCapsule = class extends BaseRestfulApiCapsule {}

      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 101,
              },
            }),
            result: {
              content: {
                customer: {
                  id: 10001,
                },
              },
            },
            abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 201,
              },
            }),
            result: {
              error: {
                code: '190.X000.001',
              },
            },
            abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 301,
              },
            }),
            result: {
              content: {
                unknown: {
                  id: 30001,
                },
              },
            },
            abortedReason: LAUNCH_ABORTED_REASON.UNKNOWN,
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 401,
              },
            }),
            result: {
              error: {
                code: '193.X000.400',
              },
            },
            // abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      ]

      test.each(cases)('result: $input.result', ({ input }) => {
        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return MockGraphqlCapsule
          }
        }

        const createSpy = jest.spyOn(MockGraphqlCapsule, 'create')

        Launcher.createCapsule(input)

        expect(createSpy)
          .toHaveBeenCalledWith(input)
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.createCapsuleAsPending()', () => {
    const cases = [
      {
        input: {
          Capsule: class AlphaCapsule extends BaseRestfulApiCapsule {},
        },
      },
      {
        input: {
          Capsule: class BetaCapsule extends BaseRestfulApiCapsule {},
        },
      },
    ]

    describe('to be instance of BaseRestfulApiCapsule', () => {
      test.each(cases)('Capsule: $input.Capsule.name', ({ input }) => {
        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return input.Capsule
          }
        }

        const capsule = Launcher.createCapsuleAsPending()

        expect(capsule)
          .toBeInstanceOf(input.Capsule)
      })
    })

    describe('to call Capsule factory method', () => {
      test.each(cases)('Capsule: $input.Capsule.name', ({ input }) => {
        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return input.Capsule
          }
        }

        const expected = {
          responseParcel: null,
          payload: null,
          result: null,
        }

        const createSpy = jest.spyOn(input.Capsule, 'create')

        Launcher.createCapsuleAsPending()

        expect(createSpy)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.createCapsuleAsInvalidParametersError()', () => {
    const capsuleCases = [
      {
        input: {
          Capsule: class AlphaCapsule extends BaseRestfulApiCapsule {},
        },
      },
      {
        input: {
          Capsule: class BetaCapsule extends BaseRestfulApiCapsule {},
        },
      },
    ]

    const cases = [
      {
        payload: BaseRestfulApiPayload.create({
          query: {
            id: 100001,
          },
        }),
      },
      {
        payload: BaseRestfulApiPayload.create({
          query: {
            id: 200001,
          },
        }),
      },
    ]

    describe('to be instance of BaseRestfulApiCapsule', () => {
      describe.each(capsuleCases)('Capsule: $input.Capsule.name', ({ input }) => {
        test.each(cases)('payload: $payload', ({ payload }) => {
          class Launcher extends BaseRestfulApiLauncher {
            /** @override */
            static get Capsule () {
              return input.Capsule
            }
          }

          const args = {
            payload,
          }

          const capsule = Launcher.createCapsuleAsInvalidParametersError(args)

          expect(capsule)
            .toBeInstanceOf(input.Capsule)
        })
      })
    })

    describe('to call Capsule factory method', () => {
      describe.each(capsuleCases)('Capsule: $input.Capsule.name', ({ input }) => {
        test.each(cases)('payload: $payload', ({ payload }) => {
          class Launcher extends BaseRestfulApiLauncher {
            /** @override */
            static get Capsule () {
              return input.Capsule
            }
          }

          const expected = {
            responseParcel: null,
            payload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
          }

          const createSpy = jest.spyOn(input.Capsule, 'create')

          const args = {
            payload,
          }

          Launcher.createCapsuleAsInvalidParametersError(args)

          expect(createSpy)
            .toHaveBeenCalledWith(expected)
        })
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.createCapsuleAsAbortedByHooks()', () => {
    const capsuleCases = [
      {
        input: {
          Capsule: class AlphaCapsule extends BaseRestfulApiCapsule {},
        },
      },
      {
        input: {
          Capsule: class BetaCapsule extends BaseRestfulApiCapsule {},
        },
      },
    ]

    const cases = [
      {
        payload: BaseRestfulApiPayload.create({
          query: {
            id: 10001,
          },
        }),
      },
      {
        payload: BaseRestfulApiPayload.create({
          body: {
            id: 20001,
          },
        }),
      },
    ]

    describe('to be instance of BaseRestfulApiCapsule', () => {
      describe.each(capsuleCases)('Capsule: $input.Capsule.name', ({ input }) => {
        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return input.Capsule
          }
        }

        test.each(cases)('payload: $payload', ({ payload }) => {
          const args = {
            payload,
          }

          const capsule = Launcher.createCapsuleAsAbortedByHooks(args)

          expect(capsule)
            .toBeInstanceOf(input.Capsule)
        })
      })
    })

    describe('to call Capsule factory method', () => {
      describe.each(capsuleCases)('Capsule: $input.Capsule.name', ({ input }) => {
        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return input.Capsule
          }
        }

        test.each(cases)('payload: $payload', ({ payload }) => {
          const expected = {
            responseParcel: null,
            payload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
          }

          const createSpy = jest.spyOn(input.Capsule, 'create')

          const args = {
            payload,
          }

          Launcher.createCapsuleAsAbortedByHooks(args)

          expect(createSpy)
            .toHaveBeenCalledWith(expected)
        })
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.createCapsuleAsNetworkError()', () => {
    const capsuleCases = [
      {
        input: {
          Capsule: class AlphaCapsule extends BaseRestfulApiCapsule {},
        },
      },
      {
        input: {
          Capsule: class BetaCapsule extends BaseRestfulApiCapsule {},
        },
      },
    ]

    const cases = [
      {
        responseParcel: XMLHttpParcel.createAsNetworkError({
          request: new Request('http://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
        }),
        payload: BaseRestfulApiPayload.create({
          query: {
            id: 10001,
          },
        }),
      },
      {
        responseParcel: XMLHttpParcel.createAsNetworkError({
          request: new Request('http://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
        }),
        payload: BaseRestfulApiPayload.create({
          body: {
            id: 20001,
          },
        }),
      },
    ]

    describe('to be instance of BaseRestfulApiCapsule', () => {
      describe.each(capsuleCases)('Capsule: $input.Capsule.name', ({ input }) => {
        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return input.Capsule
          }
        }

        test.each(cases)('payload: $payload', ({ responseParcel, payload }) => {
          const args = {
            responseParcel,
            payload,
          }

          const capsule = Launcher.createCapsuleAsNetworkError(args)

          expect(capsule)
            .toBeInstanceOf(input.Capsule)
        })
      })
    })

    describe('to call Capsule factory method', () => {
      describe.each(capsuleCases)('Capsule: $input.Capsule.name', ({ input }) => {
        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return input.Capsule
          }
        }

        test.each(cases)('payload: $payload', ({ responseParcel, payload }) => {
          const expected = {
            responseParcel,
            payload,
            result: null,
          }

          const createSpy = jest.spyOn(input.Capsule, 'create')

          const args = {
            responseParcel,
            payload,
          }

          Launcher.createCapsuleAsNetworkError(args)

          expect(createSpy)
            .toHaveBeenCalledWith(expected)
        })
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.createCapsuleAsResponseBodyParseError()', () => {
    const capsuleCases = [
      {
        input: {
          Capsule: class AlphaCapsule extends BaseRestfulApiCapsule {},
        },
      },
      {
        input: {
          Capsule: class BetaCapsule extends BaseRestfulApiCapsule {},
        },
      },
    ]

    const cases = [
      {
        args: {
          responseParcel: XMLHttpParcel.create({
            request: new Request('http://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
            response: new Response('{}', {
              status: 200,
              statusText: 'OK',
            }),
          }),
          payload: BaseRestfulApiPayload.create({
            query: {
              id: 10001,
            },
          }),
        },
      },
      {
        args: {
          responseParcel: XMLHttpParcel.create({
            request: new Request('http://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
            response: new Response('{}', {
              status: 201,
              statusText: 'Created',
            }),
          }),
          payload: BaseRestfulApiPayload.create({
            body: {
              id: 20001,
            },
          }),
        },
      },
    ]

    describe('to be instance of BaseRestfulApiCapsule', () => {
      describe.each(capsuleCases)('Capsule: $input.Capsule.name', ({ input }) => {
        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return input.Capsule
          }
        }

        test.each(cases)('payload: $args.payload', ({ args }) => {
          const capsule = Launcher.createCapsuleAsResponseBodyParseError(args)

          expect(capsule)
            .toBeInstanceOf(input.Capsule)
        })
      })
    })

    describe('to call Capsule factory method', () => {
      describe.each(capsuleCases)('Capsule: $input.Capsule.name', ({ input }) => {
        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return input.Capsule
          }
        }

        test.each(cases)('payload: $args.payload', ({ args }) => {
          const expected = {
            responseParcel: args.responseParcel,
            payload: args.payload,
            result: null,
          }

          const createSpy = jest.spyOn(input.Capsule, 'create')

          Launcher.createCapsuleAsResponseBodyParseError(args)

          expect(createSpy)
            .toHaveBeenCalledWith(expected)
        })
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('.createResponseBodyParser()', () => {
    const AlphaResponseBodyParser = class extends BaseResponseBodyParser {}
    const BetaResponseBodyParser = class extends BaseResponseBodyParser {}

    /**
     * @type {Array<{
     *   input: {
     *     Launcher: typeof BaseRestfulApiLauncher
     *   }
     *   expected: typeof BaseResponseBodyParser<*>
     * }>}
     */
    const LauncherCases = [
      {
        input: {
          Launcher: BaseRestfulApiLauncher,
        },
        expected: JsonResponseBodyParser, // default
      },
      {
        input: {
          Launcher: class AlphaRestfulApiLauncher extends BaseRestfulApiLauncher {
            /** @override */
            static get ResponseBodyParser () {
              return AlphaResponseBodyParser
            }
          },
        },
        expected: AlphaResponseBodyParser,
      },
      {
        input: {
          Launcher: class BetaRestfulApiLauncher extends BaseRestfulApiLauncher {
            /** @override */
            static get ResponseBodyParser () {
              return BetaResponseBodyParser
            }
          },
        },
        expected: BetaResponseBodyParser,
      },
    ]

    describe.each(LauncherCases)('Launcher: $input.Launcher.name', ({ input, expected }) => {
      const responseCases = [
        {
          responseParcel: XMLHttpParcel.create({
            request: new Request('http://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
            response: new Response('{}', {
              status: 200,
              statusText: 'OK',
            }),
          }),
        },
        {
          responseParcel: XMLHttpParcel.create({
            request: new Request('http://example.com/neutral'), // Neutral value
            config: {}, // Neutral value
            response: new Response('{}', {
              status: 201,
              statusText: 'Created',
            }),
          }),
        },
      ]

      test.each(responseCases)('response: $responseParcel.response', ({ responseParcel }) => {
        const args = {
          responseParcel,
        }

        const createSpy = jest.spyOn(expected, 'create')

        const actual = input.Launcher.createResponseBodyParser(args)

        expect(actual)
          .toBeInstanceOf(expected)

        expect(createSpy)
          .toHaveBeenCalledWith(args)
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('#get:Ctor', () => {
    describe('to be own class', () => {
      const cases = [
        {
          input: {
            config: {
              BASE_URL: 'https://alpha.example.com',
            },
          },
        },
        {
          input: {
            config: {
              BASE_URL: 'https://beta.example.com',
            },
          },
        },
      ]

      test.each(cases)('BASE_URL: $input.config.BASE_URL', ({ input }) => {
        const launcher = BaseRestfulApiLauncher.create(input)

        expect(launcher.Ctor)
          .toBe(BaseRestfulApiLauncher)
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('#get:baseUrl', () => {
    const cases = [
      {
        input: {
          config: {
            BASE_URL: 'http://alpha.example.com',
          },
        },
        expected: 'http://alpha.example.com',
      },
      {
        input: {
          config: {
            BASE_URL: 'http://beta.example.com',
          },
        },
        expected: 'http://beta.example.com',
      },
    ]

    test.each(cases)('BASE_URL: $input.config.BASE_URL', ({ input, expected }) => {
      const launcher = BaseRestfulApiLauncher.create(input)

      const actual = launcher.baseUrl

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('#launchRequest()', () => {
    describe('to return result capsule on success', () => {
      const restfulapiConfig = {
        BASE_URL: 'http://example.com/restfulapi-customer',
      }

      const cases = [
        {
          input: {
            baseUrl: 'http://alpha.example.com',
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 10001,
              },
            }),
            Capsule: class CustomerRestfulApiCapsule extends BaseRestfulApiCapsule {},
          },
          tally: {
            response: new Response(`{
              "content": {
                "customer": {
                  "id": 10001
                }
              }
            }`),
          },
          expected: {
            content: {
              customer: {
                id: 10001,
              },
            },
          },
        },
        {
          input: {
            baseUrl: 'http://beta.example.com',
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 20001,
              },
            }),
            Capsule: class AdminRestfulApiCapsule extends BaseRestfulApiCapsule {},
          },
          tally: {
            response: new Response(`{
              "content": {
                "admin": {
                  "id": 20001
                }
              }
            }`),
          },
          expected: {
            content: {
              admin: {
                id: 20001,
              },
            },
          },
        },
      ]

      test.each(cases)('baseUrl: $input.baseUrl', async ({ input, tally, expected }) => {
        const httpParcelTally = XMLHttpParcel.create({
          request: new Request('http://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: tally.response,
        })

        const expectedArgs = {
          responseParcel: httpParcelTally,
          payload: input.payload,
          result: expected,
        }

        const hooksTally = {
          afterRequest: async () => {},
        }

        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return input.Capsule
          }
        }

        const launcher = Launcher.create({
          config: restfulapiConfig,
        })

        jest.spyOn(launcher, 'invokeFetchQuery')
          .mockResolvedValue(httpParcelTally)
        const createSpy = jest.spyOn(input.Capsule, 'create')
        const afterRequestSpy = jest.spyOn(hooksTally, 'afterRequest')

        const args = {
          payload: input.payload,
          hooks: hooksTally,
        }

        const actual = await launcher.launchRequest(args)

        expect(actual)
          .toBeInstanceOf(input.Capsule)

        expect(createSpy)
          .toHaveBeenCalledWith(expectedArgs)
        expect(afterRequestSpy)
          .toHaveBeenCalledWith(actual)
      })
    })

    describe('to call #extendRequestHooks()', () => {
      const MockGraphqlLauncher = class extends BaseRestfulApiLauncher {
        /** @override */
        static get Capsule () {
          return BaseRestfulApiCapsule
        }
      }

      const FulfilledRestfulApiPayload = class extends BaseRestfulApiPayload {
        /** @override */
        static get method () {
          return RESTFUL_API_METHOD.GET
        }

        /** @override */
        static get pathname () {
          return '/fulfilled'
        }
      }

      const launcher = MockGraphqlLauncher.create({
        config: {
          BASE_URL: 'http://example.com/restfulapi',
        },
      })

      const cases = [
        {
          input: {
            payload: FulfilledRestfulApiPayload.create({
              query: {
                id: 10001,
              },
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
          input: {
            payload: FulfilledRestfulApiPayload.create({
              query: {
                id: 20001,
              },
            }),
            hooks: {
              beforeRequest: async payload => true,
              afterRequest: async capsule => {},
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
      ]

      test.each(cases)('payload: $input.payload', async ({ input }) => {
        jest.spyOn(launcher, 'invokeFetchQuery')
          .mockResolvedValue(
            XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
            })
          )
        const extendRequestHooksSpy = jest.spyOn(launcher, 'extendRequestHooks')

        await launcher.launchRequest(input)

        expect(extendRequestHooksSpy)
          .toHaveBeenCalledWith(input.hooks)
      })

      test('without hooks', async () => {
        const expected = {
          beforeRequest: expect.any(Function),
          afterRequest: expect.any(Function),
          onUploadProgress: expect.any(Function),
          onDownloadProgress: expect.any(Function),
        }

        jest.spyOn(launcher, 'invokeFetchQuery')
          .mockResolvedValue(
            XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
            })
          )
        const extendRequestHooksSpy = jest.spyOn(launcher, 'extendRequestHooks')

        const payload = FulfilledRestfulApiPayload.create({
          query: {
            id: 9990001,
          },
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
      class DerivedRestfulApiCapsule extends BaseRestfulApiCapsule {}

      class DerivedRestfulApiPayload extends BaseRestfulApiPayload {
        /** @override */
        static get queryRequiredFields () {
          return [
            'username',
            'password',
          ]
        }

        /** @override */
        static get bodyRequiredFields () {
          return [
            'first',
            'second',
          ]
        }

        /** @override */
        static get pathParameterRequiredFields () {
          return [
            'id',
          ]
        }
      }

      describe('to not call #invokeFetchQuery() with invalid query', () => {
        const parameterCases = [
          {
            input: {
              payload: DerivedRestfulApiPayload.create({
                query: {
                  username: 'JohnDoe',
                  password: 'password$01',
                },
              }),
            },
          },
          {
            input: {
              payload: DerivedRestfulApiPayload.create({
                body: {
                  first: 'First Value',
                  second: 'Second Value',
                },
              }),
            },
          },
          {
            input: {
              payload: DerivedRestfulApiPayload.create({
                pathParameterHash: {
                  id: '12345',
                },
              }),
            },
          },
        ]

        test.each(parameterCases)('payload: $input.payload', async ({ input }) => {
          class Launcher extends BaseRestfulApiLauncher {
            /** @override */
            static get Capsule () {
              return DerivedRestfulApiCapsule
            }
          }

          const launcher = Launcher.create({
            config: {
              BASE_URL: 'http://example.com',
            },
          })

          const expectedCapsule = DerivedRestfulApiCapsule.create({
            responseParcel: null,
            payload: input.payload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
          })

          const createCapsuleAsInvalidParametersErrorSpy = jest.spyOn(BaseRestfulApiLauncher, 'createCapsuleAsInvalidParametersError')
          const invokeFetchQuerySpy = jest.spyOn(launcher, 'invokeFetchQuery')
            .mockRejectedValue(null)

          const args = {
            payload: input.payload,
          }

          const actual = await launcher.launchRequest(args)

          expect(actual)
            .toEqual(expectedCapsule)

          expect(createCapsuleAsInvalidParametersErrorSpy)
            .toHaveBeenCalledWith(args)
          expect(invokeFetchQuerySpy)
            .not
            .toHaveBeenCalledWith()
        })
      })
    })

    describe('to return Aborted by hooks capsule', () => {
      const cases = [
        {
          input: {
            baseUrl: 'http://example.com/restfulapi-customer',
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 100001,
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-01',
                }),
              },
            }),
            Capsule: class CustomerCapsule extends BaseRestfulApiCapsule {},
            hooks: {
              beforeRequest: async () => true, // Will abort the request
              afterRequest: async () => {},
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
        {
          input: {
            baseUrl: 'http://example.com/restfulapi-admin',
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 200001,
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-02',
                }),
              },
            }),
            Capsule: class AdminCapsule extends BaseRestfulApiCapsule {},
            hooks: {
              beforeRequest: async () => true, // Will abort the request
              afterRequest: async () => {},
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
        },
      ]

      test.each(cases)('baseUrl: $input.baseUrl', async ({ input }) => {
        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return input.Capsule
          }
        }

        const launcher = Launcher.create({
          config: {
            BASE_URL: input.baseUrl,
          },
        })

        const expectedCapsule = input.Capsule.create({
          responseParcel: null,
          payload: input.payload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
        })

        const createCapsuleAsAbortedByHooksSpy = jest.spyOn(Launcher, 'createCapsuleAsAbortedByHooks')
        const invokeFetchQuerySpy = jest.spyOn(launcher, 'invokeFetchQuery')

        const args = {
          payload: input.payload,
          hooks: input.hooks,
        }

        const actual = await launcher.launchRequest(args)

        expect(actual)
          .toEqual(expectedCapsule)

        expect(createCapsuleAsAbortedByHooksSpy)
          .toHaveBeenCalledWith({
            payload: input.payload,
          })
        expect(invokeFetchQuerySpy)
          .not
          .toHaveBeenCalled()
      })
    })

    describe('to return Network error capsule', () => {
      const cases = [
        {
          input: {
            baseUrl: 'http://example.com/restfulapi-customer',
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 100001,
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-01',
                }),
              },
            }),
            Capsule: class CustomerCapsule extends BaseRestfulApiCapsule {},
          },
        },
        {
          input: {
            baseUrl: 'http://example.com/restfulapi-admin',
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 200001,
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-02',
                }),
              },
            }),
            Capsule: class AdminCapsule extends BaseRestfulApiCapsule {},
          },
        },
      ]

      test.each(cases)('baseUrl: $input.baseUrl', async ({ input }) => {
        const httpParcelTally = XMLHttpParcel.createAsNetworkError({
          request: new Request('http://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
        })
        const hooksTally = {
          afterRequest: async () => {},
        }

        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return input.Capsule
          }
        }

        const launcher = Launcher.create({
          config: {
            BASE_URL: input.baseUrl,
          },
        })

        jest.spyOn(launcher, 'invokeFetchQuery')
          .mockResolvedValue(httpParcelTally)
        const afterRequestSpy = jest.spyOn(hooksTally, 'afterRequest')

        const args = {
          payload: input.payload,
          hooks: hooksTally,
        }

        const actual = await launcher.launchRequest(args)

        expect(actual)
          .toBeInstanceOf(input.Capsule)
        expect(actual)
          .toHaveProperty('responseParcel', httpParcelTally)

        expect(afterRequestSpy)
          .toHaveBeenCalledWith(actual)
      })
    })

    describe('to return response body parse error capsule', () => {
      const cases = [
        {
          input: {
            baseUrl: 'http://example.com/restfulapi-customer',
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 10001,
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-01',
                }),
              },
            }),
            Capsule: class CustomerCapsule extends BaseRestfulApiCapsule {},
          },
          tally: {
            response: new Response(`{
              "content": {
                "customer": {
                  "id": 10001
                }
              }
            }}`), // ERROR: last } is doubled
          },
        },
        {
          input: {
            baseUrl: 'http://example.com/restfulapi-admin',
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 20001,
              },
              options: {
                headers: new Headers({
                  'x-access-token': 'access-token-02',
                }),
              },
            }),
            Capsule: class AdminCapsule extends BaseRestfulApiCapsule {},
          },
          tally: {
            response: new Response(`{
              "content": {
                "admin": {
                  "id": 20001
                }
              }
            }}`), // ERROR: last } is doubled
          },
        },
      ]

      test.each(cases)('baseUrl: $input.baseUrl', async ({ input, tally }) => {
        const hooksTally = {
          afterRequest: async () => {},
        }

        const Launcher = class AdminLauncher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return input.Capsule
          }
        }

        const launcher = Launcher.create({
          config: {
            BASE_URL: input.baseUrl,
          },
        })

        jest.spyOn(launcher, 'invokeFetchQuery')
          .mockResolvedValue(
            XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: tally.response,
            })
          )
        const afterRequestSpy = jest.spyOn(hooksTally, 'afterRequest')

        const args = {
          payload: input.payload,
          hooks: hooksTally,
        }

        const actual = await launcher.launchRequest(args)

        expect(actual)
          .toBeInstanceOf(input.Capsule)

        expect(afterRequestSpy)
          .toHaveBeenCalledWith(actual)
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('#extendRequestHooks()', () => {
    const launcher = BaseRestfulApiLauncher.create({
      config: {
        BASE_URL: 'http://example.com/restfulapi',
      },
    })

    /**
     * @param {BaseRestfulApiPayload} payload
     * @returns {Promise<boolean>}
     */
    async function alphaBeforeHook (payload) {
      return false
    }

    /**
     * @param {BaseRestfulApiPayload} payload
     * @returns {Promise<boolean>}
     */
    async function betaBeforeHook (payload) {
      return true
    }

    /**
     * @param {BaseRestfulApiCapsule} capsule
     * @returns {Promise<void>}
     */
    async function alphaAfterHook (capsule) {
      // noop
    }

    /**
     * @param {BaseRestfulApiCapsule} capsule
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
        input: {
          hooks: {
            beforeRequest: alphaBeforeHook,
            afterRequest: alphaAfterHook,
            onUploadProgress: alphaUploadProgressHook,
            onDownloadProgress: alphaDownloadProgressHook,
          },
        },
      },
      {
        input: {
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
      test.each(cases)('afterRequest: $input.hooks.afterRequest.name', ({ input }) => {
        const extendedHooks = launcher.extendRequestHooks(input.hooks)

        expect(extendedHooks)
          .toHaveProperty('beforeRequest', input.hooks.beforeRequest)
        expect(extendedHooks)
          .toHaveProperty('afterRequest', input.hooks.afterRequest)
        expect(extendedHooks)
          .toHaveProperty('onUploadProgress', input.hooks.onUploadProgress)
        expect(extendedHooks)
          .toHaveProperty('onDownloadProgress', input.hooks.onDownloadProgress)
      })
    })

    describe('to call members', () => {
      test.each(cases)('afterRequest: $input.hooks.afterRequest.name', ({ input }) => {
        const expectedArgsBeforeRequest = {
          beforeRequest: input.hooks.beforeRequest,
        }
        const expectedArgsAfterRequest = {
          afterRequest: input.hooks.afterRequest,
        }
        const expectedArgsOnUploadProgress = {
          onUploadProgress: input.hooks.onUploadProgress,
        }
        const expectedArgsOnDownloadProgress = {
          onDownloadProgress: input.hooks.onDownloadProgress,
        }

        const extendBeforeRequestHookSpy = jest.spyOn(launcher, 'extendBeforeRequestHook')
        const extendAfterRequestHookSpy = jest.spyOn(launcher, 'extendAfterRequestHook')
        const extendOnUploadProgressHookSpy = jest.spyOn(launcher, 'extendOnUploadProgressHook')
        const extendOnDownloadProgressHookSpy = jest.spyOn(launcher, 'extendOnDownloadProgressHook')

        launcher.extendRequestHooks(input.hooks)

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
      const beforeRequestHook = async () => false
      const afterRequestHook = async () => {}
      const onUploadProgressHook = () => {}
      const onDownloadProgressHook = () => {}

      const partialCases = [
        {
          input: {
            hooks: {
              beforeRequest: beforeRequestHook,
              afterRequest: afterRequestHook,
              onUploadProgress: onUploadProgressHook,
              onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: beforeRequestHook,
            afterRequest: afterRequestHook,
            onUploadProgress: onUploadProgressHook,
            onDownloadProgress: onDownloadProgressHook,
          },
        },
        {
          input: {
            hooks: {
              beforeRequest: beforeRequestHook,
              afterRequest: afterRequestHook,
              onUploadProgress: onUploadProgressHook,
              // onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: beforeRequestHook,
            afterRequest: afterRequestHook,
            onUploadProgress: onUploadProgressHook,
            onDownloadProgress: expect.any(Function),
          },
        },
        {
          input: {
            hooks: {
              beforeRequest: beforeRequestHook,
              afterRequest: afterRequestHook,
              // onUploadProgress: onUploadProgressHook,
              onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: beforeRequestHook,
            afterRequest: afterRequestHook,
            onUploadProgress: expect.any(Function),
            onDownloadProgress: onDownloadProgressHook,
          },
        },
        {
          input: {
            hooks: {
              beforeRequest: beforeRequestHook,
              // afterRequest: afterRequestHook,
              onUploadProgress: onUploadProgressHook,
              onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: beforeRequestHook,
            afterRequest: expect.any(Function),
            onUploadProgress: onUploadProgressHook,
            onDownloadProgress: onDownloadProgressHook,
          },
        },
        {
          input: {
            hooks: {
              // beforeRequest: beforeRequestHook,
              afterRequest: afterRequestHook,
              onUploadProgress: onUploadProgressHook,
              onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: expect.any(Function),
            afterRequest: afterRequestHook,
            onUploadProgress: onUploadProgressHook,
            onDownloadProgress: onDownloadProgressHook,
          },
        },
        {
          input: {
            hooks: {
              beforeRequest: beforeRequestHook,
              afterRequest: afterRequestHook,
              // onUploadProgress: onUploadProgressHook,
              // onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: beforeRequestHook,
            afterRequest: afterRequestHook,
            onUploadProgress: expect.any(Function),
            onDownloadProgress: expect.any(Function),
          },
        },
        {
          input: {
            hooks: {
              beforeRequest: beforeRequestHook,
              // afterRequest: afterRequestHook,
              onUploadProgress: onUploadProgressHook,
              // onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: beforeRequestHook,
            afterRequest: expect.any(Function),
            onUploadProgress: onUploadProgressHook,
            onDownloadProgress: expect.any(Function),
          },
        },
        {
          input: {
            hooks: {
              beforeRequest: beforeRequestHook,
              // afterRequest: afterRequestHook,
              // onUploadProgress: onUploadProgressHook,
              onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: beforeRequestHook,
            afterRequest: expect.any(Function),
            onUploadProgress: expect.any(Function),
            onDownloadProgress: onDownloadProgressHook,
          },
        },
        {
          input: {
            hooks: {
              // beforeRequest: beforeRequestHook,
              afterRequest: afterRequestHook,
              onUploadProgress: onUploadProgressHook,
              // onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: expect.any(Function),
            afterRequest: afterRequestHook,
            onUploadProgress: onUploadProgressHook,
            onDownloadProgress: expect.any(Function),
          },
        },
        {
          input: {
            hooks: {
              // beforeRequest: beforeRequestHook,
              afterRequest: afterRequestHook,
              // onUploadProgress: onUploadProgressHook,
              onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: expect.any(Function),
            afterRequest: afterRequestHook,
            onUploadProgress: expect.any(Function),
            onDownloadProgress: onDownloadProgressHook,
          },
        },
        {
          input: {
            hooks: {
              // beforeRequest: beforeRequestHook,
              // afterRequest: afterRequestHook,
              onUploadProgress: onUploadProgressHook,
              onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: expect.any(Function),
            afterRequest: expect.any(Function),
            onUploadProgress: onUploadProgressHook,
            onDownloadProgress: onDownloadProgressHook,
          },
        },
        {
          input: {
            hooks: {
              beforeRequest: beforeRequestHook,
              // afterRequest: afterRequestHook,
              // onUploadProgress: onUploadProgressHook,
              // onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: beforeRequestHook,
            afterRequest: expect.any(Function),
            onUploadProgress: expect.any(Function),
            onDownloadProgress: expect.any(Function),
          },
        },
        {
          input: {
            hooks: {
              // beforeRequest: beforeRequestHook,
              afterRequest: afterRequestHook,
              // onUploadProgress: onUploadProgressHook,
              // onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: expect.any(Function),
            afterRequest: afterRequestHook,
            onUploadProgress: expect.any(Function),
            onDownloadProgress: expect.any(Function),
          },
        },
        {
          input: {
            hooks: {
              // beforeRequest: beforeRequestHook,
              // afterRequest: afterRequestHook,
              onUploadProgress: onUploadProgressHook,
              // onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: expect.any(Function),
            afterRequest: expect.any(Function),
            onUploadProgress: onUploadProgressHook,
            onDownloadProgress: expect.any(Function),
          },
        },
        {
          input: {
            hooks: {
              // beforeRequest: beforeRequestHook,
              // afterRequest: afterRequestHook,
              // onUploadProgress: onUploadProgressHook,
              onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: expect.any(Function),
            afterRequest: expect.any(Function),
            onUploadProgress: expect.any(Function),
            onDownloadProgress: onDownloadProgressHook,
          },
        },
        {
          input: {
            hooks: {
              // beforeRequest: beforeRequestHook,
              // afterRequest: afterRequestHook,
              // onUploadProgress: onUploadProgressHook,
              // onDownloadProgress: onDownloadProgressHook,
            },
          },
          expected: {
            beforeRequest: expect.any(Function),
            afterRequest: expect.any(Function),
            onUploadProgress: expect.any(Function),
            onDownloadProgress: expect.any(Function),
          },
        },
      ]

      test.each(partialCases)('with hooks: $input.hooks', ({ input, expected }) => {
        const result = launcher.extendRequestHooks(input.hooks)

        // Verify the structure of returned hooks
        expect(result)
          .toStrictEqual(expected)
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('#extendBeforeRequestHook()', () => {
    const launcher = BaseRestfulApiLauncher.create({
      config: {
        BASE_URL: 'http://example.com/restfulapi',
      },
    })

    /**
     * @param {BaseRestfulApiPayload} payload
     * @returns {Promise<boolean>}
     */
    async function alphaHook (payload) {
      return false
    }

    /**
     * @param {BaseRestfulApiPayload} payload
     * @returns {Promise<boolean>}
     */
    async function betaHook (payload) {
      return true
    }

    const cases = [
      {
        input: {
          beforeRequest: alphaHook,
        },
      },
      {
        input: {
          beforeRequest: betaHook,
        },
      },
    ]

    test.each(cases)('beforeRequest: $input.beforeRequest.name', ({ input }) => {
      const actual = launcher.extendBeforeRequestHook(input)

      expect(actual)
        .toBe(input.beforeRequest) // same reference
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('#extendAfterRequestHook()', () => {
    const launcher = BaseRestfulApiLauncher.create({
      config: {
        BASE_URL: 'http://example.com/restfulapi',
      },
    })

    /**
     * @param {BaseRestfulApiCapsule} capsule
     * @returns {Promise<void>}
     */
    async function alphaHook (capsule) {
      // noop
    }

    /**
     * @param {BaseRestfulApiCapsule} capsule
     * @returns {Promise<void>}
     */
    async function betaHook (capsule) {
      // noop
    }

    const cases = [
      {
        input: {
          afterRequest: alphaHook,
        },
      },
      {
        input: {
          afterRequest: betaHook,
        },
      },
    ]

    test.each(cases)('afterRequest: $input.afterRequest.name', ({ input }) => {
      const extendedHook = launcher.extendAfterRequestHook(input)

      expect(extendedHook)
        .toBe(input.afterRequest) // same reference
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('#extendOnUploadProgressHook()', () => {
    const launcher = BaseRestfulApiLauncher.create({
      config: {
        BASE_URL: 'http://example.com/restfulapi',
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
        input: {
          onUploadProgress: alphaHook,
        },
      },
      {
        input: {
          onUploadProgress: betaHook,
        },
      },
    ]

    test.each(cases)('onUploadProgress: $input.onUploadProgress.name', ({ input }) => {
      const extendedHook = launcher.extendOnUploadProgressHook(input)

      expect(extendedHook)
        .toBe(input.onUploadProgress) // same reference
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('#extendOnDownloadProgressHook()', () => {
    const launcher = BaseRestfulApiLauncher.create({
      config: {
        BASE_URL: 'http://example.com/restfulapi',
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
        input: {
          onDownloadProgress: alphaHook,
        },
      },
      {
        input: {
          onDownloadProgress: betaHook,
        },
      },
    ]

    test.each(cases)('onDownloadProgress: $input.onDownloadProgress.name', ({ input }) => {
      const extendedHook = launcher.extendOnDownloadProgressHook(input)

      expect(extendedHook)
        .toBe(input.onDownloadProgress) // same reference
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('#invokeFetchQuery()', () => {
    describe('to return response', () => {
      const cases = [
        {
          input: {
            baseUrl: 'http://example.com/restfulapi-customer',
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 100001,
              },
            }),
            sink: {
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
          tally: {
            config: {
              timeoutMilliseconds: 30000,
            },
            request: new Request('http://example.com/restfulapi-customer', {
              method: 'POST',
              headers: new Headers({
                'content-type': 'application/json',
                'x-access-token': 'access-token-01',
              }),
              body: null,
            }),
            sink: {
              onUploadProgress: expect.any(Function),
              onDownloadProgress: expect.any(Function),
            },
          },
        },
        {
          input: {
            baseUrl: 'http://example.com/restfulapi-admin',
            payload: BaseRestfulApiPayload.create({
              body: {
                id: 200001,
              },
            }),
            sink: {
              onUploadProgress: () => {},
              // onDownloadProgress: () => {},
            },
          },
          tally: {
            config: {
              timeoutMilliseconds: 1000,
            },
            request: new Request('http://example.com/restfulapi-admin', {
              method: 'POST',
              headers: new Headers({
                'content-type': 'application/json',
                'x-access-token': 'access-token-02',
              }),
              body: JSON.stringify({
                id: 200001,
              }),
            }),
            sink: {
              onUploadProgress: expect.any(Function),
              onDownloadProgress: expect.any(Function),
            },
          },
        },
      ]

      test.each(cases)('baseUrl: $input.request.baseUrl', async ({ input, tally }) => {
        const responseTally = new Response()
        const httpParcelTally = XMLHttpParcel.create({
          request: new Request('http://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: responseTally,
        })
        const httpFetcherMock = XMLHttpFetcher.create({
          request: tally.request,
          config: {},
        })

        const expectedArgsForCreateFetchRequest = {
          baseUrl: input.baseUrl,
        }

        jest.spyOn(input.payload, 'timeoutMilliseconds', 'get')
          .mockReturnValue(tally.config.timeoutMilliseconds)
        const createFetchRequestSpy = jest.spyOn(input.payload, 'createFetchRequest')
          .mockReturnValue(tally.request)
        const createHttpFetcherSpy = jest.spyOn(BaseRestfulApiLauncher, 'createHttpFetcher')
          .mockReturnValue(httpFetcherMock)
        const fetchResponseSpy = jest.spyOn(httpFetcherMock, 'fetchResponse')
          .mockResolvedValue(httpParcelTally)

        const launcher = BaseRestfulApiLauncher.create({
          config: {
            BASE_URL: input.baseUrl,
          },
        })
        const args = {
          payload: input.payload,
          sink: input.sink,
        }

        const actual = await launcher.invokeFetchQuery(args)

        expect(actual)
          .toBe(httpParcelTally) // same instance

        expect(createFetchRequestSpy)
          .toHaveBeenCalledWith(expectedArgsForCreateFetchRequest)
        expect(createHttpFetcherSpy)
          .toHaveBeenCalledWith({
            request: tally.request,
            config: tally.config,
          })
        expect(fetchResponseSpy)
          .toHaveBeenCalledWith({
            sink: tally.sink,
          })
      })
    })

    describe('to be the parcel of the error on a failed fetch', () => {
      const cases = [
        {
          input: {
            baseUrl: 'http://example.com/restfulapi-customer',
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 100001,
              },
            }),
            sink: {
              onUploadProgress: () => {},
              onDownloadProgress: () => {},
            },
          },
          tally: {
            request: new Request('http://example.com/restfulapi-customer', {
              method: 'POST',
              headers: new Headers({
                'content-type': 'application/json',
                'x-access-token': 'access-token-01',
              }),
              body: null,
            }),
            sink: {
              onUploadProgress: expect.any(Function),
              onDownloadProgress: expect.any(Function),
            },
          },
        },
        {
          input: {
            baseUrl: 'http://example.com/restfulapi-admin',
            payload: BaseRestfulApiPayload.create({
              body: {
                id: 200001,
              },
            }),
            sink: {
              onUploadProgress: () => {},
              // onDownloadProgress: () => {},
            },
          },
          tally: {
            request: new Request('http://example.com/restfulapi-admin', {
              method: 'POST',
              headers: new Headers({
                'content-type': 'application/json',
                'x-access-token': 'access-token-02',
              }),
              body: JSON.stringify({
                id: 200001,
              }),
            }),
            sink: {
              onUploadProgress: expect.any(Function),
              onDownloadProgress: expect.any(Function),
            },
          },
        },
      ]

      test.each(cases)('baseUrl: $input.request.baseUrl', async ({ input, tally }) => {
        const httpFetcherMock = XMLHttpFetcher.create({
          request: tally.request,
          config: {},
        })
        const networkErrorParcelTally = XMLHttpParcel.createAsNetworkError({
          request: new Request('http://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
        })

        jest.spyOn(input.payload, 'createFetchRequest')
          .mockReturnValue(tally.request)
        jest.spyOn(BaseRestfulApiLauncher, 'createHttpFetcher')
          .mockReturnValue(httpFetcherMock)
        jest.spyOn(httpFetcherMock, 'fetchResponse')
          .mockResolvedValue(networkErrorParcelTally)

        const launcher = BaseRestfulApiLauncher.create({
          config: {
            BASE_URL: input.baseUrl,
          },
        })
        const args = {
          payload: input.payload,
          options: input.options,
        }

        const actual = await launcher.invokeFetchQuery(args)

        expect(actual)
          .toBe(networkErrorParcelTally) // same instance
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('#retrieveCapsule()', () => {
    describe('to return network error capsule on null response', () => {
      const cases = [
        {
          input: {
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 10001,
              },
            }),
          },
        },
        {
          input: {
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 20001,
              },
            }),
          },
        },
      ]

      test.each(cases)('payload: $input.payload', async ({ input }) => {
        const httpParcelTally = XMLHttpParcel.createAsNetworkError({
          request: new Request('http://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
        })

        const expectedArgs = {
          responseParcel: httpParcelTally,
          payload: input.payload,
        }

        const capsuleTally = BaseRestfulApiCapsule.createAsNetworkError({
          responseParcel: httpParcelTally,
          payload: input.payload,
        })

        const launcher = BaseRestfulApiLauncher.create({
          config: {
            BASE_URL: 'http://example.com/graphql',
          },
        })

        const createCapsuleAsNetworkErrorSpy = jest.spyOn(BaseRestfulApiLauncher, 'createCapsuleAsNetworkError')
          .mockReturnValue(capsuleTally)

        const args = {
          payload: input.payload,
          httpParcel: httpParcelTally,
        }

        const actual = await launcher.retrieveCapsule(args)

        expect(actual)
          .toBe(capsuleTally) // same reference

        expect(createCapsuleAsNetworkErrorSpy)
          .toHaveBeenCalledWith(expectedArgs)
      })
    })

    describe('to return response body parse error capsule on invalid JSON', () => {
      const cases = [
        {
          input: {
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 10001,
              },
            }),
          },
        },
        {
          input: {
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 20001,
              },
            }),
          },
        },
      ]

      test.each(cases)('payload: $input.payload', async ({ input }) => {
        const responseTally = new Response(`{
          "data": {
            "customer": {
              "id": 10001
            }
          }
        }}`) // ERROR: last } is doubled
        const httpParcelTally = XMLHttpParcel.create({
          request: new Request('http://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: responseTally,
        })

        const capsuleTally = BaseRestfulApiCapsule.createAsResponseBodyParseError({
          responseParcel: httpParcelTally,
          payload: input.payload,
        })

        const expectedArgs = {
          responseParcel: httpParcelTally,
          payload: input.payload,
        }

        const createCapsuleAsResponseBodyParseErrorSpy = jest.spyOn(BaseRestfulApiLauncher, 'createCapsuleAsResponseBodyParseError')
          .mockReturnValue(capsuleTally)

        const launcher = BaseRestfulApiLauncher.create({
          config: {
            BASE_URL: 'http://example.com/graphql',
          },
        })

        const args = {
          payload: input.payload,
          httpParcel: httpParcelTally,
        }

        const actual = await launcher.retrieveCapsule(args)

        expect(actual)
          .toEqual(capsuleTally)

        expect(createCapsuleAsResponseBodyParseErrorSpy)
          .toHaveBeenCalledWith(expectedArgs)
      })
    })

    describe('to return result capsule on success', () => {
      const cases = [
        {
          input: {
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 10001,
              },
            }),
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(`{
              "data": {
                "customer": {
                  "id": 10001
                }
              }
            }`),
            }),
            result: {
              content: {
                customer: {
                  id: 10001,
                },
              },
            },
          },
        },
        {
          input: {
            payload: BaseRestfulApiPayload.create({
              query: {
                id: 20001,
              },
            }),
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(`{
              "data": {
                "admin": {
                  "id": 20001
                }
              }
            }`),
            }),
            result: {
              content: {
                admin: {
                  id: 20001,
                },
              },
            },
          },
        },
      ]

      test.each(cases)('payload: $input.payload', async ({ input }) => {
        const capsuleTally = BaseRestfulApiCapsule.create({
          responseParcel: input.responseParcel,
          payload: input.payload,
          result: input.result,
        })

        const expectedArgsForGenerateFetchResult = {
          responseParcel: input.responseParcel,
        }
        const expectedArgsForCreateCapsule = {
          responseParcel: input.responseParcel,
          payload: input.payload,
          result: input.result,
        }

        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return BaseRestfulApiCapsule
          }
        }

        const launcher = Launcher.create({
          config: {
            BASE_URL: 'http://example.com/graphql',
          },
        })

        const generateFetchResultSpy = jest.spyOn(launcher, 'generateFetchResult')
          .mockResolvedValue(input.result)
        const createCapsuleSpy = jest.spyOn(Launcher, 'createCapsule')
          .mockReturnValue(capsuleTally)

        const args = {
          payload: input.payload,
          httpParcel: input.responseParcel,
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

    describe('to leave the response of the capsule readable', () => {
      const cases = [
        {
          input: {
            body: '{"content":{"customer":{"id":10001}}}',
          },
          expected: {
            content: {
              customer: {
                id: 10001,
              },
            },
          },
        },
        {
          input: {
            body: '{"content":{"admin":{"id":20001}}}',
          },
          expected: {
            content: {
              admin: {
                id: 20001,
              },
            },
          },
        },
      ]

      test.each(cases)('body: $input.body', async ({ input, expected }) => {
        class Launcher extends BaseRestfulApiLauncher {
          /** @override */
          static get Capsule () {
            return BaseRestfulApiCapsule
          }
        }

        const launcher = Launcher.create({
          config: {
            BASE_URL: 'http://example.com/api',
          },
        })
        const httpParcel = XMLHttpParcel.create({
          request: new Request('http://example.com/neutral'), // Neutral value
          config: {}, // Neutral value
          response: new Response(input.body),
        })

        const capsule = await launcher.retrieveCapsule({
          payload: BaseRestfulApiPayload.create({
            query: {
              id: 10001,
            },
          }),
          httpParcel,
        })

        const actual = await capsule.responseParcel.toJson()

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('BaseRestfulApiLauncher', () => {
  describe('#generateFetchResult()', () => {
    describe('to be parsed JSON object', () => {
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(`{
              "content": {
                "customer": {
                  "id": 10001
                }
              }
            }`),
            }),
          },
          expected: {
            content: {
              customer: {
                id: 10001,
              },
            },
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(`{
              "content": {
                "customer": {
                  "id": 10002
                }
              }
            }`),
            }),
          },
          expected: {
            content: {
              customer: {
                id: 10002,
              },
            },
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(`{
              "error": {
                "message": "Error message 01"
              }
            }`),
            }),
          },
          expected: {
            error: {
              message: 'Error message 01',
            },
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(`{
              "error": {
                "message": "Error message 02"
              }
            }`),
            }),
          },
          expected: {
            error: {
              message: 'Error message 02',
            },
          },
        },
      ]

      test.each(cases)('response: $input.responseParcel.response', async ({ input, expected }) => {
        const createResponseBodyParserSpy = jest.spyOn(BaseRestfulApiLauncher, 'createResponseBodyParser')

        const launcher = BaseRestfulApiLauncher.create({
          config: {
            BASE_URL: 'http://example.com/graphql-customer',
          },
        })

        const actual = await launcher.generateFetchResult(input)

        expect(actual)
          .toEqual(expected)

        expect(createResponseBodyParserSpy)
          .toHaveBeenCalledWith(input)
      })
    })

    describe('to decode the body with the charset of the response', () => {
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(
                Uint8Array.from([0x7B, 0x22, 0x69, 0x64, 0x22, 0x3A, 0x22, 0x82, 0xB1, 0x22, 0x7D]), // {"id":"こ"} in Shift_JIS
                {
                  headers: {
                    'Content-Type': 'application/json; charset=Shift_JIS',
                  },
                }
              ),
            }),
          },
          expected: {
            id: 'こ',
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(
                Uint8Array.from([0x7B, 0x22, 0x69, 0x64, 0x22, 0x3A, 0x22, 0x82, 0xF1, 0x22, 0x7D]), // {"id":"ん"} in Shift_JIS
                {
                  headers: {
                    'Content-Type': 'application/json; charset=Shift_JIS',
                  },
                }
              ),
            }),
          },
          expected: {
            id: 'ん',
          },
        },
      ]

      test.each(cases)('response: $input.responseParcel.response', async ({ input, expected }) => {
        const launcher = BaseRestfulApiLauncher.create({
          config: {
            BASE_URL: 'http://example.com/graphql-customer',
          },
        })

        const actual = await launcher.generateFetchResult(input)

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('to leave the parcel readable after the result was generated', () => {
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response('{"content":{"customer":{"id":10001}}}'),
            }),
          },
          expected: {
            content: {
              customer: {
                id: 10001,
              },
            },
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response('{"content":{"customer":{"id":10002}}}'),
            }),
          },
          expected: {
            content: {
              customer: {
                id: 10002,
              },
            },
          },
        },
      ]

      test.each(cases)('response: $input.responseParcel.response', async ({ input, expected }) => {
        const launcher = BaseRestfulApiLauncher.create({
          config: {
            BASE_URL: 'http://example.com/graphql-customer',
          },
        })

        await launcher.generateFetchResult(input)

        const actual = await input.responseParcel.toJson()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('on response body parsed error', () => {
      const cases = [
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(`{
              "content": {
                "customer": {
                  "id": 10001
                }
              }
            }}`),
            }), // ERROR: last } is doubled
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(`{
              "content": {
                "customer": {
                  "id": 10002
                }
              }
            }}`),
            }), // ERROR: last } is doubled
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(`{
              "error": {
                "message": "Error message 01"
              }
            }}`),
            }), // ERROR: last } is doubled
          },
        },
        {
          input: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(`{
              "error": {
                "message": "Error message 02"
              }
            }}`),
            }), // ERROR: last } is doubled
          },
        },
      ]

      test.each(cases)('response: $input.responseParcel.response', async ({ input }) => {
        const launcher = BaseRestfulApiLauncher.create({
          config: {
            BASE_URL: 'http://example.com/graphql-admin',
          },
        })

        const actual = await launcher.generateFetchResult(input)

        expect(actual)
          .toBeNull()
      })
    })
  })
})
