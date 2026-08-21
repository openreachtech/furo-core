# DerivedClassNameGenerator

Composes a derived class name by inserting a prefix after a fixed leading prefix, so that a `Base` prefix stays in front while the name marks what the subclass specializes.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes a `className` and an optional `fixedPrefix`, defaulting to an empty string. |
| `#generateClassName()` | Inserts `prefix` after the fixed prefix. With `BaseRestfulApiPayload` and `Get`, the result is `BaseGetRestfulApiPayload`. |
