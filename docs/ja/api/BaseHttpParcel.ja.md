# BaseHttpParcel

フェッチャーが返すものです。リクエスト、設定、レスポンスの URL と、レスポンスか、レスポンスを受け取れなかったフェッチャーのエラーのどちらかを保持します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`request` と `config` を受け取り、任意で `response`、`responseUrl`、`fetcherError` を受け取ります。 |
| `.createAsError()` | レスポンスを伴わないエラーを表すファクトリメソッド。任意の `fetcherError` を受け取ります。既定値は原因不明のエラーです。 |
| `.createAsNetworkError()` | 通信失敗を表すファクトリメソッド。 |
| `.createAsTimeoutError()` | タイムアウトしたリクエストを表すファクトリメソッド。 |
| `.createAsAbortError()` | 中断されたリクエストを表すファクトリメソッド。 |
| `.get:HTTP_FETCHER_ERROR` | フェッチャーのエラー。`NETWORK`、`TIMEOUT`、`ABORT`、`UNKNOWN` です。 |
| `#get:requestUrl` | リクエストの URL。 |
| `#get:status` | レスポンスのステータスコード。受信していない場合は `null`。 |
| `#get:statusText` | レスポンスのステータステキスト。受信していない場合は `null`。 |
| `#get:ok` | ステータスが 200 から 299 の範囲かどうか。 |
| `#hasError()` | エラーのためにレスポンスを受信できなかったかどうか。 |
| `#hasNetworkError()` | 通信失敗のためにレスポンスを受信できなかったかどうか。 |
| `#hasTimeoutError()` | リクエストがタイムアウトしたためにレスポンスを受信できなかったかどうか。 |
| `#hasAbortError()` | リクエストが中断されたためにレスポンスを受信できなかったかどうか。 |
| `#hasUnknownError()` | 原因不明の理由でレスポンスを受信できなかったかどうか。 |
| `#toJson()` | ボディを JSON として読み取ります。 |
| `#cloneResponse()` | ボディを読み直せるようにする、レスポンスの複製。 |
| `#toText()` | ボディをテキストとして読み取ります。 |
| `#toArrayBuffer()` | ボディを配列バッファとして読み取ります。 |
| `#toBlob()` | ボディを `Blob` として読み取ります。 |
| `#isRedirected()` | レスポンスがリダイレクトの結果かどうか。オーバーライドが必須です。 |
| `#extractResponseType()` | レスポンスの種類。オーバーライドが必須です。 |

レスポンスを読むメンバーは、レスポンスを受信していない場合は `null` を返します。`#toJson()`、`#toText()`、`#toArrayBuffer()`、`#toBlob()` で読むボディは複製から読むので、パーセルは繰り返し読めます。
