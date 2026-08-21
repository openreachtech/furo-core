# BaseGraphqlCapsule

GraphQL のレスポンスをラップし、どの結果を保持しているかを判定します。オペレーションごとに継承し、名前付きゲッターでレスポンスの構造を公開します。

| member | description |
| :-- | :-- |
| `.create()` | レスポンスとそのパース結果をラップするファクトリメソッド。 |
| `.createAsPending()` | リクエスト完了前のプレースホルダーカプセルを生成するファクトリメソッド。 |
| `.createAsInvalidVariablesError()` | ペイロードの検査に失敗した変数を表すファクトリメソッド。 |
| `.createAsAbortedByHooks()` | `beforeRequest` により中止されたリクエストを表すファクトリメソッド。 |
| `.createAsNetworkError()` | サーバーに到達しなかったリクエストを表すファクトリメソッド。 |
| `.createAsJsonParseError()` | レスポンスボディが妥当な JSON でなかった場合のファクトリメソッド。 |
| `.get:unknownErrorCode` | より具体的なコードが該当しない場合に報告されるエラーコード。 |
| `.get:invalidVariablesErrorCode` | 変数が不正な場合のエラーコード。 |
| `.get:networkErrorCode` | ネットワーク障害のエラーコード。 |
| `.get:jsonParseErrorCode` | JSON パース失敗のエラーコード。 |
| `#get:content` | レスポンスのコンテンツ。 |
| `#get:errors` | レスポンスが保持する GraphQL エラー。 |
| `#hasContent()` | レスポンスがデータを保持しているかどうか。 |
| `#hasError()` | いずれかのエラー条件が成立しているかどうか。 |
| `#isPending()` | プレースホルダーカプセルかどうか。 |
| `#hasInvalidVariablesError()` | 変数がペイロードの検査に失敗したかどうか。 |
| `#hasNetworkError()` | リクエストがサーバーに到達しなかったかどうか。 |
| `#hasJsonParseError()` | レスポンスボディを JSON としてパースできなかったかどうか。 |
| `#hasQueryError()` | サーバーが GraphQL エラーを返したかどうか。 |
| `#getErrorMessage()` | 保持しているエラーを説明するメッセージ。 |
| `#extractContent()` | レスポンスのコンテンツ。存在しない場合は `null`。 |
| `#extractErrors()` | レスポンスのエラー。存在しない場合は `null`。 |
