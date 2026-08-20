# FormElementInspector

Reads a `<form>` element into a value hash, resolving each control to a natural JavaScript value and skipping disabled controls.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `formElement` to read. |
| `#extractValueHash()` | Reads the form into a value hash, building a nested hash from `a[b]` style names. |
