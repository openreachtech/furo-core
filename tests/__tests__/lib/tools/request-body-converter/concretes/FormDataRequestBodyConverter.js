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
  })
})

describe('FormDataRequestBodyConverter', () => {
  describe('#generateHeaderEntries()', () => {
    describe('should be empty, so that the Request sets the multipart content type', () => {
      const cases = [
        {
          input: {
            body: {
              first: 'alpha value',
            },
          },
        },
        {
          input: {
            body: {
              second: 'beta value',
            },
          },
        },
      ]

      test.each(cases)('body: $input.body', ({ input }) => {
        const converter = FormDataRequestBodyConverter.create(input)

        const actual = converter.generateHeaderEntries()

        expect(actual)
          .toStrictEqual([])
      })
    })
  })
})
