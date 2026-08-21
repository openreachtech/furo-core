# BaseSubscriptionGraphqlCapsule

Wraps one published subscription message, and answers which outcome it holds. Extend one per subscription.

| member | description |
| :-- | :-- |
| `.create()` | Factory method wrapping a published message. |
| `.createAsPending()` | Factory method for a placeholder capsule before the first message. |
| `.createAsInvalidVariablesError()` | Factory method for variables that failed the payload's check. |
| `.createAsAbortedByHooks()` | Factory method for a subscription aborted by a hook. |
| `.createAsNetworkError()` | Factory method for a connection failure. |
| `.get:unknownErrorCode` | Error code reported when no more specific code applies. |
| `.get:invalidVariablesErrorCode` | Error code for invalid variables. |
| `.get:networkErrorCode` | Error code for a connection failure. |
| `#get:content` | The published content. |
| `#get:errors` | The GraphQL errors carried by the message. |
| `#hasContent()` | Whether the message carried data. |
| `#hasError()` | Whether any error condition holds. |
| `#isPending()` | Whether this is a placeholder capsule. |
| `#hasInvalidVariablesError()` | Whether the variables failed the payload's check. |
| `#hasNetworkError()` | Whether the connection failed. |
| `#hasQueryError()` | Whether the server answered with GraphQL errors. |
| `#getErrorMessage()` | A message describing the error held, if any. |
| `#extractContent()` | The published content, or `null`. |
| `#extractErrors()` | The message errors, or `null`. |
