export default class FormControlElementInspector {
  /**
   * Constructor of FormControlElementInspector.
   *
   * @param {FormControlElementInspectorParams} params
   */
  constructor ({
    control,
  }) {
    this.control = control
  }

  /**
   * Factory method of FormControlElementInspector.
   *
   * @template {X extends typeof FormControlElementInspector ? X : never} T, X
   * @param {FormControlElementInspectorFactoryParams} params
   * @returns {InstanceType<T>} An instance of this class.
   * @this {T}
   */
  static create ({
    control,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        control,
      })
    )
  }

  /**
   * Extract value from the control element.
   *
   * @returns {FormControlElementValueType}
   */
  extractFormControlValue () {
    if (this.control instanceof HTMLInputElement) {
      return this.extractValueFromInputElement({
        inputElement: this.control,
      })
    }

    if (this.control instanceof HTMLTextAreaElement) {
      return this.control.disabled
        ? null
        : this.control.value
    }

    if (this.control instanceof HTMLSelectElement) {
      return this.extractValueFromSelectElement({
        selectElement: this.control,
      })
    }

    if (this.control instanceof HTMLOptionElement) {
      return this.control.disabled
        ? null
        : this.control.value
    }

    if (this.control instanceof RadioNodeList) {
      return this.extractValueFromRadioNodes({
        radioNodes: this.control,
      })
    }

    return null
  }

  /**
   * Extract value from the input element.
   *
   * @param {{
   *   inputElement: HTMLInputElement
   * }} params - Parameters
   * @returns {FormControlElementValueType} Extracted value.
   */
  extractValueFromInputElement ({
    inputElement,
  }) {
    if (inputElement.type === 'file') {
      return this.extractValueFromFileTypeInputElement({
        inputElement,
      })
    }

    if (inputElement.type === 'number') {
      return this.extractValueFromNumberTypeInputElement({
        inputElement,
      })
    }

    return inputElement.value
  }

  /**
   * Extract value from the file type input element.
   *
   * @param {{
   *   inputElement: HTMLInputElement
   * }} params - Parameters.
   * @returns {FormControlElementValueType} Extracted value.
   */
  extractValueFromFileTypeInputElement ({
    inputElement,
  }) {
    if (!inputElement.files) {
      return null
    }

    if (inputElement.hasAttribute('multiple')) {
      return [...inputElement.files]
    }

    return inputElement.files.item(0)
      ?? null
  }

  /**
   * Extract value from the number type input element.
   *
   * @param {{
   *   inputElement: HTMLInputElement
   * }} params - Parameters.
   * @returns {number | null} Extracted value.
   */
  extractValueFromNumberTypeInputElement ({
    inputElement,
  }) {
    const parsedValue = parseFloat(inputElement.value)

    return isNaN(parsedValue)
      ? null
      : parsedValue
  }

  /**
   * Extract value from the select element.
   *
   * @param {{
   *   selectElement: HTMLSelectElement
   * }} params
   * @returns {FormControlElementValueType}
   */
  extractValueFromSelectElement ({
    selectElement,
  }) {
    if (!selectElement.multiple) {
      return selectElement.value
        || null // for <option disabled selected>
    }

    /** @type {Array<HTMLOptionElement>} */
    const optionElements = [...selectElement.selectedOptions]
      .filter(it =>
        !it.disabled
      )

    return /** @type {Array<*>} */ (
      optionElements
        .map(it =>
          FormControlElementInspector.create({
            control: it,
          })
        )
        .map(it =>
          it.extractFormControlValue()
        )
    )
  }

  /**
   * Extract value from the radio node list
   *
   * @param {{
   *   radioNodes: RadioNodeList
   * }} params
   * @returns {FormControlElementValueType}
   */
  extractValueFromRadioNodes ({
    radioNodes,
  }) {
    const inputElements = /** @type {Array<HTMLInputElement>} */ (
      [...radioNodes.values()]
    )

    if (inputElements.length === 0) {
      return null
    }

    const extractorHash = {
      radio: args => this.extractValueFromRadioInputElements(args),
      checkbox: args => this.extractValueFromCheckboxInputElements(args),
    }
    const sampleElement = inputElements.at(0)

    const extractor = extractorHash[sampleElement?.type]

    if (!extractor) {
      return this.extractValueFromMultipleInputElements({
        inputElements,
      })
    }

    return extractor({
      inputElements,
    })
  }

  /**
   * Extract value from <input type="radio"> elements.
   *
   * @param {{
   *   inputElements: Array<HTMLInputElement>
   * }} params - Parameters.
   * @returns {string | null} Extracted value.
   */
  extractValueFromRadioInputElements ({
    inputElements,
  }) {
    const checkedElement = inputElements.find(
      it =>
        it.checked
        && !it.disabled
    )

    return checkedElement?.value
      ?? null
  }

  /**
   * Extract value from <input type="checkbox"> elements.
   *
   * @param {{
   *   inputElements: Array<HTMLInputElement>
   * }} params - Parameters.
   * @returns {Array<string>} Extracted value.
   */
  extractValueFromCheckboxInputElements ({
    inputElements,
  }) {
    const extractingElements = inputElements.filter(
      it =>
        it.checked
        && !it.disabled
    )

    return /** @type {Array<string>} */ (
      extractingElements
        .map(it =>
          FormControlElementInspector.create({
            control: it,
          })
        )
        .map(it =>
          it.extractFormControlValue()
        )
    )
  }

  /**
   * Extract value from multiple <input> elements.
   *
   * @param {{
   *   inputElements: Array<HTMLInputElement>
   * }} params - Parameters.
   * @returns {Array<string>} Extracted value.
   */
  extractValueFromMultipleInputElements ({
    inputElements,
  }) {
    const extractingElements = inputElements.filter(
      it =>
        !it.disabled
    )

    return /** @type {Array<string>} */ (
      extractingElements
        .map(it =>
          FormControlElementInspector.create({
            control: it,
          })
        )
        .map(it =>
          it.extractFormControlValue()
        )
    )
  }
}

/**
 * @typedef {{
 *   control: FormControlElementType
 * }} FormControlElementInspectorParams
 */

/**
 * @typedef {FormControlElementInspectorParams} FormControlElementInspectorFactoryParams
 */

/**
 * @typedef {HTMLButtonElement
 *   | HTMLInputElement
 *   | HTMLOptionElement
 *   | HTMLSelectElement
 *   | HTMLTextAreaElement
 *   | RadioNodeList
 * } FormControlElementType
 */

/**
 * @typedef {string | number | Array<string> | File | Array<File> | null} FormControlElementValueType
 */
