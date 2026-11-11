# JsonResponseBodyParser

Parses the body of an HTTP parcel as JSON, through `#toJson()` of the parcel, so that the charset of the response is honored and the parcel stays readable. This is the parser a RESTful API launcher uses unless `.get:ResponseBodyParser` says otherwise.

| member | description |
| :-- | :-- |
| `.create()` | Inherited factory method. Takes the `responseParcel` to parse. |
| `#parseBody()` | Parses the response body as JSON. |
