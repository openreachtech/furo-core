# BaseResponseBodyParser

Base class for turning the body of an HTTP parcel into a value. Extend one per content type, overriding `#parseBody()`.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `responseParcel` to parse. |
| `#parseBody()` | Parses the response body. Must be overridden. |
