# BaseRestfulApiLauncher

Binds a payload class to a capsule class, and launches the request. Extend one per application to supply the base URL, then one per endpoint to bind the pair.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes an optional `config` overriding `.get:restfulApiConfig`. |
| `.get:restfulApiConfig` | Configuration carrying `BASE_URL`. Must be overridden. |
| `.get:Payload` | The payload class for this endpoint. Must be overridden. |
| `.get:Capsule` | The capsule class for this endpoint. Must be overridden. |
| `.get:ResponseBodyParser` | The parser applied to the response body. Defaults to `JsonResponseBodyParser`. |
| `.get:fetch` | The fetch function used for the request. |
| `.createHttpFetcher()` | Creates the progress-reporting fetcher used for the request. |
| `.createResponseBodyParser()` | Creates a parser of `.get:ResponseBodyParser`. |
| `.createPayload()` | Creates a payload of `.get:Payload`. |
| `.createPayloadWithFormValueHash()` | Creates a payload from a `<form>` value hash. |
| `.createCapsule()` | Creates a capsule of `.get:Capsule`. |
| `.createCapsuleAsPending()` | Creates a placeholder capsule. |
| `.createCapsuleAsInvalidParametersError()` | Creates a capsule reporting invalid parameters. |
| `.createCapsuleAsAbortedByHooks()` | Creates a capsule reporting an abort by `beforeRequest`. |
| `.createCapsuleAsNetworkError()` | Creates a capsule reporting a network failure. |
| `.createCapsuleAsResponseBodyParseError()` | Creates a capsule reporting a body parse failure. |
| `#get:baseUrl` | The base URL taken from the configuration. |
| `#launchRequest()` | Sends the request and resolves to a capsule. Takes `payload` and optional `hooks`; never throws on a failed request. |

`#launchRequest()` accepts the hooks `beforeRequest`, `afterRequest`, `onUploadProgress` and `onDownloadProgress`. Returning a truthy value from `beforeRequest` aborts the request.
