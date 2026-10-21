# FormDataRequestBodyConverter

リクエストボディを `FormData` へ変換します。`.get:RequestBodyConverter` で変更しない限り、RESTful API ペイロードが使用するコンバーターです。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。変換対象の `body` ハッシュと任意の `headerEntries`、`formDataBuilder` を受け取ります。ペイロードはここへ `#buildFormDataBody()` を渡します。 |
| `.createFormDataInstance()` | ボディの追加先となる `FormData` インスタンスを生成します。 |
| `#convertBody()` | 任意の `formDataBuilder` が返す `FormData`、またはボディを新しい `FormData` インスタンスへ追加したものを返します。 |
| `#appendBodyTo()` | ボディのすべてのフィールドを、渡された `FormData` インスタンスへ追加します。 |
| `.collectHeaderEntries()` | エントリを収集しません。`Request` が境界文字列つきの `multipart/form-data` を設定するためです。 |
