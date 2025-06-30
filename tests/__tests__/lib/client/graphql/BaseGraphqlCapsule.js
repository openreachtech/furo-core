import {
  ConstructorSpy,
} from '@openreachtech/jest-constructor-spy'

import BaseGraphqlCapsule, {
  LAUNCH_ABORTED_REASON,
} from '~/lib/client/graphql/BaseGraphqlCapsule.js'

import BaseGraphqlPayload from '~/lib/client/graphql/BaseGraphqlPayload.js'

describe('BaseGraphqlCapsule', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      const mockResponse = new Response()
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

      describe('#rawResponse', () => {
        const cases = [
          {
            params: {
              response: new Response(),
            },
          },
        ]

        test.each(cases)('response: $params.response', ({ params }) => {
          const args = {
            rawResponse: params.response,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          }

          const actual = new BaseGraphqlCapsule(args)

          expect(actual)
            .toHaveProperty('rawResponse', params.response)
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
            rawResponse: mockResponse,
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
            rawResponse: mockResponse,
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
            rawResponse: null,
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
       *     rawResponse: Response | null
       *     payload: BaseGraphqlPayload
       *     result: GraphqlType.Response | null
       *   }
       * }>}
       */
      const cases = /** @type {Array<*>} */ ([
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
         *     rawResponse: Response | null
         *     payload: BaseGraphqlPayload
         *     result: GraphqlType.Response | null
         *     abortedReason: LAUNCH_ABORTED_REASON
         *   }
         * }>}
         */
        const cases = /** @type {Array<*>} */ ([
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
         *     rawResponse: Response | null
         *     payload: BaseGraphqlPayload
         *     result: GraphqlType.Response | null
         *   }
         * }>}
         */
        const cases = /** @type {Array<*>} */ ([
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
          rawResponse: null,
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
                email: 'john001@example.com',
                username: 'Eucen',
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
          rawResponse: null,
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
                email: 'john001@example.com',
                username: 'Eucen',
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
          rawResponse: null,
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
        const actual = BaseGraphqlCapsule.createAsNetworkError(args)

        expect(actual)
          .toBeInstanceOf(BaseGraphqlCapsule)
      })
    })

    describe('to call .create()', () => {
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
        const expectedArgs = {
          rawResponse: null,
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
        const actual = BaseGraphqlCapsule.createAsJsonParseError(args)

        expect(actual)
          .toBeInstanceOf(BaseGraphqlCapsule)
      })
    })

    describe('to call constructor', () => {
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
        const expected = {
          rawResponse: args.rawResponse,
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
    const mockResponse = new Response()
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
            rawResponse: mockResponse,
            payload: mockPayload,
            result: mockResult,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
      {
        params: {
          args: {
            rawResponse: mockResponse,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
      {
        params: {
          args: {
            rawResponse: null,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      },
      {
        params: {
          args: {
            rawResponse: null,
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
    const mockResponse = new Response()
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
            rawResponse: mockResponse,
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
            rawResponse: mockResponse,
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
            rawResponse: null,
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
            rawResponse: null,
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
    const mockResponse = new Response()
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
     *       rawResponse: Response | null
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
            rawResponse: mockResponse,
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
            rawResponse: mockResponse,
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
            rawResponse: null,
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
            rawResponse: null,
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
    const mockResponse = new Response()
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
            rawResponse: null,
            payload: null,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      ]

      test.each(cases)('rawResponse: $params.rawResponse; result: $params.result', ({ params }) => {
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
            rawResponse: mockResponse,
            payload: mockPayload,
            result: mockResult,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          params: {
            rawResponse: mockResponse,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
        {
          params: {
            rawResponse: null,
            payload: mockPayload,
            result: null,
            abortedReason: LAUNCH_ABORTED_REASON.NONE,
          },
        },
      ]

      test.each(cases)('rawResponse: $params.rawResponse; result: $params.result', ({ params }) => {
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
                email: 'eucen@example.com',
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
                email: 'eucen@example.com',
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
                // email: 'eucen@example.com',
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
          rawResponse: null,
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
                email: 'eucen@example.com',
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
                email: 'eucen@example.com',
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
                // email: 'eucen@example.com',
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
              //   email: 'eucen@example.com',
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
          rawResponse: null,
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
          rawResponse: null,
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

    describe('to has no rawResponse (truthy)', () => {
      const cases = [
        {
          params: {
            rawResponse: null,
          },
        },
      ]

      test.each(cases)('rawResponse: $params.rawResponse', ({ params }) => {
        const args = {
          rawResponse: params.rawResponse,
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

    describe('to has rawResponse (falsy)', () => {
      const cases = [
        {
          params: {
            rawResponse: new Response(),
          },
        },
      ]

      test.each(cases)('rawResponse: $params.rawResponse', ({ params }) => {
        const args = {
          rawResponse: params.rawResponse,
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
  })
})

describe('BaseGraphqlCapsule', () => {
  describe('#hasJsonParseError()', () => {
    const mockResponse = new Response()
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

    describe('when has rawResponse', () => {
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
            rawResponse: mockResponse,
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
            rawResponse: mockResponse,
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

    describe('when has no rawResponse', () => {
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
            rawResponse: null,
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
    const mockResponse = new Response()
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
          rawResponse: mockResponse,
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
          rawResponse: mockResponse,
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
    const mockResponse = new Response()
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
       *     rawResponse: Response | null
       *     payload: BaseGraphqlPayload
       *     result: GraphqlType.Response | null
       *   }
       * }>}
       */
      const cases = /** @type {Array<*>} */ ([
        // query error
        {
          params: {
            rawResponse: mockResponse,
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
            rawResponse: null,
            result: null,
          },
        },
        // JSON parse error
        {
          params: {
            rawResponse: mockResponse,
            result: null,
          },
        },
      ])

      test.each(cases)('rawResponse: $params.rawResponse; result: $params.result', ({ params }) => {
        const args = {
          rawResponse: params.rawResponse,
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
            rawResponse: mockResponse,
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
            rawResponse: mockResponse,
            result: {},
          },
        },
      ]

      test.each(cases)('rawResponse: $params.rawResponse; result: $params.result', ({ params }) => {
        const args = {
          rawResponse: params.rawResponse,
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
    const mockResponse = new Response()
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
          rawResponse: mockResponse,
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
          rawResponse: mockResponse,
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
    const mockResponse = new Response()
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
          rawResponse: mockResponse,
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
            rawResponse: mockResponse,
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
            rawResponse: mockResponse,
            result: null,
          },
        },
        {
          params: {
            rawResponse: null,
            result: null,
          },
        },
      ]

      test.each(cases)('rawResponse: $params.rawResponse; result: $params.result', ({ params }) => {
        const args = {
          rawResponse: params.rawResponse,
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
    const mockResponse = new Response()
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
            rawResponse: null,
            result: null,
          },
          expected: '191.X000.001',
        },
        // on network error (192.X000.001)
        {
          params: {
            payload: mockPayload,
            rawResponse: null,
            result: null,
          },
          expected: '192.X000.001',
        },
        // on JSON parse error (192.X000.002)
        {
          params: {
            payload: mockPayload,
            rawResponse: mockResponse,
            result: null,
          },
          expected: '192.X000.002',
        },
        // on query error
        {
          params: {
            payload: mockPayload,
            rawResponse: mockResponse,
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
            rawResponse: mockResponse,
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
            rawResponse: mockResponse,
            result: {
              errors: [],
            },
          },
          expected: '190.X000.001',
        },
      ]

      test.each(cases)('payload: $params.payload; rawResponse: $params.rawResponse; result: $params.result', ({ params, expected }) => {
        const args = {
          rawResponse: params.rawResponse,
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
          rawResponse: mockResponse,
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
          rawResponse: null,
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
    const mockResponse = new Response()
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
          rawResponse: mockResponse,
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
      const cases = [
        // on network error
        {
          params: {
            rawResponse: null,
            result: null,
          },
        },
        // on JSON parse error
        {
          params: {
            rawResponse: mockResponse,
            result: null,
          },
        },
        // on query error
        {
          params: {
            rawResponse: mockResponse,
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
            rawResponse: mockResponse,
            result: {},
          },
        },
      ]

      test.each(cases)('rawResponse: $params.rawResponse; result: $params.result', ({ params }) => {
        const args = {
          rawResponse: params.rawResponse,
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
