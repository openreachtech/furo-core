import AbortTimer from '../../../../../../lib/tools/http-fetchers/tools/AbortTimer.js'

describe('AbortTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('constructor', () => {
    describe('should keep property', () => {
      const alphaSignal = new AbortController().signal
      const betaSignal = new AbortController().signal

      const cases = [
        {
          input: {
            signal: alphaSignal,
            timerId: 1001,
          },
        },
        {
          input: {
            signal: betaSignal,
            timerId: null,
          },
        },
      ]

      describe('#signal', () => {
        test.each(cases)('timerId: $input.timerId', ({ input }) => {
          const timer = new AbortTimer(input)

          expect(timer)
            .toHaveProperty('signal', input.signal)
        })
      })

      describe('#timerId', () => {
        test.each(cases)('timerId: $input.timerId', ({ input }) => {
          const timer = new AbortTimer(input)

          expect(timer)
            .toHaveProperty('timerId', input.timerId)
        })
      })
    })
  })
})

describe('AbortTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            requestSignal: new AbortController().signal,
            timeoutMilliseconds: 0,
          },
        },
        {
          input: {
            requestSignal: new AbortController().signal,
            timeoutMilliseconds: 1000,
          },
        },
      ]

      test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input }) => {
        const timer = AbortTimer.create(input)

        expect(timer)
          .toBeInstanceOf(AbortTimer)

        timer.clear()
      })
    })

    describe('when the timeout is 0', () => {
      const cases = [
        {
          input: {
            requestSignal: new AbortController().signal,
            timeoutMilliseconds: 0,
          },
        },
        {
          input: {
            requestSignal: new AbortController().signal,
            timeoutMilliseconds: 0,
          },
        },
      ]

      describe('should hold the signal of the request itself', () => {
        test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input }) => {
          const timer = AbortTimer.create(input)

          expect(timer)
            .toHaveProperty('signal', input.requestSignal)
        })
      })

      describe('should start no timer', () => {
        test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input }) => {
          const timer = AbortTimer.create(input)

          expect(timer)
            .toHaveProperty('timerId', null)

          expect(jest.getTimerCount())
            .toBe(0)
        })
      })
    })

    describe('when the timeout is positive', () => {
      const cases = [
        {
          input: {
            timeoutMilliseconds: 1000,
          },
        },
        {
          input: {
            timeoutMilliseconds: 30000,
          },
        },
      ]

      describe('should hold a signal that is not the signal of the request', () => {
        test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input }) => {
          const requestSignal = new AbortController().signal

          const timer = AbortTimer.create({
            requestSignal,
            timeoutMilliseconds: input.timeoutMilliseconds,
          })

          expect(timer.signal)
            .not
            .toBe(requestSignal)

          expect(timer.signal)
            .toBeInstanceOf(AbortSignal)

          timer.clear()
        })
      })

      describe('should not abort the signal before the timeout elapses', () => {
        test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input }) => {
          const timer = AbortTimer.create({
            requestSignal: new AbortController().signal,
            timeoutMilliseconds: input.timeoutMilliseconds,
          })

          jest.advanceTimersByTime(input.timeoutMilliseconds - 1)

          expect(timer.signal.aborted)
            .toBe(false)

          timer.clear()
        })
      })

      describe('should abort the signal with a TimeoutError when the timeout elapses', () => {
        test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input }) => {
          const timer = AbortTimer.create({
            requestSignal: new AbortController().signal,
            timeoutMilliseconds: input.timeoutMilliseconds,
          })

          jest.advanceTimersByTime(input.timeoutMilliseconds)

          expect(timer.signal.aborted)
            .toBe(true)

          expect(timer.signal.reason)
            .toHaveProperty('name', 'TimeoutError')
        })
      })

      describe('should abort the signal with the reason of the request when the request is aborted', () => {
        const reasons = [
          {
            reason: new DOMException('Cancel 0001', 'AbortError'),
          },
          {
            reason: 'cancel',
          },
        ]

        test.each(reasons)('reason: $reason', ({ reason }) => {
          const requestController = new AbortController()

          const timer = AbortTimer.create({
            requestSignal: requestController.signal,
            timeoutMilliseconds: 1000,
          })

          requestController.abort(reason)

          expect(timer.signal.aborted)
            .toBe(true)

          expect(timer.signal.reason)
            .toBe(reason) // same reference

          timer.clear()
        })
      })

      describe('should be aborted already where the request is aborted already', () => {
        test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input }) => {
          const requestController = new AbortController()

          requestController.abort()

          const timer = AbortTimer.create({
            requestSignal: requestController.signal,
            timeoutMilliseconds: input.timeoutMilliseconds,
          })

          expect(timer.signal.aborted)
            .toBe(true)

          timer.clear()
        })
      })

      describe('should start no timer where the signal cannot be created', () => {
        test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input }) => {
          class AlphaTimer extends AbortTimer {
            /** @override */
            static get AbortSignalCtor () {
              return {
                any: () => {
                  throw new TypeError('AbortSignal.any is not a function')
                },
              }
            }
          }

          expect(() => AlphaTimer.create({
            requestSignal: new AbortController().signal,
            timeoutMilliseconds: input.timeoutMilliseconds,
          }))
            .toThrow(TypeError)

          expect(jest.getTimerCount())
            .toBe(0)
        })
      })
    })
  })
})

describe('AbortTimer', () => {
  describe('.get:AbortControllerCtor', () => {
    test('should be AbortController', () => {
      const received = AbortTimer.AbortControllerCtor

      expect(received)
        .toBe(AbortController) // same reference
    })
  })

  describe('.get:AbortSignalCtor', () => {
    test('should be AbortSignal', () => {
      const received = AbortTimer.AbortSignalCtor

      expect(received)
        .toBe(AbortSignal) // same reference
    })
  })

  describe('.get:DOMExceptionCtor', () => {
    test('should be DOMException', () => {
      const received = AbortTimer.DOMExceptionCtor

      expect(received)
        .toBe(DOMException) // same reference
    })
  })
})

describe('AbortTimer', () => {
  describe('.get:setTimeout', () => {
    describe('should start a timer through the global setTimeout()', () => {
      const cases = [
        {
          input: {
            milliseconds: 1000,
          },
        },
        {
          input: {
            milliseconds: 5000,
          },
        },
      ]

      test.each(cases)('milliseconds: $input.milliseconds', ({ input }) => {
        const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout')
          .mockReturnValue(1001)
        const handler = () => {}

        const received = AbortTimer.setTimeout(handler, input.milliseconds)

        expect(setTimeoutSpy)
          .toHaveBeenCalledWith(handler, input.milliseconds)

        expect(received)
          .toBe(1001)
      })
    })
  })

  describe('.get:clearTimeout', () => {
    describe('should stop a timer through the global clearTimeout()', () => {
      const cases = [
        {
          input: {
            timerId: 1001,
          },
        },
        {
          input: {
            timerId: null,
          },
        },
      ]

      test.each(cases)('timerId: $input.timerId', ({ input }) => {
        const clearTimeoutSpy = jest.spyOn(globalThis, 'clearTimeout')
          .mockReturnValue(undefined)

        AbortTimer.clearTimeout(input.timerId)

        expect(clearTimeoutSpy)
          .toHaveBeenCalledWith(input.timerId)
      })
    })
  })
})

describe('AbortTimer', () => {
  describe('.createAbortController()', () => {
    test('should be an instance of AbortController', () => {
      const received = AbortTimer.createAbortController()

      expect(received)
        .toBeInstanceOf(AbortController)
    })
  })

  describe('.createSignal()', () => {
    describe('should combine the signal of the request and the signal of the controller', () => {
      const cases = [
        {
          input: {
            requestSignal: new AbortController().signal,
            controller: new AbortController(),
          },
        },
        {
          input: {
            requestSignal: new AbortController().signal,
            controller: new AbortController(),
          },
        },
      ]

      test.each(cases)('should call AbortSignal.any()', ({ input }) => {
        const anySpy = jest.spyOn(AbortSignal, 'any')

        AbortTimer.createSignal(input)

        expect(anySpy)
          .toHaveBeenCalledWith([
            input.requestSignal,
            input.controller.signal,
          ])
      })

      test.each(cases)('should be aborted by the controller', ({ input }) => {
        const received = AbortTimer.createSignal(input)

        input.controller.abort()

        expect(received.aborted)
          .toBe(true)
      })
    })
  })

  describe('.createTimeoutReason()', () => {
    test('should be an exception named TimeoutError', () => {
      const received = AbortTimer.createTimeoutReason()

      expect(received)
        .toBeInstanceOf(DOMException)

      expect(received)
        .toHaveProperty('name', 'TimeoutError')
    })
  })
})

describe('AbortTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('.startTimer()', () => {
    describe('should abort the controller with a TimeoutError when the timeout elapses', () => {
      const cases = [
        {
          input: {
            timeoutMilliseconds: 1000,
          },
        },
        {
          input: {
            timeoutMilliseconds: 2500,
          },
        },
      ]

      test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input }) => {
        const controller = new AbortController()

        AbortTimer.startTimer({
          controller,
          timeoutMilliseconds: input.timeoutMilliseconds,
        })

        expect(controller.signal.aborted)
          .toBe(false)

        jest.advanceTimersByTime(input.timeoutMilliseconds)

        expect(controller.signal.reason)
          .toHaveProperty('name', 'TimeoutError')
      })
    })

    describe('should keep the delay within the limit of setTimeout()', () => {
      const cases = [
        {
          input: {
            timeoutMilliseconds: 2147483647,
          },
          expected: 2147483647,
        },
        {
          input: {
            timeoutMilliseconds: 2147483648,
          },
          expected: 2147483647,
        },
        {
          input: {
            timeoutMilliseconds: 5000000000,
          },
          expected: 2147483647,
        },
      ]

      test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input, expected }) => {
        const setTimeoutMock = jest.fn()

        jest.spyOn(AbortTimer, 'setTimeout', 'get')
          .mockReturnValue(setTimeoutMock)

        AbortTimer.startTimer({
          controller: new AbortController(),
          timeoutMilliseconds: input.timeoutMilliseconds,
        })

        expect(setTimeoutMock)
          .toHaveBeenCalledWith(expect.any(Function), expected)
      })
    })
  })
})

describe('AbortTimer', () => {
  describe('#get:Ctor', () => {
    class AlphaTimer extends AbortTimer {}

    class BetaTimer extends AbortTimer {}

    describe('should be constructor of instance', () => {
      const cases = [
        {
          input: {
            Class: AbortTimer,
          },
          expected: AbortTimer,
        },
        {
          input: {
            Class: AlphaTimer,
          },
          expected: AlphaTimer,
        },
        {
          input: {
            Class: BetaTimer,
          },
          expected: BetaTimer,
        },
      ]

      test.each(cases)('Class: $input.Class.name', ({ input, expected }) => {
        const timer = input.Class.create({
          requestSignal: new AbortController().signal,
          timeoutMilliseconds: 0,
        })

        expect(timer.Ctor)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('AbortTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('#clear()', () => {
    const cases = [
      {
        input: {
          timeoutMilliseconds: 1000,
        },
      },
      {
        input: {
          timeoutMilliseconds: 30000,
        },
      },
    ]

    describe('should keep the signal from being aborted by the timeout', () => {
      test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input }) => {
        const timer = AbortTimer.create({
          requestSignal: new AbortController().signal,
          timeoutMilliseconds: input.timeoutMilliseconds,
        })

        timer.clear()

        jest.advanceTimersByTime(input.timeoutMilliseconds * 2)

        expect(timer.signal.aborted)
          .toBe(false)

        expect(jest.getTimerCount())
          .toBe(0)
      })
    })

    describe('should stop the timer through the function of the class with the timer id', () => {
      test.each(cases)('timeoutMilliseconds: $input.timeoutMilliseconds', ({ input }) => {
        const clearSpy = jest.spyOn(AbortTimer, 'clearTimeout', 'get')
          .mockReturnValue(() => {})

        const timer = AbortTimer.create({
          requestSignal: new AbortController().signal,
          timeoutMilliseconds: input.timeoutMilliseconds,
        })

        const clearFunction = jest.fn()

        clearSpy.mockReturnValue(clearFunction)

        timer.clear()

        expect(clearFunction)
          .toHaveBeenCalledWith(timer.timerId)
      })
    })

    describe('should be harmless where the timer has no timeout', () => {
      test('timeoutMilliseconds: 0', () => {
        const requestController = new AbortController()

        const timer = AbortTimer.create({
          requestSignal: requestController.signal,
          timeoutMilliseconds: 0,
        })

        expect(() => timer.clear())
          .not
          .toThrow()

        expect(timer.signal.aborted)
          .toBe(false)
      })
    })
  })
})
