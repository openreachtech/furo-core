# RestMethodRestfulApiPayloadDerivedCtorRegistry

`.get:asGetMethod` と `.get:asPostMethod` の背後にあるレジストリで、HTTP メソッドを固定したペイロードクラスを派生させます。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`SuperCtor`・`method`・任意の `pool`・`fixedPrefix` を受け取ります。 |
| `#generatePrefix()` | メソッド名を先頭大文字化した形。`GET` は `Get` になります。 |
| `#declareCtor()` | `.get:method` が固定のメソッドを返すサブクラスを宣言します。 |

[BaseDerivedCtorRegistry](./BaseDerivedCtorRegistry.ja.md) のすべてのメンバーを継承します。
