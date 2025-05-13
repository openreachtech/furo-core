import {
  ConstructorSpy,
} from '@openreachtech/jest-constructor-spy'

import UploadingPropertyPathBuilder from '~/lib/domClerks/UploadingPropertyPathBuilder.js'

describe('UploadingPropertyPathBuilder', () => {
  describe('constructor', () => {
    describe('to keep properties', () => {
      describe('#nodes', () => {
        const cases = [
          {
            params: {
              nodes: [
                {
                  value: new File([], 'alpha.txt'),
                  path: 'variables.input.file',
                },
                {
                  value: 'John Doe',
                  path: 'variables.input.name',
                },
              ],
            },
          },
          {
            params: {
              nodes: [
                {
                  value: new Blob(
                    [
                      JSON.stringify({
                        name: 'beta.txt',
                      }),
                    ],
                    { type: 'application/json' }
                  ),
                  path: 'variables.input.file',
                },
                {
                  value: 'Jack Smith',
                  path: 'variables.input.name',
                },
              ],
            },
          },
          {
            params: {
              nodes: [],
            },
          },
        ]

        test.each(cases)('nodes: $params.nodes', ({ params }) => {
          const builder = new UploadingPropertyPathBuilder(params)

          expect(builder)
            .toHaveProperty('nodes', params.nodes)
        })
      })
    })
  })
})

describe('UploadingPropertyPathBuilder', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      const cases = [
        {
          params: {
            value: {
              variables: {
                input: {
                  file: new File([], 'alpha.txt'),
                  name: 'John Doe',
                },
              },
            },
          },
        },
        {
          params: {
            value: {
              variables: {
                input: {
                  file: new Blob(
                    [
                      JSON.stringify({
                        name: 'beta.txt',
                      }),
                    ],
                    { type: 'application/json' }
                  ),
                  name: 'Jack Smith',
                },
              },
            },
          },
        },
        {
          params: {
            value: {},
          },
        },
      ]

      test.each(cases)('value: $params.value', ({ params }) => {
        const builder = UploadingPropertyPathBuilder.create(params)

        expect(builder)
          .toBeInstanceOf(UploadingPropertyPathBuilder)
      })
    })

    describe('to call constructor', () => {
      const alphaFile = new File([], 'alpha.txt')
      const betaBlob = new Blob(
        [
          JSON.stringify({
            name: 'beta.txt',
          }),
        ],
        { type: 'application/json' }
      )

      const cases = [
        {
          params: {
            value: {
              variables: {
                input: {
                  file: alphaFile,
                  name: 'John Doe',
                },
              },
            },
          },
          expected: {
            nodes: [
              {
                value: alphaFile,
                path: 'variables.input.file',
              },
              {
                value: 'John Doe',
                path: 'variables.input.name',
              },
            ],
          },
        },
        {
          params: {
            value: {
              variables: {
                input: {
                  blob: betaBlob,
                  name: 'Jack Smith',
                },
              },
            },
          },
          expected: {
            nodes: [
              {
                value: betaBlob,
                path: 'variables.input.blob',
              },
              {
                value: 'Jack Smith',
                path: 'variables.input.name',
              },
            ],
          },
        },
        {
          params: {
            value: {},
          },
          expected: {
            nodes: [],
          },
        },
      ]

      test.each(cases)('value: $params.value', ({ params, expected }) => {
        const SpyClass = ConstructorSpy.create({ jest })
          .spyOn(UploadingPropertyPathBuilder)

        SpyClass.create(params)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('to call .buildNodes()', () => {
      const cases = [
        {
          params: {
            value: {
              variables: {
                input: {
                  file: new File([], 'alpha.txt'),
                  name: 'John Doe',
                },
              },
            },
          },
        },
        {
          params: {
            value: {
              variables: {
                input: {
                  file: new Blob(
                    [
                      JSON.stringify({
                        name: 'beta.txt',
                      }),
                    ],
                    { type: 'application/json' }
                  ),
                  name: 'Jack Smith',
                },
              },
            },
          },
        },
        {
          params: {
            value: {},
          },
        },
      ]

      test.each(cases)('value: $params.value', ({ params }) => {
        const buildNodesSpy = jest.spyOn(UploadingPropertyPathBuilder, 'buildNodes')

        UploadingPropertyPathBuilder.create(params)

        expect(buildNodesSpy)
          .toHaveBeenCalledWith(params)
      })
    })
  })
})

describe('UploadingPropertyPathBuilder', () => {
  describe('.buildNodes()', () => {
    describe('to return nodes array', () => {
      const alphaFile = new File([], 'alpha.txt')
      const betaFile = new File([], 'beta.txt')
      const testBlob = new Blob([''])
      const testDate = new Date()

      const cases = [
        {
          params: {
            value: {
              variables: {
                input: {
                  label: 'alpha text',
                  file: alphaFile,
                  nested: {
                    blob: testBlob,
                    number: 123,
                    date: testDate,
                  },
                },
              },
            },
          },
          expected: [
            {
              value: 'alpha text',
              path: 'variables.input.label',
            },
            {
              value: alphaFile,
              path: 'variables.input.file',
            },
            {
              value: testBlob,
              path: 'variables.input.nested.blob',
            },
            {
              value: 123,
              path: 'variables.input.nested.number',
            },
            {
              value: testDate,
              path: 'variables.input.nested.date',
            },
          ],
        },
        {
          params: {
            value: {
              variables: {
                input: {
                  label: 'beta text',
                  files: [
                    alphaFile,
                    betaFile,
                  ],
                },
              },
            },
          },
          expected: [
            {
              value: 'beta text',
              path: 'variables.input.label',
            },
            {
              value: alphaFile,
              path: 'variables.input.files.0',
            },
            {
              value: betaFile,
              path: 'variables.input.files.1',
            },
          ],
        },
        {
          params: {
            value: {
              variables: {
                input: {
                  group: [
                    { file: alphaFile },
                    { file: betaFile },
                  ],
                },
              },
            },
          },
          expected: [
            {
              value: alphaFile,
              path: 'variables.input.group.0.file',
            },
            {
              value: betaFile,
              path: 'variables.input.group.1.file',
            },
          ],
        },
        {
          params: {
            value: {},
          },
          expected: [],
        },
      ]

      test.each(cases)('value: $params.value', ({ params, expected }) => {
        const actual = UploadingPropertyPathBuilder.buildNodes(params)

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('UploadingPropertyPathBuilder', () => {
  describe('.isNodeValue()', () => {
    describe('to be truthy', () => {
      const cases = [
        {
          params: {
            value: 'string',
          },
          expected: true,
        },
        {
          params: {
            value: 123,
          },
          expected: true,
        },
        {
          params: {
            value: null,
          },
          expected: true,
        },
        {
          params: {
            value: new File([], 'test.txt'),
          },
          expected: true,
        },
        {
          params: {
            value: new Blob(['']),
          },
          expected: true,
        },
        {
          params: {
            value: new Date(),
          },
          expected: true,
        },
      ]

      test.each(cases)('value: $params.value', ({ params, expected }) => {
        const actual = UploadingPropertyPathBuilder.isNodeValue(params)

        expect(actual)
          .toBe(expected)
      })
    })

    describe('to be falsy', () => {
      const cases = [
        {
          params: {
            value: {},
          },
          expected: false,
        },
        {
          params: {
            value: [],
          },
          expected: false,
        },
      ]

      test.each(cases)('value: $params.value', ({ params, expected }) => {
        const actual = UploadingPropertyPathBuilder.isNodeValue(params)

        expect(actual)
          .toBe(expected)
      })
    })
  })
})

describe('UploadingPropertyPathBuilder', () => {
  describe('#generateUploadingPathMap()', () => {
    describe('to return path map for uploading files', () => {
      const alphaFile = new File([], 'test.txt')
      const betaBlob = new Blob([''])

      const cases = [
        {
          params: {
            nodes: [
              {
                value: alphaFile,
                path: 'file',
              },
              {
                value: 'alpha text',
                path: 'text',
              },
              {
                value: betaBlob,
                path: 'nested.blob',
              },
            ],
          },
          expected: {
            0: ['file'],
            1: ['nested.blob'],
          },
        },
        {
          params: {
            nodes: [
              {
                value: 'text',
                path: 'text',
              },
            ],
          },
          expected: {},
        },
      ]

      test.each(cases)('nodes: $params.nodes', ({ params, expected }) => {
        const builder = new UploadingPropertyPathBuilder(params)
        const actual = builder.generateUploadingPathMap()

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('UploadingPropertyPathBuilder', () => {
  describe('#generateUploadingEntries()', () => {
    describe('to return entries for uploading files', () => {
      const testFile = new File([], 'test.txt')
      const testBlob = new Blob([''])

      const cases = [
        {
          params: {
            nodes: [
              {
                value: testFile,
                path: 'variables.input.file',
              },
              {
                value: 'text',
                path: 'variables.input.text',
              },
              {
                value: testBlob,
                path: 'variables.input.nested.blob',
              },
            ],
          },
          expected: [
            ['0', testFile],
            ['1', testBlob],
          ],
        },
        {
          params: {
            nodes: [
              {
                value: 'Beta text',
                path: 'text',
              },
            ],
          },
          expected: [],
        },
        {
          params: {
            nodes: [],
          },
          expected: [],
        },
      ]

      test.each(cases)('nodes: $params.nodes', ({ params, expected }) => {
        const builder = new UploadingPropertyPathBuilder(params)
        const actual = builder.generateUploadingEntries()

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('UploadingPropertyPathBuilder', () => {
  describe('#extractUploadingNodes()', () => {
    describe('to return nodes with File or Blob values', () => {
      const alphaFile = new File([], 'test.txt')
      const betaBlob = new Blob([''])

      const cases = [
        {
          params: {
            nodes: [
              {
                value: alphaFile,
                path: 'file',
              },
              {
                value: 'text',
                path: 'text',
              },
              {
                value: betaBlob,
                path: 'nested.blob',
              },
            ],
          },
          expected: [
            {
              value: alphaFile,
              path: 'file',
            },
            {
              value: betaBlob,
              path: 'nested.blob',
            },
          ],
        },
        {
          params: {
            nodes: [
              {
                value: 'text',
                path: 'text',
              },
            ],
          },
          expected: [],
        },
      ]

      test.each(cases)('nodes: $params.nodes', ({ params, expected }) => {
        const builder = new UploadingPropertyPathBuilder(params)
        const actual = builder.extractUploadingNodes()

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})
