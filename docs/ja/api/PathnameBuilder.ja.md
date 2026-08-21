# PathnameBuilder

パス名テンプレート内の `[name]` プレースホルダーを補間します。RESTful ペイロードがパスパラメータを URL に変換する仕組みです。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。補間対象の `templatePathname` を受け取ります。 |
| `#buildPathname()` | `valueHash` からプレースホルダーを埋めます。対応する値がないキーは空文字列になります。 |
