# IndexedDbClient

開かれた IndexedDB 接続を保持し、トランザクションとオブジェクトストアを提供します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。既に開かれた `db` を受け取ります。 |
| `.createAsync()` | `config` と `callbacks` からデータベースを開くファクトリメソッド。 |
| `.createDatabase()` | データベースを開き、接続へ解決します。 |
| `.get:indexedDbHandler` | クライアントがオープンに用いる `IDBFactory`。 |
| `#createObjectStore()` | `storeName` と `primaryKeyPath` を指定してオブジェクトストアを作成します。 |
| `#beginTransaction()` | `storeNames` に対するトランザクションを開始します。`transactionMode` の既定値は `'readwrite'` です。 |
| `#takeStore()` | トランザクションを開始し、`storeName` で指定されたオブジェクトストアを返します。 |
