# FieldValidator

One validation rule bound to one field.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes `{ field, ok, message }`. |
| `#accepts()` | Whether this validator applies to the given field. |
| `#rejects()` | Negation of `#accepts()`. |
| `#isValid()` | Applies the rule to a `target` value with the whole `variables` hash available. |
| `#isInvalid()` | Negation of `#isValid()`. |
| `#getMessage()` | The message reported when the rule fails, or `null`. |
