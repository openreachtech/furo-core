# DerivedClassNameGenerator

固定の先頭プレフィックスの後ろにプレフィックスを挿入して派生クラス名を構成します。これにより `Base` を先頭に保ちつつ、サブクラスが何を特化したのかを名前で示せます。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`className` と任意の `fixedPrefix` を受け取ります。`fixedPrefix` の既定値は空文字列です。 |
| `#generateClassName()` | 固定プレフィックスの後ろに `prefix` を挿入します。`BaseRestfulApiPayload` と `Get` の場合、結果は `BaseGetRestfulApiPayload` になります。 |
