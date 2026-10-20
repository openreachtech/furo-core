import JsonRequestBodyConverter from '~/lib/tools/request-body-converter/concretes/JsonRequestBodyConverter.js'

import BaseRequestBodyConverter from '~/lib/tools/request-body-converter/BaseRequestBodyConverter.js'

describe('JsonRequestBodyConverter', () => {
  describe('inheritance', () => {
    test('to be a subclass of BaseRequestBodyConverter', () => {
      const actual = JsonRequestBodyConverter.prototype

      expect(actual)
        .toBeInstanceOf(BaseRequestBodyConverter)
    })
  })
})

describe('JsonRequestBodyConverter', () => {
  describe('#convertBody()', () => {
    describe('should be JSON text of the body', () => {
      const cases = [
        {
          input: {
            body: {
              first: 'alpha value',
              second: 'beta value',
            },
          },
          expected: '{"first":"alpha value","second":"beta value"}',
        },
        {
          input: {
            body: {
              first: 'gamma value',
              nested: {
                numbers: [1, 2],
              },
            },
          },
          expected: '{"first":"gamma value","nested":{"numbers":[1,2]}}',
        },
        {
          input: {
            body: {},
          },
          expected: '{}',
        },
      ]

      test.each(cases)('body: $input.body', ({ input, expected }) => {
        const converter = JsonRequestBodyConverter.create(input)

        const actual = converter.convertBody()

        expect(actual)
          .toBe(expected)
      })
    })
  })
})

describe('JsonRequestBodyConverter', () => {
  describe('#generateHeaderEntries()', () => {
    describe('should be the content type of JSON', () => {
      const cases = [
        {
          input: {
            body: {
              first: 'alpha value',
            },
          },
          expected: [
            ['content-type', 'application/json'],
          ],
        },
        {
          input: {
            body: {},
          },
          expected: [
            ['content-type', 'application/json'],
          ],
        },
      ]

      test.each(cases)('body: $input.body', ({ input, expected }) => {
        const converter = JsonRequestBodyConverter.create(input)

        const actual = converter.generateHeaderEntries()

        expect(actual)
          .toStrictEqual(expected)
      })
    })
  })
})
