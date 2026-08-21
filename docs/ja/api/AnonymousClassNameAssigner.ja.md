# AnonymousClassNameAssigner

クラス式の `name` が空文字列になることを踏まえ、指定した名前を持つサブクラスを派生させます。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。派生元となる `AnonymousCtor` を受け取ります。 |
| `#assignClassName()` | `name` に指定した名前を持つサブクラスを返します。元のコンストラクタは変更されません。 |
