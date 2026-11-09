/**
 * Timer that aborts a request when the timeout elapses.
 *
 * Its signal is aborted by the signal of the request, and by the timeout when there is one.
 * Unlike `AbortSignal.timeout()`, the timer is cancellable, so that it never aborts
 * what a response has already finished.
 *
 * An instance is disposable. It starts counting when it is created, and `clear()` stops it.
 */
export default class AbortTimer {
  /**
   * Constructor.
   *
   * @param {{
   *   signal: AbortSignal
   *   timerId: ReturnType<typeof setTimeout> | null
   * }} params - Parameters of constructor.
   */
  constructor ({
    signal,
    timerId,
  }) {
    this.signal = signal
    this.timerId = timerId
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof AbortTimer ? X : never} T, X
   * @param {{
   *   requestSignal: AbortSignal
   *   timeoutMilliseconds: number
   * }} params - Parameters of factory method.
   * @returns {InstanceType<T>} Instance of this class, which has begun to count the timeout.
   * @this {T}
   * @public
   */
  static create ({
    requestSignal,
    timeoutMilliseconds,
  }) {
    if (timeoutMilliseconds === 0) {
      return /** @type {InstanceType<T>} */ (
        new this({
          signal: requestSignal,
          timerId: null,
        })
      )
    }

    const controller = this.createAbortController()
    const signal = this.createSignal({
      requestSignal,
      controller,
    })
    const timerId = this.startTimer({
      controller,
      timeoutMilliseconds,
    })

    return /** @type {InstanceType<T>} */ (
      new this({
        signal,
        timerId,
      })
    )
  }

  /**
   * get: Constructor of `AbortController`.
   *
   * @returns {typeof AbortController} Constructor of `AbortController`.
   */
  static get AbortControllerCtor () {
    return AbortController
  }

  /**
   * get: Constructor of `AbortSignal`.
   *
   * @returns {typeof AbortSignal} Constructor of `AbortSignal`.
   */
  static get AbortSignalCtor () {
    return AbortSignal
  }

  /**
   * get: Constructor of `DOMException`.
   *
   * @returns {typeof DOMException} Constructor of `DOMException`.
   */
  static get DOMExceptionCtor () {
    return DOMException
  }

  /**
   * get: Function that starts a timer.
   *
   * @returns {(callback: () => void, milliseconds: number) => ReturnType<typeof setTimeout>} Function of `setTimeout()`.
   */
  static get setTimeout () {
    return (...args) => setTimeout(...args)
  }

  /**
   * get: Function that stops a timer.
   *
   * @returns {(timerId: ReturnType<typeof setTimeout> | null) => void} Function of `clearTimeout()`.
   */
  static get clearTimeout () {
    return timerId => clearTimeout(timerId)
  }

  /**
   * Create an abort controller.
   *
   * @returns {AbortController} Instance of `AbortController`.
   */
  static createAbortController () {
    return new this.AbortControllerCtor()
  }

  /**
   * Create a signal that is aborted by the signal of the request, or by the controller of the timer.
   *
   * @param {{
   *   requestSignal: AbortSignal
   *   controller: AbortController
   * }} params - Parameters.
   * @returns {AbortSignal} Signal that aborts the request.
   */
  static createSignal ({
    requestSignal,
    controller,
  }) {
    return this.AbortSignalCtor.any([
      requestSignal,
      controller.signal,
    ])
  }

  /**
   * Create the reason that the controller of the timer aborts with.
   *
   * @returns {DOMException} Exception named `TimeoutError`.
   */
  static createTimeoutReason () {
    return new this.DOMExceptionCtor('signal timed out', 'TimeoutError')
  }

  /**
   * Start the timer that aborts the controller when the timeout elapses.
   *
   * @param {{
   *   controller: AbortController
   *   timeoutMilliseconds: number
   * }} params - Parameters.
   * @returns {ReturnType<typeof setTimeout>} Identifier of the timer.
   */
  static startTimer ({
    controller,
    timeoutMilliseconds,
  }) {
    return this.setTimeout(
      () => controller.abort(this.createTimeoutReason()),
      timeoutMilliseconds
    )
  }

  /**
   * get: Constructor of this class.
   *
   * @returns {typeof AbortTimer} Constructor of this class.
   */
  get Ctor () {
    return /** @type {typeof AbortTimer} */ (
      this.constructor
    )
  }

  /**
   * Stop the timer, so that the timeout never aborts the signal after this call.
   *
   * @returns {void}
   * @public
   */
  clear () {
    this.Ctor.clearTimeout(this.timerId)
  }
}
