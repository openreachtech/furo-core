# XMLHttpRequestClerk

[BaseRequestClerk](./BaseRequestClerk.ja.md) を継承します。`XMLHttpRequest` 経由で `Response` を組み立て、`fetch()` では取得できないアップロードの進捗も含め、アップロード・ダウンロード双方の進捗を `sink` へ通知します。`#buildResponse()` のたびに新しい `XMLHttpRequest` を生成します。

| member | description |
| :-- | :-- |
| `.createXMLHttpRequest()` | `config` の `timeout`・`responseType`・`withCredentials` を設定した `XMLHttpRequest` を生成します。 |
| `.buildRequestBody()` | `Request` のボディを `Blob` として読み取ります。ボディを持たないメソッドでは `null` になります。 |
| `.isBodyRequiredMethod()` | リクエストのメソッドがボディを送信するかどうか。 |
| `.isNullBodyStatus()` | レスポンスのステータスがボディを持たないかどうか（`101`・`103`・`204`・`205`・`304`）。 |
| `.buildResponseByHttpRequest()` | ロード済みの `XMLHttpRequest` から `Response` を組み立てます。 |
| `#buildResponse()` | `request` を送信し、`sink` を通じて進捗を通知して `Response` へ解決します。 |

`#buildResponse()` はリクエストが中断・失敗・タイムアウトした場合に `TypeError` で reject します。これは `fetch()` が失敗したリクエストを報告する方法に揃えたものです。リクエストの `signal` で中断できます。`sink` は `onUploadProgress` と `onDownloadProgress` を受け取ります。

`Response` のボディは `XMLHttpRequest#response` です。`responseType` が `''` の間はサーバーが送ったテキストで、ボディを持たないステータスでは `null` です。`responseType` が `''` 以外のとき `responseText` は例外を投げるため、サブクラスはボディを `XMLHttpRequest#response` から読み取ります。

`XMLHttpRequest` は `credentials: 'omit'`（同一オリジンの cookie を必ず送ります）、`redirect`、`mode`、`cache` を守れません。これらが必要なリクエストは [FetchRequestClerk](./FetchRequestClerk.ja.md) で送ります。
