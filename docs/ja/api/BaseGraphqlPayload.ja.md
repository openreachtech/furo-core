# BaseGraphqlPayload

GraphQL オペレーション 1 つ分のクエリドキュメントとリクエスト変数を保持し、送信する `Request` を構築します。オペレーションごとに継承し、`.get:document` をオーバーライドしてください。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`variables` と fetch の `options` を受け取ります。 |
| `.createWithValueHash()` | `.generateVariables()` を介してフラットな値ハッシュから変数を構築するファクトリメソッド。 |
| `.createWithFormValueHash()` | `<form>` の値ハッシュから変数を構築するファクトリメソッド。`File` 値は multipart リクエスト用に切り出されます。 |
| `.get:document` | GraphQL のクエリドキュメント。オーバーライドが必須です。 |
| `.get:fieldHash` | 実際に送信する変数を絞り込むためのフィールドハッシュ。 |
| `.generateVariables()` | 値ハッシュをリクエスト変数へ変換します。フォームのフィールドをスキーマへ対応づけるためにオーバーライドします。 |
| `.collectBasedHeadersOptions()` | すべてのリクエストにマージされるヘッダーハッシュ。アクセストークンを付与するためにオーバーライドします。 |
| `.collectBasedFetchOptions()` | すべてのリクエストにマージされる fetch オプションハッシュ。 |
| `#createFetchRequest()` | このペイロードに対応する `Request` を構築します。 |
| `#isValidVariables()` | 変数がペイロード自身の検査を満たすかどうか。 |
| `#isInvalidVariables()` | `#isValidVariables()` の否定。 |
