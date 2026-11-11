# AbortTimer

Timer that aborts a request when the timeout elapses. Its signal is aborted by the signal of the request, and by the timeout when there is one. Unlike `AbortSignal.timeout()`, the timer is cancellable, so that it never aborts what a response has already finished.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `requestSignal` and the `timeoutMilliseconds`, and starts counting. `0` for no timer, where the signal is the one of the request. |
| `.get:MAX_DELAY_MILLISECONDS` | `2147483647`, the longest delay that `setTimeout()` holds. |
| `.get:AbortControllerCtor` | The `AbortController` class. |
| `.get:AbortSignalCtor` | The `AbortSignal` class. |
| `.get:DOMExceptionCtor` | The `DOMException` class. |
| `.get:setTimeout` | The function that starts a timer. |
| `.get:clearTimeout` | The function that stops a timer. |
| `.createAbortController()` | Creates an `AbortController`. |
| `.createSignal()` | Creates the signal that the request and the controller of the timer both abort. |
| `.createTimeoutReason()` | Creates the `DOMException` named `TimeoutError` that the timer aborts with. |
| `.startTimer()` | Starts the timer that aborts the controller. |
| `.resolveDelayMilliseconds()` | Keeps the delay within `.get:MAX_DELAY_MILLISECONDS`, because `setTimeout()` sets a longer delay to 1 ms. |
| `#clear()` | Stops the timer, so that the timeout never aborts the signal after this call. |

An instance is disposable: it counts from the moment it is created, and `#clear()` stops it. `BaseHttpFetcher` clears it once the fetch settles.
