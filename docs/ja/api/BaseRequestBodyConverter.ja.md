# BaseRequestBodyConverter

リクエストボディを `Request` が送信する形へ変換するための基底クラスです。コンテンツタイプごとに継承し、`#convertBody()` と `#generateHeaderEntries()` をオーバーライドしてください。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。変換対象の `body` ハッシュを受け取ります。 |
| `#convertBody()` | ボディを `FormData` またはテキストへ変換します。オーバーライドが必須です。 |
| `#generateHeaderEntries()` | 変換後のボディが必要とするヘッダーエントリを生成します。オーバーライドが必須です。 |
