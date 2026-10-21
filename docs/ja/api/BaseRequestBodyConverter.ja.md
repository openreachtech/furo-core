# BaseRequestBodyConverter

リクエストボディを `Request` が送信する形へ変換するための基底クラスです。コンテンツタイプごとに継承し、`#convertBody()` と `.collectHeaderEntries()` をオーバーライドしてください。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。変換対象の `body` ハッシュと任意の `headerEntries` を受け取ります。`headerEntries` の既定値は `.collectHeaderEntries()` です。 |
| `.collectHeaderEntries()` | 変換後のボディが必要とするヘッダーエントリを収集します。オーバーライドが必須です。 |
| `#convertBody()` | ボディを `FormData` またはテキストへ変換します。オーバーライドが必須です。 |
