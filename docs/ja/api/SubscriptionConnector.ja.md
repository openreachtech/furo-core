# SubscriptionConnector

サブスクリプションが共有する WebSocket 接続を保持し、そのライフサイクルをリスナー登録可能なイベントとして公開します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`WEBSOCKET_URL` を保持する `config` を受け取ります。 |
| `.createEventTarget()` | ライフサイクルイベントを保持するイベントターゲットを生成します。 |
| `.createWebSocketClient()` | 内部で用いる `graphql-ws` クライアントを生成します。 |
| `.createCustomEvent()` | ライフサイクルイベントを生成します。 |
| `.generateWebSocketSink()` | サブスクライバーへメッセージを転送する sink を構築します。 |
| `.get:graphqlWsCore` | コネクタの基盤となる `graphql-ws` モジュール。 |
| `#subscribe()` | ペイロードをサブスクライブし、そのサブスクリプションを解除する関数を返します。 |
| `#unsubscribe()` | 接続を閉じます。 |
| `#addLifecycleListener()` | ライフサイクルイベントのハンドラーを登録します。コネクタ自身を返すため、メソッドチェーンが可能です。 |
| `#removeLifecycleListener()` | 登録済みのハンドラーを解除します。 |

ライフサイクルイベントは `connecting`・`opened`・`connected`・`message`・`closed`・`error`・`ping`・`pong` です。
