# FormDataRequestBodyConverter

Converts a request body into `FormData`. This is the converter a RESTful API payload uses unless `.get:RequestBodyConverterCtor` says otherwise.

| member | description |
| :-- | :-- |
| `.create()` | Factory method inherited from `BaseRequestBodyConverter`. Takes the `body` hash to convert and optional `headerEntries`. |
| `.createFormDataInstance()` | Creates the `FormData` instance the body is appended to. Override in a subclass to customize the `FormData`. |
| `#convertBody()` | Returns the body appended to the `FormData` instance of `.createFormDataInstance()`. |
| `#appendBodyTo()` | Appends every field of the body to the given `FormData` instance. An array value becomes one part per element under the same key. Override in a subclass to customize how the body is appended. |
| `.collectHeaderEntries()` | Collects no entries, because the `Request` sets `multipart/form-data` with its boundary. |
