# ProgressHttpFetcher

Extends [BaseHttpFetcher](./BaseHttpFetcher.md). Performs a `Request` over `XMLHttpRequest` and resolves to a `Response`, reporting upload and download progress — which `fetch()` cannot do for uploads.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes an optional `httpRequest`, defaulting to a new `XMLHttpRequest`, and an optional `timeout` in milliseconds, defaulting to the `timeout` of `httpRequest`. `0` waits without limit. |
| `.createXMLHttpRequest()` | Creates the `XMLHttpRequest` used for the request. |
| `.createRequestBody()` | Reads a `Request` body as a `Blob`, and as `null` for a method without a body. |
| `.isBodyRequiredMethod()` | Whether a request's method sends a body. |
| `.isCredentialsIncluded()` | Whether a request's `credentials` is `'include'`. |
| `#fetchRequest()` | Sends the `request`, reporting progress through the optional `sink`, and resolves to a `Response`. |

`#fetchRequest()` rejects with a `TypeError` when the request is aborted, fails, or times out — matching how `fetch()` reports the same conditions. The `sink` accepts `onUploadProgress` and `onDownloadProgress`.

The `Request` steers the `XMLHttpRequest` in two more ways. Its `signal` aborts the request, and `credentials: 'include'` turns on `withCredentials`, which never turns off an `XMLHttpRequest` passed in with `withCredentials` already set. The response body keeps the bytes the server sent, and a `204`, `205`, or `304` response has no body. The fetcher reads the response as a `Blob` (`responseType` is `'blob'`), so a subclass reads the body from `XMLHttpRequest#response`, because `responseText` throws.

`XMLHttpRequest` cannot honour `credentials: 'omit'` (it always sends same-origin cookies), `redirect`, `mode`, or `cache`. Send a request that needs them through [FetchHttpFetcher](./FetchHttpFetcher.md).
