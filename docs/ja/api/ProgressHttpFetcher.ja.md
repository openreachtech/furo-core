# ProgressHttpFetcher

[BaseHttpFetcher](./BaseHttpFetcher.ja.md) を継承します。`Request` を `XMLHttpRequest` 経由で実行し、`Response` へ解決します。`fetch()` では取得できないアップロードの進捗も含め、アップロード・ダウンロード双方の進捗を通知します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。任意の `httpRequest` を受け取ります。既定値は新しい `XMLHttpRequest` です。任意の `timeout`（ミリ秒）も受け取り、既定値は `httpRequest` の `timeout` です。`0` は無制限に待ちます。 |
| `.createXMLHttpRequest()` | リクエストに使用する `XMLHttpRequest` を生成します。 |
| `.createRequestBody()` | `Request` のボディを `Blob` として読み取ります。ボディを持たないメソッドでは `null` になります。 |
| `.isBodyRequiredMethod()` | リクエストのメソッドがボディを送信するかどうか。 |
| `.isCredentialsIncluded()` | リクエストの `credentials` が `'include'` かどうか。 |
| `#fetchRequest()` | `request` を送信し、任意の `sink` を通じて進捗を通知して `Response` へ解決します。 |

`#fetchRequest()` はリクエストが中断・失敗・タイムアウトした場合に `TypeError` で reject します。これは `fetch()` が同じ状況を報告する方法に揃えたものです。`sink` は `onUploadProgress` と `onDownloadProgress` を受け取ります。

`Request` は、さらに 2 つの点で `XMLHttpRequest` を動かします。`signal` はリクエストを中断し、`credentials: 'include'` は `withCredentials` を有効にします。`withCredentials` を設定済みの `XMLHttpRequest` を渡した場合、それを無効にすることはありません。レスポンスボディはサーバーが送ったバイトをそのまま保ち、`204`・`205`・`304` のレスポンスはボディを持ちません。レスポンスは `Blob` として読み取る（`responseType` は `'blob'`）ため、サブクラスはボディを `XMLHttpRequest#response` から読み取ります。`responseText` は例外を投げます。

`XMLHttpRequest` は `credentials: 'omit'`（同一オリジンの cookie を必ず送ります）、`redirect`、`mode`、`cache` を守れません。これらが必要なリクエストは [FetchHttpFetcher](./FetchHttpFetcher.ja.md) で送ります。
