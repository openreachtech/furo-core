# BaseRestfulApiCapsule

RESTful API のレスポンスをラップし、どの結果を保持しているかを判定します。エンドポイントごとに継承します。

| member | description |
| :-- | :-- |
| `.create()` | レスポンスとそのパース結果をラップするファクトリメソッド。 |
| `.createAsPending()` | リクエスト完了前のプレースホルダーカプセルを生成するファクトリメソッド。 |
| `.createAsInvalidParametersError()` | ペイロードの検査に失敗したパラメータを表すファクトリメソッド。 |
| `.createAsAbortedByHooks()` | `beforeRequest` により中止されたリクエストを表すファクトリメソッド。 |
| `.createAsNetworkError()` | レスポンスを受け取る前に失敗したリクエストを表すファクトリメソッド。失敗を表す HTTP パーセルを保持します。 |
| `.createAsResponseBodyParseError()` | パースできなかったレスポンスボディを表すファクトリメソッド。 |
| `.get:unknownErrorCode` | より具体的なコードが該当しない場合に報告されるエラーコード。 |
| `.get:invalidParameterHashErrorCode` | パラメータが不正な場合のエラーコード。 |
| `.get:abortErrorCode` | 中断されたリクエストのエラーコード。 |
| `.get:timeoutErrorCode` | タイムアウトしたリクエストのエラーコード。 |
| `.get:networkErrorCode` | ネットワーク障害のエラーコード。 |
| `.get:responseBodyParseErrorCode` | ボディのパース失敗のエラーコード。 |
| `#responseParcel` | レスポンス、またはフェッチャーのエラーを保持する HTTP パーセル。リクエストを送っていないカプセルでは `null`。 |
| `#result` | パースされたレスポンスボディ。 |
| `#get:requestMethod` | リクエストが使用した HTTP メソッド。 |
| `#get:statusCode` | レスポンスのステータスコード。 |
| `#get:statusText` | レスポンスのステータステキスト。 |
| `#hasError()` | いずれかのエラー条件が成立しているかどうか。 |
| `#isPending()` | プレースホルダーカプセルかどうか。 |
| `#hasInvalidParameterHashError()` | パラメータがペイロードの検査に失敗したかどうか。 |
| `#hasAbortError()` | リクエストが中断されたかどうか。 |
| `#hasTimeoutError()` | リクエストがタイムアウトしたかどうか。 |
| `#hasNetworkError()` | 中断とタイムアウト以外の理由でリクエストが失敗した、または送信されなかったかどうか。 |
| `#hasResponseBodyParseError()` | レスポンスボディをパースできなかったかどうか。 |
| `#hasStatusCodeError()` | レスポンスが 4xx または 5xx のステータスを返したかどうか。 |
| `#hasResultError()` | パースされたボディがアプリケーションレベルのエラーを報告したかどうか。 |
| `#getErrorMessage()` | 保持しているエラーを説明するメッセージ。 |
