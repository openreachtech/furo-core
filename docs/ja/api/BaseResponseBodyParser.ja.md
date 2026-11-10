# BaseResponseBodyParser

HTTP パーセルのボディを値へ変換するための基底クラスです。コンテンツタイプごとに継承し、`#parseBody()` をオーバーライドしてください。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。パース対象の `responseParcel` を受け取ります。 |
| `#parseBody()` | レスポンスボディをパースします。オーバーライドが必須です。 |
