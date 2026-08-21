# SubscriptionConnector

Owns the WebSocket connection that subscriptions share, and exposes its lifecycle as listenable events.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes a `config` carrying `WEBSOCKET_URL`. |
| `.createEventTarget()` | Creates the event target carrying the lifecycle events. |
| `.createWebSocketClient()` | Creates the underlying `graphql-ws` client. |
| `.createCustomEvent()` | Creates a lifecycle event. |
| `.generateWebSocketSink()` | Builds the sink forwarding messages to a subscriber. |
| `.get:graphqlWsCore` | The `graphql-ws` module the connector is built on. |
| `#subscribe()` | Subscribes a payload, and returns the function that unsubscribes it. |
| `#unsubscribe()` | Closes the connection. |
| `#addLifecycleListener()` | Registers a handler for a lifecycle event. Returns the connector, so calls chain. |
| `#removeLifecycleListener()` | Removes a previously registered handler. |

The lifecycle events are `connecting`, `opened`, `connected`, `message`, `closed`, `error`, `ping` and `pong`.
