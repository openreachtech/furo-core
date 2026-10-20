# FormDataRequestBodyConverter

Converts a request body into `FormData`. This is the converter a RESTful API payload uses unless `.get:RequestBodyConverter` says otherwise.

| member | description |
| :-- | :-- |
| `.create()` | Inherited factory method. Takes the `body` hash to convert. |
| `.createFormDataInstance()` | Creates the `FormData` instance the body is appended to. |
| `#convertBody()` | Appends every field of the body to a `FormData` instance. |
| `#generateHeaderEntries()` | Generates no entries, because the `Request` sets `multipart/form-data` with its boundary. |
