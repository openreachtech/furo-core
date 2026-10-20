# FormDataRequestBodyConverter

リクエストボディを `FormData` へ変換します。`.get:RequestBodyConverter` で変更しない限り、RESTful API ペイロードが使用するコンバーターです。

| member | description |
| :-- | :-- |
| `.create()` | 継承したファクトリメソッド。変換対象の `body` ハッシュを受け取ります。 |
| `.createFormDataInstance()` | ボディの追加先となる `FormData` インスタンスを生成します。 |
| `#convertBody()` | ボディのすべてのフィールドを `FormData` インスタンスへ追加します。 |
| `#generateHeaderEntries()` | エントリを生成しません。`Request` が境界文字列つきの `multipart/form-data` を設定するためです。 |
