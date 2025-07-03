import FormControlElementClerk from '../domClerks/FormControlElementClerk.js'

import HashBuilder from '../domClerks/HashBuilder.js'

/**
 * <form> Element Inspector.
 */
export default class FormElementInspector {
  /**
   * Constructor of FormElementInspector.
   *
   * @param {FormElementInspectorParams} params - Parameters.
   */
  constructor ({
    formElement,
  }) {
    this.formElement = formElement
  }

  /**
   * Factory method of FormElementInspector.
   *
   * @template {X extends typeof FormElementInspector ? X : never} T, X
   * @param {FormElementInspectorFactoryParams} params - Parameters.
   * @returns {InstanceType<T>} An instance of this class.
   * @this {T}
   */
  static create ({
    formElement,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        formElement,
      })
    )
  }

  /**
   * get: Constructor from instance.
   *
   * @template {typeof FormElementInspector} T
   * @returns {T} Constructor of the instance.
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }

  /**
   * Extract value hash from the form element.
   *
   * @returns {FormValueHashType} Hash of form control value.
   * @public
   */
  extractValueHash () {
    const allElements = this.extractEnabledElements()

    const fieldsetElements = [
      // ...this.formElement.querySelectorAll('fieldset:not([name])'),
      ...this.formElement.getElementsByTagName('fieldset'),
    ]

    const controlElements = allElements
      .filter(it =>
        // HTMLFieldsetElement と HTMLButtonElement は除外
        it instanceof HTMLInputElement
        || it instanceof HTMLSelectElement
        || it instanceof HTMLTextAreaElement
      )
      .filter(it => it.getAttribute('name'))

    // OK ----------------------------------------------------------------------

    const controlFieldsetMap = new WeakMap(
      controlElements.map(it => [
        it,
        fieldsetElements.filter(fieldset => fieldset.contains(it)),
      ])
    )

    const fieldsetGroupMap = new WeakMap(
      fieldsetElements.map(it => {
        const containedControlElements = controlElements
          .filter(control =>
            controlFieldsetMap.get(control)
              .includes(it)
          )

        return [
          it,
          containedControlElements,
        ]
      })
    )

    const nameResolvedControlElementEntries = controlElements
      .map(control => {
        const controlName = control.getAttribute('name')

        const targetFieldsetElements = controlFieldsetMap.get(control)

        const fieldsetNames = targetFieldsetElements
          .map(fieldset => fieldset.getAttribute('name'))
          .filter(it => it)

        const simpleJoinedName = fieldsetNames
          .concat(controlName)
          .join('.')

        return {
          name: simpleJoinedName,
          control,
        }
      })

    const fieldsetTreeNodes = [
      this.formElement,
      ...fieldsetElements,
    ]

    const containingMap = fieldsetTreeNodes
      .map(it => [
        fieldsetTreeNodes
          .filter(genitor => it !== genitor)
          .filter(genitor => genitor.contains(it))
          .at(-1),
        it,
      ])

    const fieldsetTree = containingMap
      .reduce(
        (map, [genitor, child]) => {
          map.get(genitor)
            ?.push(child)

          return map
        },
        new WeakMap(
          fieldsetTreeNodes.map(it => [
            it,
            [],
          ])
        )
      )

    // -------------------------------------------------------------------------

    const fieldsetIndexHash = new WeakMap(
      fieldsetTreeNodes
        .flatMap(genitor => {
          const children = fieldsetTree.get(genitor)

          return children
            .map(child => {
              const name = child.getAttribute('name')

              const array = children.filter(
                it => it.getAttribute('name') === name
              )

              return [
                child,
                array.indexOf(child),
              ]
            })
        })
    )

    // -------------------------------------------------------------------------

    const childControlElements = controlElements
      .filter(
        control =>
          controlFieldsetMap.get(control)
            .length === 0
      )

    const controlElementIndexHash = new WeakMap(
      controlElements
        .filter(it =>
          it.getAttribute('name')
            ?.endsWith('[]')
        )
        .map(it => {
          const fieldset = controlFieldsetMap.get(it)
            .at(-1)

          const groupElements = fieldsetGroupMap.get(fieldset)
            ?? childControlElements

          const name = it.getAttribute('name')

          const siblingElements = groupElements.filter(
            control => control.getAttribute('name') === name
          )

          return [
            it,
            siblingElements.indexOf(it),
          ]
        })
    )

    // -------------------------------------------------------------------------

    const results = nameResolvedControlElementEntries
      .map(({
        name,
        control,
      }) => {
        const indexes = controlFieldsetMap.get(control)
          .map(fieldset => fieldsetIndexHash.get(fieldset))
          .concat(
            controlElementIndexHash.get(control)
            ?? []
          )

        const fulfilledName = name.split(/(?<=\[\])/ug)
          .map((it, index) => (
            Number.isInteger(indexes[index])
              ? `${it}.${indexes[index]}`
              : it
          ))
          .join('')

        return {
          name: fulfilledName,
          control,
        }
      })

    // -------------------------------------------------------------------------

    const controlHash = this.extractControlElements()

    const radioNodeLists = Object.values(controlHash)
      .filter(it => it instanceof RadioNodeList)

    const resolveTargetControl = control => {
      const isGroupControl = ['radio', 'checkbox'].includes(
        control.getAttribute('type')
      )

      if (!isGroupControl) {
        return control
      }

      const radioNodes = radioNodeLists.find(radioNodes =>
        [...radioNodes.values()]
          .includes(control)
      )

      return radioNodes ?? control
    }

    const controlElementValueMap = new WeakMap(
      controlElements
        .map(it => ({
          control: it,
          target: resolveTargetControl(it),
        }))
        .map(({
          control,
          target,
        }) => [
          control,
          FormControlElementClerk.create({
            control: target,
          })
            .extractFormControlValue(),
        ])
    )

    // -------------------------------------------------------------------------

    /** @type {Array<[string, *]>} */
    const assigned = results.map(({
      name,
      control,
    }) => [
      name,
      controlElementValueMap.get(control),
    ])

    return /** @type {*} */ (
      HashBuilder.create()
        .setValues({
          values: assigned,
        })
        .buildHash()
    )
  }

  /**
   * Extract enabled elements from the form element.
   *
   * @returns {ReturnType<FormElementInspector['extractAllElements']>} Array of form control elements.
   */
  extractEnabledElements () {
    return this.extractAllElements()
      .filter(it => !it.disabled)
  }

  /**
   * Extract all elements from the form element.
   *
   * @returns {Array<
   *   FormControlElementType
   *   | HTMLFieldSetElement
   *   | HTMLButtonElement
   * >} Array of form control elements.
   */
  extractAllElements () {
    return /** @type {Array<*>} */ (
      [...this.formElement.elements]
    )
  }

  /**
   * Extract control elements by object hash.
   *
   * @returns {Record<string, FormControlElementHash>} Hash of form control elements.
   */
  extractControlElements () {
    const names = this.extractNames()

    return /** @type {*} */ (
      Object.fromEntries(
        names.map(it => [
          it,
          // NOTE: Jest's jsdom does not support `this.formElement[it]`
          this.formElement.elements.namedItem(it),
        ])
      )
    )
  }

  /**
   * Extract names of the control elements.
   *
   * @returns {Array<string>}
   */
  extractNames () {
    return /** @type {Array<*>} */ (
      [...new Set(
        this.extractAllElements()
          .map(it => it.getAttribute('name'))
          .filter(it => it)
      )]
    )
  }
}

/**
 * @typedef {{
 *   formElement: HTMLFormElement
 * }} FormElementInspectorParams
 */

/**
 * @typedef {FormElementInspectorParams} FormElementInspectorFactoryParams
 */

/**
 * @typedef {FormControlElementType | RadioNodeList} FormControlElementHash
 */

/**
 * @typedef {HTMLButtonElement
 *   | HTMLInputElement
 *   | HTMLSelectElement
 *   | HTMLTextAreaElement
 * } FormControlElementType
 */

/**
 * @typedef {Record<string, *>} FormValueHashType
 */
