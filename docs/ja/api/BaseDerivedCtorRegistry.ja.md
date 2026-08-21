# BaseDerivedCtorRegistry

クラス名ジェネレータとコンストラクタプールを組み合わせ、派生クラスを一度だけ宣言して以降はキャッシュから返します。特化の種類ごとに継承します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。派生元の `SuperCtor`、任意の共有 `pool`、既定値 `'Base'` の `fixedPrefix` を受け取ります。 |
| `.createDynamicDerivedCtorPool()` | レジストリがキャッシュ先とするプールを生成します。 |
| `.createDerivedClassNameGenerator()` | 派生クラス名を構成するジェネレータを生成します。 |
| `#obtainCtor()` | 生成された名前に対応するキャッシュ済みコンストラクタを返します。初回のみ宣言して登録します。 |
| `#generatePrefix()` | サブクラスが何を特化したのかを示すプレフィックス。オーバーライドが必須です。 |
| `#declareCtor()` | 派生クラスを宣言します。オーバーライドが必須です。 |

`#obtainCtor()` が返すコンストラクタは `#declareCtor()` が生成したクラスそのもので、`AnonymousClassNameAssigner` を経由しません。そのため `name` は空文字列になります。生成された名前はキャッシュキーとしてのみ使われます。
