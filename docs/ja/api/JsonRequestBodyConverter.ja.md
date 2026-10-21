# JsonRequestBodyConverter

リクエストボディを JSON テキストへ変換します。RESTful API ペイロードの `.get:RequestBodyConverter` で宣言してください。

| member | description |
| :-- | :-- |
| `.create()` | 継承したファクトリメソッド。変換対象の `body` ハッシュを受け取ります。 |
| `#convertBody()` | ボディを JSON テキストへ変換します。 |
| `.collectHeaderEntries()` | `content-type: application/json` のエントリを収集します。 |
