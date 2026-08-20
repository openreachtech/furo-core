# BaseGraphqlSubscriber

サブスクリプションのペイロードクラスとカプセルクラスを結び付け、共有コネクタ経由でサブスクライブします。サブスクリプションごとに継承します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。WebSocket 接続を保持する `connector` を受け取ります。 |
| `.get:Payload` | サブスクリプションのペイロードクラス。オーバーライドが必須です。 |
| `.get:Capsule` | サブスクリプションのカプセルクラス。オーバーライドが必須です。 |
| `.createPayload()` | `.get:Payload` のペイロードを生成します。 |
| `.createPayloadWithValueHash()` | フラットな値ハッシュからペイロードを生成します。 |
| `.createCapsule()` | `.get:Capsule` のカプセルを生成します。 |
| `.createCapsuleAsPending()` | プレースホルダーカプセルを生成します。 |
| `.createCapsuleAsInvalidVariablesError()` | 変数が不正であることを報告するカプセルを生成します。 |
| `.createCapsuleAsAbortedByHooks()` | フックによる中止を報告するカプセルを生成します。 |
| `.createCapsuleAsNetworkError()` | 接続障害を報告するカプセルを生成します。 |
| `#subscribe()` | サブスクリプションを開始します。`payload` と `hooks` を受け取り、このサブスクライバーで実行中のサブスクリプションを置き換えます。 |
| `#unsubscribe()` | サブスクリプションを停止します。 |

`#subscribe()` は `onPublish`・`onDisconnected`・`onTerminate` のフックを受け取ります。接続が切断された場合は、一定時間後に再接続されます。
