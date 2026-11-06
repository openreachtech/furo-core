# XMLHttpRequestClerk

Extends [BaseRequestClerk](./BaseRequestClerk.md). Builds the `Response` over `XMLHttpRequest`, reporting upload and download progress through the `sink`, which `fetch()` cannot do for uploads. It creates a new `XMLHttpRequest` for every `#buildResponse()`.

| member | description |
| :-- | :-- |
| `.createXMLHttpRequest()` | Creates an `XMLHttpRequest` with the `timeout`, `responseType`, and `withCredentials` of the `config`. |
| `.buildRequestBody()` | Reads a `Request` body as a `Blob`, and as `null` for a method without a body. |
| `.isBodyRequiredMethod()` | Whether a request's method sends a body. |
| `.isNullBodyStatus()` | Whether a response status carries no body (`101`, `103`, `204`, `205`, `304`). |
| `.buildResponseByHttpRequest()` | Builds the `Response` from a loaded `XMLHttpRequest`. |
| `#buildResponse()` | Sends the `request`, reports progress through the `sink`, and resolves to a `Response`. |

`#buildResponse()` rejects with a `TypeError` when the request is aborted, fails, or times out, matching how `fetch()` reports a failed request. The `signal` of the request aborts it. The `sink` takes `onUploadProgress` and `onDownloadProgress`.

The body of the `Response` is `XMLHttpRequest#response`, which is the text the server sent while `responseType` is `''`, and it is `null` on a status that carries no body. A subclass reads the body from `XMLHttpRequest#response`, because `responseText` throws for any other `responseType`.

`XMLHttpRequest` cannot honour `credentials: 'omit'` (it always sends same-origin cookies), `redirect`, `mode`, or `cache`. Send a request that needs them through [FetchRequestClerk](./FetchRequestClerk.md).
