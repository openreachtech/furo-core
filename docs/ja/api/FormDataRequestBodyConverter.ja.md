# FormDataRequestBodyConverter

リクエストボディを `FormData` へ変換します。`.get:RequestBodyConverter` で変更しない限り、RESTful API ペイロードが使用するコンバーターです。

| member | description |
| :-- | :-- |
| `.create()` | `BaseRequestBodyConverter` から継承したファクトリメソッド。変換対象の `body` ハッシュと任意の `headerEntries` を受け取ります。 |
| `.createFormDataInstance()` | ボディの追加先となる `FormData` インスタンスを生成します。`FormData` をカスタマイズするにはサブクラスでオーバーライドします。 |
| `#convertBody()` | `.createFormDataInstance()` が生成した `FormData` インスタンスへボディを追加したものを返します。 |
| `#appendBodyTo()` | ボディのすべてのフィールドを、渡された `FormData` インスタンスへ追加します。配列の値は、同じキーで要素ごとに 1 つのパートになります。ボディの追加方法をカスタマイズするにはサブクラスでオーバーライドします。 |
| `.collectHeaderEntries()` | エントリを収集しません。`Request` が境界文字列つきの `multipart/form-data` を設定するためです。 |
