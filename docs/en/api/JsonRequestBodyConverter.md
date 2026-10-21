# JsonRequestBodyConverter

Converts a request body into JSON text. Declare it through `.get:RequestBodyConverterCtor` of a RESTful API payload.

| member | description |
| :-- | :-- |
| `.create()` | Inherited factory method. Takes the `body` hash to convert. |
| `#convertBody()` | Converts the body into JSON text. |
| `.collectHeaderEntries()` | Collects the `content-type: application/json` entry. |
