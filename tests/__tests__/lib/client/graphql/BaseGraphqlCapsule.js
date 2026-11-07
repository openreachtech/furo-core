import {
  ConstructorSpy,
} from '@openreachtech/jest-constructor-spy'

import BaseGraphqlCapsule, {
  LAUNCH_ABORTED_REASON,
} from '~/lib/client/graphql/BaseGraphqlCapsule.js'

import BaseGraphqlPayload from '~/lib/client/graphql/BaseGraphqlPayload.js'
import XMLHttpParcel from '~/lib/tools/http-fetchers/parcels/concretes/XMLHttpParcel.js'

describe('BaseGraphqlCapsule', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      const mockResponseParcel = XMLHttpParcel.create({
        request: new Request('http://example.com/neutral'), // Neutral value
        config: {}, // Neutral value
        response: new Response(),
      })
      const mockPayload = new BaseGraphqlPayload({
        queryTemplate: /* GraphQL */ `
          query {
            customer {
              id
            }
          }
        `,
        variables: null,
      })

      describe('#responseParcel', () => {
        const cases = [
          {
            params: {
              response: new Response(),
            },
          },
        ]

        test.each(cases)('response: $params.response', ({ params }) => {
          const args = {
            responseParcel: params.response,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }

          const actual = new BaseGraphqlCapsule(args)

          expect(actual)
            .toHaveProperty('responseParcel', params.response)
        })
      })

      describe('#payload', () => {
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

        test.each(cases)('payload: $params.payload', ({ params }) => {
          const args = {
            responseParcel: mockResponseParcel,
            payload: params.payload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }

          const actual = new BaseGraphqlCapsule(args)

          expect(actual)
            .toHaveProperty('payload', params.payload)
        })
      })

      describe('#result', () => {
        /**
         * @type {Array<{
         *   params: {
         *     result: GraphqlType.Response
         *   }
         * }>}
         */
        const cases = /** @type {Array<*>} */ ([
          {
            params: {
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
              result: {
                errors: [
                  {
                    message: 'error message-01',
                    locations: [
                      {
                        line: 101,
                        column: 11,
                      },
                    ],
                    path: [
                      'alpha',
                    ],
                  },
                  {
                    message: 'error message-02',
                    locations: [
                      {
                        line: 102,
                        column: 12,
                      },
                    ],
                    path: [
                      'beta',
                    ],
                  },
                ],
              },
            },
          },
        ])

        test.each(cases)('result: $params.result', ({ params }) => {
          const args = {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: params.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }

          const actual = new BaseGraphqlCapsule(args)

          expect(actual)
            .toHaveProperty('result', params.result)
        })
      })

      describe('#abortedReason', () => {
        /**
         * @type {Array<{
         *   params: {
         *     abortedReason: LAUNCH_ABORTED_REASON
         *   }
         * }>}
         */
        const cases = [
          {
            params: {
              abortedReason: LAUNCH_ABORTED_REASON.NONE,
            },
          },
          {
            params: {
              abortedReason: LAUNCH_ABORTED_REASON.UNKNOWN,
            },
          },
          {
            params: {
              abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
            },
          },
          {
            params: {
              abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
            },
          },
        ]

        test.each(cases)('abortedReason: $params.abortedReason', ({ params }) => {
          const args = {
            responseParcel: null,
            payload: mockPayload,
            result: null,
            abortedReason: params.abortedReason,
          }

          const actual = new BaseGraphqlCapsule(args)

          expect(actual)
            .toHaveProperty('abortedReason', params.abortedReason)
        })
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      /**
       * @type {Array<{
       *   params: {
       *     responseParcel: Response | null
       *     payload: BaseGraphqlPayload
       *     result: GraphqlType.Response | null
       *   }
       * }>}
       */
      const cases = /** @type {Array<*>} */ ([
        {
          params: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
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
                  id: 10001,
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
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
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
                  id: 10002,
                },
              },
            }),
            result: {
              errors: [
                {
                  message: 'error message-01',
                  locations: [
                    {
                      line: 101,
                      column: 11,
                    },
                  ],
                  path: [
                    'alpha',
                  ],
                },
                {
                  message: 'error message-02',
                  locations: [
                    {
                      line: 102,
                      column: 12,
                    },
                  ],
                  path: [
                    'beta',
                  ],
                },
              ],
            },
          },
        },
      ])

      test.each(cases)('result: $params.result', ({ params }) => {
        const actual = BaseGraphqlCapsule.create(params)

        expect(actual)
          .toBeInstanceOf(BaseGraphqlCapsule)
      })
    })

    describe('to call constructor', () => {
      describe('with abortedReason', () => {
        /**
         * @type {Array<{
         *   params: {
         *     responseParcel: Response | null
         *     payload: BaseGraphqlPayload
         *     result: GraphqlType.Response | null
         *     abortedReason: LAUNCH_ABORTED_REASON
         *   }
         * }>}
         */
        const cases = /** @type {Array<*>} */ ([
          {
            params: {
              responseParcel: XMLHttpParcel.create({
                request: new Request('http://example.com/neutral'), // Neutral value
                config: {}, // Neutral value
                response: new Response(),
              }),
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
                    id: 10001,
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
              responseParcel: XMLHttpParcel.create({
                request: new Request('http://example.com/neutral'), // Neutral value
                config: {}, // Neutral value
                response: new Response(),
              }),
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
                    id: 10002,
                  },
                },
              }),
              result: {
                errors: [
                  {
                    message: 'error message-01',
                    locations: [
                      {
                        line: 101,
                        column: 11,
                      },
                    ],
                    path: [
                      'alpha',
                    ],
                  },
                  {
                    message: 'error message-02',
                    locations: [
                      {
                        line: 102,
                        column: 12,
                      },
                    ],
                    path: [
                      'beta',
                    ],
                  },
                ],
              },
              abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
            },
          },
        ])

        test.each(cases)('result: $params.result', ({ params }) => {
          const DerivedClass = ConstructorSpy.create({ jest })
            .spyOn(BaseGraphqlCapsule)

          DerivedClass.create(params)

          expect(DerivedClass.__spy__)
            .toHaveBeenCalledWith(params)
        })
      })

      describe('with no abortedReason', () => {
        /**
         * @type {Array<{
         *   params: {
         *     responseParcel: Response | null
         *     payload: BaseGraphqlPayload
         *     result: GraphqlType.Response | null
         *   }
         * }>}
         */
        const cases = /** @type {Array<*>} */ ([
          {
            params: {
              responseParcel: XMLHttpParcel.create({
                request: new Request('http://example.com/neutral'), // Neutral value
                config: {}, // Neutral value
                response: new Response(),
              }),
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
                    id: 10001,
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
              responseParcel: XMLHttpParcel.create({
                request: new Request('http://example.com/neutral'), // Neutral value
                config: {}, // Neutral value
                response: new Response(),
              }),
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
                    id: 10002,
                  },
                },
              }),
              result: {
                errors: [
                  {
                    message: 'error message-01',
                    locations: [
                      {
                        line: 101,
                        column: 11,
                      },
                    ],
                    path: [
                      'alpha',
                    ],
                  },
                  {
                    message: 'error message-02',
                    locations: [
                      {
                        line: 102,
                        column: 12,
                      },
                    ],
                    path: [
                      'beta',
                    ],
                  },
                ],
              },
            },
          },
        ])

        test.each(cases)('result: $params.result', ({ params }) => {
          const expected = {
            ...params,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }

          const DerivedClass = ConstructorSpy.create({ jest })
            .spyOn(BaseGraphqlCapsule)

          DerivedClass.create(params)

          expect(DerivedClass.__spy__)
            .toHaveBeenCalledWith(expected)
        })
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('.createAsPending()', () => {
    describe('to be instance of own class', () => {
      test('with no args', () => {
        const actual = BaseGraphqlCapsule.createAsPending()

        expect(actual)
          .toBeInstanceOf(BaseGraphqlCapsule)
      })
    })

    describe('to call .create()', () => {
      test('with no args', () => {
        const expectedArgs = {
          responseParcel: null,
          payload: null,
          result: null,
        }

        const createSpy = jest.spyOn(BaseGraphqlCapsule, 'create')

        BaseGraphqlCapsule.createAsPending()

        expect(createSpy)
          .toHaveBeenCalledWith(expectedArgs)

        createSpy.mockRestore()
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('.createAsInvalidVariablesError()', () => {
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
            variables: {
              input: {
                email: 'info@example.com',
                username: 'JohnDoe',
                password: 'password$01',
              },
            },
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
            variables: {
              input: {
                email: 'jane.smith@example.com',
                username: 'JaneSmith',
                password: 'password$01',
              },
            },
          }),
        },
      },
    ]

    describe('to be instance of own class', () => {
      test.each(cases)('payload: $args.payload', ({ args }) => {
        const actual = BaseGraphqlCapsule.createAsInvalidVariablesError(args)

        expect(actual)
          .toBeInstanceOf(BaseGraphqlCapsule)
      })
    })

    describe('to call .create()', () => {
      test.each(cases)('payload: $args.payload', ({ args }) => {
        const expectedArgs = {
          responseParcel: null,
          payload: args.payload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.INVALID_VARIABLES,
        }

        const createSpy = jest.spyOn(BaseGraphqlCapsule, 'create')

        BaseGraphqlCapsule.createAsInvalidVariablesError(args)

        expect(createSpy)
          .toHaveBeenCalledWith(expectedArgs)

        createSpy.mockRestore()
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('.createAsAbortedByHooks()', () => {
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
            variables: {
              input: {
                email: 'info@example.com',
                username: 'JohnDoe',
                password: 'password$01',
              },
            },
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
            variables: {
              input: {
                email: 'jane.smith@example.com',
                username: 'JaneSmith',
                password: 'password$01',
              },
            },
          }),
        },
      },
    ]

    describe('to be instance of own class', () => {
      test.each(cases)('payload: $args.payload', ({ args }) => {
        const actual = BaseGraphqlCapsule.createAsAbortedByHooks(args)

        expect(actual)
          .toBeInstanceOf(BaseGraphqlCapsule)
      })
    })

    describe('to call .create()', () => {
      test.each(cases)('payload: $args.payload', ({ args }) => {
        const expectedArgs = {
          responseParcel: null,
          payload: args.payload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.BEFORE_REQUEST_HOOK,
        }

        const createSpy = jest.spyOn(BaseGraphqlCapsule, 'create')

        BaseGraphqlCapsule.createAsAbortedByHooks(args)

        expect(createSpy)
          .toHaveBeenCalledWith(expectedArgs)

        createSpy.mockRestore()
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('.createAsNetworkError()', () => {
    describe('to be instance of own class', () => {
      const cases = [
        {
          args: {
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
            }),
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
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
            }),
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
        const actual = BaseGraphqlCapsule.createAsNetworkError(args)

        expect(actual)
          .toBeInstanceOf(BaseGraphqlCapsule)
      })
    })

    describe('to call .create()', () => {
      const cases = [
        {
          args: {
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
            }),
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
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
            }),
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
        const expectedArgs = {
          responseParcel: args.responseParcel,
          payload: args.payload,
          result: null,
        }

        const createSpy = jest.spyOn(BaseGraphqlCapsule, 'create')

        BaseGraphqlCapsule.createAsNetworkError(args)

        expect(createSpy)
          .toHaveBeenCalledWith(expectedArgs)

        createSpy.mockRestore()
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('.createAsJsonParseError()', () => {
    describe('to be instance of own class', () => {
      const cases = [
        {
          args: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
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
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
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
        const actual = BaseGraphqlCapsule.createAsJsonParseError(args)

        expect(actual)
          .toBeInstanceOf(BaseGraphqlCapsule)
      })
    })

    describe('to call constructor', () => {
      const cases = [
        {
          args: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
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
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
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
        const expected = {
          responseParcel: args.responseParcel,
          payload: args.payload,
          result: null,
        }

        const createSpy = jest.spyOn(BaseGraphqlCapsule, 'create')

        BaseGraphqlCapsule.createAsJsonParseError(args)

        expect(createSpy)
          .toHaveBeenCalledWith(expected)

        createSpy.mockRestore()
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('.get:unknownErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '190.X000.001'

      const actual = BaseGraphqlCapsule.unknownErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('.get:invalidVariablesErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '191.X000.001'

      const actual = BaseGraphqlCapsule.invalidVariablesErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('.get:abortErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '192.X000.004'

      const actual = BaseGraphqlCapsule.abortErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('.get:timeoutErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '192.X000.003'

      const actual = BaseGraphqlCapsule.timeoutErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('.get:networkErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '192.X000.001'

      const actual = BaseGraphqlCapsule.networkErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('.get:jsonParseErrorCode', () => {
    test('to be fixed value', () => {
      const expected = '192.X000.002'

      const actual = BaseGraphqlCapsule.jsonParseErrorCode

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#get:Ctor', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })
    const mockResult = {
      data: {
        customer: {
          id: 10001,
        },
      },
    }

    const cases = [
      {
        params: {
          args: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: mockResult,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
      {
        params: {
          args: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
      {
        params: {
          args: {
            responseParcel: null,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
      {
        params: {
          args: {
            responseParcel: null,
            payload: null,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
    ]

    test.each(cases)('args: $params.args', ({ params }) => {
      const capsule = new BaseGraphqlCapsule(params.args)

      const actual = capsule.Ctor

      expect(actual)
        .toBe(BaseGraphqlCapsule) // same reference
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#get:content', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })

    const cases = [
      {
        params: {
          args: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: {
              data: {
                customer: {
                  id: 1000001,
                },
              },
            },
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        expected: {
          customer: {
            id: 1000001,
          },
        },
      },
      {
        params: {
          args: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: {
              data: {
                admin: {
                  id: 2000001,
                },
              },
            },
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        expected: {
          admin: {
            id: 2000001,
          },
        },
      },
      {
        params: {
          args: {
            responseParcel: null,
            payload: mockPayload,
            result: {
              data: {
                articles: [
                  { id: 1000001, title: 'Article 01' },
                  { id: 1000002, title: 'Article 02' },
                  { id: 1000003, title: 'Article 03' },
                ],
              },
            },
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        expected: {
          articles: [
            { id: 1000001, title: 'Article 01' },
            { id: 1000002, title: 'Article 02' },
            { id: 1000003, title: 'Article 03' },
          ],
        },
      },
      {
        params: {
          args: {
            responseParcel: null,
            payload: null,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        expected: null,
      },
    ]

    test.each(cases)('result: $params.args.result', ({ params, expected }) => {
      const capsule = new BaseGraphqlCapsule(params.args)

      const actual = capsule.content

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#get:errors', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })

    /**
     * @type {Array<{
     *   params: {
     *     args: {
     *       responseParcel: Response | null
     *       payload: BaseGraphqlPayload
     *       result: GraphqlType.Response | null
     *       abortedReason: LAUNCH_ABORTED_REASON
     *     }
     *   }
     *   expected: Array<GraphqlType.ResponseError>
     * }>}
     */
    const cases = /** @type {Array<*>} */ ([
      {
        params: {
          args: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: {
              errors: [
                {
                  message: 'error message-01',
                  locations: [
                    {
                      line: 100001,
                      column: 11,
                    },
                  ],
                },
              ],
            },
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        expected: [
          {
            message: 'error message-01',
            locations: [
              {
                line: 100001,
                column: 11,
              },
            ],
          },
        ],
      },
      {
        params: {
          args: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: {
              errors: [
                {
                  message: 'error message-01',
                  locations: [
                    {
                      line: 200001,
                      column: 21,
                    },
                  ],
                },
                {
                  message: 'error message-02',
                  locations: [
                    {
                      line: 200002,
                      column: 22,
                    },
                  ],
                },
              ],
            },
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        expected: [
          {
            message: 'error message-01',
            locations: [
              {
                line: 200001,
                column: 21,
              },
            ],
          },
          {
            message: 'error message-02',
            locations: [
              {
                line: 200002,
                column: 22,
              },
            ],
          },
        ],
      },
      {
        params: {
          args: {
            responseParcel: null,
            payload: mockPayload,
            result: {
              errors: [
                {
                  message: 'error message-01',
                  locations: [
                    {
                      line: 300001,
                      column: 31,
                    },
                  ],
                },
                {
                  message: 'error message-02',
                  locations: [
                    {
                      line: 300002,
                      column: 32,
                    },
                  ],
                },
                {
                  message: 'error message-03',
                  locations: [
                    {
                      line: 300003,
                      column: 33,
                    },
                  ],
                },
              ],
            },
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        expected: [
          {
            message: 'error message-01',
            locations: [
              {
                line: 300001,
                column: 31,
              },
            ],
          },
          {
            message: 'error message-02',
            locations: [
              {
                line: 300002,
                column: 32,
              },
            ],
          },
          {
            message: 'error message-03',
            locations: [
              {
                line: 300003,
                column: 33,
              },
            ],
          },
        ],
      },
      {
        params: {
          args: {
            responseParcel: null,
            payload: null,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        expected: [],
      },
    ])

    test.each(cases)('result: $params.args.result', ({ params, expected }) => {
      const capsule = new BaseGraphqlCapsule(params.args)

      const actual = capsule.errors

      expect(actual)
        .toEqual(expected)
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#isPending()', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockResult = {
      data: {
        customer: {
          id: 10001,
        },
      },
    }

    describe('to be pending (truthy)', () => {
      const cases = [
        {
          params: {
            responseParcel: null,
            payload: null,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel; result: $params.result', ({ params }) => {
        const capsule = new BaseGraphqlCapsule(params)

        const actual = capsule.isPending()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to be not pending (falsy)', () => {
      const mockPayload = new BaseGraphqlPayload({
        queryTemplate: /* GraphQL */ `
          query {
            customer {
              id
            }
          }
        `,
        variables: null,
      })

      const cases = [
        {
          params: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: mockResult,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          params: {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          params: {
            responseParcel: null,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel; result: $params.result', ({ params }) => {
        const capsule = new BaseGraphqlCapsule(params)

        const actual = capsule.isPending()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#hasInvalidVariablesError()', () => {
    /** @extends {BaseGraphqlPayload<typeof DerivedPayload, *>} */
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
            'email',
            'username',
            'password',
          ],
        }
      }
    }

    describe('to has invalid variables error (truthy)', () => {
      /**
       * @type {Array<{
       *   params: {
       *     variables: Record<string, any>
       *   }
       * }>}
       */
      const cases = [
        {
          params: {
            variables: {
              input: {
                email: 'john.doe@example.com',
                username: 'JohnDoe',
                password: 'password$01',
                'password-confirmation': 'password$01',
              },
            },
          },
        },
        {
          params: {
            variables: {
              input: {
                email: 'john.doe@example.com',
                // username: 'JohnDoe',
                password: 'password$01',
                'password-confirmation': 'password$01',
              },
            },
          },
        },
        {
          params: {
            variables: {
              input: {
                // email: 'john.doe@example.com',
                // username: 'JohnDoe',
                // password: 'password$01',
                'password-confirmation': 'password$01',
              },
            },
          },
        },
      ]

      test.each(cases)('variables: $params.variables', ({ params }) => {
        const targetPayload = DerivedPayload.create({
          variables: params.variables,
        })

        const args = {
          responseParcel: null,
          payload: targetPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasInvalidVariablesError()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to has no invalid variables error (falsy)', () => {
      const cases = [
        {
          params: {
            variables: {
              input: {
                email: 'john.doe@example.com',
                username: 'JohnDoe',
                password: 'password$01',
              },
            },
          },
        },
        {
          params: {
            variables: {
              input: {
                email: 'john.doe@example.com',
                // username: 'JohnDoe',
                password: 'password$01',
              },
            },
          },
        },
        {
          params: {
            variables: {
              input: {
                // email: 'john.doe@example.com',
                // username: 'JohnDoe',
                // password: 'password$01',
              },
            },
          },
        },
        {
          params: {
            variables: {
              // input: {
              //   email: 'john.doe@example.com',
              //   username: 'JohnDoe',
              //   password: 'password$01',
              // },
            },
          },
        },
      ]

      test.each(cases)('variables: $params.variables', ({ params }) => {
        const targetPayload = DerivedPayload.create({
          variables: params.variables,
        })

        const args = {
          responseParcel: null,
          payload: targetPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasInvalidVariablesError()

        expect(actual)
          .toBeFalsy()
      })

      test('when payload is null', () => {
        const args = {
          responseParcel: null,
          payload: null,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasInvalidVariablesError()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#hasAbortError()', () => {
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })

    describe('to be true where the parcel is of the abort', () => {
      const cases = [
        {
          params: {
            responseParcel: XMLHttpParcel.createAsAbortError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsAbortError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasAbortError()

        expect(actual)
          .toBe(true)
      })
    })

    describe('to be false where the parcel is not of the abort', () => {
      const cases = [
        {
          params: {
            responseParcel: null,
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsTimeoutError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/resource-0003'),
              config: {},
              response: new Response(),
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasAbortError()

        expect(actual)
          .toBe(false)
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#hasTimeoutError()', () => {
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })

    describe('to be true where the parcel is of the timeout', () => {
      const cases = [
        {
          params: {
            responseParcel: XMLHttpParcel.createAsTimeoutError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsTimeoutError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasTimeoutError()

        expect(actual)
          .toBe(true)
      })
    })

    describe('to be false where the parcel is not of the timeout', () => {
      const cases = [
        {
          params: {
            responseParcel: null,
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsAbortError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/resource-0003'),
              config: {},
              response: new Response(),
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasTimeoutError()

        expect(actual)
          .toBe(false)
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#hasNetworkError()', () => {
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })

    describe('to has no responseParcel (truthy)', () => {
      const cases = [
        {
          params: {
            responseParcel: null,
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasNetworkError()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to has responseParcel (falsy)', () => {
      const cases = [
        {
          params: {
            responseParcel: XMLHttpParcel.create({
              request: new Request('http://example.com/neutral'), // Neutral value
              config: {}, // Neutral value
              response: new Response(),
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasNetworkError()

        expect(actual)
          .toBeFalsy()
      })
    })

    describe('to has a failed parcel other than the abortion and the timeout (true)', () => {
      const cases = [
        {
          params: {
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasNetworkError()

        expect(actual)
          .toBe(true)
      })
    })

    describe('to has a parcel of the abortion or the timeout (false)', () => {
      const cases = [
        {
          params: {
            responseParcel: XMLHttpParcel.createAsAbortError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsTimeoutError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasNetworkError()

        expect(actual)
          .toBe(false)
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#hasJsonParseError()', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })

    describe('when has responseParcel', () => {
      describe('to has no result (truthy)', () => {
        const cases = [
          {
            params: {
              result: null,
            },
          },
        ]

        test.each(cases)('result: $params.result', ({ params }) => {
          const args = {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: params.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseGraphqlCapsule(args)

          const actual = capsule.hasJsonParseError()

          expect(actual)
            .toBeTruthy()
        })
      })

      describe('to has result (falsy)', () => {
        /**
         * @type {Array<{
         *   params: {
         *     result: GraphqlType.Response | null
         *   }
         * }>}
         */
        const cases = /** @type {Array<*>} */ ([
          {
            params: {
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
              result: {
                errors: [
                  {
                    message: 'error message-01',
                    locations: [
                      {
                        line: 101,
                        column: 11,
                      },
                    ],
                    path: [
                      'alpha',
                    ],
                  },
                  {
                    message: 'error message-02',
                    locations: [
                      {
                        line: 102,
                        column: 12,
                      },
                    ],
                    path: [
                      'beta',
                    ],
                  },
                ],
              },
            },
          },
        ])

        test.each(cases)('result: $params.result', ({ params }) => {
          const args = {
            responseParcel: mockResponseParcel,
            payload: mockPayload,
            result: params.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseGraphqlCapsule(args)

          const actual = capsule.hasJsonParseError()

          expect(actual)
            .toBeFalsy()
        })
      })
    })

    describe('when has no responseParcel', () => {
      describe('to be falsy always', () => {
        /**
         * @type {Array<{
         *   params: {
         *     result: GraphqlType.Response | null
         *   }
         * }>}
         */
        const cases = /** @type {Array<*>} */ ([
          {
            params: {
              result: null,
            },
          },
          {
            params: {
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
              result: {
                errors: [
                  {
                    message: 'error message-01',
                    locations: [
                      {
                        line: 101,
                        column: 11,
                      },
                    ],
                    path: [
                      'alpha',
                    ],
                  },
                  {
                    message: 'error message-02',
                    locations: [
                      {
                        line: 102,
                        column: 12,
                      },
                    ],
                    path: [
                      'beta',
                    ],
                  },
                ],
              },
            },
          },
        ])

        test.each(cases)('result: $params.result', ({ params }) => {
          const args = {
            responseParcel: null,
            payload: mockPayload,
            result: params.result,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }
          const capsule = new BaseGraphqlCapsule(args)

          const actual = capsule.hasJsonParseError()

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#hasQueryError()', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })

    describe('to has errors (truthy)', () => {
      /**
       * @type {Array<{
       *   params: {
       *     result: GraphqlType.Response | null
       *   }
       * }>}
       */
      const cases = /** @type {Array<*>} */ ([
        {
          params: {
            result: {
              errors: [
                {
                  message: 'error message-01',
                  locations: [
                    {
                      line: 101,
                      column: 11,
                    },
                  ],
                  path: [
                    'alpha',
                  ],
                },
                {
                  message: 'error message-02',
                  locations: [
                    {
                      line: 102,
                      column: 12,
                    },
                  ],
                  path: [
                    'beta',
                  ],
                },
              ],
            },
          },
        },
        {
          params: {
            result: {
              // Even if empty array, it is considered as query error.
              // Because it is not a normal response, not network error and not json parse error.
              errors: [],
            },
          },
        },
      ])

      test.each(cases)('result: $params.result', ({ params }) => {
        const args = {
          responseParcel: mockResponseParcel,
          payload: mockPayload,
          result: params.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasQueryError()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to has no errors (falsy)', () => {
      const cases = [
        {
          params: {
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
            result: null, // network error or json parse error, etc.
          },
        },
      ]

      test.each(cases)('result: $params.result', ({ params }) => {
        const args = {
          responseParcel: mockResponseParcel,
          payload: mockPayload,
          result: params.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasQueryError()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#hasError()', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })

    describe('to has error (truthy)', () => {
      /**
       * @type {Array<{
       *   params: {
       *     responseParcel: Response | null
       *     payload: BaseGraphqlPayload
       *     result: GraphqlType.Response | null
       *   }
       * }>}
       */
      const cases = /** @type {Array<*>} */ ([
        // query error
        {
          params: {
            responseParcel: mockResponseParcel,
            result: {
              errors: [
                {
                  message: 'error message-01',
                  locations: [
                    {
                      line: 101,
                      column: 11,
                    },
                  ],
                  path: [
                    'alpha',
                  ],
                },
                {
                  message: 'error message-02',
                  locations: [
                    {
                      line: 102,
                      column: 12,
                    },
                  ],
                  path: [
                    'beta',
                  ],
                },
              ],
            },
          },
        },
        // network error
        {
          params: {
            responseParcel: null,
            result: null,
          },
        },
        // JSON parse error
        {
          params: {
            responseParcel: mockResponseParcel,
            result: null,
          },
        },
      ])

      test.each(cases)('responseParcel: $params.responseParcel; result: $params.result', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: params.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }

        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasError()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to has no error (falsy)', () => {
      const cases = [
        {
          params: {
            responseParcel: mockResponseParcel,
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
            responseParcel: mockResponseParcel,
            result: {},
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel; result: $params.result', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: params.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }

        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasError()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#hasContent()', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })

    describe('to has content (truthy)', () => {
      const cases = [
        {
          params: {
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
            result: {
              data: {
                customer: {
                  id: 10002,
                },
              },
            },
          },
        },
      ]

      test.each(cases)('result: $params.result', ({ params }) => {
        const args = {
          responseParcel: mockResponseParcel,
          payload: mockPayload,
          result: params.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasContent()

        expect(actual)
          .toBeTruthy()
      })
    })

    describe('to has no content (falsy)', () => {
      /**
       * @type {Array<{
       *   params: {
       *     result: GraphqlType.Response | null
       *   }
       * }>}
       */
      const cases = /** @type {Array<*>} */ ([
        {
          params: {
            result: {
              errors: [
                {
                  message: 'error message-01',
                  locations: [
                    {
                      line: 101,
                      column: 11,
                    },
                  ],
                  path: [
                    'alpha',
                  ],
                },
                {
                  message: 'error message-02',
                  locations: [
                    {
                      line: 102,
                      column: 12,
                    },
                  ],
                  path: [
                    'beta',
                  ],
                },
              ],
            },
          },
        },
        {
          params: {
            result: null, // network error or json parse error, etc.
          },
        },
      ])

      test.each(cases)('result: $params.result', ({ params }) => {
        const args = {
          responseParcel: mockResponseParcel,
          payload: mockPayload,
          result: params.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.hasContent()

        expect(actual)
          .toBeFalsy()
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#extractErrors()', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })

    describe('when existing errors', () => {
      /**
       * @type {Array<{
       *   params: {
       *     result: GraphqlType.Response | null
       *   }
       *   expected: Array<GraphqlType.ResponseError>
       * }>}
       */
      const cases = /** @type {Array<*>} */ ([
        {
          params: {
            result: {
              errors: [
                {
                  message: 'error message-01',
                  locations: [
                    {
                      line: 101,
                      column: 11,
                    },
                  ],
                  path: [
                    'alpha',
                  ],
                },
                {
                  message: 'error message-02',
                  locations: [
                    {
                      line: 102,
                      column: 12,
                    },
                  ],
                  path: [
                    'beta',
                  ],
                },
              ],
            },
          },
          expected: [
            {
              message: 'error message-01',
              locations: [
                {
                  line: 101,
                  column: 11,
                },
              ],
              path: [
                'alpha',
              ],
            },
            {
              message: 'error message-02',
              locations: [
                {
                  line: 102,
                  column: 12,
                },
              ],
              path: [
                'beta',
              ],
            },
          ],
        },
        {
          params: {
            result: {
              errors: [
                {
                  message: 'error message-03',
                  locations: [
                    {
                      line: 103,
                      column: 13,
                    },
                  ],
                  path: [
                    'gamma',
                  ],
                },
              ],
            },
          },
          expected: [
            {
              message: 'error message-03',
              locations: [
                {
                  line: 103,
                  column: 13,
                },
              ],
              path: [
                'gamma',
              ],
            },
          ],
        },
      ])

      test.each(cases)('result: $params.result', ({ params, expected }) => {
        const args = {
          responseParcel: mockResponseParcel,
          payload: mockPayload,
          result: params.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.extractErrors()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('to get empty array', () => {
      const cases = [
        {
          params: {
            responseParcel: mockResponseParcel,
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
            responseParcel: mockResponseParcel,
            result: null,
          },
        },
        {
          params: {
            responseParcel: null,
            result: null,
          },
        },
      ]

      test.each(cases)('responseParcel: $params.responseParcel; result: $params.result', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: params.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.extractErrors()

        expect(actual)
          .toBeInstanceOf(Array)
        expect(actual)
          .toHaveLength(0)
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#getErrorMessage()', () => {
    describe('when the response was not received', () => {
      const neutralPayload = new BaseGraphqlPayload({
        queryTemplate: /* GraphQL */ `
          query {
            customer {
              id
            }
          }
        `,
        variables: null,
      })

      const cases = [
        {
          params: {
            responseParcel: XMLHttpParcel.createAsTimeoutError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
          expected: BaseGraphqlCapsule.timeoutErrorCode,
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsTimeoutError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
          expected: BaseGraphqlCapsule.timeoutErrorCode,
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsAbortError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
          expected: BaseGraphqlCapsule.abortErrorCode,
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsAbortError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
          expected: BaseGraphqlCapsule.abortErrorCode,
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/resource-0001'),
              config: {},
            }),
          },
          expected: BaseGraphqlCapsule.networkErrorCode,
        },
        {
          params: {
            responseParcel: XMLHttpParcel.createAsNetworkError({
              request: new Request('http://example.com/resource-0002'),
              config: {},
            }),
          },
          expected: BaseGraphqlCapsule.networkErrorCode,
        },
      ]

      test.each(cases)('expected: $expected', ({ params, expected }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: neutralPayload,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.getErrorMessage()

        expect(actual)
          .toBe(expected)
      })
    })

    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })

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

    describe('when has error', () => {
      const cases = [
        // on invalid variables error (191.X000.001)
        {
          params: {
            payload: DerivedPayload.create({
              variables: {
                input: {
                  username: 'JohnDoe',
                  password: 'password$01',
                  'confirm-password': 'password$01', // ❌
                },
              },
            }),
            responseParcel: null,
            result: null,
          },
          expected: '191.X000.001',
        },
        // on network error (192.X000.001)
        {
          params: {
            payload: mockPayload,
            responseParcel: null,
            result: null,
          },
          expected: '192.X000.001',
        },
        // on JSON parse error (192.X000.002)
        {
          params: {
            payload: mockPayload,
            responseParcel: mockResponseParcel,
            result: null,
          },
          expected: '192.X000.002',
        },
        // on query error
        {
          params: {
            payload: mockPayload,
            responseParcel: mockResponseParcel,
            result: {
              errors: [
                {
                  message: 'error message-01',
                  locations: [
                    {
                      line: 101,
                      column: 11,
                    },
                  ],
                  path: [
                    'alpha',
                  ],
                },
                {
                  message: 'error message-02',
                  locations: [
                    {
                      line: 102,
                      column: 12,
                    },
                  ],
                  path: [
                    'beta',
                  ],
                },
              ],
            },
          },
          expected: 'error message-01',
        },
        {
          params: {
            payload: mockPayload,
            responseParcel: mockResponseParcel,
            result: {
              errors: [
                {
                  message: 'error message-03',
                  locations: [
                    {
                      line: 103,
                      column: 13,
                    },
                  ],
                  path: [
                    'gamma',
                  ],
                },
              ],
            },
          },
          expected: 'error message-03',
        },
        // on unknown error (190.X000.001)
        {
          params: {
            payload: mockPayload,
            responseParcel: mockResponseParcel,
            result: {
              errors: [],
            },
          },
          expected: '190.X000.001',
        },
      ]

      test.each(cases)('payload: $params.payload; responseParcel: $params.responseParcel; result: $params.result', ({ params, expected }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: params.payload,
          result: params.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.getErrorMessage()

        expect(actual)
          .toBe(expected)
      })
    })

    describe('when has no error on post-fetch', () => {
      const cases = [
        {
          params: {
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
            result: {},
          },
        },
      ]

      test.each(cases)('result: $params.result', ({ params }) => {
        const args = {
          responseParcel: mockResponseParcel,
          payload: mockPayload,
          result: params.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.getErrorMessage()

        expect(actual)
          .toBeNull()
      })
    })

    describe('when has no error on pre-fetch', () => {
      test('all args are null', () => {
        const args = {
          responseParcel: null,
          payload: null,
          result: null,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.getErrorMessage()

        expect(actual)
          .toBeNull()
      })
    })
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#extractContent()', () => {
    const mockResponseParcel = XMLHttpParcel.create({
      request: new Request('http://example.com/neutral'), // Neutral value
      config: {}, // Neutral value
      response: new Response(),
    })
    const mockPayload = new BaseGraphqlPayload({
      queryTemplate: /* GraphQL */ `
        query {
          customer {
            id
          }
        }
      `,
      variables: null,
    })

    describe('when has content', () => {
      const cases = [
        {
          params: {
            result: {
              data: {
                customer: {
                  id: 10001,
                },
              },
            },
          },
          expected: {
            customer: {
              id: 10001,
            },
          },
        },
        {
          params: {
            result: {
              data: {
                customer: {
                  id: 10002,
                },
              },
            },
          },
          expected: {
            customer: {
              id: 10002,
            },
          },
        },
      ]

      test.each(cases)('result: $params.result', ({ params, expected }) => {
        const args = {
          responseParcel: mockResponseParcel,
          payload: mockPayload,
          result: params.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.extractContent()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('when has no content (returns null)', () => {
      /**
       * @type {Array<{
       *   params: {
       *     responseParcel: Response | null
       *     result: GraphqlType.Response | null
       *   }
       * }>}
       */
      const cases = /** @type {Array<*>} */ ([
        // on network error
        {
          params: {
            responseParcel: null,
            result: null,
          },
        },
        // on JSON parse error
        {
          params: {
            responseParcel: mockResponseParcel,
            result: null,
          },
        },
        // on query error
        {
          params: {
            responseParcel: mockResponseParcel,
            result: {
              errors: [
                {
                  message: 'error message-01',
                  locations: [
                    {
                      line: 101,
                      column: 11,
                    },
                  ],
                  path: [
                    'alpha',
                  ],
                },
              ],
            },
          },
        },
        {
          params: {
            responseParcel: mockResponseParcel,
            result: {},
          },
        },
      ])

      test.each(cases)('responseParcel: $params.responseParcel; result: $params.result', ({ params }) => {
        const args = {
          responseParcel: params.responseParcel,
          payload: mockPayload,
          result: params.result,
          abortedReason: LAUNCH_ABORTED_REASON.NONE,
        }
        const capsule = new BaseGraphqlCapsule(args)

        const actual = capsule.extractContent()

        expect(actual)
          .toBeNull()
      })
    })
  })
})
