# ValueHashValidator

Validates a value hash against field rules, and reports the result as four views of the same outcome.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes a `valueHash` and an array of `rules`, each turned into a `FieldValidator`. |
| `#generateValidationHash()` | Returns `{ valid, invalid, messages, message }`, each keyed by field name. |
| `#isValid()` | Whether every rule passed. |
| `#isInvalid()` | Negation of `#isValid()`. |

`valid` and `invalid` map a field name to a boolean, `messages` to every failed rule's message, and `message` to the first failed rule's message.
