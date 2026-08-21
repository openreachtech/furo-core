# BaseDatabase

Names an IndexedDB database and points to its migration. Extend one per database, exposing each object store as a getter.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes an already-opened `dbClient`. |
| `.createAsync()` | Factory method that opens the database first. This is the one to use, since opening is asynchronous. |
| `.get:dbName` | The database name. Must be overridden. |
| `.get:dbVersion` | The database version, defaulting to `1`. Raise it when the migration changes. |
| `.get:MigrationCtor` | The migration class. Must be overridden. |
| `.get:IndexedDbClientCtor` | The client class used to open the database. |
| `.get:config` | The name and version passed to the client. |
| `.createDbClient()` | Opens the database and returns the client. |
| `.generateCallbacks()` | The open-request callbacks, bundling the three below. |
| `.defineOnSuccess()` | The handler invoked when the database opens. |
| `.defineOnError()` | The handler invoked when opening fails. |
| `.defineOnUpgradeNeeded()` | The handler that runs the migration on a version change. |
