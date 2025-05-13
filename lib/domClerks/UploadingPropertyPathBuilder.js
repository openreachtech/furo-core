/**
 * FormData builder.
 */
export default class UploadingPropertyPathBuilder {
  /**
   * Constructor.
   *
   * @param {UploadingPropertyPathBuilderParams} params - Parameters.
   */
  constructor ({
    nodes,
  }) {
    this.nodes = nodes
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof UploadingPropertyPathBuilder ? X : never} T, X
   * @param {UploadingPropertyPathBuilderFactoryParams} params - Parameters.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   */
  static create ({
    value,
  }) {
    const nodes = this.buildNodes({
      value,
    })

    return /** @type {InstanceType<T>} */ (
      new this({
        nodes,
      })
    )
  }

  /**
   * Build nodes.
   *
   * @param {{
   *   value: *
   *   properties?: Array<string>
   * }} params - Parameters.
   * @returns {Array<PropertyPathNode<UploadingPropertyPathBuilderValue>>} Nodes.
   */
  static buildNodes ({
    value,
    properties = [],
  }) {
    if (this.isNodeValue({
      value,
    })) {
      return [
        {
          value,
          path: properties.join('.'),
        },
      ]
    }

    return Object.entries(value)
      .flatMap(
        ([property, it]) =>
          this.buildNodes({
            value: it,
            properties: [
              ...properties,
              property,
            ],
          })
      )
  }

  /**
   * Is node value?
   *
   * @param {{
   *   value: *
   * }} params - Parameters.
   * @returns {boolean} true: bingo.
   */
  static isNodeValue ({
    value,
  }) {
    return typeof value !== 'object'
      || value === null
      || value instanceof File
      || value instanceof Blob
      || value instanceof Date
  }

  /**
   * Generate FormData map value.
   *
   * @returns {{
   *   [key: string]: [string]
   * }} Map value.
   */
  generateUploadingPathMap () {
    return Object.fromEntries(
      this.extractUploadingNodes()
        .map((it, index) => [
          index,
          [it.path],
        ])
    )
  }

  /**
   * Generate Uploading entries.
   *
   * @returns {Array<[string, File | Blob]>} Entries.
   */
  generateUploadingEntries () {
    return this.extractUploadingNodes()
      .map((it, index) => [
        index.toString(),
        it.value,
      ])
  }

  /**
   * Extract uploading nodes.
   *
   * @returns {Array<PropertyPathNode<File | Blob>>} Nodes.
   */
  extractUploadingNodes () {
    return /** @type {Array<*>} */ (
      this.nodes.filter(
        it =>
          it.value instanceof File
          || it.value instanceof Blob
      )
    )
  }
}

/**
 * @typedef {{
 *   nodes: Array<PropertyPathNode<UploadingPropertyPathBuilderValue>>
 * }} UploadingPropertyPathBuilderParams
 */

/**
 * @typedef {{
 *   value: *
 * }} UploadingPropertyPathBuilderFactoryParams
 */

/**
 * @typedef {{
 *   value: T
 *   path: string
 * }} PropertyPathNode
 * @template T
 */

/**
 * @typedef {string | number | null | File | Blob} UploadingPropertyPathBuilderValue
 */
