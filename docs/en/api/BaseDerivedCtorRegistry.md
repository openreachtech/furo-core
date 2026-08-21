# BaseDerivedCtorRegistry

Combines a class-name generator with a constructor pool, so that a derived class is declared once and returned from the cache afterwards. Extend one per kind of specialization.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `SuperCtor` to derive from, an optional shared `pool`, and a `fixedPrefix` defaulting to `'Base'`. |
| `.createDynamicDerivedCtorPool()` | Creates the pool the registry caches into. |
| `.createDerivedClassNameGenerator()` | Creates the generator composing the derived class name. |
| `#obtainCtor()` | Returns the cached constructor for the generated name, declaring and registering it on first use. |
| `#generatePrefix()` | The prefix marking what the subclass specializes. Must be overridden. |
| `#declareCtor()` | Declares the derived class. Must be overridden. |

The constructor returned by `#obtainCtor()` is the class `#declareCtor()` produced, and is not passed through `AnonymousClassNameAssigner` — so it reports an empty `name`. The generated name is the cache key only.
