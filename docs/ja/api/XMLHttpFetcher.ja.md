# XMLHttpFetcher

`XMLHttpRequest` 経由でリクエストを送信し、`sink` を通じてアップロードとダウンロードの進捗を通知する HTTP フェッチャーです。レスポンスボディは配列バッファとして受信し、全体が届いてから `Response` を組み立てます。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`request`、`config`、任意の `requestClerk` を受け取ります。既定値は新しい `XMLHttpRequest` の係です。 |
| `.get:XMLHttpRequestClerkCtor` | `XMLHttpRequest` の係のクラス。 |
| `.get:HeadersParserCtor` | 生のヘッダーテキストをパースするクラス。 |
| `.get:HttpParcelCtor` | `XMLHttpParcel` を返します。 |
| `.createXMLHttpRequestClerk()` | `XMLHttpRequest` の係を生成します。 |
| `.createHeadersParser()` | 生のヘッダーテキストのパーサーを生成します。 |
| `.createRequestBody()` | `Request` のボディを `Blob` として読み取ります。ボディを持たないメソッドでは `null` になります。 |
| `.isBodyRequiredMethod()` | リクエストのメソッドがボディを送信するかどうか。 |
| `.isNullBodyStatus()` | ボディを持たないレスポンスのステータスかどうか。 |
| `#receiveResponse()` | リクエストを送信し、`sink` へ進捗を通知して、組み立てた `Response` へ解決します。シグナルが中断した場合はそのシグナルの理由で、通信が失敗した場合は `NetworkError` という名前のエラーで reject します。 |
| `#setupRequestClerk()` | 係にリクエストを設定します。メソッド、URL、レスポンスの種類、認証情報、ヘッダーです。 |
| `#shouldSendCredentials()` | リクエストの認証情報モードが `include` かどうか。 |
| `#buildClerkSink()` | 係がイベントを通知するシンクを組み立てます。 |
| `#createResponse()` | 係が受信したものから `Response` を生成します。 |
| `#extractResponseBody()` | レスポンスボディ。ボディを持たないレスポンスでは `null`。 |
| `#resolveResponseUrl()` | `XMLHttpRequest` が報告するレスポンスの URL。 |
| `#invokeSend()` | 係を通じてリクエストを送信します。 |

インスタンスは係を 1 つ持つので、取得は一度だけです。タイムアウトは中断用のシグナルで数え、`XMLHttpRequest#timeout` は使いません。
