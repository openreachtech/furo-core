# UploadingPropertyPathBuilder

Locates `File` values inside a variables hash, and produces the path map a GraphQL multipart request needs.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `value` to walk. |
| `.buildNodes()` | Walks a value into path nodes. |
| `.isNodeValue()` | Whether a value is one the walk treats as a leaf. |
| `#generateUploadingPathMap()` | The `map` field of a multipart request, pairing each file part with its variable path. |
| `#generateUploadingEntries()` | The file parts appended to the `FormData` body. |
| `#extractUploadingNodes()` | The path nodes holding a `File` value. |
