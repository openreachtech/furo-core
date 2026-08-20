# IndexedDbClient

Owns an opened IndexedDB connection, and hands out transactions and object stores.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes an already-opened `db`. |
| `.createAsync()` | Factory method that opens the database from a `config` and `callbacks`. |
| `.createDatabase()` | Opens the database and resolves to the connection. |
| `.get:indexedDbHandler` | The `IDBFactory` the client opens through. |
| `#createObjectStore()` | Creates an object store with a `storeName` and a `primaryKeyPath`. |
| `#beginTransaction()` | Starts a transaction over `storeNames`, with a `transactionMode` defaulting to `'readwrite'`. |
| `#takeStore()` | Starts a transaction and returns the object store named by `storeName`. |
