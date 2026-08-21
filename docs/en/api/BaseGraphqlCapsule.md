# BaseGraphqlCapsule

Wraps a GraphQL response, and answers which outcome it holds. Extend one per operation to expose the response shape through named getters.

| member | description |
| :-- | :-- |
| `.create()` | Factory method wrapping a response and its parsed payload. |
| `.createAsPending()` | Factory method for a placeholder capsule before a request finishes. |
| `.createAsInvalidVariablesError()` | Factory method for variables that failed the payload's check. |
| `.createAsAbortedByHooks()` | Factory method for a request aborted by `beforeRequest`. |
| `.createAsNetworkError()` | Factory method for a request that never reached the server. |
| `.createAsJsonParseError()` | Factory method for a response body that was not valid JSON. |
| `.get:unknownErrorCode` | Error code reported when no more specific code applies. |
| `.get:invalidVariablesErrorCode` | Error code for invalid variables. |
| `.get:networkErrorCode` | Error code for a network failure. |
| `.get:jsonParseErrorCode` | Error code for a JSON parse failure. |
| `#get:content` | The response content. |
| `#get:errors` | The GraphQL errors carried by the response. |
| `#hasContent()` | Whether the response carried data. |
| `#hasError()` | Whether any error condition holds. |
| `#isPending()` | Whether this is a placeholder capsule. |
| `#hasInvalidVariablesError()` | Whether the variables failed the payload's check. |
| `#hasNetworkError()` | Whether the request never reached the server. |
| `#hasJsonParseError()` | Whether the response body could not be parsed as JSON. |
| `#hasQueryError()` | Whether the server answered with GraphQL errors. |
| `#getErrorMessage()` | A message describing the error held, if any. |
| `#extractContent()` | The response content, or `null`. |
| `#extractErrors()` | The response errors, or `null`. |
