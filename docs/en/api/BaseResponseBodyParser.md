# BaseResponseBodyParser

Base class for turning a `Response` body into a value. Extend one per content type, overriding `#parseBody()`.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `response` to parse. |
| `#parseBody()` | Parses the response body. Must be overridden. |
