# BaseDatabaseMigration

データベースのオブジェクトストアとそのインデックスを宣言します。データベースごとに継承し、`#generateObjectStoreArgs()` をオーバーライドしてください。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。マイグレーション対象の `dbClient` を受け取ります。 |
| `#migrate()` | `oldVersion` から `newVersion` への変更に対してマイグレーションを実行し、宣言されたオブジェクトストアを作成します。 |
| `#generateObjectStoreArgs()` | 作成するオブジェクトストア。それぞれ `storeName`・`primaryKeyPath`・`indexArgs` を持ちます。オーバーライドが必須です。 |
| `#createObjectStores()` | 宣言されたオブジェクトストアを作成します。 |
| `#validatesCreatedStores()` | 宣言されたすべてのストアが作成されたかどうか。 |
