# DynamicDerivedCtorPool

Caches derived constructors by name. The backing `Map` defaults to one shared at module scope, so the cache spans every pool instance in the process.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes an optional `pool` `Map`, defaulting to the module-scope one. |
| `#registerCtor()` | Registers a constructor under a name. A name already held is left unchanged, so the first registration wins. |
| `#bulkRegisterCtors()` | Registers every entry of a name-to-constructor hash. |
| `#retrieveCtor()` | The constructor held under a name, or `null`. |
| `#containsCtor()` | Whether a name is already held. |
