# BaseSubscriptionGraphqlPayload

サブスクリプションのドキュメントと変数を保持し、WebSocket 上で送信するペイロードを構築します。サブスクリプションごとに継承し、`.get:document` をオーバーライドしてください。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`variables` とサブスクリプションのオプションを受け取ります。 |
| `.createWithValueHash()` | フラットな値ハッシュから変数を構築するファクトリメソッド。 |
| `.get:document` | GraphQL のサブスクリプションドキュメント。オーバーライドが必須です。 |
| `.get:fieldHash` | 実際に送信する変数を絞り込むためのフィールドハッシュ。 |
| `.generateVariables()` | 値ハッシュをサブスクリプションの変数へ変換します。 |
| `.collectBasedSubscriptionPayloadOptions()` | すべてのサブスクリプションにマージされるペイロードオプションハッシュ。 |
| `.collectBasedSubscriptionContextOptions()` | すべてのサブスクリプションにマージされるコンテキストオプションハッシュ。 |
| `.collectBasedHeadersOptions()` | 接続コンテキストにマージされるヘッダーハッシュ。 |
| `#buildSubscriptionPayload()` | WebSocket 上で送信するペイロードを構築します。 |
| `#isValidVariables()` | 変数がペイロード自身の検査を満たすかどうか。 |
| `#isInvalidVariables()` | `#isValidVariables()` の否定。 |
