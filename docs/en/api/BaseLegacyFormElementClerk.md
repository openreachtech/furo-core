# BaseLegacyFormElementClerk

The earlier form element clerk, kept for existing code. It reads control elements directly rather than delegating to `FormElementInspector`, and does not build nested hashes. New code should use `BaseFormElementClerk`.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `formElement` to read. |
| `.get:rules` | Validation rules, one entry per rule. |
| `#get:controlElements` | Every control element of the form. |
| `#extractValueHash()` | Reads the form into a flat value hash. |
| `#generateValidationHash()` | Validates the extracted value hash. |
| `#isValid()` | Whether every rule passed. |
| `#isInvalid()` | Negation of `#isValid()`. |
