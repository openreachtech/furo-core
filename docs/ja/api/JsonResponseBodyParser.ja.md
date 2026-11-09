# JsonResponseBodyParser

HTTP パーセルのボディを、パーセルの `#toJson()` を通して JSON としてパースします。そのためレスポンスの文字コードが尊重され、パーセルは読み直せます。`.get:ResponseBodyParser` で変更しない限り、RESTful API ランチャーが使用するパーサーです。

| member | description |
| :-- | :-- |
| `.create()` | 継承したファクトリメソッド。パース対象の `responseParcel` を受け取ります。 |
| `#parseBody()` | レスポンスボディを JSON としてパースします。 |
