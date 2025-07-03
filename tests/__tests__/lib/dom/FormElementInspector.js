import FormElementInspector from '~/lib/dom/FormElementInspector.js'

import DomInflator from '~/lib/tools/DomInflator'

describe('FormElementInspector', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      describe('#formElement', () => {
        const cases = [
          {
            args: {
              formElement: document.createElement('form'),
            },
          },
        ]

        test.each(cases)('formElement: $args.formElement', ({ args }) => {
          const instance = new FormElementInspector(args)

          expect(instance)
            .toHaveProperty('formElement', args.formElement)
        })
      })
    })
  })
})

describe('FormElementInspector', () => {
  describe('.create()', () => {
    describe('to create an instance of own class', () => {
      const cases = [
        {
          args: {
            formElement: document.createElement('form'),
          },
        },
      ]

      test.each(cases)('formElement: $args.formElement', ({ args }) => {
        const instance = FormElementInspector.create(args)

        expect(instance)
          .toBeInstanceOf(FormElementInspector)
      })
    })

    describe('to call constructor', () => {
      const cases = [
        {
          args: {
            formElement: document.createElement('form'),
          },
        },
      ]

      test.each(cases)('formElement: $args.formElement', ({ args }) => {
        const DerivedClass = globalThis.constructorSpy.spyOn(FormElementInspector)

        DerivedClass.create(args)

        expect(DerivedClass.__spy__)
          .toHaveBeenCalledWith(args)
      })
    })
  })
})

describe('FormElementInspector', () => {
  describe('#get:Ctor', () => {
    describe('should be a constructor of own class', () => {
      const cases = [
        {
          input: {
            formElement: document.createElement('form'),
          },
        },
      ]

      test.each(cases)('formElement: $input.formElement', ({ input }) => {
        const instance = new FormElementInspector(input)

        const actual = instance.Ctor

        expect(actual)
          .toBe(FormElementInspector) // same reference
      })
    })
  })
})

describe('FormElementInspector', () => {
  describe('#extractValueHash()', () => {
    describe('with one word name', () => {
      describe('from <input> elements', () => {
        const cases = [
          {
            args: {
              html: `
                <form>
                  <input name="alpha" value="alpha value">
                </form>
              `,
            },
            expected: {
              alpha: 'alpha value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <input name="alpha" value="alpha value">
                  <input name="beta" value="beta value">
                </form>
              `,
            },
            expected: {
              alpha: 'alpha value',
              beta: 'beta value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <input name="alpha" value="alpha value">
                  <input name="beta" value="beta value">
                  <input name="gamma" value="gamma value">
                </form>
              `,
            },
            expected: {
              alpha: 'alpha value',
              beta: 'beta value',
              gamma: 'gamma value',
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const [formElement] = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const formElementClerk = FormElementInspector.create({
            formElement,
          })

          const actual = formElementClerk.extractValueHash()

          expect(actual)
            .toStrictEqual(expected)
        })
      })

      describe('from radio button elements', () => {
        const cases = [
          {
            args: {
              html: `
                <form>
                  <input type="radio" name="alpha" value="first value" checked>
                  <input type="radio" name="alpha" value="second value">
                  <input type="radio" name="alpha" value="third value">
                </form>
              `,
            },
            expected: {
              alpha: 'first value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="radio" name="beta" value="first value">
                  <input type="radio" name="beta" value="second value" checked>
                  <input type="radio" name="beta" value="third value">
                </form>
              `,
            },
            expected: {
              beta: 'second value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="radio" name="gamma" value="first value">
                  <input type="radio" name="gamma" value="second value">
                  <input type="radio" name="gamma" value="third value" checked>
                </form>
              `,
            },
            expected: {
              gamma: 'third value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="radio" name="delta" value="first value">
                  <input type="radio" name="delta" value="second value">
                  <input type="radio" name="delta" value="third value">
                </form>
              `,
            },
            expected: {
              delta: null,
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const [formElement] = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const formElementClerk = FormElementInspector.create({
            formElement,
          })

          const actual = formElementClerk.extractValueHash()

          expect(actual)
            .toStrictEqual(expected)
        })
      })

      describe('from checkbox elements', () => {
        const cases = [
          {
            args: {
              html: `
                <form>
                  <input type="checkbox" name="alpha" value="first value">
                  <input type="checkbox" name="alpha" value="second value">
                  <input type="checkbox" name="alpha" value="third value">
                </form>
              `,
            },
            expected: {
              alpha: [
                // 'first value',
                // 'second value',
                // 'third value',
              ],
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="checkbox" name="beta" value="first value" checked>
                  <input type="checkbox" name="beta" value="second value">
                  <input type="checkbox" name="beta" value="third value">
                </form>
              `,
            },
            expected: {
              beta: [
                'first value',
                // 'second value',
                // 'third value',
              ],
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="checkbox" name="gamma" value="first value">
                  <input type="checkbox" name="gamma" value="second value" checked>
                  <input type="checkbox" name="gamma" value="third value">
                </form>
              `,
            },
            expected: {
              gamma: [
                // 'first value',
                'second value',
                // 'third value',
              ],
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="checkbox" name="delta" value="first value" checked>
                  <input type="checkbox" name="delta" value="second value" checked>
                  <input type="checkbox" name="delta" value="third value">
                </form>
              `,
            },
            expected: {
              delta: [
                'first value',
                'second value',
                // 'third value',
              ],
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="checkbox" name="epsilon" value="first value">
                  <input type="checkbox" name="epsilon" value="second value">
                  <input type="checkbox" name="epsilon" value="third value" checked>
                </form>
              `,
            },
            expected: {
              epsilon: [
                // 'first value',
                // 'second value',
                'third value',
              ],
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="checkbox" name="zeta" value="first value" checked>
                  <input type="checkbox" name="zeta" value="second value">
                  <input type="checkbox" name="zeta" value="third value" checked>
                </form>
              `,
            },
            expected: {
              zeta: [
                'first value',
                // 'second value',
                'third value',
              ],
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="checkbox" name="eta" value="first value">
                  <input type="checkbox" name="eta" value="second value" checked>
                  <input type="checkbox" name="eta" value="third value" checked>
                </form>
              `,
            },
            expected: {
              eta: [
                // 'first value',
                'second value',
                'third value',
              ],
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="checkbox" name="theta" value="first value" checked>
                  <input type="checkbox" name="theta" value="second value" checked>
                  <input type="checkbox" name="theta" value="third value" checked>
                </form>
              `,
            },
            expected: {
              theta: [
                'first value',
                'second value',
                'third value',
              ],
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const [formElement] = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const formElementClerk = FormElementInspector.create({
            formElement,
          })

          const actual = formElementClerk.extractValueHash()

          expect(actual)
            .toStrictEqual(expected)
        })
      })

      describe('from <textbox>', () => {
        const cases = [
          {
            args: {
              html: `
                <form>
                  <textarea name="alpha">alpha value</textarea>
                </form>
              `,
            },
            expected: {
              alpha: 'alpha value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <textarea name="alpha">alpha value</textarea>
                  <textarea name="beta">beta value</textarea>
                </form>
              `,
            },
            expected: {
              alpha: 'alpha value',
              beta: 'beta value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <textarea name="alpha">alpha value</textarea>
                  <textarea name="beta">beta value</textarea>
                  <textarea name="gamma">gamma value</textarea>
                </form>
              `,
            },
            expected: {
              alpha: 'alpha value',
              beta: 'beta value',
              gamma: 'gamma value',
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const [formElement] = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const formElementClerk = FormElementInspector.create({
            formElement,
          })

          const actual = formElementClerk.extractValueHash()

          expect(actual)
            .toStrictEqual(expected)
        })
      })

      describe('from single <select>', () => {
        const cases = [
          {
            args: {
              html: `
                <form>
                  <select name="alpha">
                    <option value="first value">First</option><!-- default selected -->
                    <option value="second value">Second</option>
                    <option value="third value">Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              alpha: 'first value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <select name="beta">
                    <option value="first value" selected>First</option>
                    <option value="second value">Second</option>
                    <option value="third value">Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              beta: 'first value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <select name="gamma">
                    <option value="first value">First</option>
                    <option value="second value" selected>Second</option>
                    <option value="third value">Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              gamma: 'second value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <select name="delta">
                    <option value="first value">First</option>
                    <option value="second value">Second</option>
                    <option value="third value" selected>Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              delta: 'third value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <select name="epsilon">
                    <option value="" disabled selected>Please select</option>
                    <option value="first value">First</option>
                    <option value="second value">Second</option>
                    <option value="third value">Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              epsilon: null,
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const [formElement] = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const formElementClerk = FormElementInspector.create({
            formElement,
          })

          const actual = formElementClerk.extractValueHash()

          expect(actual)
            .toStrictEqual(expected)
        })
      })

      describe('from multiple <select>', () => {
        const cases = [
          {
            args: {
              html: `
                <form>
                  <select name="alpha" multiple>
                    <option value="first value">First</option>
                    <option value="second value">Second</option>
                    <option value="third value">Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              alpha: [
                // 'first value',
                // 'second value',
                // 'third value',
              ],
            },
          },
          {
            args: {
              html: `
                <form>
                  <select name="beta" multiple>
                    <option value="first value" selected>First</option>
                    <option value="second value" selected>Second</option>
                    <option value="third value">Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              beta: [
                'first value',
                'second value',
                // 'third value',
              ],
            },
          },
          {
            args: {
              html: `
                <form>
                  <select name="gamma" multiple>
                    <option value="first value" selected>First</option>
                    <option value="second value">Second</option>
                    <option value="third value" selected>Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              gamma: [
                'first value',
                // 'second value',
                'third value',
              ],
            },
          },
          {
            args: {
              html: `
                <form>
                  <select name="delta" multiple>
                    <option value="first value">First</option>
                    <option value="second value" selected>Second</option>
                    <option value="third value" selected>Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              delta: [
                // 'first value',
                'second value',
                'third value',
              ],
            },
          },
          {
            args: {
              html: `
                <form>
                  <select name="epsilon" multiple>
                    <option value="first value" selected>First</option>
                    <option value="second value" selected>Second</option>
                    <option value="third value" selected>Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              epsilon: [
                'first value',
                'second value',
                'third value',
              ],
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const [formElement] = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const formElementClerk = FormElementInspector.create({
            formElement,
          })

          const actual = formElementClerk.extractValueHash()

          expect(actual)
            .toStrictEqual(expected)
        })
      })
    })

    describe('with paths name', () => {
      const cases = [
        {
          args: {
            html: `
              <form>
                <input name="user.id" value="10001">
                <input name="user.username" value="John Doe">
              </form>
            `,
          },
          expected: {
            user: {
              id: '10001',
              username: 'John Doe',
            },
          },
        },
        {
          args: {
            html: `
              <form>
                <input name="user.id" value="10001">
                <input name="user.username" value="John Doe">
                <input name="user.profile.bio" value="Hello, I am John Doe.">
                <input name="user.profile.age" value="58">
              </form>
            `,
          },
          expected: {
            user: {
              id: '10001',
              username: 'John Doe',
              profile: {
                bio: 'Hello, I am John Doe.',
                age: '58',
              },
            },
          },
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const [formElement] = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const formElementClerk = FormElementInspector.create({
          formElement,
        })

        const actual = formElementClerk.extractValueHash()

        expect(actual)
          .toStrictEqual(expected)
      })
    })

    describe('with paths name includes array', () => {
      const cases = [
        {
          args: {
            html: `
              <form>
                <input name="alpha[]" value="alpha value">
                <input name="alpha[]" value="beta value">
              </form>
            `,
          },
          expected: {
            alpha: [
              'alpha value',
              'beta value',
            ],
          },
        },
        {
          args: {
            html: `
              <form>
                <input name="alpha[]" value="alpha value">
                <input name="alpha[]" value="beta value">

                <input name="beta[]" value="first value">
                <input name="beta[]" value="second value">
              </form>
            `,
          },
          expected: {
            alpha: [
              'alpha value',
              'beta value',
            ],
            beta: [
              'first value',
              'second value',
            ],
          },
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const [formElement] = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const formElementClerk = FormElementInspector.create({
          formElement,
        })

        const actual = formElementClerk.extractValueHash()

        expect(actual)
          .toStrictEqual(expected)
      })
    })

    describe('with paths name and named <fieldset>', () => {
      const cases = [
        {
          args: {
            html: `
              <form>
                <fieldset name="user[]">
                  <input name="id" value="10001">
                  <input name="username" value="John Doe">
                </fieldset>
                <fieldset name="user[]">
                  <input name="id" value="10002">
                  <input name="username" value="Jane Smith">
                </fieldset>
              </form>
            `,
          },
          expected: {
            user: [
              {
                id: '10001',
                username: 'John Doe',
              },
              {
                id: '10002',
                username: 'Jane Smith',
              },
            ],
          },
        },
        {
          args: {
            html: `
              <form>
                <fieldset name="user[]">
                  <input name="id" value="10001">
                  <input name="username" value="John Doe">
                  <input name="tags[]" value="user01-tag01">
                  <input name="tags[]" value="user01-tag02">
                </fieldset>
                <fieldset name="user[]">
                  <input name="id" value="10002">
                  <input name="username" value="Jane Smith">
                  <input name="tags[]" value="user02-tag01">
                  <input name="tags[]" value="user02-tag02">
                </fieldset>
              </form>
            `,
          },
          expected: {
            user: [
              {
                id: '10001',
                username: 'John Doe',
                tags: [
                  'user01-tag01',
                  'user01-tag02',
                ],
              },
              {
                id: '10002',
                username: 'Jane Smith',
                tags: [
                  'user02-tag01',
                  'user02-tag02',
                ],
              },
            ],
          },
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const [formElement] = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const formElementClerk = FormElementInspector.create({
          formElement,
        })

        const actual = formElementClerk.extractValueHash()

        expect(actual)
          .toStrictEqual(expected)
      })
    })

    describe('with paths name and plain <fieldset>', () => {
      const cases = [
        {
          args: {
            html: `
              <form>
                <fieldset>
                  <input name="user[].id" value="20001">
                  <input name="user[].username" value="John Doe">
                </fieldset>
                <fieldset>
                  <input name="user[].id" value="20002">
                  <input name="user[].username" value="Jane Smith">
                </fieldset>
              </form>
            `,
          },
          expected: {
            user: [
              {
                id: '20001',
                username: 'John Doe',
              },
              {
                id: '20002',
                username: 'Jane Smith',
              },
            ],
          },
        },
        {
          args: {
            html: `
              <form>
                <fieldset>
                  <input name="user[].id" value="20001">
                  <input name="user[].username" value="John Doe">
                  <input name="user[].tags[]" value="user01-tag01">
                  <input name="user[].tags[]" value="user01-tag02">
                </fieldset>
                <fieldset>
                  <input name="user[].id" value="20002">
                  <input name="user[].username" value="Jane Smith">
                  <input name="user[].tags[]" value="user02-tag01">
                  <input name="user[].tags[]" value="user02-tag02">
                </fieldset>
              </form>
            `,
          },
          expected: {
            user: [
              {
                id: '20001',
                username: 'John Doe',
                tags: [
                  'user01-tag01',
                  'user01-tag02',
                ],
              },
              {
                id: '20002',
                username: 'Jane Smith',
                tags: [
                  'user02-tag01',
                  'user02-tag02',
                ],
              },
            ],
          },
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const [formElement] = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const formElementClerk = FormElementInspector.create({
          formElement,
        })

        const actual = formElementClerk.extractValueHash()

        expect(actual)
          .toStrictEqual(expected)
      })
    })

    describe('with disabled <form> controls', () => {
      describe('from <input> elements', () => {
        const cases = [
          {
            args: {
              html: `
                <form>
                  <input name="alpha" value="alpha value" disabled>
                </form>
              `,
            },
            expected: {},
          },
          {
            args: {
              html: `
                <form>
                  <input name="alpha" value="alpha value" disabled>
                  <input name="beta" value="beta value">
                </form>
              `,
            },
            expected: {
              beta: 'beta value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <input name="alpha" value="alpha value">
                  <input name="beta" value="beta value" disabled>
                  <input name="gamma" value="gamma value">
                </form>
              `,
            },
            expected: {
              alpha: 'alpha value',
              gamma: 'gamma value',
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const [formElement] = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const formElementClerk = FormElementInspector.create({
            formElement,
          })

          const actual = formElementClerk.extractValueHash()

          expect(actual)
            .toStrictEqual(expected)
        })
      })

      describe('from radio button elements', () => {
        const cases = [
          {
            args: {
              html: `
                <form>
                  <input type="radio" name="alpha" value="first value" checked disabled>
                  <input type="radio" name="alpha" value="second value">
                  <input type="radio" name="alpha" value="third value">
                </form>
              `,
            },
            expected: {
              alpha: null,
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="radio" name="beta" value="first value">
                  <input type="radio" name="beta" value="second value" checked disabled>
                  <input type="radio" name="beta" value="third value">
                </form>
              `,
            },
            expected: {
              beta: null,
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="radio" name="gamma" value="first value">
                  <input type="radio" name="gamma" value="second value">
                  <input type="radio" name="gamma" value="third value" checked disabled>
                </form>
              `,
            },
            expected: {
              gamma: null,
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="radio" name="delta" value="first value" disabled>
                  <input type="radio" name="delta" value="second value" disabled>
                  <input type="radio" name="delta" value="third value" disabled>
                </form>
              `,
            },
            // When all radio buttons are disabled, can not extract the name from all control elements
            expected: {
              // delta: null,
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const [formElement] = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const formElementClerk = FormElementInspector.create({
            formElement,
          })

          const actual = formElementClerk.extractValueHash()

          expect(actual)
            .toStrictEqual(expected)
        })
      })

      describe('from checkbox elements', () => {
        const cases = [
          {
            args: {
              html: `
                <form>
                  <input type="checkbox" name="beta" value="first value" checked disabled>
                  <input type="checkbox" name="beta" value="second value">
                  <input type="checkbox" name="beta" value="third value">
                </form>
              `,
            },
            expected: {
              beta: [
                // 'first value',
                // 'second value',
                // 'third value',
              ],
            },
          },
          {
            args: {
              html: `
                <form>
                  <input type="checkbox" name="delta" value="first value" checked>
                  <input type="checkbox" name="delta" value="second value" checked disabled>
                  <input type="checkbox" name="delta" value="third value">
                </form>
              `,
            },
            expected: {
              delta: [
                'first value',
                // 'second value',
                // 'third value',
              ],
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const [formElement] = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const formElementClerk = FormElementInspector.create({
            formElement,
          })

          const actual = formElementClerk.extractValueHash()

          expect(actual)
            .toStrictEqual(expected)
        })
      })

      describe('from <textbox>', () => {
        const cases = [
          {
            args: {
              html: `
                <form>
                  <textarea name="alpha" disabled>alpha value</textarea>
                </form>
              `,
            },
            expected: {},
          },
          {
            args: {
              html: `
                <form>
                  <textarea name="alpha" disabled>alpha value</textarea>
                  <textarea name="beta">beta value</textarea>
                </form>
              `,
            },
            expected: {
              // alpha: 'alpha value',
              beta: 'beta value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <textarea name="alpha">alpha value</textarea>
                  <textarea name="beta" disabled>beta value</textarea>
                  <textarea name="gamma">gamma value</textarea>
                </form>
              `,
            },
            expected: {
              alpha: 'alpha value',
              // beta: 'beta value',
              gamma: 'gamma value',
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const [formElement] = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const formElementClerk = FormElementInspector.create({
            formElement,
          })

          const actual = formElementClerk.extractValueHash()

          expect(actual)
            .toStrictEqual(expected)
        })
      })

      describe('from single <select>', () => {
        const cases = [
          {
            args: {
              html: `
                <form>
                  <select name="alpha" disabled>
                    <option value="first value">First</option><!-- default selected -->
                    <option value="second value">Second</option>
                    <option value="third value">Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              // alpha: 'first value',
            },
          },
          {
            args: {
              html: `
                <form>
                  <select name="alpha" disabled>
                    <option value="first value">First</option><!-- default selected -->
                    <option value="second value">Second</option>
                    <option value="third value">Third</option>
                  </select>
                  <select name="beta">
                    <option value="first value" selected>First</option>
                    <option value="second value">Second</option>
                    <option value="third value">Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              // alpha: 'first value',
              beta: 'first value',
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const [formElement] = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const formElementClerk = FormElementInspector.create({
            formElement,
          })

          const actual = formElementClerk.extractValueHash()

          expect(actual)
            .toStrictEqual(expected)
        })
      })

      describe('from multiple <select>', () => {
        const cases = [
          {
            args: {
              html: `
                <form>
                  <select name="alpha" multiple disabled>
                    <option value="first value">First</option>
                    <option value="second value">Second</option>
                    <option value="third value">Third</option>
                  </select>
                </form>
              `,
            },
            expected: {
              // alpha: [
              //   // 'first value',
              //   // 'second value',
              //   // 'third value',
              // ],
            },
          },
        ]

        test.each(cases)('html: $args.html', ({ args, expected }) => {
          const [formElement] = DomInflator.create({
            html: args.html,
          })
            .inflateElements()

          const formElementClerk = FormElementInspector.create({
            formElement,
          })

          const actual = formElementClerk.extractValueHash()

          expect(actual)
            .toStrictEqual(expected)
        })
      })
    })
  })
})

describe('FormElementInspector', () => {
  describe('#extractEnabledElements()', () => {
    describe('to extract all enabled control elements', () => {
      const cases = [
        {
          args: {
            html: `
              <form>
                <input name="alpha" value="alpha value">
                <input name="beta" value="beta value" disabled>
              </form>
            `,
          },
          expected: [
            expect.any(HTMLInputElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <input name="alpha" value="alpha value" disabled>
                <input name="beta" value="beta value" disabled>
              </form>
            `,
          },
          expected: [],
        },
        {
          args: {
            html: `
              <form>
                <input type="radio" name="alpha" value="first value" checked>
                <input type="radio" name="alpha" value="second value" disabled>
                <input type="radio" name="alpha" value="third value">
              </form>
            `,
          },
          expected: [
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <input type="checkbox" name="alpha" value="first value">
                <input type="checkbox" name="alpha" value="second value">
                <input type="checkbox" name="alpha" value="third value" disabled>
                <input type="checkbox" name="alpha" value="fourth value">
              </form>
            `,
          },
          expected: [
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <textarea name="alpha">alpha value</textarea>
                <textarea name="alpha" disabled>alpha value</textarea>
              </form>
            `,
          },
          expected: [
            expect.any(HTMLTextAreaElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <select name="alpha">
                  <option value="first value">First</option><!-- default selected -->
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
                <select name="beta" disabled>
                  <option value="first value">First</option><!-- default selected -->
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
              </form>
            `,
          },
          expected: [
            expect.any(HTMLSelectElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <select name="alpha" multiple>
                  <option value="first value">First</option>
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
                <select name="alpha" multiple disabled>
                  <option value="first value">First</option>
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
              </form>
            `,
          },
          expected: [
            expect.any(HTMLSelectElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <input name="alpha[]" value="alpha value">
                <input name="alpha[]" value="beta value" disabled>

                <input name="beta[]" value="first value">
                <input name="beta[]" value="second value" disabled>
              </form>
            `,
          },
          expected: [
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <fieldset name="user[]">
                  <input name="id" value="10001">
                  <input name="username" value="John Doe" disabled>
                </fieldset>
                <fieldset name="user[]" disabled>
                  <input name="id" value="10002">
                  <input name="username" value="Jane Smith">
                </fieldset>
              </form>
            `,
          },
          expected: [
            expect.any(HTMLFieldSetElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
          ],
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const [formElement] = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const formElementClerk = FormElementInspector.create({
          formElement,
        })

        const actual = formElementClerk.extractEnabledElements()

        expect(actual)
          .toStrictEqual(expected)
      })
    })
  })
})

describe('FormElementInspector', () => {
  describe('#extractAllElements()', () => {
    describe('to extract all control elements', () => {
      const cases = [
        {
          args: {
            html: `
              <form>
                <input name="alpha" value="alpha value">
                <input name="beta" value="beta value">
              </form>
            `,
          },
          expected: [
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <input type="radio" name="alpha" value="first value" checked>
                <input type="radio" name="alpha" value="second value">
                <input type="radio" name="alpha" value="third value">
              </form>
            `,
          },
          expected: [
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <input type="checkbox" name="alpha" value="first value">
                <input type="checkbox" name="alpha" value="second value">
                <input type="checkbox" name="alpha" value="third value">
                <input type="checkbox" name="alpha" value="fourth value">
              </form>
            `,
          },
          expected: [
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <textarea name="alpha">alpha value</textarea>
              </form>
            `,
          },
          expected: [
            expect.any(HTMLTextAreaElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <select name="alpha">
                  <option value="first value">First</option><!-- default selected -->
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
              </form>
            `,
          },
          expected: [
            expect.any(HTMLSelectElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <select name="alpha" multiple>
                  <option value="first value">First</option>
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
              </form>
            `,
          },
          expected: [
            expect.any(HTMLSelectElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <input name="user.id" value="10001">
                <input name="user.username" value="John Doe">
                <input name="user.profile.bio" value="Hello, I am John Doe.">
                <input name="user.profile.age" value="58">
              </form>
            `,
          },
          expected: [
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <input name="alpha[]" value="alpha value">
                <input name="alpha[]" value="beta value">

                <input name="beta[]" value="first value">
                <input name="beta[]" value="second value">
              </form>
            `,
          },
          expected: [
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
          ],
        },
        {
          args: {
            html: `
              <form>
                <fieldset name="user[]">
                  <input name="id" value="10001">
                  <input name="username" value="John Doe">
                </fieldset>
                <fieldset name="user[]">
                  <input name="id" value="10002">
                  <input name="username" value="Jane Smith">
                </fieldset>
              </form>
            `,
          },
          expected: [
            expect.any(HTMLFieldSetElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLFieldSetElement),
            expect.any(HTMLInputElement),
            expect.any(HTMLInputElement),
          ],
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const [formElement] = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const formElementClerk = FormElementInspector.create({
          formElement,
        })

        const actual = formElementClerk.extractAllElements()

        expect(actual)
          .toStrictEqual(expected)
      })
    })
  })
})

describe('FormElementInspector', () => {
  describe('#extractControlElements()', () => {
    describe('should be names of form control element', () => {
      const cases = [
        {
          args: {
            html: `
              <form>
                <input name="alpha" value="alpha value">
                <input name="beta" value="beta value" disabled>
              </form>
            `,
          },
          expected: {
            alpha: expect.any(HTMLInputElement),
            beta: expect.any(HTMLInputElement),
          },
        },
        {
          args: {
            html: `
              <form>
                <input name="alpha" value="alpha value" disabled>
                <input name="beta" value="beta value" disabled>
              </form>
            `,
          },
          expected: {
            alpha: expect.any(HTMLInputElement),
            beta: expect.any(HTMLInputElement),
          },
        },
        {
          args: {
            html: `
              <form>
                <input type="radio" name="alpha" value="first value" checked>
                <input type="radio" name="alpha" value="second value" disabled>
                <input type="radio" name="alpha" value="third value">
              </form>
            `,
          },
          expected: {
            alpha: expect.any(RadioNodeList),
          },
        },
        {
          args: {
            html: `
              <form>
                <input type="checkbox" name="alpha" value="first value">
                <input type="checkbox" name="alpha" value="second value">
                <input type="checkbox" name="alpha" value="third value" disabled>
                <input type="checkbox" name="alpha" value="fourth value">
              </form>
            `,
          },
          expected: {
            alpha: expect.any(RadioNodeList),
          },
        },
        {
          args: {
            html: `
              <form>
                <textarea name="alpha">alpha value</textarea>
                <textarea name="alpha" disabled>alpha value</textarea>
              </form>
            `,
          },
          expected: {
            alpha: expect.any(RadioNodeList),
          },
        },
        {
          args: {
            html: `
              <form>
                <select name="alpha">
                  <option value="first value">First</option><!-- default selected -->
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
                <select name="beta" disabled>
                  <option value="first value">First</option><!-- default selected -->
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
              </form>
            `,
          },
          expected: {
            alpha: expect.any(HTMLSelectElement),
            beta: expect.any(HTMLSelectElement),
          },
        },
        {
          args: {
            html: `
              <form>
                <select name="alpha" multiple>
                  <option value="first value">First</option>
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
                <select name="alpha" multiple disabled>
                  <option value="first value">First</option>
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
              </form>
            `,
          },
          expected: {
            alpha: expect.any(RadioNodeList),
          },
        },
        {
          args: {
            html: `
              <form>
                <input name="alpha[]" value="alpha value">
                <input name="alpha[]" value="beta value" disabled>

                <input name="beta[]" value="first value">
                <input name="beta[]" value="second value" disabled>
              </form>
            `,
          },
          expected: {
            'alpha[]': expect.any(RadioNodeList),
            'beta[]': expect.any(RadioNodeList),
          },
        },
        {
          args: {
            html: `
              <form>
                <fieldset name="user[]">
                  <input name="id" value="10001">
                  <input name="username" value="John Doe" disabled>
                </fieldset>
                <fieldset name="user[]" disabled>
                  <input name="id" value="10002">
                  <input name="username" value="Jane Smith">
                </fieldset>
              </form>
            `,
          },
          expected: {
            'user[]': expect.any(RadioNodeList),
            id: expect.any(RadioNodeList),
            username: expect.any(RadioNodeList),
          },
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const [formElement] = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const formElementClerk = FormElementInspector.create({
          formElement,
        })

        const actual = formElementClerk.extractControlElements()

        expect(actual)
          .toStrictEqual(expected)
      })
    })
  })
})

describe('FormElementInspector', () => {
  describe('#extractNames()', () => {
    describe('should be names of form control element', () => {
      const cases = [
        {
          args: {
            html: `
              <form>
                <input name="alpha" value="alpha value">
                <input name="beta" value="beta value" disabled>
              </form>
            `,
          },
          expected: [
            'alpha',
            'beta',
          ],
        },
        {
          args: {
            html: `
              <form>
                <input name="alpha" value="alpha value" disabled>
                <input name="beta" value="beta value" disabled>
              </form>
            `,
          },
          expected: [
            'alpha',
            'beta',
          ],
        },
        {
          args: {
            html: `
              <form>
                <input type="radio" name="alpha" value="first value" checked>
                <input type="radio" name="alpha" value="second value" disabled>
                <input type="radio" name="alpha" value="third value">
              </form>
            `,
          },
          expected: [
            'alpha',
          ],
        },
        {
          args: {
            html: `
              <form>
                <input type="checkbox" name="alpha" value="first value">
                <input type="checkbox" name="alpha" value="second value">
                <input type="checkbox" name="alpha" value="third value" disabled>
                <input type="checkbox" name="alpha" value="fourth value">
              </form>
            `,
          },
          expected: [
            'alpha',
          ],
        },
        {
          args: {
            html: `
              <form>
                <textarea name="alpha">alpha value</textarea>
                <textarea name="alpha" disabled>alpha value</textarea>
              </form>
            `,
          },
          expected: [
            'alpha',
          ],
        },
        {
          args: {
            html: `
              <form>
                <select name="alpha">
                  <option value="first value">First</option><!-- default selected -->
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
                <select name="beta" disabled>
                  <option value="first value">First</option><!-- default selected -->
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
              </form>
            `,
          },
          expected: [
            'alpha',
            'beta',
          ],
        },
        {
          args: {
            html: `
              <form>
                <select name="alpha" multiple>
                  <option value="first value">First</option>
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
                <select name="alpha" multiple disabled>
                  <option value="first value">First</option>
                  <option value="second value">Second</option>
                  <option value="third value">Third</option>
                </select>
              </form>
            `,
          },
          expected: [
            'alpha',
          ],
        },
        {
          args: {
            html: `
              <form>
                <input name="alpha[]" value="alpha value">
                <input name="alpha[]" value="beta value" disabled>

                <input name="beta[]" value="first value">
                <input name="beta[]" value="second value" disabled>
              </form>
            `,
          },
          expected: [
            'alpha[]',
            'beta[]',
          ],
        },
        {
          args: {
            html: `
              <form>
                <fieldset name="user[]">
                  <input name="id" value="10001">
                  <input name="username" value="John Doe" disabled>
                </fieldset>
                <fieldset name="user[]" disabled>
                  <input name="id" value="10002">
                  <input name="username" value="Jane Smith">
                </fieldset>
              </form>
            `,
          },
          expected: [
            'user[]',
            'id',
            'username',
          ],
        },
      ]

      test.each(cases)('html: $args.html', ({ args, expected }) => {
        const [formElement] = DomInflator.create({
          html: args.html,
        })
          .inflateElements()

        const formElementClerk = FormElementInspector.create({
          formElement,
        })

        const actual = formElementClerk.extractNames()

        expect(actual)
          .toStrictEqual(expected)
      })
    })
  })
})
