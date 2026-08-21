# ProgressHttpFetcher

Performs a `Request` over `XMLHttpRequest` and resolves to a `Response`, reporting upload and download progress — which `fetch()` cannot do for uploads.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes an optional `httpRequest`, defaulting to a new `XMLHttpRequest`. |
| `.createXMLHttpRequest()` | Creates the `XMLHttpRequest` used for the request. |
| `.createFormDataBody()` | Reads a `Request` body into a `FormData` instance. |
| `.createFormDataFromRequest()` | Builds a `FormData` instance from a `Request`. |
| `.isBodyRequiredMethod()` | Whether a request's method sends a body. |
| `#fetchRequest()` | Sends the `request`, reporting progress through the optional `sink`, and resolves to a `Response`. |

`#fetchRequest()` rejects with a `TypeError` when the request is aborted, fails, or times out — matching how `fetch()` reports the same conditions. The `sink` accepts `onUploadProgress` and `onDownloadProgress`.
