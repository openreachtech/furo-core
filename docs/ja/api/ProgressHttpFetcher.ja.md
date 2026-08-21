# ProgressHttpFetcher

`Request` を `XMLHttpRequest` 経由で実行し、`Response` へ解決します。`fetch()` では取得できないアップロードの進捗も含め、アップロード・ダウンロード双方の進捗を通知します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。任意の `httpRequest` を受け取ります。既定値は新しい `XMLHttpRequest` です。 |
| `.createXMLHttpRequest()` | リクエストに使用する `XMLHttpRequest` を生成します。 |
| `.createFormDataBody()` | `Request` のボディを `FormData` インスタンスとして読み取ります。 |
| `.createFormDataFromRequest()` | `Request` から `FormData` インスタンスを構築します。 |
| `.isBodyRequiredMethod()` | リクエストのメソッドがボディを送信するかどうか。 |
| `#fetchRequest()` | `request` を送信し、任意の `sink` を通じて進捗を通知して `Response` へ解決します。 |

`#fetchRequest()` はリクエストが中断・失敗・タイムアウトした場合に `TypeError` で reject します。これは `fetch()` が同じ状況を報告する方法に揃えたものです。`sink` は `onUploadProgress` と `onDownloadProgress` を受け取ります。
