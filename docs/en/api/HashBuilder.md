# HashBuilder

Builds a nested hash from flat `a[b][c]` style keys, which is how a form's control names become a structured value hash.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes an optional `core` hash to start from. |
| `#setValue()` | Assigns one value at a `name` path. Returns the builder, so calls chain. |
| `#setValues()` | Assigns an array of `[name, value]` pairs. Returns the builder, so calls chain. |
| `#buildHash()` | Returns the assembled hash, resolving nested builders and trailing `[]` keys. |
