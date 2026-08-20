# BaseGraphqlPayload

Holds the query document and the request variables of one GraphQL operation, and builds the `Request` sent for it. Extend one per operation, overriding `.get:document`.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes `variables` and fetch `options`. |
| `.createWithValueHash()` | Factory method building variables from a flat value hash via `.generateVariables()`. |
| `.createWithFormValueHash()` | Factory method building variables from a `<form>` value hash, lifting out `File` values for a multipart request. |
| `.get:document` | The GraphQL query document. Must be overridden. |
| `.get:fieldHash` | Field hash used to filter the variables actually sent. |
| `.generateVariables()` | Converts a value hash into request variables. Override to map form fields onto a schema. |
| `.collectBasedHeadersOptions()` | Header hashes merged into every request. Override to attach an access token. |
| `.collectBasedFetchOptions()` | Fetch option hashes merged into every request. |
| `#createFetchRequest()` | Builds the `Request` for this payload. |
| `#isValidVariables()` | Whether the variables satisfy the payload's own check. |
| `#isInvalidVariables()` | Negation of `#isValidVariables()`. |
