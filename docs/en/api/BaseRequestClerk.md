# BaseRequestClerk

Base class for sending a `Request` and building its `Response`. A clerk serves one request: it holds the `request`, the `config`, and the `sink`, and every subclass takes the same input and builds the response through the same `#buildResponse()`. `XMLHttpRequestClerk` and `FetchRequestClerk` extend it.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `request`, an optional `config`, and an optional `sink`. |
| `.validateResponseType()` | Throws a `TypeError` unless `responseType` is `''`, `'text'`, `'blob'`, or `'arraybuffer'`, the types whose body `Response` takes as it is. |
| `.resolveWithCredentials()` | Resolves the default of `withCredentials`, which is `true` when `credentials` of the request is `'include'`. |
| `.buildNetworkError()` | Builds the `TypeError` that every subclass rejects with: `Network request aborted`, `failed`, or `timed out`, with the original error as `cause`. |
| `#buildResponse()` | Sends the request and resolves to its `Response`. Must be overridden. |

The `config` takes `timeout` in milliseconds (default `0`, which waits without limit), `responseType` (default `''`, one of `''`, `'text'`, `'blob'`, or `'arraybuffer'`), and `withCredentials` (default from `.resolveWithCredentials()`). `.create()` fills in what the `config` leaves out, and the constructor applies no defaults.

The `sink` takes `onUploadProgress` and `onDownloadProgress`, which a clerk that cannot report progress leaves unread.
