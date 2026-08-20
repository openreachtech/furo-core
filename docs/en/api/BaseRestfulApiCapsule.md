# BaseRestfulApiCapsule

Wraps a RESTful API response, and answers which outcome it holds. Extend one per endpoint.

| member | description |
| :-- | :-- |
| `.create()` | Factory method wrapping a response and its parsed result. |
| `.createAsPending()` | Factory method for a placeholder capsule before a request finishes. |
| `.createAsInvalidParametersError()` | Factory method for parameters that failed the payload's check. |
| `.createAsAbortedByHooks()` | Factory method for a request aborted by `beforeRequest`. |
| `.createAsNetworkError()` | Factory method for a request that never reached the server. |
| `.createAsResponseBodyParseError()` | Factory method for a response body that could not be parsed. |
| `.get:unknownErrorCode` | Error code reported when no more specific code applies. |
| `.get:invalidParameterHashErrorCode` | Error code for invalid parameters. |
| `.get:networkErrorCode` | Error code for a network failure. |
| `.get:responseBodyParseErrorCode` | Error code for a body parse failure. |
| `#result` | The parsed response body. |
| `#get:requestMethod` | The HTTP method the request used. |
| `#get:statusCode` | The response status code. |
| `#get:statusText` | The response status text. |
| `#hasError()` | Whether any error condition holds. |
| `#isPending()` | Whether this is a placeholder capsule. |
| `#hasInvalidParameterHashError()` | Whether the parameters failed the payload's check. |
| `#hasNetworkError()` | Whether the request never reached the server. |
| `#hasResponseBodyParseError()` | Whether the response body could not be parsed. |
| `#hasStatusCodeError()` | Whether the response carried a 4xx or 5xx status. |
| `#hasResultError()` | Whether the parsed body reported an application-level error. |
| `#getErrorMessage()` | A message describing the error held, if any. |
