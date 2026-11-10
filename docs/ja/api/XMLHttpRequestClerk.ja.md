# XMLHttpRequestClerk

`XMLHttpRequest` をラップする係です。リクエストへのプロパティの代入はすべてこれを通し、何かを設定するメソッドは係自身を返すので、呼び出しをつなげて書けます。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。任意の `xmlHttpRequest` を受け取ります。既定値は新しいものです。 |
| `.get:XMLHttpRequestCtor` | `XMLHttpRequest` クラス。 |
| `.get:requestSinkEventNameLookup` | シンクのキーごとの、リクエストのイベント名。 |
| `.get:uploadSinkEventNameLookup` | シンクのキーごとの、アップロードのイベント名。 |
| `.createXMLHttpRequest()` | `XMLHttpRequest` を生成します。 |
| `#get:status` | レスポンスのステータス。 |
| `#get:statusText` | レスポンスのステータステキスト。 |
| `#get:response` | レスポンスのボディ。 |
| `#get:responseUrl` | リダイレクト後のレスポンスの URL。 |
| `#extractAllResponseHeadersText()` | レスポンスヘッダーの生のテキスト。 |
| `#openRequest()` | リクエストを非同期として開きます。 |
| `#setResponseType()` | レスポンスの種類を設定します。 |
| `#setTimeoutMilliseconds()` | タイムアウトを設定します。 |
| `#setWithCredentials()` | クロスサイトのサーバーへ認証情報を送るかどうかを設定します。 |
| `#setRequestHeaders()` | `Headers` のすべてのヘッダーを設定します。 |
| `#addEventListener()` | リクエストのイベントのリスナーを追加します。 |
| `#addUploadEventListener()` | アップロードのイベントのリスナーを追加します。 |
| `#addSink()` | リクエストのシンクとアップロードのシンクを一度に追加します。 |
| `#addRequestSink()` | リクエストのイベントのシンクを追加します。 |
| `#addUploadSink()` | アップロードのイベントのシンクを追加します。 |
| `#sendRequest()` | ボディを付けてリクエストを送信します。 |
| `#abortRequest()` | リクエストを中断します。 |

シンクは、`onLoad`、`onError`、`onAbort`、`onDownloadProgress`、`onUploadProgress` のように、メンバー名をキーとするリスナーのハッシュです。各メンバーはそのままリスナーとして追加されるので、`this` に依存してはいけません。
