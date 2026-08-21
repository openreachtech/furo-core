# StorageClerk

Wraps `localStorage` and `sessionStorage` behind one interface, so the storage a module talks to becomes an injected choice rather than a global reference.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes any object satisfying the `Storage` interface. |
| `.createAsLocal()` | Factory method backed by `window.localStorage`. |
| `.createAsSession()` | Factory method backed by `window.sessionStorage`. |
| `#get()` | The value stored under a key, or `null`. |
| `#set()` | Stores a value under a key. Returns the clerk, so calls chain. |
| `#remove()` | Removes the value stored under a key. Returns the clerk, so calls chain. |
| `#clearAll()` | Removes every value. Returns the clerk, so calls chain. |

Values are stored as strings, exactly as the underlying Web Storage API does — serialize structured values before storing them.
