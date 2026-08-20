# BaseRestfulApiLauncher

ペイロードクラスとカプセルクラスを結び付け、リクエストを送信します。アプリケーションごとに継承してベース URL を与え、さらにエンドポイントごとに継承して両者を結び付けます。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`.get:restfulApiConfig` を上書きする任意の `config` を受け取ります。 |
| `.get:restfulApiConfig` | `BASE_URL` を保持する設定。オーバーライドが必須です。 |
| `.get:Payload` | このエンドポイントのペイロードクラス。オーバーライドが必須です。 |
| `.get:Capsule` | このエンドポイントのカプセルクラス。オーバーライドが必須です。 |
| `.get:ResponseBodyParser` | レスポンスボディに適用されるパーサー。既定値は `JsonResponseBodyParser` です。 |
| `.get:fetch` | リクエストに使用される fetch 関数。 |
| `.createHttpFetcher()` | リクエストに使用する進捗通知付きフェッチャーを生成します。 |
| `.createResponseBodyParser()` | `.get:ResponseBodyParser` のパーサーを生成します。 |
| `.createPayload()` | `.get:Payload` のペイロードを生成します。 |
| `.createPayloadWithFormValueHash()` | `<form>` の値ハッシュからペイロードを生成します。 |
| `.createCapsule()` | `.get:Capsule` のカプセルを生成します。 |
| `.createCapsuleAsPending()` | プレースホルダーカプセルを生成します。 |
| `.createCapsuleAsInvalidParametersError()` | パラメータが不正であることを報告するカプセルを生成します。 |
| `.createCapsuleAsAbortedByHooks()` | `beforeRequest` による中止を報告するカプセルを生成します。 |
| `.createCapsuleAsNetworkError()` | ネットワーク障害を報告するカプセルを生成します。 |
| `.createCapsuleAsResponseBodyParseError()` | ボディのパース失敗を報告するカプセルを生成します。 |
| `#get:baseUrl` | 設定から取得したベース URL。 |
| `#launchRequest()` | リクエストを送信し、カプセルへ解決します。`payload` と任意の `hooks` を受け取り、リクエスト失敗時に例外を投げません。 |

`#launchRequest()` は `beforeRequest`・`afterRequest`・`onUploadProgress`・`onDownloadProgress` のフックを受け取ります。`beforeRequest` が真値を返すとリクエストは中止されます。
