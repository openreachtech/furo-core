# BaseFormElementClerk

Reads a `<form>` element into a value hash, and validates that hash against rules declared on the class. Extend one per form, overriding `.get:rules`.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `formElement` to read. |
| `.get:rules` | Validation rules, one entry per rule. Defaults to an empty array. |
| `#get:controlElements` | Every control element of the form. |
| `#extractValueHash()` | Reads the form into a value hash, building a nested hash from `a[b]` style names. |
| `#generateValidationHash()` | Validates the extracted value hash, returning the `valid`, `invalid`, `messages` and `message` views. |
| `#isValid()` | Whether every rule passed. |
| `#isInvalid()` | Negation of `#isValid()`. |

A rule is `{ field, ok, message }`, where `ok` receives the field's value as its first argument and the whole value hash as its second.
