import { XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP } from './constants/XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP.js'
import { XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP } from './constants/XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP.js'

const OPENS_AS_ASYNC = true

/**
 * Clerk of `XMLHttpRequest`.
 *
 * It keeps every operation on an instance of `XMLHttpRequest` in one class,
 * including the ones that assign a property of the instance.
 * The operations that change the instance return the clerk, so that they can be chained.
 */
export default class XMLHttpRequestClerk {
  /**
   * Constructor.
   *
   * @param {{
   *   xmlHttpRequest: XMLHttpRequest
   * }} params - Parameters of the constructor.
   */
  constructor ({
    xmlHttpRequest,
  }) {
    this.xmlHttpRequest = xmlHttpRequest
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof XMLHttpRequestClerk ? X : never} T, X
   * @param {{
   *   xmlHttpRequest?: XMLHttpRequest
   * }} [params] - Parameters of the factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    xmlHttpRequest = this.createXMLHttpRequest(),
  } = {}) {
    return /** @type {InstanceType<T>} */ (
      new this({
        xmlHttpRequest,
      })
    )
  }

  /**
   * get: Constructor of `XMLHttpRequest`.
   *
   * @returns {typeof XMLHttpRequest} Constructor of `XMLHttpRequest`.
   */
  static get XMLHttpRequestCtor () {
    return XMLHttpRequest
  }

  /**
   * get: Event names of `XMLHttpRequest`, keyed by the member of the sink.
   *
   * @returns {typeof XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP} Event names of the request.
   */
  static get requestSinkEventNameLookup () {
    return XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP
  }

  /**
   * get: Event names of the upload of `XMLHttpRequest`, keyed by the member of the sink.
   *
   * @returns {typeof XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP} Event names of the upload.
   */
  static get uploadSinkEventNameLookup () {
    return XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP
  }

  /**
   * Create `XMLHttpRequest`.
   *
   * @returns {XMLHttpRequest} Instance of `XMLHttpRequest`.
   */
  static createXMLHttpRequest () {
    return new this.XMLHttpRequestCtor()
  }

  /**
   * get: Constructor of this class.
   *
   * @returns {typeof XMLHttpRequestClerk} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof XMLHttpRequestClerk} */ (
      this.constructor
    )
  }

  /**
   * get: HTTP status code of the response.
   *
   * @returns {number} HTTP status code.
   */
  get status () {
    return this.xmlHttpRequest.status
  }

  /**
   * get: HTTP status text of the response.
   *
   * @returns {string} HTTP status text.
   */
  get statusText () {
    return this.xmlHttpRequest.statusText
  }

  /**
   * get: Response body.
   *
   * @returns {*} Response body, whose type is decided by the response type.
   */
  get response () {
    return this.xmlHttpRequest.response
  }

  /**
   * get: URL of the response, after the redirects and without the fragment.
   *
   * @returns {string} URL of the response, or an empty string until the response is received.
   */
  get responseUrl () {
    return this.xmlHttpRequest.responseURL
  }

  /**
   * Extract all the response headers as a text, as `getAllResponseHeaders()` returns them.
   *
   * @returns {string} Response headers, separated by CRLF.
   */
  extractAllResponseHeadersText () {
    return this.xmlHttpRequest.getAllResponseHeaders()
  }

  /**
   * Open a request asynchronously.
   *
   * @param {{
   *   method: string
   *   url: string
   * }} params - Parameters.
   * @returns {XMLHttpRequestClerk} For method chaining.
   * @public
   */
  openRequest ({
    method,
    url,
  }) {
    this.xmlHttpRequest.open(
      method,
      url,
      OPENS_AS_ASYNC
    )

    return this
  }

  /**
   * Set the type of the response body.
   *
   * @param {{
   *   responseType: XMLHttpRequestResponseType
   * }} params - Parameters.
   * @returns {XMLHttpRequestClerk} For method chaining.
   * @public
   */
  setResponseType ({
    responseType,
  }) {
    this.xmlHttpRequest.responseType = responseType

    return this
  }

  /**
   * Set the milliseconds that the request may take.
   *
   * @param {{
   *   timeoutMilliseconds: number
   * }} params - Parameters.
   * @returns {XMLHttpRequestClerk} For method chaining.
   * @public
   */
  setTimeoutMilliseconds ({
    timeoutMilliseconds,
  }) {
    this.xmlHttpRequest.timeout = timeoutMilliseconds

    return this
  }

  /**
   * Set whether the cross-site request carries credentials.
   *
   * @param {{
   *   withCredentials: boolean
   * }} params - Parameters.
   * @returns {XMLHttpRequestClerk} For method chaining.
   * @public
   */
  setWithCredentials ({
    withCredentials,
  }) {
    this.xmlHttpRequest.withCredentials = withCredentials

    return this
  }

  /**
   * Set each header to the request.
   *
   * @param {{
   *   headers: Headers
   * }} params - Parameters.
   * @returns {XMLHttpRequestClerk} For method chaining.
   * @public
   */
  setRequestHeaders ({
    headers,
  }) {
    headers.forEach((value, key) => {
      this.xmlHttpRequest.setRequestHeader(key, value)
    })

    return this
  }

  /**
   * Add a listener of an event to the request.
   *
   * @param {{
   *   eventName: string
   *   listener: (event: *) => void
   * }} params - Parameters.
   * @returns {XMLHttpRequestClerk} For method chaining.
   * @public
   */
  addEventListener ({
    eventName,
    listener,
  }) {
    this.xmlHttpRequest.addEventListener(eventName, listener)

    return this
  }

  /**
   * Add a listener of an event to the upload of the request.
   *
   * @param {{
   *   eventName: string
   *   listener: (event: *) => void
   * }} params - Parameters.
   * @returns {XMLHttpRequestClerk} For method chaining.
   * @public
   */
  addUploadEventListener ({
    eventName,
    listener,
  }) {
    this.xmlHttpRequest.upload.addEventListener(eventName, listener)

    return this
  }

  /**
   * Add a sink, which is notified of the events of the request and of its upload.
   * Each member of the sink is added as a listener as it is, so that it must not depend on `this`.
   *
   * @param {{
   *   sink: XMLHttpRequestClerkSink
   * }} params - Parameters.
   * @returns {XMLHttpRequestClerk} For method chaining.
   * @public
   */
  addSink ({
    sink,
  }) {
    return this.addRequestSink({
      sink,
    })
      .addUploadSink({
        sink,
      })
  }

  /**
   * Add the members of a sink that are notified of the events of the request.
   *
   * @param {{
   *   sink: XMLHttpRequestClerkSink
   * }} params - Parameters.
   * @returns {XMLHttpRequestClerk} For method chaining.
   */
  addRequestSink ({
    sink,
  }) {
    /**
     * @type {Array<[string, (event: *) => void]>}
     */
    const entries = Object.entries(sink)
      .map(([memberName, listener]) => [
        this.Ctor.requestSinkEventNameLookup[memberName],
        listener,
      ])

    entries
      .filter(([eventName]) => eventName)
      .filter(([, listener]) => typeof listener === 'function')
      .forEach(([eventName, listener]) => {
        this.addEventListener({
          eventName,
          listener,
        })
      })

    return this
  }

  /**
   * Add the members of a sink that are notified of the events of the upload.
   *
   * @param {{
   *   sink: XMLHttpRequestClerkSink
   * }} params - Parameters.
   * @returns {XMLHttpRequestClerk} For method chaining.
   */
  addUploadSink ({
    sink,
  }) {
    /**
     * @type {Array<[string, (event: *) => void]>}
     */
    const entries = Object.entries(sink)
      .map(([memberName, listener]) => [
        this.Ctor.uploadSinkEventNameLookup[memberName],
        listener,
      ])

    entries
      .filter(([eventName]) => eventName)
      .filter(([, listener]) => typeof listener === 'function')
      .forEach(([eventName, listener]) => {
        this.addUploadEventListener({
          eventName,
          listener,
        })
      })

    return this
  }

  /**
   * Send the request.
   *
   * @param {{
   *   requestBody: Blob | null
   * }} params - Parameters.
   * @returns {XMLHttpRequestClerk} For method chaining.
   * @public
   */
  sendRequest ({
    requestBody,
  }) {
    this.xmlHttpRequest.send(requestBody)

    return this
  }

  /**
   * Abort the request.
   *
   * @returns {XMLHttpRequestClerk} For method chaining.
   * @public
   */
  abortRequest () {
    this.xmlHttpRequest.abort()

    return this
  }
}

/**
 * Members that are notified of the events of `XMLHttpRequest`, keyed by the name of each member.
 * Which names are accepted is settled by the two lookups of the event names.
 *
 * @typedef {Record<string, (event: *) => void>} XMLHttpRequestClerkSink
 */
