# BaseDatabaseMigration

Declares the object stores of a database and their indexes. Extend one per database, overriding `#generateObjectStoreArgs()`.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `dbClient` the migration runs against. |
| `#migrate()` | Runs the migration for an `oldVersion` to `newVersion` change, creating the declared object stores. |
| `#generateObjectStoreArgs()` | The object stores to create, each with a `storeName`, a `primaryKeyPath` and `indexArgs`. Must be overridden. |
| `#createObjectStores()` | Creates the declared object stores. |
| `#validatesCreatedStores()` | Whether every declared store was created. |
