# JsonResponseBodyParser

Parses a response body as JSON. This is the parser a RESTful API launcher uses unless `.get:ResponseBodyParser` says otherwise.

| member | description |
| :-- | :-- |
| `.create()` | Inherited factory method. Takes the `response` to parse. |
| `#parseBody()` | Parses the response body as JSON. |
