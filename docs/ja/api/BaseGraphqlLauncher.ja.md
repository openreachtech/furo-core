# BaseGraphqlLauncher

ペイロードクラスとカプセルクラスを結び付け、リクエストを送信します。アプリケーションごとに継承してエンドポイントを与え、さらにオペレーションごとに継承して両者を結び付けます。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`.get:graphqlConfig` を上書きする任意の `config` を受け取ります。 |
| `.get:graphqlConfig` | `ENDPOINT_URL` と `WEBSOCKET_URL` を保持する設定。オーバーライドが必須です。 |
| `.get:Payload` | このオペレーションのペイロードクラス。オーバーライドが必須です。 |
| `.get:Capsule` | このオペレーションのカプセルクラス。オーバーライドが必須です。 |
| `.get:fetch` | リクエストに使用される fetch 関数。 |
| `.createHttpFetcher()` | リクエストに使用する進捗通知付きフェッチャーを生成します。 |
| `.createPayload()` | 変数とオプションから `.get:Payload` のペイロードを生成します。 |
| `.createPayloadWithValueHash()` | フラットな値ハッシュからペイロードを生成します。 |
| `.createPayloadWithFormValueHash()` | `<form>` の値ハッシュからペイロードを生成します。 |
| `.createCapsule()` | レスポンスから `.get:Capsule` のカプセルを生成します。 |
| `.createCapsuleAsPending()` | プレースホルダーカプセルを生成します。 |
| `.createCapsuleAsInvalidVariablesError()` | 変数が不正であることを報告するカプセルを生成します。 |
| `.createCapsuleAsAbortedByHooks()` | `beforeRequest` による中止を報告するカプセルを生成します。 |
| `.createCapsuleAsNetworkError()` | ネットワーク障害を報告するカプセルを生成します。 |
| `.createCapsuleAsJsonParseError()` | JSON パース失敗を報告するカプセルを生成します。 |
| `#get:endpointUrl` | 設定から取得したエンドポイント URL。 |
| `#launchRequest()` | リクエストを送信し、カプセルへ解決します。`payload` と任意の `hooks` を受け取り、リクエスト失敗時に例外を投げません。 |

`#launchRequest()` は `beforeRequest`・`afterRequest`・`onUploadProgress`・`onDownloadProgress` のフックを受け取ります。`beforeRequest` が真値を返すとリクエストは中止されます。
