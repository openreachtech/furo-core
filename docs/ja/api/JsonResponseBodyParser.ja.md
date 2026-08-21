# JsonResponseBodyParser

レスポンスボディを JSON としてパースします。`.get:ResponseBodyParser` で変更しない限り、RESTful API ランチャーが使用するパーサーです。

| member | description |
| :-- | :-- |
| `.create()` | 継承したファクトリメソッド。パース対象の `response` を受け取ります。 |
| `#parseBody()` | レスポンスボディを JSON としてパースします。 |
