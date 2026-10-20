# BaseRequestBodyConverter

Base class for converting a request body into what a `Request` sends. Extend one per content type, overriding `#convertBody()` and `#generateHeaderEntries()`.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `body` hash to convert. |
| `#convertBody()` | Converts the body into `FormData` or text. Must be overridden. |
| `#generateHeaderEntries()` | Generates the header entries the converted body requires. Must be overridden. |
