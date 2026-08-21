# BaseRestfulApiCapsule

RESTful API のレスポンスをラップし、どの結果を保持しているかを判定します。エンドポイントごとに継承します。

| member | description |
| :-- | :-- |
| `.create()` | レスポンスとそのパース結果をラップするファクトリメソッド。 |
| `.createAsPending()` | リクエスト完了前のプレースホルダーカプセルを生成するファクトリメソッド。 |
| `.createAsInvalidParametersError()` | ペイロードの検査に失敗したパラメータを表すファクトリメソッド。 |
| `.createAsAbortedByHooks()` | `beforeRequest` により中止されたリクエストを表すファクトリメソッド。 |
| `.createAsNetworkError()` | サーバーに到達しなかったリクエストを表すファクトリメソッド。 |
| `.createAsResponseBodyParseError()` | パースできなかったレスポンスボディを表すファクトリメソッド。 |
| `.get:unknownErrorCode` | より具体的なコードが該当しない場合に報告されるエラーコード。 |
| `.get:invalidParameterHashErrorCode` | パラメータが不正な場合のエラーコード。 |
| `.get:networkErrorCode` | ネットワーク障害のエラーコード。 |
| `.get:responseBodyParseErrorCode` | ボディのパース失敗のエラーコード。 |
| `#result` | パースされたレスポンスボディ。 |
| `#get:requestMethod` | リクエストが使用した HTTP メソッド。 |
| `#get:statusCode` | レスポンスのステータスコード。 |
| `#get:statusText` | レスポンスのステータステキスト。 |
| `#hasError()` | いずれかのエラー条件が成立しているかどうか。 |
| `#isPending()` | プレースホルダーカプセルかどうか。 |
| `#hasInvalidParameterHashError()` | パラメータがペイロードの検査に失敗したかどうか。 |
| `#hasNetworkError()` | リクエストがサーバーに到達しなかったかどうか。 |
| `#hasResponseBodyParseError()` | レスポンスボディをパースできなかったかどうか。 |
| `#hasStatusCodeError()` | レスポンスが 4xx または 5xx のステータスを返したかどうか。 |
| `#hasResultError()` | パースされたボディがアプリケーションレベルのエラーを報告したかどうか。 |
| `#getErrorMessage()` | 保持しているエラーを説明するメッセージ。 |
