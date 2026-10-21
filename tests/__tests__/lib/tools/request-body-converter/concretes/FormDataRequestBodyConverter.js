import FormDataRequestBodyConverter from '~/lib/tools/request-body-converter/concretes/FormDataRequestBodyConverter.js'

import BaseRequestBodyConverter from '~/lib/tools/request-body-converter/BaseRequestBodyConverter.js'

describe('FormDataRequestBodyConverter', () => {
  describe('inheritance', () => {
    test('to be a subclass of BaseRequestBodyConverter', () => {
      const actual = FormDataRequestBodyConverter.prototype

      expect(actual)
        .toBeInstanceOf(BaseRequestBodyConverter)
    })
  })
})

describe('FormDataRequestBodyConverter', () => {
  describe('.createFormDataInstance()', () => {
    test('to return new FormData instance', () => {
      const actual = FormDataRequestBodyConverter.createFormDataInstance()

      expect(actual)
        .toBeInstanceOf(FormData)
    })

    test('to return independent instances', () => {
      const formData1 = FormDataRequestBodyConverter.createFormDataInstance()
      const formData2 = FormDataRequestBodyConverter.createFormDataInstance()

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

describe('FormDataRequestBodyConverter', () => {
  describe('#get:Ctor', () => {
    describe('to be constructor of own class', () => {
      const cases = [
        {
          input: {
            body: {
              first: 'alpha value',
            },
          },
          expected: FormDataRequestBodyConverter,
        },
        {
          input: {
            body: {
              second: 'beta value',
            },
          },
          expected: FormDataRequestBodyConverter,
        },
      ]

      test.each(cases)('body: $input.body', ({ input, expected }) => {
        const converter = FormDataRequestBodyConverter.create(input)

        const actual = converter.Ctor

        expect(actual)
          .toBe(expected) // same reference
      })
    })

    describe('to be constructor of derived class', () => {
      const AlphaConverter = class extends FormDataRequestBodyConverter {}
      const BetaConverter = class extends FormDataRequestBodyConverter {}

      const cases = [
        {
          input: {
            Converter: AlphaConverter,
            body: {
              first: 'alpha value',
            },
          },
          expected: AlphaConverter,
        },
        {
          input: {
            Converter: BetaConverter,
            body: {
              second: 'beta value',
            },
          },
          expected: BetaConverter,
        },
      ]

      test.each(cases)('Converter: $input.Converter.name', ({ input, expected }) => {
        const converter = input.Converter.create({
          body: input.body,
        })

        const actual = converter.Ctor

        expect(actual)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('FormDataRequestBodyConverter', () => {
  describe('.create()', () => {
    describe('should keep the callback which builds FormData', () => {
      const cases = [
        {
          input: {
            body: {
              first: 'alpha value',
            },
            formDataBuilder: () => new FormData(),
          },
        },
        {
          input: {
            body: {
              second: 'beta value',
            },
            formDataBuilder: () => new FormData(),
          },
        },
      ]

      test.each(cases)('body: $input.body', ({ input }) => {
        const converter = FormDataRequestBodyConverter.create(input)

        expect(converter)
          .toHaveProperty('formDataBuilder', input.formDataBuilder) // same reference
      })
    })
  })
})

describe('FormDataRequestBodyConverter', () => {
  describe('#appendBodyTo()', () => {
    describe('should append every field of the body to the given FormData', () => {
      const alphaFile = new File(['alpha'], 'alpha.txt', { type: 'text/plain' })

      const alphaFormDataHub = new FormData()
      const betaFormDataHub = new FormData()

      alphaFormDataHub.append('first', 'alpha value')
      alphaFormDataHub.append('second', 'beta value')

      betaFormDataHub.append('first', 'gamma value')
      betaFormDataHub.append('file', alphaFile)

      const cases = [
        {
          input: {
            body: {
              first: 'alpha value',
              second: 'beta value',
            },
          },
          expected: alphaFormDataHub,
        },
        {
          input: {
            body: {
              first: 'gamma value',
              file: alphaFile,
            },
          },
          expected: betaFormDataHub,
        },
      ]

      test.each(cases)('first: $input.body.first', ({ input, expected }) => {
        const converter = FormDataRequestBodyConverter.create(input)
        const formDataHub = new FormData()

        const actual = converter.appendBodyTo({
          formDataHub,
        })

        expect(actual)
          .toBe(formDataHub) // same reference

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('FormDataRequestBodyConverter', () => {
  describe('#appendBodyTo()', () => {
    describe('should append each element of an array value as its own part, in order', () => {
      const cases = [
        {
          input: {
            body: {
              tags: ['alpha', 'beta', 'gamma'],
            },
          },
          expected: [
            ['tags', 'alpha'],
            ['tags', 'beta'],
            ['tags', 'gamma'],
          ],
        },
        {
          input: {
            body: {
              title: 'delta value',
              tags: ['epsilon', 'zeta'],
              note: 'eta value',
            },
          },
          expected: [
            ['title', 'delta value'],
            ['tags', 'epsilon'],
            ['tags', 'zeta'],
            ['note', 'eta value'],
          ],
        },
        {
          input: {
            body: {
              first: ['alpha', 'beta'],
              second: ['gamma'],
            },
          },
          expected: [
            ['first', 'alpha'],
            ['first', 'beta'],
            ['second', 'gamma'],
          ],
        },
      ]

      test.each(cases)('body: $input.body', ({ input, expected }) => {
        const converter = FormDataRequestBodyConverter.create(input)

        const actual = converter.appendBodyTo({
          formDataHub: new FormData(),
        })

        expect(Array.from(actual.entries()))
          .toStrictEqual(expected)
      })
    })

    describe('should append each File of an array value as its own part', () => {
      const alphaFile = new File(['alpha'], 'alpha.txt', { type: 'text/plain' })
      const betaFile = new File(['beta'], 'beta.txt', { type: 'text/plain' })

      const cases = [
        {
          input: {
            body: {
              files: [alphaFile, betaFile],
            },
          },
          expected: [
            { name: 'alpha.txt' },
            { name: 'beta.txt' },
          ],
        },
        {
          input: {
            body: {
              title: 'gamma value',
              files: [betaFile, alphaFile],
            },
          },
          expected: [
            { name: 'beta.txt' },
            { name: 'alpha.txt' },
          ],
        },
      ]

      test.each(cases)('body: $input.body', ({ input, expected }) => {
        const converter = FormDataRequestBodyConverter.create(input)

        const actual = converter.appendBodyTo({
          formDataHub: new FormData(),
        })

        expect(actual.getAll('files'))
          .toMatchObject(expected)
        expect(actual.getAll('files'))
          .toHaveLength(expected.length)
      })
    })

    describe('should append nothing for an empty array value', () => {
      const cases = [
        {
          input: {
            body: {
              tags: [],
            },
          },
          expected: [],
        },
        {
          input: {
            body: {
              title: 'alpha value',
              tags: [],
              note: 'beta value',
            },
          },
          expected: [
            ['title', 'alpha value'],
            ['note', 'beta value'],
          ],
        },
      ]

      test.each(cases)('body: $input.body', ({ input, expected }) => {
        const converter = FormDataRequestBodyConverter.create(input)

        const actual = converter.appendBodyTo({
          formDataHub: new FormData(),
        })

        expect(Array.from(actual.entries()))
          .toStrictEqual(expected)
      })
    })
  })
})

describe('FormDataRequestBodyConverter', () => {
  describe('#convertBody()', () => {
    describe('to create FormData with correct structure', () => {
      const alphaFile = new File(['alpha'], 'alpha.txt', { type: 'text/plain' })

      const alphaFormDataHub = new FormData()
      const betaFormDataHub = new FormData()

      alphaFormDataHub.append('first', 'alpha value')
      alphaFormDataHub.append('second', 'beta value')

      betaFormDataHub.append('first', 'gamma value')
      betaFormDataHub.append('second', 'delta value')
      betaFormDataHub.append('file', alphaFile)

      const cases = [
        {
          input: {
            body: {
              first: 'alpha value',
              second: 'beta value',
            },
          },
          expected: alphaFormDataHub,
        },
        {
          input: {
            body: {
              first: 'gamma value',
              second: 'delta value',
              file: alphaFile,
            },
          },
          expected: betaFormDataHub,
        },
      ]

      test.each(cases)('first: $input.body.first', ({ input, expected }) => {
        const converter = FormDataRequestBodyConverter.create(input)

        const actual = converter.convertBody()

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('to use FormData instance created by .createFormDataInstance()', () => {
      const cases = [
        {
          input: {
            body: {
              first: 'alpha value',
            },
          },
          tally: new FormData(),
        },
        {
          input: {
            body: {
              second: 'beta value',
            },
          },
          tally: new FormData(),
        },
      ]

      test.each(cases)('body: $input.body', ({ input, tally }) => {
        const createFormDataInstanceSpy = jest.spyOn(FormDataRequestBodyConverter, 'createFormDataInstance')
          .mockReturnValue(tally)

        const converter = FormDataRequestBodyConverter.create(input)

        const actual = converter.convertBody()

        expect(actual)
          .toBe(tally) // same reference

        expect(createFormDataInstanceSpy)
          .toHaveBeenCalledWith()
      })
    })

    describe('to return what the callback builds', () => {
      const cases = [
        {
          input: {
            body: {
              first: 'alpha value',
            },
          },
          tally: new FormData(),
        },
        {
          input: {
            body: {
              second: 'beta value',
            },
          },
          tally: new FormData(),
        },
      ]

      test.each(cases)('body: $input.body', ({ input, tally }) => {
        const converter = FormDataRequestBodyConverter.create({
          ...input,
          formDataBuilder: () => tally,
        })

        const actual = converter.convertBody()

        expect(actual)
          .toBe(tally) // same reference
      })
    })
  })
})

describe('FormDataRequestBodyConverter', () => {
  describe('.collectHeaderEntries()', () => {
    test('to be empty, so that the Request sets the multipart content type', () => {
      const actual = FormDataRequestBodyConverter.collectHeaderEntries()

      expect(actual)
        .toStrictEqual([])
    })
  })
})

describe('FormDataRequestBodyConverter', () => {
  describe('.create()', () => {
    describe('should keep headerEntries', () => {
      const cases = [
        {
          input: {
            body: {
              first: 'alpha value',
            },
            headerEntries: [
              ['x-alpha', 'alpha value'],
            ],
          },
          expected: [
            ['x-alpha', 'alpha value'],
          ],
        },
        {
          input: {
            body: {
              second: 'beta value',
            },
          },
          expected: [],
        },
      ]

      test.each(cases)('body: $input.body', ({ input, expected }) => {
        const converter = FormDataRequestBodyConverter.create(input)

        expect(converter)
          .toHaveProperty('headerEntries', expected)
      })
    })
  })
})
