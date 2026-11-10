# BaseRestfulApiCapsule

Wraps a RESTful API response, and answers which outcome it holds. Extend one per endpoint.

| member | description |
| :-- | :-- |
| `.create()` | Factory method wrapping a response and its parsed result. |
| `.createAsPending()` | Factory method for a placeholder capsule before a request finishes. |
| `.createAsInvalidParametersError()` | Factory method for parameters that failed the payload's check. |
| `.createAsAbortedByHooks()` | Factory method for a request aborted by `beforeRequest`. |
| `.createAsNetworkError()` | Factory method for a request that failed before a response was received, which carries the HTTP parcel of the failure. |
| `.createAsResponseBodyParseError()` | Factory method for a response body that could not be parsed. |
| `.get:unknownErrorCode` | Error code reported when no more specific code applies. |
| `.get:invalidParameterHashErrorCode` | Error code for invalid parameters. |
| `.get:abortErrorCode` | Error code for an aborted request. |
| `.get:timeoutErrorCode` | Error code for a timed out request. |
| `.get:networkErrorCode` | Error code for a network failure. |
| `.get:responseBodyParseErrorCode` | Error code for a body parse failure. |
| `#responseParcel` | The HTTP parcel that carries the response or the error of the fetcher, or `null` for a capsule that sent no request. |
| `#result` | The parsed response body. |
| `#get:requestMethod` | The HTTP method the request used. |
| `#get:statusCode` | The response status code. |
| `#get:statusText` | The response status text. |
| `#hasError()` | Whether any error condition holds. |
| `#isPending()` | Whether this is a placeholder capsule. |
| `#hasInvalidParameterHashError()` | Whether the parameters failed the payload's check. |
| `#hasAbortError()` | Whether the request was aborted. |
| `#hasTimeoutError()` | Whether the request timed out. |
| `#hasNetworkError()` | Whether the request failed for any reason other than an abortion and a timeout, or was never sent. |
| `#hasResponseBodyParseError()` | Whether the response body could not be parsed. |
| `#hasStatusCodeError()` | Whether the response carried a 4xx or 5xx status. |
| `#hasResultError()` | Whether the parsed body reported an application-level error. |
| `#getErrorMessage()` | A message describing the error held, if any. |
