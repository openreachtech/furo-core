# BaseSubscriptionGraphqlCapsule

publish されたサブスクリプションメッセージ 1 件をラップし、どの結果を保持しているかを判定します。サブスクリプションごとに継承します。

| member | description |
| :-- | :-- |
| `.create()` | publish されたメッセージをラップするファクトリメソッド。 |
| `.createAsPending()` | 最初のメッセージ到着前のプレースホルダーカプセルを生成するファクトリメソッド。 |
| `.createAsInvalidVariablesError()` | ペイロードの検査に失敗した変数を表すファクトリメソッド。 |
| `.createAsAbortedByHooks()` | フックにより中止されたサブスクリプションを表すファクトリメソッド。 |
| `.createAsNetworkError()` | 接続障害を表すファクトリメソッド。 |
| `.get:unknownErrorCode` | より具体的なコードが該当しない場合に報告されるエラーコード。 |
| `.get:invalidVariablesErrorCode` | 変数が不正な場合のエラーコード。 |
| `.get:networkErrorCode` | 接続障害のエラーコード。 |
| `#get:content` | publish されたコンテンツ。 |
| `#get:errors` | メッセージが保持する GraphQL エラー。 |
| `#hasContent()` | メッセージがデータを保持しているかどうか。 |
| `#hasError()` | いずれかのエラー条件が成立しているかどうか。 |
| `#isPending()` | プレースホルダーカプセルかどうか。 |
| `#hasInvalidVariablesError()` | 変数がペイロードの検査に失敗したかどうか。 |
| `#hasNetworkError()` | 接続が失敗したかどうか。 |
| `#hasQueryError()` | サーバーが GraphQL エラーを返したかどうか。 |
| `#getErrorMessage()` | 保持しているエラーを説明するメッセージ。 |
| `#extractContent()` | publish されたコンテンツ。存在しない場合は `null`。 |
| `#extractErrors()` | メッセージのエラー。存在しない場合は `null`。 |
