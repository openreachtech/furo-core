# BaseGraphqlLauncher

Binds a payload class to a capsule class, and launches the request. Extend one per application to supply the endpoint, then one per operation to bind the pair.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes an optional `config` overriding `.get:graphqlConfig`. |
| `.get:graphqlConfig` | Configuration carrying `ENDPOINT_URL` and `WEBSOCKET_URL`. Must be overridden. |
| `.get:Payload` | The payload class for this operation. Must be overridden. |
| `.get:Capsule` | The capsule class for this operation. Must be overridden. |
| `.get:fetch` | The fetch function used for the request. |
| `.createHttpFetcher()` | Creates the progress-reporting fetcher used for the request. |
| `.createPayload()` | Creates a payload of `.get:Payload` from variables and options. |
| `.createPayloadWithValueHash()` | Creates a payload from a flat value hash. |
| `.createPayloadWithFormValueHash()` | Creates a payload from a `<form>` value hash. |
| `.createCapsule()` | Creates a capsule of `.get:Capsule` from a response. |
| `.createCapsuleAsPending()` | Creates a placeholder capsule. |
| `.createCapsuleAsInvalidVariablesError()` | Creates a capsule reporting invalid variables. |
| `.createCapsuleAsAbortedByHooks()` | Creates a capsule reporting an abort by `beforeRequest`. |
| `.createCapsuleAsNetworkError()` | Creates a capsule reporting a network failure. |
| `.createCapsuleAsJsonParseError()` | Creates a capsule reporting a JSON parse failure. |
| `#get:endpointUrl` | The endpoint URL taken from the configuration. |
| `#launchRequest()` | Sends the request and resolves to a capsule. Takes `payload` and optional `hooks`; never throws on a failed request. |

`#launchRequest()` accepts the hooks `beforeRequest`, `afterRequest`, `onUploadProgress` and `onDownloadProgress`. Returning a truthy value from `beforeRequest` aborts the request.
