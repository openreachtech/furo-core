# BaseHttpFetcher

HTTP フェッチャーの基底クラスです。取得の流れを持ちます。リクエストを中断するタイマーを始動し、レスポンスの受信をサブクラスに任せ、必ず HTTP パーセルを返します。通信手段ごとに継承します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`request` と `config` を受け取ります。 |
| `.get:AbortTimerCtor` | リクエストを中断するタイマーの生成に使用する `AbortTimer` クラス。 |
| `.get:HttpParcelCtor` | フェッチャーが返す HTTP パーセルのクラス。オーバーライドが必須です。 |
| `.createHttpParcel()` | `.get:HttpParcelCtor` の HTTP パーセルを生成します。 |
| `#get:timeoutMilliseconds` | `config` から得る、レスポンスを待つミリ秒。`0` は制限なし。 |
| `#fetchResponse()` | レスポンスを取得し、HTTP パーセルへ解決します。タイマーを生成できない場合も含め、reject しません。 |
| `#fetchResponseUnderTimer()` | タイマーがタイムアウトを数えている間に `#receiveHttpParcel()` を呼び、終わった時点でタイマーを止めます。失敗は `#resolveFailure()` を通して投げ直します。 |
| `#resolveFailure()` | シグナルが中断していればその理由を、そうでなければエラーを返します。Safari は中断したボディのダウンロードを汎用の `AbortError` で reject するので、理由でタイムアウトと中断を区別します。 |
| `#receiveHttpParcel()` | レスポンスを受信し、そのパーセルを作ります。サブクラスはタイマー内で待つ処理を足すためにオーバーライドします。 |
| `#createAbortTimer()` | リクエスト自身のシグナルとタイムアウトで、リクエストを中断する `AbortTimer` を生成します。 |
| `#receiveResponse()` | レスポンスを受信します。オーバーライドが必須です。受信できない場合はその理由で reject します。パーセルがタイマーの動いている間にボディを待つので、ヘッダーの受信で解決して構いません。 |
| `#createHttpParcelByResponse()` | 受信したレスポンスの HTTP パーセルを生成します。 |
| `#resolveResponseUrl()` | リダイレクト後のレスポンスの URL を解決します。オーバーライドが必須です。 |
| `#createHttpParcelByFailure()` | 失敗の HTTP パーセルを生成します。リクエストのシグナルが中断している間の失敗は、理由が何であっても中断です。それ以外はエラーの名前（`TimeoutError`、`AbortError`、`NetworkError`）で決めます。 |
| `#createHttpParcelByUnnamedFailure()` | 名前では分からない失敗の HTTP パーセルを生成します。既定は原因不明のエラーです。 |
| `#createHttpParcelAsNetworkError()` | 通信失敗の HTTP パーセルを生成します。 |
| `#createHttpParcelAsTimeoutError()` | タイムアウトしたリクエストの HTTP パーセルを生成します。 |
| `#createHttpParcelAsAbortError()` | 中断されたリクエストの HTTP パーセルを生成します。 |
| `#createHttpParcelAsError()` | 原因不明のエラーの HTTP パーセルを生成します。 |

フェッチャーは使い捨てです。`request` と `config` を一度だけ受け取り、一度だけ取得します。`config` が持つのは、`Request` では表せない `timeoutMilliseconds` で、サブクラスごとに独自のものが加わります。
