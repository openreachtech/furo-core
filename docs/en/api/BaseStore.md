# BaseStore

Reads and writes one IndexedDB object store through promise-returning methods. Extend one per store, overriding `.get:storeName`.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `dbClient` the store reads through. |
| `.get:storeName` | The object store name. Must be overridden. |
| `#get:objectStore` | The underlying object store, taken through a fresh transaction. |
| `#findAll()` | Every record, optionally narrowed by an `IDBKeyRange` `query` and a `count` limit. |
| `#findByKey()` | The record stored under a primary `key`. |
| `#findByIndex()` | Records walked through a named index, taking `indexName`, `value`, a `direction` defaulting to `'prev'`, and a `limit` defaulting to `Infinity`. |
| `#save()` | Writes one `value`, optionally under an explicit `key`. |
| `#bulkSave()` | Writes an array of `values`. |

`#get:objectStore` starts a fresh transaction on each access, so a stored reference should not be reused across awaits. `#save()` resolves to `null` rather than rejecting when the write fails.
