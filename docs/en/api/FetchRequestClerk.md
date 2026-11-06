# FetchRequestClerk

Extends [BaseRequestClerk](./BaseRequestClerk.md). Builds the `Response` through `fetch()`. The request goes out as built, so its `mode`, `cache`, and `redirect` hold.

| member | description |
| :-- | :-- |
| `.fetch()` | Calls the native `fetch()`. Override it to replace the transport. |
| `.buildTimeoutSignal()` | Builds the `AbortSignal` that aborts after the `timeout`. |
| `.buildAnySignal()` | Builds the `AbortSignal` that follows several signals. |
| `#buildResponse()` | Sends the `request` and resolves to the `Response` of `fetch()`. |

`#buildResponse()` aborts through the `signal` of the request and, when `timeout` is above `0`, after the `timeout`. `credentials` is `'include'` when `withCredentials` is `true`, and the `credentials` of the request otherwise, so `credentials: 'omit'` holds.

It rejects as `fetch()` does. A failed request rejects with a `TypeError`, a request aborted through its own `signal` with the reason of that signal (an `AbortError` by default), and a request past the `timeout` with a `TimeoutError`. It ignores `responseType` and reports no progress, so it leaves the `sink` unread.

It needs `AbortSignal.any()` and `AbortSignal.timeout()`, which every major browser ships since March 2024.
