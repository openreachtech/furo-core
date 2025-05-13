/**
 * DOM inflator
 */
export default class DomInflator {
  /**
   * Constructor of DomInflator.
   *
   * @param {DomInflatorParams} params
   */
  constructor ({
    html,
  }) {
    this.html = html
  }

  /**
   * Factory method of DomInflator.
   *
   * @template {X extends typeof DomInflator ? X : never} T, X
   * @param {DomInflatorFactoryParams} params - Parameters of factory method.
   * @returns {InstanceType<X>} Instance of this class.
   * @this {T}
   */
  static create ({
    html,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        html,
      })
    )
  }

  /**
   * get: Constructor from instance.
   *
   * @template {typeof DomInflator} T
   * @returns {T} Constructor of the
   */
  get Ctor () {
    return /** @type {*} */ (this.constructor)
  }

  /**
   * get: HTML document.
   *
   * @returns {Document} HTML document.
   */
  static get htmlDocument () {
    return window.document
  }

  /**
   * Inflate HTML.
   *
   * @returns {Array<Element>} HTML collection.
   */
  inflateElements () {
    const template = this.Ctor.htmlDocument
      .createElement('template')

    template.innerHTML = this.html

    return [...template.content.children]
  }
}

/**
 * @typedef {{
 *   html: string
 * }} DomInflatorParams
 */

/**
 * @typedef {{
 *   html: string
 * }} DomInflatorFactoryParams
 */
