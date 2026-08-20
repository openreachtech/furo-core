# BaseSubscriptionGraphqlPayload

Holds the subscription document and variables, and builds the payload sent over the WebSocket. Extend one per subscription, overriding `.get:document`.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes `variables` and subscription options. |
| `.createWithValueHash()` | Factory method building variables from a flat value hash. |
| `.get:document` | The GraphQL subscription document. Must be overridden. |
| `.get:fieldHash` | Field hash used to filter the variables actually sent. |
| `.generateVariables()` | Converts a value hash into subscription variables. |
| `.collectBasedSubscriptionPayloadOptions()` | Payload option hashes merged into every subscription. |
| `.collectBasedSubscriptionContextOptions()` | Context option hashes merged into every subscription. |
| `.collectBasedHeadersOptions()` | Header hashes merged into the connection context. |
| `#buildSubscriptionPayload()` | Builds the payload sent over the WebSocket. |
| `#isValidVariables()` | Whether the variables satisfy the payload's own check. |
| `#isInvalidVariables()` | Negation of `#isValidVariables()`. |
