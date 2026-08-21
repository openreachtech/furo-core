# BaseGraphqlSubscriber

Binds a subscription payload class to a capsule class, and subscribes over a shared connector. Extend one per subscription.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `connector` carrying the WebSocket connection. |
| `.get:Payload` | The subscription payload class. Must be overridden. |
| `.get:Capsule` | The subscription capsule class. Must be overridden. |
| `.createPayload()` | Creates a payload of `.get:Payload`. |
| `.createPayloadWithValueHash()` | Creates a payload from a flat value hash. |
| `.createCapsule()` | Creates a capsule of `.get:Capsule`. |
| `.createCapsuleAsPending()` | Creates a placeholder capsule. |
| `.createCapsuleAsInvalidVariablesError()` | Creates a capsule reporting invalid variables. |
| `.createCapsuleAsAbortedByHooks()` | Creates a capsule reporting an abort by a hook. |
| `.createCapsuleAsNetworkError()` | Creates a capsule reporting a connection failure. |
| `#subscribe()` | Starts the subscription. Takes `payload` and `hooks`; replaces any subscription already running on this subscriber. |
| `#unsubscribe()` | Stops the subscription. |

`#subscribe()` accepts the hooks `onPublish`, `onDisconnected` and `onTerminate`. A dropped connection is retried after a delay.
