import {
  ConstructorSpy,
} from '@openreachtech/jest-constructor-spy'

import BaseGraphqlPayload from '~/lib/client/graphql/BaseGraphqlPayload.js'
import UploadingPropertyPathBuilder from '~/lib/domClerks/UploadingPropertyPathBuilder.js'

describe('BaseGraphqlPayload', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      describe('#queryTemplate', () => {
        const cases = [
          {
            params: {
              queryTemplate: /* GraphQL */ `
                query PickUpForumTopicsQuery {
                  pickUpForumTopics {
                    pickUpForumTopics {
                      id
                      forumCategory {
                        id
                        name
                      }
                      name
                      descriptionHtml
                      proposer {
                        customerId
                        username
                        avatarUrl
                        customerRoles {
                          id
                          name
                        }
                      }
                      proposedAt
                      editedAt
                      totalForumPost
                      latestForumPostPostedAt
                    }
                  }
                }
              `,
            },
          },
          {
            params: {
              queryTemplate: /* GraphQL */ `
                query CurriculumsQuery ($input: CurriculumsSearchInput!) {
                  curriculums(input: $input) {
                    curriculums {
                      id
                      title
                      description
                      thumbnailUrl
                      postedAt
                    }
                    pagination {
                      limit
                      offset
                      sort {
                        targetColumn
                        orderBy
                      }
                      totalRecords
                    }
                  }
                }
              `,
            },
          },
        ]

        test.each(cases)('queryTemplate: $params.queryTemplate', ({ params }) => {
          const options = /** @type {RequestInit} */ ({
            mode: 'cors',
          })
          const args = {
            queryTemplate: params.queryTemplate,
            variables: {},
            options,
          }
          const actual = new BaseGraphqlPayload(args)

          expect(actual)
            .toHaveProperty('queryTemplate', params.queryTemplate)
        })
      })

      describe('#variables', () => {
        const cases = [
          {
            params: {
              variables: {
                input: {
                  id: 10001,
                },
              },
            },
          },
          {
            params: {
              variables: {
                input: {
                  id: 10002,
                },
              },
            },
          },
          {
            params: {
              variables: {},
            },
          },
        ]

        test.each(cases)('variables: $params.variables', ({ params }) => {
          const queryTemplate = /* GraphQL */ `
            query CurriculumsQuery ($input: CurriculumsSearchInput!) {
              curriculums (input: $input) {
                curriculums {
                  id
                  title
                  description
                  thumbnailUrl
                  postedAt
                }
                pagination {
                  limit
                  offset
                  sort {
                    targetColumn
                    orderBy
                  }
                  totalRecords
                }
              }
            }
          `
          const options = /** @type {RequestInit} */ ({
            mode: 'cors',
          })
          const args = {
            queryTemplate,
            variables: params.variables,
            options,
          }
          const actual = new BaseGraphqlPayload(args)

          expect(actual)
            .toHaveProperty('variables', params.variables)
        })
      })

      describe('#headers', () => {
        const queryTemplate = /* GraphQL */ `
          query CurriculumsQuery ($input: CurriculumsSearchInput!) {
            curriculums (input: $input) {
              curriculums {
                id
                title
                description
                thumbnailUrl
                postedAt
              }
              pagination {
                limit
                offset
                sort {
                  targetColumn
                  orderBy
                }
                totalRecords
              }
            }
          }
        `

        const cases = [
          {
            params: {
              options: {
                headers: new Headers(),
              },
            },
          },
          {
            params: {
              options: {
                headers: new Headers({
                  'content-type': 'application/json',
                }),
              },
            },
          },
          {
            params: {
              options: {
                headers: {
                  'content-type': 'application/json',
                },
              },
            },
          },
        ]

        test.each(cases)('headers: $params.options.headers', ({ params }) => {
          const args = {
            queryTemplate,
            variables: {},
            options: params.options,
          }
          const actual = new BaseGraphqlPayload(args)

          expect(actual.headers)
            .toBe(params.options.headers) // same reference
        })

        test('without headers parameter', () => {
          const args = {
            queryTemplate,
            variables: {},
            options: {},
          }
          const actual = new BaseGraphqlPayload(args)

          expect(actual)
            .toHaveProperty(
              'headers',
              expect.any(Headers)
            )
        })
      })

      describe('#restOptions', () => {
        const queryTemplate = /* GraphQL */ `
          query CurriculumsQuery ($input: CurriculumsSearchInput!) {
            curriculums (input: $input) {
              curriculums {
                id
                title
                description
                thumbnailUrl
                postedAt
              }
              pagination {
                limit
                offset
                sort {
                  targetColumn
                  orderBy
                }
                totalRecords
              }
            }
          }
        `

        /**
         * @type {Array<{
         *   params: {
         *     options: RequestInit
         *   }
         *   expected: RequestInit
         * }>}
         */
        const cases = [
          {
            params: {
              options: {
                headers: new Headers(),
                mode: 'cors',
              },
            },
            expected: {
              mode: 'cors',
            },
          },
          {
            params: {
              options: {
                headers: new Headers(),
                credentials: 'omit',
              },
            },
            expected: {
              credentials: 'omit',
            },
          },
          {
            params: {
              options: {
                priority: 'high',
              },
            },
            expected: {
              priority: 'high',
            },
          },
        ]

        test.each(cases)('options: $params.options', ({ params, expected }) => {
          const args = {
            queryTemplate,
            variables: {},
            options: params.options,
          }
          const actual = new BaseGraphqlPayload(args)

          expect(actual)
            .toHaveProperty('restOptions', expected)
        })
      })

      describe('#options', () => {
        /**
         * @type {Array<{
         *   params: {
         *     options: RequestInit
         *   }
         * }>}
         */
        const cases = [
          {
            params: {
              options: {
                mode: 'cors',
              },
            },
          },
          {
            params: {
              options: {
                credentials: 'omit',
              },
            },
          },
          {
            params: {
              options: {
                priority: 'high',
              },
            },
          },
        ]

        test.each(cases)('options: $params.options', ({ params }) => {
          const expected = {
            headers: new Headers(),
            ...params.options,
          }

          const queryTemplate = /* GraphQL */ `
            query CurriculumsQuery ($input: CurriculumsSearchInput!) {
              curriculums (input: $input) {
                curriculums {
                  id
                  title
                  description
                  thumbnailUrl
                  postedAt
                }
                pagination {
                  limit
                  offset
                  sort {
                    targetColumn
                    orderBy
                  }
                  totalRecords
                }
              }
            }
          `
          const args = {
            queryTemplate,
            variables: {},
            options: params.options,
          }
          const actual = new BaseGraphqlPayload(args)

          expect(actual)
            .toHaveProperty('options', expected)
        })
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('.get:document', () => {
    test('to throw Error', () => {
      const expected = 'this function must be inherited'

      expect(() => BaseGraphqlPayload.document)
        .toThrow(expected)
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('.get:fieldHash', () => {
    describe('to be []', () => {
      test('with no arguments', () => {
        const actual = BaseGraphqlPayload.fieldHash

        expect(actual)
          .toEqual({})
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('.generateVariables', () => {
    describe('to return as { input: valueHash }', () => {
      const cases = [
        {
          params: {
            valueHash: {
              id: 20001,
            },
          },
          expected: {
            input: {
              id: 20001,
            },
          },
        },
        {
          params: {
            valueHash: {
              id: 20002,
              username: 'Eucen',
              password: 'password$001',
            },
          },
          expected: {
            input: {
              id: 20002,
              username: 'Eucen',
              password: 'password$001',
            },
          },
        },
      ]

      test.each(cases)('id: $params.valueHash.id', ({ params, expected }) => {
        const actual = BaseGraphqlPayload.generateVariables({
          valueHash: params.valueHash,
        })

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('.create', () => {
    describe('to return instance of this class', () => {
      /**
       * @type {Array<{
       *   params: {
       *     variables: Record<string, unknown>
       *     options: RequestInit
       *     queryTemplate: string
       *   }
       * }>}
       */
      const cases = [
        {
          params: {
            variables: {},
            options: {
              mode: 'cors',
            },
            queryTemplate: /* GraphQL */ `
              query PickUpForumTopicsQuery {
                pickUpForumTopics {
                  pickUpForumTopics {
                    id
                    forumCategory {
                      id
                      name
                    }
                    name
                    descriptionHtml
                    proposer {
                      customerId
                      username
                      avatarUrl
                      customerRoles {
                        id
                        name
                      }
                    }
                    proposedAt
                    editedAt
                    totalForumPost
                    latestForumPostPostedAt
                  }
                }
              }
            `,
          },
        },
        {
          params: {
            variables: {
              input: {
                id: 10001,
              },
            },
            options: {
              credentials: 'omit',
            },
            queryTemplate: /* GraphQL */ `
              query CurriculumsQuery ($input: CurriculumsSearchInput!) {
                curriculums(input: $input) {
                  curriculums {
                    id
                    title
                    description
                    thumbnailUrl
                    postedAt
                  }
                  pagination {
                    limit
                    offset
                    sort {
                      targetColumn
                      orderBy
                    }
                    totalRecords
                  }
                }
              }
            `,
          },
        },
      ]

      test.each(cases)('variables: $params.variables', ({ params }) => {
        const querySpy = jest.spyOn(BaseGraphqlPayload, 'document', 'get')
          .mockReturnValue(params.queryTemplate)

        const args = {
          variables: params.variables,
          options: params.options,
        }
        const actual = BaseGraphqlPayload.create(args)

        expect(actual)
          .toBeInstanceOf(BaseGraphqlPayload)

        querySpy.mockRestore()
      })
    })

    describe('to call constructor', () => {
      /**
       * @type {Array<{
       *   params: {
       *     variables: Record<string, unknown>
       *     options: RequestInit
       *     queryTemplate: string
       *   }
       * }>}
       */
      const cases = [
        {
          params: {
            variables: {},
            options: {
              mode: 'cors',
            },
            queryTemplate: /* GraphQL */ `
              query PickUpForumTopicsQuery {
                pickUpForumTopics {
                  pickUpForumTopics {
                    id
                    forumCategory {
                      id
                      name
                    }
                    name
                    descriptionHtml
                    proposer {
                      customerId
                      username
                      avatarUrl
                      customerRoles {
                        id
                        name
                      }
                    }
                    proposedAt
                    editedAt
                    totalForumPost
                    latestForumPostPostedAt
                  }
                }
              }
            `,
          },
        },
        {
          params: {
            variables: {
              input: {
                id: 10001,
              },
            },
            options: {
              credentials: 'omit',
            },
            queryTemplate: /* GraphQL */ `
              query CurriculumsQuery ($input: CurriculumsSearchInput!) {
                curriculums(input: $input) {
                  curriculums {
                    id
                    title
                    description
                    thumbnailUrl
                    postedAt
                  }
                  pagination {
                    limit
                    offset
                    sort {
                      targetColumn
                      orderBy
                    }
                    totalRecords
                  }
                }
              }
            `,
          },
        },
      ]

      test.each(cases)('variables: $params.variables', ({ params }) => {
        const expected = {
          queryTemplate: params.queryTemplate,
          variables: params.variables,
          options: params.options,
        }
        const args = {
          variables: params.variables,
          options: params.options,
        }

        const querySpy = jest.spyOn(BaseGraphqlPayload, 'document', 'get')
          .mockReturnValue(params.queryTemplate)

        const DerivedClass = ConstructorSpy.create({ jest })
          .spyOn(BaseGraphqlPayload)

        DerivedClass.create(args)

        expect(DerivedClass.__spy__)
          .toHaveBeenCalledWith(expected)

        querySpy.mockRestore()
      })
    })

    describe('to throw on called directly', () => {
      describe('to throw error', () => {
        /**
         * @type {Array<{
         *   params: {
         *     variables: Record<string, unknown>
         *     options: RequestInit
         *   }
         * }>}
         */
        const cases = [
          {
            params: {
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
              variables: {},
              options: {
                credentials: 'omit',
              },
            },
          },
        ]

        test.each(cases)('variables: $params.variables', ({ params }) => {
          const expected = 'this function must be inherited'

          expect(() => BaseGraphqlPayload.create(params))
            .toThrow(expected)
        })
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('.createWithValueHash', () => {
    const mockQueryTemplate = /* GraphQL */ `
      query PickUpForumTopicsQuery {
        pickUpForumTopics {
          pickUpForumTopics {
            id
            forumCategory {
              id
              name
            }
            name
            descriptionHtml
            proposer {
              customerId
              username
              avatarUrl
              customerRoles {
                id
                name
              }
            }
            proposedAt
            editedAt
            totalForumPost
            latestForumPostPostedAt
          }
        }
      }
    `
    const mockOptions = {}

    describe('to return instance of this class', () => {
      const cases = [
        {
          params: {
            valueHash: {
              id: 10001,
            },
          },
        },
        {
          params: {
            valueHash: {
              id: 20001,
              username: 'Eucen',
            },
          },
        },
      ]

      test.each(cases)('id: $params.valueHash.id', ({ params }) => {
        const documentSpy = jest.spyOn(BaseGraphqlPayload, 'document', 'get')
          .mockReturnValue(mockQueryTemplate)

        const args = {
          valueHash: params.valueHash,
          options: mockOptions,
        }
        const actual = BaseGraphqlPayload.createWithValueHash(args)

        expect(actual)
          .toBeInstanceOf(BaseGraphqlPayload)

        documentSpy.mockRestore()
      })
    })

    describe('to call .create()', () => {
      const cases = [
        {
          params: {
            valueHash: {
              id: 10001,
            },
          },
          expected: {
            variables: {
              input: {
                id: 10001,
              },
            },
          },
        },
        {
          params: {
            valueHash: {
              id: 20001,
              username: 'Eucen',
            },
          },
          expected: {
            variables: {
              input: {
                id: 20001,
                username: 'Eucen',
              },
            },
          },
        },
      ]

      test.each(cases)('id: $params.valueHash.id', ({ params, expected }) => {
        const optionsTally = mockOptions

        const expectedArgs = {
          variables: expected.variables,
          options: optionsTally,
        }

        const documentSpy = jest.spyOn(BaseGraphqlPayload, 'document', 'get')
          .mockReturnValue(params.queryTemplate)
        const createSpy = jest.spyOn(BaseGraphqlPayload, 'create')

        const args = {
          valueHash: params.valueHash,
          options: optionsTally,
        }

        BaseGraphqlPayload.createWithValueHash(args)

        expect(createSpy)
          .toHaveBeenCalledWith(expectedArgs)

        documentSpy.mockRestore()
        createSpy.mockRestore()
      })
    })

    describe('to throw on called directly', () => {
      describe('to throw error', () => {
        const cases = [
          {
            params: {
              valueHash: {
                id: 10001,
              },
            },
          },
          {
            params: {
              valueHash: {
                id: 20001,
                username: 'Eucen',
              },
            },
          },
        ]

        test.each(cases)('id: $params.valueHash.id', ({ params }) => {
          const expected = 'this function must be inherited'

          expect(() => BaseGraphqlPayload.createWithValueHash(params))
            .toThrow(expected)
        })
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('.createWithFormValueHash', () => {
    const mockQueryTemplate = /* GraphQL */ `
      query PickUpForumTopicsQuery {
        pickUpForumTopics {
          pickUpForumTopics {
            id
            forumCategory {
              id
              name
            }
            name
            descriptionHtml
            proposer {
              customerId
              username
              avatarUrl
              customerRoles {
                id
                name
              }
            }
            proposedAt
            editedAt
            totalForumPost
            latestForumPostPostedAt
          }
        }
      }
    `
    const mockOptions = {}

    describe('to return instance of this class', () => {
      const cases = [
        {
          params: {
            valueHash: {
              id: 10001,
            },
          },
        },
        {
          params: {
            valueHash: {
              id: 20001,
              username: 'Eucen',
            },
          },
        },
        {
          params: {
            valueHash: {
              id: 30001,
            },
            extraValueHash: {
              bio: 'Who am I?',
            },
          },
        },
        {
          params: {
            valueHash: {
              id: 40001,
            },
            extraValueHash: {
              bio: 'Who are you?',
            },
            options: mockOptions,
          },
        },
      ]

      test.each(cases)('id: $params.valueHash.id', ({ params }) => {
        jest.spyOn(BaseGraphqlPayload, 'document', 'get')
          .mockReturnValue(mockQueryTemplate)

        const actual = BaseGraphqlPayload.createWithFormValueHash(params)

        expect(actual)
          .toBeInstanceOf(BaseGraphqlPayload)
      })
    })

    describe('to call other members', () => {
      /**
       * @type {Array<{
       *   params: {
       *     valueHash: Record<string, furo.FormControlElementValueType>
       *     extraValueHash?: Record<string, furo.FormControlElementValueType>
       *     options?: RequestInit
       *   }
       *   expected: {
       *     buildFormBasedValueHashArgs: {
       *       valueHash: Record<string, furo.FormControlElementValueType>
       *       extraValueHash: Record<string, furo.FormControlElementValueType>
       *     }
       *     createWithValueHashArgs: {
       *       valueHash: Record<string, furo.FormControlElementValueType>
       *       options: RequestInit
       *     }
       *   }
       * }>}
       */
      const cases = [
        {
          params: {
            valueHash: {
              id: 10001,
            },
          },
          expected: {
            buildFormBasedValueHashArgs: {
              valueHash: {
                id: 10001,
              },
              extraValueHash: {},
            },
            createWithValueHashArgs: {
              valueHash: {
                id: 10001,
              },
              options: mockOptions,
            },
          },
        },
        {
          params: {
            valueHash: {
              id: 20001,
              username: 'Eucen',
            },
          },
          expected: {
            buildFormBasedValueHashArgs: {
              valueHash: {
                id: 20001,
                username: 'Eucen',
              },
              extraValueHash: {},
            },
            createWithValueHashArgs: {
              valueHash: {
                id: 20001,
                username: 'Eucen',
              },
              options: mockOptions,
            },
          },
        },
        {
          params: {
            valueHash: {
              id: 30001,
            },
            extraValueHash: {
              bio: 'Who am I?',
            },
          },
          expected: {
            buildFormBasedValueHashArgs: {
              valueHash: {
                id: 30001,
              },
              extraValueHash: {
                bio: 'Who am I?',
              },
            },
            createWithValueHashArgs: {
              valueHash: {
                id: 30001,
                bio: 'Who am I?',
              },
              options: mockOptions,
            },
          },
        },
        {
          params: {
            valueHash: {
              id: 40001,
            },
            extraValueHash: {
              bio: 'Who are you?',
            },
            options: mockOptions,
          },
          expected: {
            buildFormBasedValueHashArgs: {
              valueHash: {
                id: 40001,
              },
              extraValueHash: {
                bio: 'Who are you?',
              },
            },
            createWithValueHashArgs: {
              valueHash: {
                id: 40001,
                bio: 'Who are you?',
              },
              options: mockOptions,
            },
          },
        },
      ]

      test.each(cases)('id: $params.valueHash.id', ({ params, expected }) => {
        jest.spyOn(BaseGraphqlPayload, 'document', 'get')
          .mockReturnValue(mockQueryTemplate)

        const buildFormBasedValueHashSpy = jest.spyOn(BaseGraphqlPayload, 'buildFormBasedValueHash')
        const createWithValueHashSpy = jest.spyOn(BaseGraphqlPayload, 'createWithValueHash')

        BaseGraphqlPayload.createWithFormValueHash(params)

        expect(buildFormBasedValueHashSpy)
          .toHaveBeenCalledWith(expected.buildFormBasedValueHashArgs)
        expect(createWithValueHashSpy)
          .toHaveBeenCalledWith(expected.createWithValueHashArgs)
      })
    })

    describe('to throw on called directly', () => {
      describe('to throw error', () => {
        const cases = [
          {
            params: {
              valueHash: {
                id: 10001,
              },
            },
          },
          {
            params: {
              valueHash: {
                id: 20001,
                username: 'Eucen',
              },
            },
          },
          {
            params: {
              valueHash: {
                id: 30001,
              },
              extraValueHash: {
                bio: 'Who am I?',
              },
            },
          },
          {
            params: {
              valueHash: {
                id: 40001,
              },
              extraValueHash: {
                bio: 'Who are you?',
              },
              options: mockOptions,
            },
          },
        ]

        test.each(cases)('id: $params.valueHash.id', ({ params }) => {
          const expected = 'this function must be inherited'

          expect(() => BaseGraphqlPayload.createWithFormValueHash(params))
            .toThrow(expected)
        })
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('.normalizeFormBasedValueHash()', () => {
    const cases = [
      {
        params: {
          valueHash: {
            id: 10001,
          },
        },
      },
      {
        params: {
          valueHash: {
            id: 20001,
          },
        },
      },
    ]

    test.each(cases)('id: $params.valueHash.id', ({ params }) => {
      const actual = BaseGraphqlPayload.normalizeFormBasedValueHash(params)

      expect(actual)
        .toEqual(params.valueHash)
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('.buildFormBasedValueHash()', () => {
    describe('to be merged object hash', () => {
      const cases = [
        {
          params: {
            valueHash: {
              id: 10001,
            },
            extraValueHash: {
              username: 'John Doe',
            },
          },
          expected: {
            id: 10001,
            username: 'John Doe',
          },
        },
        {
          params: {
            valueHash: {
              id: 20001,
            },
            extraValueHash: {
              username: 'Jane Smith',
            },
          },
          expected: {
            id: 20001,
            username: 'Jane Smith',
          },
        },
      ]

      test.each(cases)('id: $params.valueHash.id', ({ params, expected }) => {
        const actual = BaseGraphqlPayload.buildFormBasedValueHash(params)

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('to call .normalizeFormBasedValueHash()', () => {
      const cases = [
        {
          params: {
            valueHash: {
              id: 10001,
            },
            extraValueHash: {
              username: 'John Doe',
            },
          },
          expected: {
            id: 10001,
            username: 'John Doe',
          },
        },
        {
          params: {
            valueHash: {
              id: 20001,
            },
            extraValueHash: {
              username: 'Jane Smith',
            },
          },
          expected: {
            id: 20001,
            username: 'Jane Smith',
          },
        },
      ]

      test.each(cases)('id: $params.valueHash.id', ({ params, expected }) => {
        const expectedArgs = {
          valueHash: params.valueHash,
        }

        const normalizeFormBasedValueHashSpy = jest.spyOn(BaseGraphqlPayload, 'normalizeFormBasedValueHash')

        const actual = BaseGraphqlPayload.buildFormBasedValueHash(params)

        expect(actual)
          .toEqual(expected)

        expect(normalizeFormBasedValueHashSpy)
          .toHaveBeenCalledWith(expectedArgs)
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('.collectBasedHeadersOptions()', () => {
    describe('to be fixed array', () => {
      test('with no arguments', () => {
        const expected = []

        const actual = BaseGraphqlPayload.collectBasedHeadersOptions()

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('.collectBasedFetchOptions()', () => {
    describe('to be fixed array', () => {
      test('with no arguments', () => {
        const actual = BaseGraphqlPayload.collectBasedFetchOptions()

        expect(actual)
          .toBeInstanceOf(Array)
        expect(actual)
          .toHaveLength(0)
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('#get:Ctor', () => {
    describe('to be own class', () => {
      const cases = [
        {
          params: {
            variables: {},
            queryTemplate: /* GraphQL */ `
              query PickUpForumTopicsQuery {
                pickUpForumTopics {
                  pickUpForumTopics {
                    id
                    forumCategory {
                      id
                      name
                    }
                    name
                    descriptionHtml
                    proposer {
                      customerId
                      username
                      avatarUrl
                      customerRoles {
                        id
                        name
                      }
                    }
                    proposedAt
                    editedAt
                    totalForumPost
                    latestForumPostPostedAt
                  }
                }
              }
            `,
          },
        },
        {
          params: {
            variables: {
              input: {
                id: 10001,
              },
            },
            queryTemplate: /* GraphQL */ `
              query CurriculumsQuery ($input: CurriculumsSearchInput!) {
                curriculums(input: $input) {
                  curriculums {
                    id
                    title
                    description
                    thumbnailUrl
                    postedAt
                  }
                  pagination {
                    limit
                    offset
                    sort {
                      targetColumn
                      orderBy
                    }
                    totalRecords
                  }
                }
              }
            `,
          },
        },
      ]

      test.each(cases)('variables: $params.variables', ({ params }) => {
        const payload = new BaseGraphqlPayload(params)

        expect(payload.Ctor)
          .toBe(BaseGraphqlPayload)
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('#createMergedHeaders()', () => {
    const queryTemplate = /* GraphQL */ `
      query PickUpForumTopicsQuery {
        pickUpForumTopics {
          pickUpForumTopics {
            id
            forumCategory {
              id
              name
            }
            name
            descriptionHtml
            proposer {
              customerId
              username
              avatarUrl
              customerRoles {
                id
                name
              }
            }
            proposedAt
            editedAt
            totalForumPost
            latestForumPostPostedAt
          }
        }
      }
    `

    describe('to be instance of Headers', () => {
      const cases = [
        {
          params: {
            headers: new Headers(),
          },
          expected: new Headers(),
        },
        {
          params: {
            headers: new Headers({
              'x-app-access-key': 'access-key-of-our-application',
            }),
          },
          expected: new Headers({
            'x-app-access-key': 'access-key-of-our-application',
          }),
        },
      ]

      test.each(cases)('headers: $params.headers', ({ params, expected }) => {
        const payload = new BaseGraphqlPayload({
          queryTemplate,
          variables: {},
          options: {
            headers: params.headers,
          },
        })

        const actual = payload.createMergedHeaders()

        expect(actual)
          .toBeInstanceOf(Headers)

        expect([...actual.entries()])
          .toEqual([...expected.entries()])
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('#generateMergedFetchOptionHash()', () => {
    const queryTemplate = /* GraphQL */ `
                query CurriculumsQuery ($input: CurriculumsInput!) {
                  curriculums (input: $input) {
                    curriculums {
                      id
                      title
                    }
                  }
                }`

    describe('to be return object', () => {
      describe('for headers property', () => {
        describe('to be instanceof Headers', () => {
          /**
           * @type {Array<{
           *   params: {
           *     variables: Record<string, unknown>
           *     options: RequestInit
           *   }
           * }>}
           */
          const cases = [
            {
              params: {
                options: {
                  mode: 'cors',
                },
                variables: {
                  input: {
                    curriculumId: 20001,
                  },
                },
              },
            },
            {
              params: {
                options: {
                  headers: new Headers({
                    'x-app-access-key': 'access-key-of-our-application',
                  }),
                },
                variables: {
                  input: {
                    curriculumId: 20002,
                  },
                },
              },
            },
          ]

          test.each(cases)('variables: $params.variables', ({ params }) => {
            const payload = new BaseGraphqlPayload({
              queryTemplate,
              variables: params.variables,
              options: params.options,
            })

            const actual = payload.generateMergedFetchOptionHash()

            expect(actual.headers)
              .toBeInstanceOf(Headers)
          })
        })

        describe('to be set return value of created Headers', () => {
          /**
           * @type {Array<{
           *   params: {
           *     variables: Record<string, unknown>
           *     options: RequestInit
           *   }
           *   expected: Headers
           * }>}
           */
          const cases = [
            {
              params: {
                options: {
                  mode: 'cors',
                },
                variables: {
                  input: {
                    curriculumId: 20001,
                  },
                },
              },
              expected: new Headers(),
            },
            {
              params: {
                options: {
                  headers: new Headers({
                    'x-app-access-key': 'access-key-of-our-application',
                  }),
                },
                variables: {
                  input: {
                    curriculumId: 20002,
                  },
                },
              },
              expected: new Headers({
                'x-app-access-key': 'access-key-of-our-application',
              }),
            },
          ]

          test.each(cases)('variables: $params.variables', ({ params, expected }) => {
            const payload = new BaseGraphqlPayload({
              queryTemplate,
              variables: params.variables,
              options: params.options,
            })

            const actual = payload.generateMergedFetchOptionHash()
            const actualHeaders = /** @type {Headers} */ (actual.headers)

            expect(actual)
              .toHaveProperty('headers', expect.any(Headers))

            expect([...actualHeaders.entries()])
              .toEqual(
                expect.arrayContaining([...expected.entries()])
              )
          })
        })
      })

      describe('for body property', () => {
        describe('to be set JSON string generated from #generateQuery()', () => {
          const alphaFile = new File(['alpha'], 'alpha.txt', { type: 'text/plain' })
          const betaFile = new File(['beta'], 'beta.txt', { type: 'text/plain' })
          const gammaFile = new File(['gamma'], 'gamma.txt', { type: 'text/plain' })

          const alphaBlob = new Blob(['beta'])

          /**
           * @type {Array<{
           *   params: {
           *     variables: Record<string, unknown>
           *     options: RequestInit
           *   }
           *   expected: Array<[string, *]>
           * }>}
           */
          const cases = [
            {
              params: {
                options: {
                  mode: 'cors',
                },
                variables: {
                  input: {
                    curriculumId: 20001,
                  },
                },
              },
              expected: [
                ['operations', '{"query":"\\n                query CurriculumsQuery ($input: CurriculumsInput!) {\\n                  curriculums (input: $input) {\\n                    curriculums {\\n                      id\\n                      title\\n                    }\\n                  }\\n                }","variables":{"input":{"curriculumId":20001}}}'],
                ['map', '{}'],
              ],
            },
            {
              params: {
                options: {},
                variables: {
                  input: {
                    curriculumId: 20002,
                  },
                },
              },
              expected: [
                ['operations', '{"query":"\\n                query CurriculumsQuery ($input: CurriculumsInput!) {\\n                  curriculums (input: $input) {\\n                    curriculums {\\n                      id\\n                      title\\n                    }\\n                  }\\n                }","variables":{"input":{"curriculumId":20002}}}'],
                ['map', '{}'],
              ],
            },
            {
              params: {
                options: {},
                variables: {
                  input: {
                    curriculumId: 20003,
                    file: alphaFile,
                  },
                },
              },
              expected: [
                ['operations', '{"query":"\\n                query CurriculumsQuery ($input: CurriculumsInput!) {\\n                  curriculums (input: $input) {\\n                    curriculums {\\n                      id\\n                      title\\n                    }\\n                  }\\n                }","variables":{"input":{"curriculumId":20003,"file":{}}}}'],
                ['map', '{"0":["variables.input.file"]}'],
                ['0', alphaFile],
              ],
            },
            {
              params: {
                options: {},
                variables: {
                  input: {
                    curriculumId: 20004,
                    blob: alphaBlob,
                  },
                },
              },
              expected: [
                ['operations', '{"query":"\\n                query CurriculumsQuery ($input: CurriculumsInput!) {\\n                  curriculums (input: $input) {\\n                    curriculums {\\n                      id\\n                      title\\n                    }\\n                  }\\n                }","variables":{"input":{"curriculumId":20004,"blob":{}}}}'],
                ['map', '{"0":["variables.input.blob"]}'],
                ['0', expect.any(Blob)],
              ],
            },
            {
              params: {
                options: {},
                variables: {
                  input: {
                    curriculumId: 20005,
                    files: [
                      alphaFile,
                      betaFile,
                    ],
                  },
                },
              },
              expected: [
                ['operations', '{"query":"\\n                query CurriculumsQuery ($input: CurriculumsInput!) {\\n                  curriculums (input: $input) {\\n                    curriculums {\\n                      id\\n                      title\\n                    }\\n                  }\\n                }","variables":{"input":{"curriculumId":20005,"files":[{},{}]}}}'],
                ['map', '{"0":["variables.input.files.0"],"1":["variables.input.files.1"]}'],
                ['0', alphaFile],
                ['1', betaFile],
              ],
            },
            {
              params: {
                options: {},
                variables: {
                  input: {
                    curriculumId: 20006,
                    group: [
                      { file: betaFile },
                      { file: gammaFile },
                    ],
                  },
                },
              },
              expected: [
                ['operations', '{"query":"\\n                query CurriculumsQuery ($input: CurriculumsInput!) {\\n                  curriculums (input: $input) {\\n                    curriculums {\\n                      id\\n                      title\\n                    }\\n                  }\\n                }","variables":{"input":{"curriculumId":20006,"group":[{"file":{}},{"file":{}}]}}}'],
                ['map', '{"0":["variables.input.group.0.file"],"1":["variables.input.group.1.file"]}'],
                ['0', betaFile],
                ['1', gammaFile],
              ],
            },
          ]

          test.each(cases)('input: $params.input', ({ params, expected }) => {
            const payload = new BaseGraphqlPayload({
              queryTemplate,
              variables: params.variables,
              options: params.options,
            })

            const optionHash = payload.generateMergedFetchOptionHash()

            /** @type {FormData} */
            const formDataHub = /** @type {*} */ (optionHash.body)

            const actual = [...formDataHub.entries()]

            expect(actual)
              .toEqual(expected)
          })
        })
      })

      describe('for extra property', () => {
        describe('to be set by options parameter', () => {
          /**
           * @type {Array<{
           *   params: {
           *     variables: Record<string, unknown>
           *     options: RequestInit
           *   }
           *   expected: RequestInit
           * }>}
           */
          const cases = [
            {
              params: {
                variables: {
                  input: {
                    curriculumId: 20001,
                  },
                },
                options: {
                  mode: 'cors',
                },
              },
              expected: {
                mode: 'cors',
                method: 'POST',
                body: expect.any(FormData),
              },
            },
            {
              params: {
                variables: {
                  input: {
                    curriculumId: 20002,
                  },
                },
                options: {
                  credentials: 'include',
                },
              },
              expected: {
                credentials: 'include',
                method: 'POST',
                body: expect.any(FormData),
              },
            },
            {
              params: {
                variables: {
                  input: {
                    curriculumId: 20003,
                  },
                },
                options: {
                  cache: 'no-cache',
                },
              },
              expected: {
                cache: 'no-cache',
                method: 'POST',
                body: expect.any(FormData),
              },
            },
            {
              params: {
                variables: {
                  input: {
                    curriculumId: 20004,
                  },
                },
                options: {
                  redirect: 'follow',
                },
              },
              expected: {
                redirect: 'follow',
                method: 'POST',
                body: expect.any(FormData),
              },
            },
          ]

          test.each(cases)('options: $params.options', ({ params, expected }) => {
            const payload = new BaseGraphqlPayload({
              queryTemplate,
              variables: params.variables,
              options: params.options,
            })

            const actual = payload.generateMergedFetchOptionHash()

            expect(actual)
              .toMatchObject(expected)
          })
        })
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('#extractFilteredVariables()', () => {
    describe('to return as is', () => {
      const queryTemplate = /* GraphQL */ `
        query PickUpForumTopicsQuery {
          pickUpForumTopics {
            pickUpForumTopics {
              id
              forumCategory {
                id
                name
              }
              name
              descriptionHtml
              proposer {
                customerId
                username
                avatarUrl
                customerRoles {
                  id
                  name
                }
              }
              proposedAt
              editedAt
              totalForumPost
              latestForumPostPostedAt
            }
          }
        }
      `

      /**
       * @type {Array<{
       *   params: {
       *     variables: {
       *       input: {
       *         id: number
       *       }
       *     }
       *   }
       * }>}
       */
      const cases = [
        {
          params: {
            variables: {
              input: {
                id: 10001,
              },
            },
          },
        },
        {
          params: {
            variables: {
              input: {
                id: 10002,
              },
            },
          },
        },
      ]

      test.each(cases)('variables: $params.variables', ({ params }) => {
        const payload = new BaseGraphqlPayload({
          queryTemplate,
          variables: params.variables,
        })

        const actual = payload.extractFilteredVariables()

        expect(actual)
          .toBe(params.variables) // same reference
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('#createFetchRequest()', () => {
    describe('to be instance of Request', () => {
      const queryTemplate = /* GraphQL */ `
        query CurriculumsQuery ($input: CurriculumsSearchInput!) {
          curriculums(input: $input) {
            curriculums {
              id
              title
            }
          }
        }
      `

      /**
       * @type {Array<{
       *   params: {
       *     url: string
       *     variables: Record<string, unknown>
       *     options: RequestInit
       *   }
       * }>}
       */
      const cases = [
        {
          params: {
            url: 'https://api.example.com/graphql-customer',
            options: {
              mode: 'cors',
            },
            variables: {
              input: {
                curriculumId: 20001,
              },
            },
          },
        },
        {
          params: {
            url: 'https://api.example.com/graphql-admin',
            options: {
              headers: new Headers({
                'x-app-access-key': 'access-key-of-our-application',
              }),
            },
            variables: {
              input: {
                curriculumId: 20002,
              },
            },
          },
        },
      ]

      test.each(cases)('url: $params.url', ({ params }) => {
        const payload = new BaseGraphqlPayload({
          queryTemplate,
          variables: params.variables,
          options: params.options,
        })
        const args = {
          url: params.url,
        }

        const actual = payload.createFetchRequest(args)

        expect(actual)
          .toBeInstanceOf(Request)
      })
    })

    describe('to equal Request value', () => {
      const queryTemplate = /* GraphQL */ `
        query CurriculumsQuery ($input: CurriculumsSearchInput!) {
          curriculums(input: $input) {
            curriculums {
              id
              title
            }
          }
        }
      `

      /**
       * @type {Array<{
       *   params: {
       *     url: string
       *     variables: Record<string, unknown>
       *     options: RequestInit
       *   }
       *   expected: Request
       * }>}
       */
      const cases = [
        {
          params: {
            url: 'https://api.example.com/graphql-customer',
            options: {
              mode: 'cors',
            },
            variables: {
              input: {
                curriculumId: 20001,
              },
            },
          },
          expected: new Request('https://api.example.com/graphql-customer', {
            method: 'POST',
            headers: new Headers({
              'content-type': 'application/json',
            }),
            body: '{"query":"\\n        query {\\n          curriculums(input: {\\"curriculumId\\":20001}) {\\n            curriculums {\\n              id\\n              title\\n            }\\n          }\\n        }"}',
          }),
        },
        {
          params: {
            url: 'https://api.example.com/graphql-admin',
            options: {
              headers: new Headers({
                'x-app-access-key': 'access-key-of-our-application',
              }),
            },
            variables: {
              input: {
                curriculumId: 20002,
              },
            },
          },
          expected: new Request('https://api.example.com/graphql-admin', {
            method: 'POST',
            headers: new Headers({
              'content-type': 'application/json',
              'x-app-access-key': 'access-key-of-our-application',
            }),
            body: '{"query":"\\n        query {\\n          curriculums(input: {\\"curriculumId\\":20002}) {\\n            curriculums {\\n              id\\n              title\\n            }\\n          }\\n        }"}',
          }),
        },
      ]

      test.each(cases)('url: $params.url', ({ params }) => {
        const payload = new BaseGraphqlPayload({
          queryTemplate,
          variables: params.variables,
          options: params.options,
        })
        const args = {
          url: params.url,
        }

        const actual = payload.createFetchRequest(args)

        expect(actual)
          .toBeInstanceOf(Request)
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('#isValidVariables()', () => {
    const queryTemplate = /* GraphQL */ `
      query CurriculumsQuery ($input: CurriculumsSearchInput!) {
        curriculums(input: $input) {
          curriculums {
            id
            title
          }
        }
      }
    `

    /** @extends {BaseGraphqlPayload<typeof AlphaPayload, *>} */
    class AlphaPayload extends BaseGraphqlPayload {
      /** @override */
      static get document () {
        return queryTemplate
      }

      /** @override */
      static get fieldHash () {
        return {
          input: [
            'email',
            'username',
            'firstName',
            'lastName',
            'password',
          ],
        }
      }
    }

    /** @extends {BaseGraphqlPayload<typeof BetaPayload, *>} */
    class BetaPayload extends BaseGraphqlPayload {
      /** @override */
      static get document () {
        return queryTemplate
      }

      /** @override */
      static get fieldHash () {
        return {
          products: [
            'customerId',
            'productId',
          ],
          members: [
            'gender',
            'language',
            'minAge',
            'maxAge',
          ],
        }
      }
    }

    /**
     * @type {Array<{
     *   Payload: furo.PayloadCtor<*>,
     *   truthyCases: Array<furo.GraphqlRequestVariables>,
     *   falsyCases: Array<furo.GraphqlRequestVariables>,
     * }>}
     */
    const cases = [
      {
        Payload: AlphaPayload,
        truthyCases: [
          {
            variables: {
              input: {
                email: 'eucen@example.com',
                username: 'StewEucen',
                firstName: 'Eucen',
                lastName: 'Stew',
                password: 'password$001',
              },
            },
          },
          {
            variables: {
              input: {
                email: 'eucen@example.com',
                username: 'StewEucen',
                // firstName: 'Eucen',
                lastName: 'Stew',
                password: 'password$001',
              },
            },
          },
          {
            variables: {
              input: {
                // email: 'eucen@example.com',
                // username: 'StewEucen',
                // firstName: 'Eucen',
                // lastName: 'Stew',
                // password: 'password$001',
              },
            },
          },
          {
            variables: {
              // input: {
              //   email: 'eucen@example.com',
              //   username: 'StewEucen',
              //   firstName: 'Eucen',
              //   lastName: 'Stew',
              //   password: 'password$001',
              // },
            },
          },
        ],
        falsyCases: [
          {
            variables: {
              input: {
                email: 'eucen@example.com',
                username: 'StewEucen',
                firstName: 'Eucen',
                lastName: 'Stew',
                password: 'password$001',
                extra: 'extra value', // ❌
              },
            },
          },
          {
            variables: {
              input: {
                email: 'eucen@example.com',
                username: 'StewEucen',
                // firstName: 'Eucen',
                lastName: 'Stew',
                password: 'password$001',
                extra: 'extra value', // ❌
              },
            },
          },
          {
            variables: {
              input: {
                // email: 'eucen@example.com',
                // username: 'StewEucen',
                // firstName: 'Eucen',
                // lastName: 'Stew',
                // password: 'password$001',
                extra: 'extra value', // ❌
              },
            },
          },
        ],
      },
      {
        Payload: BetaPayload,
        truthyCases: [
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                // productId: 20001,
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              members: {
                // gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                // customerId: 10001,
                // productId: 20001,
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              members: {
                // gender: 'male',
                // language: 'en',
                // minAge: 18,
                // maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                // customerId: 10001,
                // productId: 20001,
              },
              members: {
                // gender: 'male',
                // language: 'en',
                // minAge: 18,
                // maxAge: 65,
              },
            },
          },
          {
            variables: {
              // products: {
              //   customerId: 10001,
              //   productId: 20001,
              // },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              // members: {
              //   gender: 'male',
              //   language: 'en',
              //   minAge: 18,
              //   maxAge: 65,
              // },
            },
          },
          {
            variables: {
              // products: {
              //   customerId: 10001,
              //   productId: 20001,
              // },
              // members: {
              //   gender: 'male',
              //   language: 'en',
              //   minAge: 18,
              //   maxAge: 65,
              // },
            },
          },
        ],
        falsyCases: [
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
                extra: 'extra value', // ❌
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
                extra: 'extra value', // ❌
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
                extra: 'extra value', // ❌
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
                extra: 'extra value', // ❌
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                // productId: 20001,
                extra: 'extra value', // ❌
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              members: {
                gender: 'male',
                // language: 'en',
                minAge: 18,
                maxAge: 65,
                extra: 'extra value', // ❌
              },
            },
          },
          {
            variables: {
              products: {
                // customerId: 10001,
                // productId: 20001,
                extra: 'extra value', // ❌
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              members: {
                // gender: 'male',
                // language: 'en',
                // minAge: 18,
                // maxAge: 65,
                extra: 'extra value', // ❌
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
                extra: 'extra value', // ❌
              },
              // members: {
              //   gender: 'male',
              //   language: 'en',
              //   minAge: 18,
              //   maxAge: 65,
              // },
            },
          },
        ],
      },
    ]

    describe.each(cases)('Payload: $Payload.name', ({ Payload, truthyCases, falsyCases }) => {
      describe('to be truthy', () => {
        test.each(truthyCases)('variables: $variables', ({ variables }) => {
          const payload = Payload.create({ variables })

          const actual = payload.isValidVariables()

          expect(actual)
            .toBeTruthy()
        })
      })

      describe('to be falsy', () => {
        test.each(falsyCases)('variables: $variables', ({ variables }) => {
          const payload = Payload.create({ variables })

          const actual = payload.isValidVariables()

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('#isInvalidVariables()', () => {
    const queryTemplate = /* GraphQL */ `
      query CurriculumsQuery ($input: CurriculumsSearchInput!) {
        curriculums(input: $input) {
          curriculums {
            id
            title
          }
        }
      }
    `

    /**
     * @extends {BaseGraphqlPayload<
     *   typeof AlphaPayload,
     *   {
     *     input: {
     *       email: string
     *       username: string
     *       firstName: string
     *       lastName: string
     *       password: string
     *     }
     *   }
     * >}
     */
    class AlphaPayload extends BaseGraphqlPayload {
      /** @override */
      static get document () {
        return queryTemplate
      }

      /** @override */
      static get fieldHash () {
        return {
          input: [
            'email',
            'username',
            'firstName',
            'lastName',
            'password',
          ],
        }
      }
    }

    /**
     * @extends {BaseGraphqlPayload<
     *   typeof BetaPayload,
     *   {
     *     products: {
     *       customerId: number
     *       productId: number
     *     }
     *     members: {
     *       gender: string
     *       language: string
     *       minAge: number
     *       maxAge: number
     *     }
     *   }
     * >}
     */
    class BetaPayload extends BaseGraphqlPayload {
      /** @override */
      static get document () {
        return queryTemplate
      }

      /** @override */
      static get fieldHash () {
        return {
          products: [
            'customerId',
            'productId',
          ],
          members: [
            'gender',
            'language',
            'minAge',
            'maxAge',
          ],
        }
      }
    }

    /**
     * @type {Array<{
     *   Payload: furo.PayloadCtor<*>,
     *   truthyCases: Array<furo.GraphqlRequestVariables>,
     *   falsyCases: Array<furo.GraphqlRequestVariables>,
     * }>}
     */
    const cases = [
      {
        Payload: AlphaPayload,
        truthyCases: [
          {
            variables: {
              input: {
                email: 'eucen@example.com',
                username: 'StewEucen',
                firstName: 'Eucen',
                lastName: 'Stew',
                password: 'password$001',
                extra: 'extra value', // ❌
              },
            },
          },
          {
            variables: {
              input: {
                email: 'eucen@example.com',
                username: 'StewEucen',
                // firstName: 'Eucen',
                lastName: 'Stew',
                password: 'password$001',
                extra: 'extra value', // ❌
              },
            },
          },
          {
            variables: {
              input: {
                // email: 'eucen@example.com',
                // username: 'StewEucen',
                // firstName: 'Eucen',
                // lastName: 'Stew',
                // password: 'password$001',
                extra: 'extra value', // ❌
              },
            },
          },
        ],
        falsyCases: [
          {
            variables: {
              input: {
                email: 'eucen@example.com',
                username: 'StewEucen',
                firstName: 'Eucen',
                lastName: 'Stew',
                password: 'password$001',
              },
            },
          },
          {
            variables: {
              input: {
                email: 'eucen@example.com',
                username: 'StewEucen',
                // firstName: 'Eucen',
                lastName: 'Stew',
                password: 'password$001',
              },
            },
          },
          {
            variables: {
              input: {
                // email: 'eucen@example.com',
                // username: 'StewEucen',
                // firstName: 'Eucen',
                // lastName: 'Stew',
                // password: 'password$001',
              },
            },
          },
          {
            variables: {
              // input: {
              //   email: 'eucen@example.com',
              //   username: 'StewEucen',
              //   firstName: 'Eucen',
              //   lastName: 'Stew',
              //   password: 'password$001',
              // },
            },
          },
        ],
      },
      {
        Payload: BetaPayload,
        truthyCases: [
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
                extra: 'extra value', // ❌
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
                extra: 'extra value', // ❌
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
                extra: 'extra value', // ❌
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
                extra: 'extra value', // ❌
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                // productId: 20001,
                extra: 'extra value', // ❌
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              members: {
                gender: 'male',
                // language: 'en',
                minAge: 18,
                maxAge: 65,
                extra: 'extra value', // ❌
              },
            },
          },
          {
            variables: {
              products: {
                // customerId: 10001,
                // productId: 20001,
                extra: 'extra value', // ❌
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              members: {
                // gender: 'male',
                // language: 'en',
                // minAge: 18,
                // maxAge: 65,
                extra: 'extra value', // ❌
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
                extra: 'extra value', // ❌
              },
              // members: {
              //   gender: 'male',
              //   language: 'en',
              //   minAge: 18,
              //   maxAge: 65,
              // },
            },
          },
        ],
        falsyCases: [
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                // productId: 20001,
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              members: {
                // gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                // customerId: 10001,
                // productId: 20001,
              },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              members: {
                // gender: 'male',
                // language: 'en',
                // minAge: 18,
                // maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                // customerId: 10001,
                // productId: 20001,
              },
              members: {
                // gender: 'male',
                // language: 'en',
                // minAge: 18,
                // maxAge: 65,
              },
            },
          },
          {
            variables: {
              // products: {
              //   customerId: 10001,
              //   productId: 20001,
              // },
              members: {
                gender: 'male',
                language: 'en',
                minAge: 18,
                maxAge: 65,
              },
            },
          },
          {
            variables: {
              products: {
                customerId: 10001,
                productId: 20001,
              },
              // members: {
              //   gender: 'male',
              //   language: 'en',
              //   minAge: 18,
              //   maxAge: 65,
              // },
            },
          },
          {
            variables: {
              // products: {
              //   customerId: 10001,
              //   productId: 20001,
              // },
              // members: {
              //   gender: 'male',
              //   language: 'en',
              //   minAge: 18,
              //   maxAge: 65,
              // },
            },
          },
        ],
      },
    ]

    describe.each(cases)('Payload: $Payload.name', ({ Payload, truthyCases, falsyCases }) => {
      describe('to be truthy', () => {
        test.each(truthyCases)('variables: $variables', ({ variables }) => {
          const payload = Payload.create({ variables })

          const actual = payload.isInvalidVariables()

          expect(actual)
            .toBeTruthy()
        })
      })

      describe('to be falsy', () => {
        test.each(falsyCases)('variables: $variables', ({ variables }) => {
          const payload = Payload.create({ variables })

          const actual = payload.isInvalidVariables()

          expect(actual)
            .toBeFalsy()
        })
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('#buildFormDataBody()', () => {
    describe('to create FormData with correct structure', () => {
      const alphaFile = new File(['alpha'], 'alpha.txt', { type: 'text/plain' })

      const cases = [
        {
          params: {
            queryTemplate: /* GraphQL */ `
              query CurriculumsQuery ($input: CurriculumsSearchInput!) {
                curriculums(input: $input) {
                  curriculums {
                    id
                    title
                  }
                }
              }
            `,
            variables: {
              input: {
                id: 10001,
                title: 'Test Curriculum',
              },
            },
            options: {},
          },
          expected: [
            ['operations', '{"query":"\\n              query CurriculumsQuery ($input: CurriculumsSearchInput!) {\\n                curriculums(input: $input) {\\n                  curriculums {\\n                    id\\n                    title\\n                  }\\n                }\\n              }\\n            ","variables":{"input":{"id":10001,"title":"Test Curriculum"}}}'],
            ['map', '{}'],
          ],
        },
        {
          params: {
            queryTemplate: /* GraphQL */ `
              query CurriculumsQuery ($input: CurriculumsSearchInput!) {
                curriculums(input: $input) {
                  curriculums {
                    id
                    title
                  }
                }
              }
            `,
            variables: {
              input: {
                id: 10002,
                file: alphaFile,
              },
            },
            options: {},
          },
          expected: [
            ['operations', '{"query":"\\n              query CurriculumsQuery ($input: CurriculumsSearchInput!) {\\n                curriculums(input: $input) {\\n                  curriculums {\\n                    id\\n                    title\\n                  }\\n                }\\n              }\\n            ","variables":{"input":{"id":10002,"file":{}}}}'],
            ['map', '{"0":["variables.input.file"]}'],
            ['0', alphaFile],
          ],
        },
      ]

      test.each(cases)('variables: $params.variables', ({ params, expected }) => {
        const payload = new BaseGraphqlPayload(params)

        const formDataHub = payload.buildFormDataBody()
        const actual = [...formDataHub.entries()]

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('#createUploadingPropertyPathBuilder()', () => {
    describe('to return valid instance with correct value', () => {
      const alphaFile = new File(['alpha'], 'alpha.txt', { type: 'text/plain' })
      const betaFile = new File(['beta'], 'beta.txt', { type: 'text/plain' })

      const cases = [
        {
          params: {
            queryTemplate: /* GraphQL */ `query {
              alpha
            }`,
            variables: {},
            options: {},
            builderValue: {
              input: {
                id: 100001,
                file: alphaFile,
              },
            },
          },
        },
        {
          params: {
            queryTemplate: /* GraphQL */ `query {
              beta
            }`,
            variables: {},
            options: {},
            builderValue: {
              input: {
                id: 100002,
                file: betaFile,
              },
            },
          },
        },
      ]

      test.each(cases)('builderValue: $params.builderValue', ({ params }) => {
        const payload = new BaseGraphqlPayload({
          queryTemplate: params.queryTemplate,
          variables: params.variables,
          options: params.options,
        })

        const actual = payload.createUploadingPropertyPathBuilder({
          value: params.builderValue,
        })

        expect(actual)
          .toBeInstanceOf(UploadingPropertyPathBuilder)
      })
    })
  })
})

describe('BaseGraphqlPayload', () => {
  describe('#createFormDataInstance()', () => {
    const cases = [
      {
        params: {
          queryTemplate: /* GraphQL */ `query {
            alpha
          }`,
          variables: {},
          options: {},
        },
      },
      {
        params: {
          queryTemplate: /* GraphQL */ `query {
            beta
          }`,
          variables: {},
          options: {},
        },
      },
    ]

    describe('to return new FormData instance', () => {
      test.each(cases)('queryTemplate: $params.queryTemplate', ({ params }) => {
        const payload = new BaseGraphqlPayload(params)

        const actual = payload.createFormDataInstance()

        expect(actual)
          .toBeInstanceOf(FormData)
      })
    })

    describe('to return independent instances', () => {
      test.each(cases)('queryTemplate: $params.queryTemplate', ({ params }) => {
        const payload = new BaseGraphqlPayload(params)

        const formData1 = payload.createFormDataInstance()
        const formData2 = payload.createFormDataInstance()

        formData1.append('test', 'value')

        const actual1 = [...formData1.entries()]
        const actual2 = [...formData2.entries()]

        expect(actual1)
          .toHaveLength(1)
        expect(actual2)
          .toHaveLength(0)
      })
    })
  })
})
