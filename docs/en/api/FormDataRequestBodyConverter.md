# FormDataRequestBodyConverter

Converts a request body into `FormData`. This is the converter a RESTful API payload uses unless `.get:RequestBodyConverter` says otherwise.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `body` hash to convert and an optional `formDataBuilder`. A payload passes `#buildFormDataBody()` there. |
| `.createFormDataInstance()` | Creates the `FormData` instance the body is appended to. |
| `#convertBody()` | Returns the `FormData` of the optional `formDataBuilder`, or the body appended to a new `FormData` instance. |
| `#appendBodyTo()` | Appends every field of the body to the given `FormData` instance. |
| `#generateHeaderEntries()` | Generates no entries, because the `Request` sets `multipart/form-data` with its boundary. |
