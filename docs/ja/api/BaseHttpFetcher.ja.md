# BaseHttpFetcher

HTTP フェッチャーの基底クラスです。取得の流れを持ちます。リクエストを中断するシグナルを作り、レスポンスの受信をサブクラスに任せ、必ず HTTP パーセルを返します。通信手段ごとに継承します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`request` と `config` を受け取ります。 |
| `.get:AbortSignalCtor` | シグナルの生成に使用する `AbortSignal` クラス。 |
| `.get:HttpParcelCtor` | フェッチャーが返す HTTP パーセルのクラス。オーバーライドが必須です。 |
| `.createHttpParcel()` | `.get:HttpParcelCtor` の HTTP パーセルを生成します。 |
| `#get:timeoutMilliseconds` | `config` から得る、レスポンスを待つミリ秒。`0` は制限なし。 |
| `#fetchResponse()` | レスポンスを取得し、HTTP パーセルへ解決します。reject しません。 |
| `#createAbortSignal()` | リクエスト自身のシグナルとタイムアウトで、リクエストを中断するシグナルを生成します。 |
| `#receiveResponse()` | レスポンスを受信します。オーバーライドが必須です。受信できない場合はその理由で reject します。 |
| `#createHttpParcelByResponse()` | 受信したレスポンスの HTTP パーセルを生成します。 |
| `#resolveResponseUrl()` | リダイレクト後のレスポンスの URL を解決します。オーバーライドが必須です。 |
| `#createHttpParcelByFailure()` | 失敗の HTTP パーセルを、エラーの名前（`TimeoutError`、`AbortError`、`NetworkError`）で生成します。 |
| `#createHttpParcelByUnnamedFailure()` | 名前では分からない失敗の HTTP パーセルを生成します。既定は原因不明のエラーです。 |
| `#createHttpParcelAsNetworkError()` | 通信失敗の HTTP パーセルを生成します。 |
| `#createHttpParcelAsTimeoutError()` | タイムアウトしたリクエストの HTTP パーセルを生成します。 |
| `#createHttpParcelAsAbortError()` | 中断されたリクエストの HTTP パーセルを生成します。 |
| `#createHttpParcelAsError()` | 原因不明のエラーの HTTP パーセルを生成します。 |

フェッチャーは使い捨てです。`request` と `config` を一度だけ受け取り、一度だけ取得します。`config` が持つのは、`Request` では表せない `timeoutMilliseconds` で、サブクラスごとに独自のものが加わります。
