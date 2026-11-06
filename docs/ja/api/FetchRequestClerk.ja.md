# FetchRequestClerk

[BaseRequestClerk](./BaseRequestClerk.ja.md) を継承します。`fetch()` で `Response` を組み立てます。リクエストは作られたまま送られるため、`mode`・`cache`・`redirect` は守られます。

| member | description |
| :-- | :-- |
| `.fetch()` | ネイティブの `fetch()` を呼び出します。通信手段を差し替えるにはオーバーライドします。 |
| `.buildTimeoutSignal()` | `timeout` の後に中断する `AbortSignal` を生成します。 |
| `.buildAnySignal()` | 複数のシグナルに従う `AbortSignal` を生成します。 |
| `.waitForResponseBody()` | `Response` の body の読み込み完了を待ちます。読み込み中の失敗も、失敗したリクエストと同じく reject します。 |
| `#buildResponse()` | `request` の複製を送信するため、元の body は未読のままです。`XMLHttpRequestClerk` と同じく、body の読み込み後に `fetch()` の `Response` へ解決します。 |

`#buildResponse()` はリクエストの `signal` で中断し、`timeout` が `0` より大きいときは `timeout` の後にも中断します。`withCredentials` は `XMLHttpRequest` と同じくクロスオリジンの cookie を決めます。`true` なら `'include'` を送り、`false` ならリクエストの `'include'` を `'same-origin'` に下げます。`withCredentials` が既定値のままなら、`.resolveWithCredentials()` が `false` を返すため、リクエストの `credentials: 'omit'` は守られます。

`XMLHttpRequestClerk` と同じく、`.buildNetworkError()` の `TypeError` で reject します。リクエストの `signal` で中断されたら `Network request aborted`、`timeout` を過ぎたら `Network request timed out`、それ以外は `Network request failed` です。`fetch()` のエラーは `cause` に残ります。`responseType` は無視し、進捗も通知しないため、`sink` は読み取りません。

`AbortSignal.any()` と `AbortSignal.timeout()` が必要です。主要ブラウザはすべて 2024 年 3 月から対応しています。
