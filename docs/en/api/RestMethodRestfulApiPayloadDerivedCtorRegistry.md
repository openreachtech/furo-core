# RestMethodRestfulApiPayloadDerivedCtorRegistry

The registry behind `.get:asGetMethod` and `.get:asPostMethod`, deriving a payload class with its HTTP method fixed.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes `SuperCtor`, `method`, an optional `pool`, and a `fixedPrefix`. |
| `#generatePrefix()` | The method name in capitalized form, so `GET` becomes `Get`. |
| `#declareCtor()` | Declares a subclass whose `.get:method` returns the fixed method. |

Every member of [BaseDerivedCtorRegistry](./BaseDerivedCtorRegistry.md) is inherited.
