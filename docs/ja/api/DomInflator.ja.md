# DomInflator

HTML 文字列を要素の配列へ展開します。コンテナへ `innerHTML` を代入した場合に残るラッパー要素は生じません。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。展開対象の `html` を受け取ります。 |
| `.get:htmlDocument` | template 要素を生成する document。 |
| `#inflateElements()` | 展開した要素を配列として返します。 |
