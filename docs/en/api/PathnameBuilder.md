# PathnameBuilder

Interpolates `[name]` placeholders in a pathname template, which is how a RESTful payload turns path parameters into a URL.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `templatePathname` to interpolate. |
| `#buildPathname()` | Fills the placeholders from a `valueHash`. A key with no matching value becomes an empty string. |
