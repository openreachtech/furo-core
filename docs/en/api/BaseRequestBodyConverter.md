# BaseRequestBodyConverter

Base class for converting a request body into what a `Request` sends. Extend one per content type, overriding `#convertBody()` and `.collectHeaderEntries()`.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `body` hash to convert and optional `headerEntries`, which default to `.collectHeaderEntries()`. |
| `.collectHeaderEntries()` | Collects the header entries the converted body requires. Must be overridden. |
| `#convertBody()` | Converts the body into `FormData` or text. Must be overridden. |
