# FormControlElementInspector

Reads one form control into a value, resolving its type — a number for `type="number"`, a `File` for `type="file"`, an array for a multi-select or a checkbox group, and the checked member's value for a radio group.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `control` to read. |
| `#extractFormControlValue()` | Reads the control into a value, or `null` when it is disabled. |

Also exported as `FormControlElementClerk` for backward compatibility; both names refer to this class.
