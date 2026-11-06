# FetchRequestClerk

Extends [BaseRequestClerk](./BaseRequestClerk.md). Builds the `Response` through `fetch()`. The request goes out as built, so its `mode`, `cache`, and `redirect` hold.

| member | description |
| :-- | :-- |
| `.fetch()` | Calls the native `fetch()`. Override it to replace the transport. |
| `.buildTimeoutSignal()` | Builds the `AbortSignal` that aborts after the `timeout`. |
| `.buildAnySignal()` | Builds the `AbortSignal` that follows several signals. |
| `.waitForResponseBody()` | Waits until the body of the `Response` loads, so a failure while loading rejects like a failed request. |
| `#buildResponse()` | Sends a clone of the `request`, so its body stays unread, and resolves to the `Response` of `fetch()` once the body loads, as `XMLHttpRequestClerk` does. |

`#buildResponse()` aborts through the `signal` of the request and, when `timeout` is above `0`, after the `timeout`. `withCredentials` decides cross-origin cookies as it does on `XMLHttpRequest`: `true` sends `'include'`, and `false` lowers `'include'` of the request to `'same-origin'`. `credentials: 'omit'` of the request holds while `withCredentials` keeps its default, because `.resolveWithCredentials()` resolves it to `false`.

It rejects as `XMLHttpRequestClerk` does, with the `TypeError` of `.buildNetworkError()`: `Network request aborted` when the `signal` of the request aborts, `Network request timed out` past the `timeout`, and `Network request failed` otherwise. The error from `fetch()` stays as `cause`. It ignores `responseType` and reports no progress, so it leaves the `sink` unread.

It needs `AbortSignal.any()` and `AbortSignal.timeout()`, which every major browser ships since March 2024.
