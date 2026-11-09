# AbortTimer

タイムアウトが経過するとリクエストを中断するタイマーです。そのシグナルは、リクエスト自身のシグナルと、タイムアウトがあればタイムアウトによって中断されます。`AbortSignal.timeout()` と違って取り消せるので、レスポンスがすでに終えたものを中断することはありません。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`requestSignal` と `timeoutMilliseconds` を受け取り、数え始めます。`0` はタイマーなしで、シグナルはリクエストのものです。 |
| `.get:AbortControllerCtor` | `AbortController` クラス。 |
| `.get:AbortSignalCtor` | `AbortSignal` クラス。 |
| `.get:DOMExceptionCtor` | `DOMException` クラス。 |
| `.get:setTimeout` | タイマーを始動する関数。 |
| `.get:clearTimeout` | タイマーを止める関数。 |
| `.createAbortController()` | `AbortController` を生成します。 |
| `.createSignal()` | リクエストとタイマーのコントローラーの両方が中断するシグナルを生成します。 |
| `.createTimeoutReason()` | タイマーが中断に使う、`TimeoutError` という名前の `DOMException` を生成します。 |
| `.startTimer()` | コントローラーを中断するタイマーを始動します。 |
| `#clear()` | タイマーを止めます。この呼び出しのあとは、タイムアウトがシグナルを中断することはありません。 |

インスタンスは使い捨てです。生成した時点から数え、`#clear()` で止まります。`BaseHttpFetcher` は取得が終わった時点でこれを止めます。
