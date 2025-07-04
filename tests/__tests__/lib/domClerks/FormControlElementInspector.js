import {
  ConstructorSpy,
} from '@openreachtech/jest-constructor-spy'

import FormControlElementClerk from '~/lib/domClerks/FormControlElementInspector.js'

import DomInflator from '~/lib/tools/DomInflator.js'

const haystackHtml = `
  <form>
    <input type="radio" name="group" value="001">
    <input type="radio" name="group" value="002">
    <input type="radio" name="group" value="003">
  </form>
`

const [formElementMock] = DomInflator.create({
  html: haystackHtml,
})
  .inflateElements()

/** @type {RadioNodeList} */
const radioNodeListInstance = formElementMock.elements.namedItem('group')

describe('FormControlElementClerk', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      describe('#control', () => {
        const cases = [
          {
            args: {
              control: document.createElement('button'),
            },
          },
          {
            args: {
              control: document.createElement('input'),
            },
          },
          {
            args: {
              control: document.createElement('option'),
            },
          },
          {
            args: {
              control: document.createElement('select'),
            },
          },
          {
            args: {
              control: document.createElement('textarea'),
            },
          },
          {
            args: {
              control: radioNodeListInstance,
            },
          },
        ]

        test.each(cases)('control: $args.control', ({ args }) => {
          const instance = new FormControlElementClerk(args)

          expect(instance)
            .toHaveProperty('control', args.control)
        })
      })
    })
  })
})

describe('FormControlElementClerk', () => {
  describe('.create()', () => {
    describe('to create an instance of own class', () => {
      const cases = [
        {
          args: {
            control: document.createElement('button'),
          },
        },
        {
          args: {
            control: document.createElement('input'),
          },
        },
        {
          args: {
            control: document.createElement('option'),
          },
        },
        {
          args: {
            control: document.createElement('select'),
          },
        },
        {
          args: {
            control: document.createElement('textarea'),
          },
        },
        {
          args: {
            control: radioNodeListInstance,
          },
        },
      ]

      test.each(cases)('control: $args.control', ({ args }) => {
        const instance = FormControlElementClerk.create(args)

        expect(instance)
          .toBeInstanceOf(FormControlElementClerk)
      })
    })

    describe('to call constructor', () => {
      const cases = [
        {
          args: {
            control: document.createElement('button'),
          },
        },
        {
          args: {
            control: document.createElement('input'),
          },
        },
        {
          args: {
            control: document.createElement('option'),
          },
        },
        {
          args: {
            control: document.createElement('select'),
          },
        },
        {
          args: {
            control: document.createElement('textarea'),
          },
        },
        {
          args: {
            control: radioNodeListInstance,
          },
        },
      ]

      test.each(cases)('control: $args.control', ({ args }) => {
        const DerivedClass = ConstructorSpy.create({ jest })
          .spyOn(FormControlElementClerk)

        DerivedClass.create(args)

        expect(DerivedClass.__spy__)
          .toHaveBeenCalledWith(args)
      })
    })
  })
})

describe('FormControlElementClerk', () => {
  describe('#extractFormControlValue()', () => {
    describe('without disabled controls', () => {
      describe('with <input>', () => {
        const cases = [
          {
            params: {
              html: `
                <input type="text" name="alpha" value="text-value">
              `,
            },
            tally: 'text-value',
          },
          {
            params: {
              html: `
                <input type="password" name="beta" value="password-text">
              `,
            },
            tally: 'password-text',
          },
        ]

        test.each(cases)('html: $params.html', ({ params, tally }) => {
          const [inputElement] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: inputElement,
          })

          const extractValueFromInputElementSpy = jest.spyOn(clerk, 'extractValueFromInputElement')
            .mockReturnValue(tally)
          const extractValueFromSelectElementSpy = jest.spyOn(clerk, 'extractValueFromSelectElement')
          const extractValueFromRadioNodesSpy = jest.spyOn(clerk, 'extractValueFromRadioNodes')

          const expectedArgs = {
            inputElement,
          }

          const actual = clerk.extractFormControlValue()

          expect(actual)
            .toBe(tally)

          expect(extractValueFromInputElementSpy)
            .toHaveBeenCalledWith(expectedArgs)
          expect(extractValueFromSelectElementSpy)
            .not
            .toHaveBeenCalled()
          expect(extractValueFromRadioNodesSpy)
            .not
            .toHaveBeenCalled()
        })
      })

      describe('with <select>', () => {
        const cases = [
          {
            params: {
              html: `
                <select name="alpha">
                  <option value="alpha-01">Gamma 01</option>
                  <option value="alpha-02" selected>Gamma 02</option>
                </select>
              `,
            },
            expected: 'alpha-02',
          },
          {
            params: {
              html: `
                <select name="beta">
                  <option value="beta-01">Delta 01</option><!-- default selected -->
                  <option value="beta-02">Delta 02</option>
                </select>
              `,
            },
            expected: 'beta-01',
          },
          {
            params: {
              html: `
                <select name="gamma" multiple>
                  <option value="gamma-01" selected>Gamma 01</option>
                  <option value="gamma-02" selected>Gamma 02</option>
                  <option value="gamma-03">Gamma 03</option>
                </select>
              `,
            },
            expected: [
              'gamma-01',
              'gamma-02',
              // 'gamma-03',
            ],
          },
          {
            params: {
              html: `
                <select name="delta" multiple>
                  <option value="delta-01">Delta 01</option>
                  <option value="delta-02">Delta 02</option>
                </select>
              `,
            },
            expected: [],
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [selectElement] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: selectElement,
          })

          const extractValueFromInputElementSpy = jest.spyOn(clerk, 'extractValueFromInputElement')
          const extractValueFromSelectElementSpy = jest.spyOn(clerk, 'extractValueFromSelectElement')
          const extractValueFromRadioNodesSpy = jest.spyOn(clerk, 'extractValueFromRadioNodes')

          const expectedArgs = {
            selectElement,
          }

          const actual = clerk.extractFormControlValue()

          expect(actual)
            .toEqual(expected)

          expect(extractValueFromInputElementSpy)
            .not
            .toHaveBeenCalled()
          expect(extractValueFromSelectElementSpy)
            .toHaveBeenCalledWith(expectedArgs)
          expect(extractValueFromRadioNodesSpy)
            .not
            .toHaveBeenCalled()
        })
      })

      describe('with <option>', () => {
        const cases = [
          {
            params: {
              html: `
                <option value="alpha" selected>Alpha</option>
              `,
            },
            expected: 'alpha',
          },
          {
            params: {
              html: `
                <option value="beta">Beta</option>
              `,
            },
            expected: 'beta',
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [optionElement] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: optionElement,
          })

          const extractValueFromInputElementSpy = jest.spyOn(clerk, 'extractValueFromInputElement')
          const extractValueFromSelectElementSpy = jest.spyOn(clerk, 'extractValueFromSelectElement')
          const extractValueFromRadioNodesSpy = jest.spyOn(clerk, 'extractValueFromRadioNodes')

          const expectedArgs = {
            selectElement: optionElement,
          }

          const actual = clerk.extractFormControlValue()

          expect(actual)
            .toEqual(expected)

          expect(extractValueFromInputElementSpy)
            .not
            .toHaveBeenCalled()
          expect(extractValueFromSelectElementSpy)
            .not
            .toHaveBeenCalledWith(expectedArgs)
          expect(extractValueFromRadioNodesSpy)
            .not
            .toHaveBeenCalled()
        })
      })

      describe('with <textarea>', () => {
        const cases = [
          {
            params: {
              html: `
                <textarea name="alpha">Alpha</textarea>
              `,
            },
            expected: 'Alpha',
          },
          {
            params: {
              html: `
                <textarea name="beta">Beta</textarea>
              `,
            },
            expected: 'Beta',
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [textareaElement] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: textareaElement,
          })

          const extractValueFromInputElementSpy = jest.spyOn(clerk, 'extractValueFromInputElement')
          const extractValueFromSelectElementSpy = jest.spyOn(clerk, 'extractValueFromSelectElement')
          const extractValueFromRadioNodesSpy = jest.spyOn(clerk, 'extractValueFromRadioNodes')

          const expectedArgs = {
            inputElement: textareaElement,
          }

          const actual = clerk.extractFormControlValue()

          expect(actual)
            .toEqual(expected)

          expect(extractValueFromInputElementSpy)
            .not
            .toHaveBeenCalledWith(expectedArgs)
          expect(extractValueFromSelectElementSpy)
            .not
            .toHaveBeenCalled()
          expect(extractValueFromRadioNodesSpy)
            .not
            .toHaveBeenCalled()
        })
      })

      describe('with RadioNodeList', () => {
        const cases = [
          // radio button
          {
            params: {
              html: `
                <form>
                  <input type="radio" name="group" value="alpha-01">
                  <input type="radio" name="group" value="alpha-02">
                  <input type="radio" name="group" value="alpha-03" checked>
                </form>
              `,
            },
            expected: 'alpha-03',
          },
          {
            params: {
              html: `
                <form>
                  <input type="radio" name="group" value="beta-01">
                  <input type="radio" name="group" value="beta-02">
                </form>
              `,
            },
            expected: null,
          },
          // checkbox
          {
            params: {
              html: `
                <form>
                  <input type="checkbox" name="group" value="gamma-01">
                  <input type="checkbox" name="group" value="gamma-02" checked>
                  <input type="checkbox" name="group" value="gamma-03" checked>
                </form>
              `,
            },
            expected: [
              // 'gamma-01',
              'gamma-02',
              'gamma-03',
            ],
          },
          {
            params: {
              html: `
                <form>
                  <input type="checkbox" name="group" value="delta-01">
                  <input type="checkbox" name="group" value="delta-02">
                </form>
              `,
            },
            expected: [
              // 'delta-01',
              // 'delta-02',
            ],
          },
          // multiple text
          {
            params: {
              html: `
                <form>
                  <input type="text" name="group" value="epsilon-01">
                  <input type="text" name="group" value="epsilon-02">
                  <input type="text" name="group" value="epsilon-03">
                </form>
              `,
            },
            expected: [
              'epsilon-01',
              'epsilon-02',
              'epsilon-03',
            ],
          },
          {
            params: {
              html: `
                <form>
                  <input type="text" name="group" value="zeta-01">
                  <input type="text" name="group" value="zeta-02">
                </form>
              `,
            },
            expected: [
              'zeta-01',
              'zeta-02',
            ],
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [form] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()
          const radioNodes = form.elements.namedItem('group')

          const clerk = FormControlElementClerk.create({
            control: radioNodes,
          })

          const extractValueFromInputElementSpy = jest.spyOn(clerk, 'extractValueFromInputElement')
          const extractValueFromSelectElementSpy = jest.spyOn(clerk, 'extractValueFromSelectElement')
          const extractValueFromRadioNodesSpy = jest.spyOn(clerk, 'extractValueFromRadioNodes')

          const expectedArgs = {
            radioNodes,
          }

          const actual = clerk.extractFormControlValue()

          expect(actual)
            .toEqual(expected)

          expect(extractValueFromInputElementSpy)
            .not
            .toHaveBeenCalled()
          expect(extractValueFromSelectElementSpy)
            .not
            .toHaveBeenCalled()
          expect(extractValueFromRadioNodesSpy)
            .toHaveBeenCalledWith(expectedArgs)
        })
      })
    })

    describe('with disabled controls', () => {
      describe('with <input>', () => {
        const cases = [
          {
            params: {
              html: `
                <input type="text" name="alpha" value="text-value" disabled>
              `,
            },
            tally: 'text-value',
          },
          {
            params: {
              html: `
                <input type="password" name="beta" value="password-text" disabled>
              `,
            },
            tally: 'password-text',
          },
        ]

        test.each(cases)('html: $params.html', ({ params, tally }) => {
          const [inputElement] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: inputElement,
          })

          const extractValueFromInputElementSpy = jest.spyOn(clerk, 'extractValueFromInputElement')
            .mockReturnValue(tally)
          const extractValueFromSelectElementSpy = jest.spyOn(clerk, 'extractValueFromSelectElement')
          const extractValueFromRadioNodesSpy = jest.spyOn(clerk, 'extractValueFromRadioNodes')

          const expectedArgs = {
            inputElement,
          }

          const actual = clerk.extractFormControlValue()

          expect(actual)
            .toBe(tally)

          expect(extractValueFromInputElementSpy)
            .toHaveBeenCalledWith(expectedArgs)
          expect(extractValueFromSelectElementSpy)
            .not
            .toHaveBeenCalled()
          expect(extractValueFromRadioNodesSpy)
            .not
            .toHaveBeenCalled()
        })
      })

      describe('with <select>', () => {
        const cases = [
          {
            params: {
              html: `
                <select name="alpha">
                  <option value="alpha-01">Gamma 01</option>
                  <option value="alpha-02" selected disabled>Gamma 02</option>
                </select>
              `,
            },
            expected: 'alpha-01',
          },
          {
            params: {
              html: `
                <select name="beta">
                  <option value="beta-01" disabled>Delta 01</option><!-- default selected -->
                  <option value="beta-02">Delta 02</option>
                </select>
              `,
            },
            expected: 'beta-02',
          },
          {
            params: {
              html: `
                <select name="gamma" multiple>
                  <option value="gamma-01" selected disabled>Gamma 01</option>
                  <option value="gamma-02" selected>Gamma 02</option>
                  <option value="gamma-03">Gamma 03</option>
                </select>
              `,
            },
            expected: [
              // 'gamma-01',
              'gamma-02',
              // 'gamma-03',
            ],
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [selectElement] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: selectElement,
          })

          const extractValueFromInputElementSpy = jest.spyOn(clerk, 'extractValueFromInputElement')
          const extractValueFromSelectElementSpy = jest.spyOn(clerk, 'extractValueFromSelectElement')
          const extractValueFromRadioNodesSpy = jest.spyOn(clerk, 'extractValueFromRadioNodes')

          const expectedArgs = {
            selectElement,
          }

          const actual = clerk.extractFormControlValue()

          expect(actual)
            .toEqual(expected)

          expect(extractValueFromInputElementSpy)
            .not
            .toHaveBeenCalled()
          expect(extractValueFromSelectElementSpy)
            .toHaveBeenCalledWith(expectedArgs)
          expect(extractValueFromRadioNodesSpy)
            .not
            .toHaveBeenCalled()
        })
      })

      describe('with <option>', () => {
        const cases = [
          {
            params: {
              html: `
                <option value="alpha" selected disabled>Alpha</option>
              `,
            },
          },
          {
            params: {
              html: `
                <option value="beta" disabled>Beta</option>
              `,
            },
          },
        ]

        test.each(cases)('html: $params.html', ({ params }) => {
          const [optionElement] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: optionElement,
          })

          const extractValueFromInputElementSpy = jest.spyOn(clerk, 'extractValueFromInputElement')
          const extractValueFromSelectElementSpy = jest.spyOn(clerk, 'extractValueFromSelectElement')
          const extractValueFromRadioNodesSpy = jest.spyOn(clerk, 'extractValueFromRadioNodes')

          const expectedArgs = {
            selectElement: optionElement,
          }

          const actual = clerk.extractFormControlValue()

          expect(actual)
            .toBeNull()

          expect(extractValueFromInputElementSpy)
            .not
            .toHaveBeenCalled()
          expect(extractValueFromSelectElementSpy)
            .not
            .toHaveBeenCalledWith(expectedArgs)
          expect(extractValueFromRadioNodesSpy)
            .not
            .toHaveBeenCalled()
        })
      })

      describe('with <textarea>', () => {
        const cases = [
          {
            params: {
              html: `
                <textarea name="alpha" disabled>Alpha</textarea>
              `,
            },
          },
          {
            params: {
              html: `
                <textarea name="beta" disabled>Beta</textarea>
              `,
            },
          },
        ]

        test.each(cases)('html: $params.html', ({ params }) => {
          const [textareaElement] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: textareaElement,
          })

          const extractValueFromInputElementSpy = jest.spyOn(clerk, 'extractValueFromInputElement')
          const extractValueFromSelectElementSpy = jest.spyOn(clerk, 'extractValueFromSelectElement')
          const extractValueFromRadioNodesSpy = jest.spyOn(clerk, 'extractValueFromRadioNodes')

          const expectedArgs = {
            inputElement: textareaElement,
          }

          const actual = clerk.extractFormControlValue()

          expect(actual)
            .toBeNull()

          expect(extractValueFromInputElementSpy)
            .not
            .toHaveBeenCalledWith(expectedArgs)
          expect(extractValueFromSelectElementSpy)
            .not
            .toHaveBeenCalled()
          expect(extractValueFromRadioNodesSpy)
            .not
            .toHaveBeenCalled()
        })
      })

      describe('with RadioNodeList', () => {
        const cases = [
          // radio button
          {
            params: {
              html: `
                <form>
                  <input type="radio" name="group" value="alpha-01">
                  <input type="radio" name="group" value="alpha-02">
                  <input type="radio" name="group" value="alpha-03" checked disabled>
                </form>
              `,
            },
            expected: null,
          },
          {
            params: {
              html: `
                <form>
                  <input type="radio" name="group" value="beta-01">
                  <input type="radio" name="group" value="beta-02">
                </form>
              `,
            },
            expected: null,
          },
          // checkbox
          {
            params: {
              html: `
                <form>
                  <input type="checkbox" name="group" value="gamma-01">
                  <input type="checkbox" name="group" value="gamma-02" checked disabled>
                  <input type="checkbox" name="group" value="gamma-03" checked>
                </form>
              `,
            },
            expected: [
              // 'gamma-01',
              // 'gamma-02',
              'gamma-03',
            ],
          },
          {
            params: {
              html: `
                <form>
                  <input type="checkbox" name="group" value="delta-01">
                  <input type="checkbox" name="group" value="delta-02" checked disabled>
                </form>
              `,
            },
            expected: [
              // 'delta-01',
              // 'delta-02',
            ],
          },
          // multiple text
          {
            params: {
              html: `
                <form>
                  <input type="text" name="group" value="epsilon-01" disabled>
                  <input type="text" name="group" value="epsilon-02">
                  <input type="text" name="group" value="epsilon-03">
                </form>
              `,
            },
            expected: [
              // 'epsilon-01',
              'epsilon-02',
              'epsilon-03',
            ],
          },
          {
            params: {
              html: `
                <form>
                  <input type="text" name="group" value="zeta-01">
                  <input type="text" name="group" value="zeta-02" disabled>
                </form>
              `,
            },
            expected: [
              'zeta-01',
              // 'zeta-02',
            ],
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [form] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()
          const radioNodes = form.elements.namedItem('group')

          const clerk = FormControlElementClerk.create({
            control: radioNodes,
          })

          const extractValueFromInputElementSpy = jest.spyOn(clerk, 'extractValueFromInputElement')
          const extractValueFromSelectElementSpy = jest.spyOn(clerk, 'extractValueFromSelectElement')
          const extractValueFromRadioNodesSpy = jest.spyOn(clerk, 'extractValueFromRadioNodes')

          const expectedArgs = {
            radioNodes,
          }

          const actual = clerk.extractFormControlValue()

          expect(actual)
            .toEqual(expected)

          expect(extractValueFromInputElementSpy)
            .not
            .toHaveBeenCalled()
          expect(extractValueFromSelectElementSpy)
            .not
            .toHaveBeenCalled()
          expect(extractValueFromRadioNodesSpy)
            .toHaveBeenCalledWith(expectedArgs)
        })
      })
    })
  })
})

describe('FormControlElementClerk', () => {
  describe('#extractValueFromInputElement()', () => {
    describe('with <input type="file">', () => {
      const alphaFile = new File(['alpha-01'], 'alpha-01.txt', {
        type: 'text/plain',
      })
      const betaFile = new File(['beta-01'], 'beta-01.txt', {
        type: 'text/plain',
      })
      const gammaFile = new File(['gamma-01'], 'gamma-01.txt', {
        type: 'text/plain',
      })
      const deltaFile = new File(['delta-01'], 'delta-01.txt', {
        type: 'text/plain',
      })

      describe('with single <input type="file">', () => {
        const cases = [
          {
            params: {
              html: `
                <input type="file" name="alpha">
              `,
            },
            fileTally: alphaFile,
          },
          {
            params: {
              html: `
                <input type="file" name="beta">
              `,
            },
            fileTally: betaFile,
          },
          {
            params: {
              html: `
                <input type="file" name="gamma">
              `,
            },
            fileTally: gammaFile,
          },
          {
            params: {
              html: `
                <input type="file" name="delta">
              `,
            },
            fileTally: deltaFile,
          },
          {
            params: {
              html: `
                <input type="file" name="epsilon">
              `,
            },
            fileTally: null,
          },
        ]

        test.each(cases)('html: $params.html', ({ params, fileTally }) => {
          const [fileInputElement] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()

          jest.spyOn(fileInputElement.files, 'item')
            .mockReturnValue(fileTally)

          const clerk = FormControlElementClerk.create({
            control: fileInputElement,
          })

          const actual = clerk.extractValueFromInputElement({
            inputElement: fileInputElement,
          })

          expect(actual)
            .toBe(fileTally)
        })
      })

      describe('with multiple <input type="file" multiple>', () => {
        const cases = [
          {
            params: {
              html: `
                <input type="file" name="alpha" multiple>
              `,
            },
            filesTally: [
              alphaFile,
            ],
          },
          {
            params: {
              html: `
                <input type="file" name="beta" multiple>
              `,
            },
            filesTally: [
              alphaFile,
              betaFile,
            ],
          },
          {
            params: {
              html: `
                <input type="file" name="gamma" multiple>
              `,
            },
            filesTally: [
              alphaFile,
              betaFile,
              gammaFile,
            ],
          },
          {
            params: {
              html: `
                <input type="file" name="delta" multiple>
              `,
            },
            filesTally: [],
          },
        ]

        test.each(cases)('html: $params.html', ({ params, filesTally }) => {
          const [fileInputElement] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()

          /** @type {HTMLInputElement} */
          const fulfilledInputElement = /** @type {*} */ ({
            __proto__: fileInputElement,
            type: fileInputElement.type,
            files: filesTally,
            hasAttribute (key) {
              return fileInputElement.hasAttribute(key)
            },
          })

          const clerk = FormControlElementClerk.create({
            control: fulfilledInputElement,
          })

          const actual = clerk.extractValueFromInputElement({
            inputElement: fulfilledInputElement,
          })

          expect(actual)
            .toEqual(filesTally)
        })
      })
    })

    describe('with <input type="number">', () => {
      describe('to convert valid string to number', () => {
        const cases = [
          {
            params: {
              html: `
                <input type="number" name="num1" value="100">
              `,
            },
            expected: 100,
          },
          {
            params: {
              html: `
                <input type="number" name="num2" value="123.45">
              `,
            },
            expected: 123.45,
          },
          {
            params: {
              html: `
                <input type="number" name="num3" value="0">
              `,
            },
            expected: 0,
          },
          {
            params: {
              html: `
                <input type="number" name="num4" value="-100">
              `,
            },
            expected: -100,
          },
          {
            params: {
              html: `
                <input type="number" name="num5" value="-123.45">
              `,
            },
            expected: -123.45,
          },
          {
            params: {
              html: `
                <input type="number" name="num6" value="1e5">
              `,
            },
            expected: 100000,
          },
          {
            params: {
              html: `
                <input type="number" name="num7" value="-1e5">
              `,
            },
            expected: -100000,
          },
          {
            params: {
              html: `
                <input type="number" name="num8" value="1.23e2">
              `,
            },
            expected: 123,
          },
          {
            params: {
              html: `
                <input type="number" name="num9" value="-1.23e2">
              `,
            },
            expected: -123,
          },
          {
            params: {
              html: `
                <input type="number" name="num10" value="1e-5">
              `,
            },
            expected: 0.00001,
          },
          {
            params: {
              html: `
                <input type="number" name="num11" value=".123">
              `,
            },
            expected: 0.123,
          },
          {
            params: {
              html: `
                <input type="number" name="num12" value="9999999999">
              `,
            },
            expected: 9999999999,
          },
          {
            params: {
              html: `
                <input type="number" name="num13" value="0.0000001">
              `,
            },
            expected: 0.0000001,
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [inputElement] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: inputElement,
          })

          const actual = clerk.extractValueFromInputElement({
            inputElement,
          })

          expect(actual)
            .toBe(expected)
        })
      })

      describe('to return null for invalid values', () => {
        const cases = [
          {
            params: {
              html: `
                <input type="number" name="invalid1" value="">
              `,
            },
          },
          {
            params: {
              html: `
                <input type="number" name="invalid2" value="123.45a">
              `,
            },
          },
          {
            params: {
              html: `
                <input type="number" name="invalid3" value="12.34.56">
              `,
            },
          },
          {
            params: {
              html: `
                <input type="number" name="invalid4" value=".">
              `,
            },
          },
          {
            params: {
              html: `
                <input type="number" name="invalid5" value=" 123 ">
              `,
            },
          },
          {
            params: {
              html: `
                <input type="number" name="invalid6" value="12#34">
              `,
            },
          },
          {
            params: {
              html: `
                <input type="number" name="invalid7" value="+123">
              `,
            },
          },
          {
            params: {
              html: `
                <input type="number" name="invalid8" value="+-123">
              `,
            },
          },
          {
            params: {
              html: `
                <input type="number" name="invalid9" value="0xFF">
              `,
            },
          },
          {
            params: {
              html: `
                <input type="number" name="invalid10" value="Infinity">
              `,
            },
          },
          {
            params: {
              html: `
                <input type="number" name="invalid11" value="NaN">
              `,
            },
          },
        ]

        test.each(cases)('html: $params.html', ({ params }) => {
          const [inputElement] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: inputElement,
          })

          const actual = clerk.extractValueFromInputElement({
            inputElement,
          })

          expect(actual)
            .toBeNull()
        })
      })
    })

    describe('with other type of <input>', () => {
      const cases = [
        {
          params: {
            html: `
              <input type="text" name="alpha" value="text-value">
            `,
          },
          expected: 'text-value',
        },
        {
          params: {
            html: `
              <input type="password" name="beta" value="password-text">
            `,
          },
          expected: 'password-text',
        },
        {
          params: {
            html: `
              <input type="email" name="gamma" value="user@example.com">
            `,
          },
          expected: 'user@example.com',
        },
        {
          params: {
            html: `
              <input type="url" name="delta" value="https://example.com">
            `,
          },
          expected: 'https://example.com',
        },
        {
          params: {
            html: `
              <input type="tel" name="epsilon" value="000-1234-5678">
            `,
          },
          expected: '000-1234-5678',
        },
        {
          params: {
            html: `
              <input type="search" name="zeta" value="search query">
            `,
          },
          expected: 'search query',
        },
        {
          params: {
            html: `
              <input type="color" name="eta" value="#aabbdd">
            `,
          },
          expected: '#aabbdd',
        },
        {
          params: {
            html: `
              <input type="date" name="theta" value="2025-05-31">
            `,
          },
          expected: '2025-05-31',
        },
        {
          params: {
            html: `
              <input type="datetime-local" name="iota" value="2025-05-31T11:22:33.999">
            `,
          },
          expected: '2025-05-31T11:22:33.999',
        },
        {
          params: {
            html: `
              <input type="month" name="kappa" value="2025-05">
            `,
          },
          expected: '2025-05',
        },
        {
          params: {
            html: `
              <input type="week" name="lambda" value="2025-W18">
            `,
          },
          expected: '2025-W18',
        },
        {
          params: {
            html: `
              <input type="time" name="mu" value="12:34">
            `,
          },
          expected: '12:34',
        },
        {
          params: {
            html: `
              <input type="range" name="nu" value="75">
            `,
          },
          expected: '75',
        },
      ]

      test.each(cases)('html: $params.html', ({ params, expected }) => {
        const [inputElement] = DomInflator.create({
          html: params.html,
        })
          .inflateElements()

        const clerk = FormControlElementClerk.create({
          control: inputElement,
        })

        const actual = clerk.extractValueFromInputElement({
          inputElement,
        })

        expect(actual)
          .toBe(expected)
      })
    })
  })
})

describe('FormControlElementClerk', () => {
  describe('#extractValueFromFileTypeInputElement()', () => {
    const alphaFile = new File(['alpha-01'], 'alpha-01.txt', {
      type: 'text/plain',
    })
    const betaFile = new File(['beta-01'], 'beta-01.txt', {
      type: 'text/plain',
    })
    const gammaFile = new File(['gamma-01'], 'gamma-01.txt', {
      type: 'text/plain',
    })
    const deltaFile = new File(['delta-01'], 'delta-01.txt', {
      type: 'text/plain',
    })

    describe('with single <input type="file">', () => {
      const cases = [
        {
          params: {
            html: `
              <input type="file" name="alpha">
            `,
          },
          fileTally: alphaFile,
        },
        {
          params: {
            html: `
              <input type="file" name="beta">
            `,
          },
          fileTally: betaFile,
        },
        {
          params: {
            html: `
              <input type="file" name="gamma">
            `,
          },
          fileTally: gammaFile,
        },
        {
          params: {
            html: `
              <input type="file" name="delta">
            `,
          },
          fileTally: deltaFile,
        },
        {
          params: {
            html: `
              <input type="file" name="epsilon">
            `,
          },
          fileTally: null,
        },
      ]

      test.each(cases)('html: $params.html', ({ params, fileTally }) => {
        const [fileInputElement] = DomInflator.create({
          html: params.html,
        })
          .inflateElements()

        jest.spyOn(fileInputElement.files, 'item')
          .mockReturnValue(fileTally)

        const clerk = FormControlElementClerk.create({
          control: fileInputElement,
        })

        const actual = clerk.extractValueFromFileTypeInputElement({
          inputElement: fileInputElement,
        })

        expect(actual)
          .toBe(fileTally)
      })
    })

    describe('with multiple <input type="file" multiple>', () => {
      const cases = [
        {
          params: {
            html: `
              <input type="file" name="alpha" multiple>
            `,
          },
          filesTally: [
            alphaFile,
          ],
        },
        {
          params: {
            html: `
              <input type="file" name="beta" multiple>
            `,
          },
          filesTally: [
            alphaFile,
            betaFile,
          ],
        },
        {
          params: {
            html: `
              <input type="file" name="gamma" multiple>
            `,
          },
          filesTally: [
            alphaFile,
            betaFile,
            gammaFile,
          ],
        },
        {
          params: {
            html: `
              <input type="file" name="delta" multiple>
            `,
          },
          filesTally: [],
        },
      ]

      test.each(cases)('html: $params.html', ({ params, filesTally }) => {
        const [fileInputElement] = DomInflator.create({
          html: params.html,
        })
          .inflateElements()

        /** @type {HTMLInputElement} */
        const fulfilledInputElement = /** @type {*} */ ({
          __proto__: fileInputElement,
          files: filesTally,
          hasAttribute (key) {
            return fileInputElement.hasAttribute(key)
          },
        })

        const clerk = FormControlElementClerk.create({
          control: fulfilledInputElement,
        })

        const actual = clerk.extractValueFromFileTypeInputElement({
          inputElement: fulfilledInputElement,
        })

        expect(actual)
          .toEqual(filesTally)
      })
    })
  })
})

describe('FormControlElementClerk', () => {
  describe('#extractValueFromNumberTypeInputElement()', () => {
    describe('to convert valid string to number', () => {
      const cases = [
        {
          params: {
            html: `
              <input type="number" name="num1" value="100">
            `,
          },
          expected: 100,
        },
        {
          params: {
            html: `
              <input type="number" name="num2" value="123.45">
            `,
          },
          expected: 123.45,
        },
        {
          params: {
            html: `
              <input type="number" name="num3" value="0">
            `,
          },
          expected: 0,
        },
        {
          params: {
            html: `
              <input type="number" name="num4" value="-100">
            `,
          },
          expected: -100,
        },
        {
          params: {
            html: `
              <input type="number" name="num5" value="-123.45">
            `,
          },
          expected: -123.45,
        },
        {
          params: {
            html: `
              <input type="number" name="num6" value="1e5">
            `,
          },
          expected: 100000,
        },
        {
          params: {
            html: `
              <input type="number" name="num7" value="-1e5">
            `,
          },
          expected: -100000,
        },
        {
          params: {
            html: `
              <input type="number" name="num8" value="1.23e2">
            `,
          },
          expected: 123,
        },
        {
          params: {
            html: `
              <input type="number" name="num9" value="-1.23e2">
            `,
          },
          expected: -123,
        },
        {
          params: {
            html: `
              <input type="number" name="num10" value="1e-5">
            `,
          },
          expected: 0.00001,
        },
        {
          params: {
            html: `
              <input type="number" name="num11" value=".123">
            `,
          },
          expected: 0.123,
        },
        {
          params: {
            html: `
              <input type="number" name="num12" value="9999999999">
            `,
          },
          expected: 9999999999,
        },
        {
          params: {
            html: `
              <input type="number" name="num13" value="0.0000001">
            `,
          },
          expected: 0.0000001,
        },
      ]

      test.each(cases)('html: $params.html', ({ params, expected }) => {
        const [inputElement] = DomInflator.create({
          html: params.html,
        })
          .inflateElements()

        const clerk = FormControlElementClerk.create({
          control: inputElement,
        })

        const actual = clerk.extractValueFromNumberTypeInputElement({
          inputElement,
        })

        expect(actual)
          .toBe(expected)
      })
    })

    describe('to return null for invalid values', () => {
      const cases = [
        {
          params: {
            html: `
              <input type="number" name="invalid1" value="">
            `,
          },
        },
        {
          params: {
            html: `
              <input type="number" name="invalid2" value="123.45a">
            `,
          },
        },
        {
          params: {
            html: `
              <input type="number" name="invalid3" value="12.34.56">
            `,
          },
        },
        {
          params: {
            html: `
              <input type="number" name="invalid4" value=".">
            `,
          },
        },
        {
          params: {
            html: `
              <input type="number" name="invalid5" value=" 123 ">
            `,
          },
        },
        {
          params: {
            html: `
              <input type="number" name="invalid6" value="12#34">
            `,
          },
        },
        {
          params: {
            html: `
              <input type="number" name="invalid7" value="+123">
            `,
          },
        },
        {
          params: {
            html: `
              <input type="number" name="invalid8" value="+-123">
            `,
          },
        },
        {
          params: {
            html: `
              <input type="number" name="invalid9" value="0xFF">
            `,
          },
        },
        {
          params: {
            html: `
              <input type="number" name="invalid10" value="Infinity">
            `,
          },
        },
        {
          params: {
            html: `
              <input type="number" name="invalid11" value="NaN">
            `,
          },
        },
      ]

      test.each(cases)('html: $params.html', ({ params }) => {
        const [inputElement] = DomInflator.create({
          html: params.html,
        })
          .inflateElements()

        const clerk = FormControlElementClerk.create({
          control: inputElement,
        })

        const actual = clerk.extractValueFromNumberTypeInputElement({
          inputElement,
        })

        expect(actual)
          .toBeNull()
      })
    })
  })
})

describe('FormControlElementClerk', () => {
  describe('#extractValueFromSelectElement()', () => {
    describe('as single value', () => {
      const cases = [
        {
          args: {
            html: `
              <select>
                <option value="alpha-01" selected>Alpha 01</option>
                <option value="alpha-02">Alpha 02</option>
                <option value="alpha-03">Alpha 03</option>
              </select>
            `,
          },
          expected: 'alpha-01',
        },
        {
          args: {
            html: `
              <select>
                <option value="beta-01">Beta 01</option>
                <option value="beta-02" selected>Beta 02</option>
              </select>
            `,
          },
          expected: 'beta-02',
        },
        {
          args: {
            html: `
              <select>
                <option value="gamma-01" selected>Gamma 01</option>
              </select>
            `,
          },
          expected: 'gamma-01',
        },
        {
          args: {
            html: `
              <select>
                <option value="delta-01">Delta 01</option>
                <option value="delta-02">Delta 02</option>
                <option value="delta-03">Delta 03</option>
              </select>
            `,
          },
          expected: 'delta-01',
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const [selectElement] = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const clerk = FormControlElementClerk.create({
          control: selectElement,
        })

        const actual = clerk.extractValueFromSelectElement({
          selectElement,
        })

        expect(actual)
          .toBe(expected)
      })
    })

    describe('as multiple values', () => {
      const cases = [
        {
          args: {
            html: `
              <select multiple>
                <option value="alpha-01" selected>Alpha 01</option>
                <option value="alpha-02" selected>Alpha 02</option>
                <option value="alpha-03">Alpha 03</option>
              </select>
            `,
          },
          expected: [
            'alpha-01',
            'alpha-02',
            // 'alpha-03',
          ],
        },
        {
          args: {
            html: `
              <select multiple>
                <option value="beta-01">Beta 01</option>
                <option value="beta-02" selected>Beta 02</option>
                <option value="beta-03" selected>Beta 03</option>
              </select>
            `,
          },
          expected: [
            // 'beta-01',
            'beta-02',
            'beta-03',
          ],
        },
        {
          args: {
            html: `
              <select multiple>
                <option value="gamma-01">Gamma 01</option>
                <option value="gamma-02">Gamma 02</option>
                <option value="gamma-03">Gamma 03</option>
              </select>
            `,
          },
          expected: [
            // 'gamma-01',
            // 'gamma-02',
            // 'gamma-03',
          ],
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const [selectElement] = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const clerk = FormControlElementClerk.create({
          control: selectElement,
        })

        const actual = clerk.extractValueFromSelectElement({
          selectElement,
        })

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('FormControlElementClerk', () => {
  describe('#extractValueFromRadioNodes()', () => {
    describe('without disabled <input>', () => {
      describe('<input type="radio">', () => {
        const cases = [
          {
            params: {
              html: `
                <form>
                  <input type="radio" name="group" value="alpha-01">
                  <input type="radio" name="group" value="alpha-02">
                  <input type="radio" name="group" value="alpha-03" checked>
                </form>
              `,
            },
            expected: 'alpha-03',
          },
          {
            params: {
              html: `
                <form>
                  <input type="radio" name="group" value="beta-01">
                  <input type="radio" name="group" value="beta-02">
                </form>
              `,
            },
            expected: null,
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [form] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()
          const radioNodes = form.elements.namedItem('group')

          const clerk = FormControlElementClerk.create({
            control: radioNodes,
          })

          const actual = clerk.extractValueFromRadioNodes({
            radioNodes,
          })

          expect(actual)
            .toBe(expected)
        })
      })

      describe('<input type="checkbox">', () => {
        const cases = [
          {
            params: {
              html: `
                <form>
                  <input type="checkbox" name="group" value="gamma-01" checked>
                  <input type="checkbox" name="group" value="gamma-02">
                  <input type="checkbox" name="group" value="gamma-03" checked>
                </form>
              `,
            },
            expected: [
              'gamma-01',
              // 'gamma-02',
              'gamma-03',
            ],
          },
          {
            params: {
              html: `
                <form>
                  <input type="checkbox" name="group" value="gamma-01" checked>
                  <input type="checkbox" name="group" value="gamma-02">
                  <input type="checkbox" name="group" value="gamma-03" checked>
                </form>
              `,
            },
            expected: [
              'gamma-01',
              // 'gamma-02',
              'gamma-03',
            ],
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [form] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()
          const radioNodes = form.elements.namedItem('group')

          const clerk = FormControlElementClerk.create({
            control: radioNodes,
          })

          const actual = clerk.extractValueFromRadioNodes({
            radioNodes,
          })

          expect(actual)
            .toEqual(expected)
        })
      })

      describe('multiple <input> controls', () => {
        const cases = [
          {
            params: {
              html: `
                <form>
                  <input type="text" name="group" value="alpha-01">
                  <input type="text" name="group" value="alpha-02">
                </form>
              `,
            },
            expected: [
              'alpha-01',
              'alpha-02',
            ],
          },
          {
            params: {
              html: `
                <form>
                  <input type="text" name="group" value="beta-01">
                  <input type="text" name="group" value="beta-02">
                  <input type="text" name="group" value="beta-03">
                </form>
              `,
            },
            expected: [
              'beta-01',
              'beta-02',
              'beta-03',
            ],
          },
          {
            params: {
              html: `
                <form>
                  <input type="text" name="group" value="gamma-01">
                  <input type="text" name="group" value="gamma-02">
                  <input type="text" name="group" value="gamma-03">
                  <input type="text" name="group" value="gamma-04">
                </form>
              `,
            },
            expected: [
              'gamma-01',
              'gamma-02',
              'gamma-03',
              'gamma-04',
            ],
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [form] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()
          const radioNodes = form.elements.namedItem('group')

          const clerk = FormControlElementClerk.create({
            control: radioNodes,
          })

          const actual = clerk.extractValueFromRadioNodes({
            radioNodes,
          })

          expect(actual)
            .toEqual(expected)
        })
      })
    })

    describe('without disabled <input>', () => {
      describe('<input type="radio">', () => {
        const cases = [
          {
            params: {
              html: `
                <form>
                  <input type="radio" name="group" value="alpha-01">
                  <input type="radio" name="group" value="alpha-02">
                  <input type="radio" name="group" value="alpha-03" checked disabled>
                </form>
              `,
            },
            expected: null,
          },
          {
            params: {
              html: `
                <form>
                  <input type="radio" name="group" value="beta-01" disabled>
                  <input type="radio" name="group" value="beta-02" checked>
                </form>
              `,
            },
            expected: 'beta-02',
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [form] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()
          const radioNodes = form.elements.namedItem('group')

          const clerk = FormControlElementClerk.create({
            control: radioNodes,
          })

          const actual = clerk.extractValueFromRadioNodes({
            radioNodes,
          })

          expect(actual)
            .toBe(expected)
        })
      })

      describe('<input type="checkbox">', () => {
        const cases = [
          {
            params: {
              html: `
                <form>
                  <input type="checkbox" name="group" value="gamma-01" checked disabled>
                  <input type="checkbox" name="group" value="gamma-02">
                  <input type="checkbox" name="group" value="gamma-03" checked>
                </form>
              `,
            },
            expected: [
              // 'gamma-01',
              // 'gamma-02',
              'gamma-03',
            ],
          },
          {
            params: {
              html: `
                <form>
                  <input type="checkbox" name="group" value="gamma-01" checked disabled>
                  <input type="checkbox" name="group" value="gamma-02">
                  <input type="checkbox" name="group" value="gamma-03" checked disabled>
                </form>
              `,
            },
            expected: [
              // 'gamma-01',
              // 'gamma-02',
              // 'gamma-03',
            ],
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [form] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()
          const radioNodes = form.elements.namedItem('group')

          const clerk = FormControlElementClerk.create({
            control: radioNodes,
          })

          const actual = clerk.extractValueFromRadioNodes({
            radioNodes,
          })

          expect(actual)
            .toEqual(expected)
        })
      })

      describe('multiple <input> controls', () => {
        const cases = [
          {
            params: {
              html: `
                <form>
                  <input type="text" name="group" value="alpha-01" disabled>
                  <input type="text" name="group" value="alpha-02">
                </form>
              `,
            },
            expected: [
              // 'alpha-01',
              'alpha-02',
            ],
          },
          {
            params: {
              html: `
                <form>
                  <input type="text" name="group" value="beta-01">
                  <input type="text" name="group" value="beta-02" disabled>
                  <input type="text" name="group" value="beta-03" disabled>
                </form>
              `,
            },
            expected: [
              'beta-01',
              // 'beta-02',
              // 'beta-03',
            ],
          },
          {
            params: {
              html: `
                <form>
                  <input type="text" name="group" value="gamma-01" disabled>
                  <input type="text" name="group" value="gamma-02" disabled>
                  <input type="text" name="group" value="gamma-03" disabled>
                  <input type="text" name="group" value="gamma-04">
                </form>
              `,
            },
            expected: [
              // 'gamma-01',
              // 'gamma-02',
              // 'gamma-03',
              'gamma-04',
            ],
          },
        ]

        test.each(cases)('html: $params.html', ({ params, expected }) => {
          const [form] = DomInflator.create({
            html: params.html,
          })
            .inflateElements()
          const radioNodes = form.elements.namedItem('group')

          const clerk = FormControlElementClerk.create({
            control: radioNodes,
          })

          const actual = clerk.extractValueFromRadioNodes({
            radioNodes,
          })

          expect(actual)
            .toEqual(expected)
        })
      })
    })
  })
})

describe('FormControlElementClerk', () => {
  describe('#extractValueFromRadioInputElements()', () => {
    describe('without disabled <input>', () => {
      describe('checked', () => {
        const cases = [
          {
            args: {
              html: `
                <input type="radio" name="group" value="alpha-01" checked>
                <input type="radio" name="group" value="alpha-02">
                <input type="radio" name="group" value="alpha-03">
              `,
            },
            expected: 'alpha-01',
          },
          {
            args: {
              html: `
                <input type="radio" name="group" value="beta-01">
                <input type="radio" name="group" value="beta-02" checked>
              `,
            },
            expected: 'beta-02',
          },
          {
            args: {
              html: `
                <input type="radio" name="group" value="gamma-01" checked>
              `,
            },
            expected: 'gamma-01',
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const inputElements = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: radioNodeListInstance,
          })

          const actual = clerk.extractValueFromRadioInputElements({
            inputElements,
          })

          expect(actual)
            .toBe(expected)
        })
      })

      describe('unchecked', () => {
        const cases = [
          {
            args: {
              html: `
                <input type="radio" name="group" value="alpha-01">
                <input type="radio" name="group" value="alpha-02">
                <input type="radio" name="group" value="alpha-03">
              `,
            },
          },
          {
            args: {
              html: `
                <input type="radio" name="group" value="beta-01">
                <input type="radio" name="group" value="beta-02">
              `,
            },
          },
          {
            args: {
              html: `
                <input type="radio" name="group" value="gamma-01">
              `,
            },
          },
          {
            args: {
              html: '',
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args }) => {
          const inputElements = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: radioNodeListInstance,
          })

          const actual = clerk.extractValueFromRadioInputElements({
            inputElements,
          })

          expect(actual)
            .toBeNull()
        })
      })
    })

    describe('with disabled <input>', () => {
      describe('checked', () => {
        const cases = [
          {
            args: {
              html: `
                <input type="radio" name="group" value="alpha-01" checked disabled>
                <input type="radio" name="group" value="alpha-02">
                <input type="radio" name="group" value="alpha-03">
              `,
            },
          },
          {
            args: {
              html: `
                <input type="radio" name="group" value="beta-01">
                <input type="radio" name="group" value="beta-02" checked disabled>
              `,
            },
          },
          {
            args: {
              html: `
                <input type="radio" name="group" value="gamma-01" checked disabled>
              `,
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args }) => {
          const inputElements = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const clerk = FormControlElementClerk.create({
            control: radioNodeListInstance,
          })

          const actual = clerk.extractValueFromRadioInputElements({
            inputElements,
          })

          expect(actual)
            .toBeNull()
        })
      })
    })
  })
})

describe('FormControlElementClerk', () => {
  describe('#extractValueFromCheckboxInputElements()', () => {
    describe('without disabled <input>', () => {
      const cases = [
        {
          args: {
            html: `
              <input type="checkbox" name="group" value="alpha-01" checked>
              <input type="checkbox" name="group" value="alpha-02" checked>
              <input type="checkbox" name="group" value="alpha-03" checked>
            `,
          },
          expected: [
            'alpha-01',
            'alpha-02',
            'alpha-03',
          ],
        },
        {
          args: {
            html: `
              <input type="checkbox" name="group" value="alpha-01" checked>
              <input type="checkbox" name="group" value="alpha-02" checked>
              <input type="checkbox" name="group" value="alpha-03">
            `,
          },
          expected: [
            'alpha-01',
            'alpha-02',
            // 'alpha-03',
          ],
        },
        {
          args: {
            html: `
              <input type="checkbox" name="group" value="alpha-01" checked>
              <input type="checkbox" name="group" value="alpha-02">
              <input type="checkbox" name="group" value="alpha-03">
            `,
          },
          expected: [
            'alpha-01',
            // 'alpha-02',
            // 'alpha-03',
          ],
        },
        {
          args: {
            html: `
              <input type="checkbox" name="group" value="alpha-01">
              <input type="checkbox" name="group" value="alpha-02">
              <input type="checkbox" name="group" value="alpha-03">
            `,
          },
          expected: [
            // 'alpha-01',
            // 'alpha-02',
            // 'alpha-03',
          ],
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const inputElements = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const clerk = FormControlElementClerk.create({
          control: radioNodeListInstance,
        })

        const actual = clerk.extractValueFromCheckboxInputElements({
          inputElements,
        })

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('with disabled <input>', () => {
      const cases = [
        {
          args: {
            html: `
              <input type="checkbox" name="group" value="alpha-01" checked disabled>
              <input type="checkbox" name="group" value="alpha-02" checked>
              <input type="checkbox" name="group" value="alpha-03" checked>
            `,
          },
          expected: [
            // 'alpha-01',
            'alpha-02',
            'alpha-03',
          ],
        },
        {
          args: {
            html: `
              <input type="checkbox" name="group" value="alpha-01" checked>
              <input type="checkbox" name="group" value="alpha-02" checked disabled>
              <input type="checkbox" name="group" value="alpha-03">
            `,
          },
          expected: [
            'alpha-01',
            // 'alpha-02',
            // 'alpha-03',
          ],
        },
        {
          args: {
            html: `
              <input type="checkbox" name="group" value="alpha-01" checked disabled>
              <input type="checkbox" name="group" value="alpha-02">
              <input type="checkbox" name="group" value="alpha-03">
            `,
          },
          expected: [
            // 'alpha-01',
            // 'alpha-02',
            // 'alpha-03',
          ],
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const inputElements = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const clerk = FormControlElementClerk.create({
          control: radioNodeListInstance,
        })

        const actual = clerk.extractValueFromCheckboxInputElements({
          inputElements,
        })

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})

describe('FormControlElementClerk', () => {
  describe('#extractValueFromMultipleInputElements()', () => {
    describe('without disabled <input>', () => {
      const cases = [
        {
          args: {
            html: `
              <input type="text" name="group" value="alpha-01">
              <input type="text" name="group" value="alpha-02">
              <input type="text" name="group" value="alpha-03">
            `,
          },
          expected: [
            'alpha-01',
            'alpha-02',
            'alpha-03',
          ],
        },
        {
          args: {
            html: `
              <input type="text" name="group" value="beta-01">
              <input type="text" name="group" value="beta-02">
            `,
          },
          expected: [
            'beta-01',
            'beta-02',
          ],
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const inputElements = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const clerk = FormControlElementClerk.create({
          control: radioNodeListInstance,
        })

        const actual = clerk.extractValueFromMultipleInputElements({
          inputElements,
        })

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('with disabled <input>', () => {
      const cases = [
        {
          args: {
            html: `
              <input type="text" name="group" value="alpha-01" disabled>
              <input type="text" name="group" value="alpha-02">
              <input type="text" name="group" value="alpha-03">
            `,
          },
          expected: [
            // 'alpha-01',
            'alpha-02',
            'alpha-03',
          ],
        },
        {
          args: {
            html: `
              <input type="text" name="group" value="beta-01">
              <input type="text" name="group" value="beta-02" disabled>
            `,
          },
          expected: [
            'beta-01',
            // 'beta-02',
          ],
        },
        {
          args: {
            html: `
              <input type="text" name="group" value="gamma-01" disabled>
            `,
          },
          expected: [
            // 'gamma-01',
          ],
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const inputElements = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const clerk = FormControlElementClerk.create({
          control: radioNodeListInstance,
        })

        const actual = clerk.extractValueFromMultipleInputElements({
          inputElements,
        })

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})
