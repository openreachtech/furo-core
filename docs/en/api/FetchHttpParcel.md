# FetchHttpParcel

HTTP parcel of the response that `fetch()` returned. It answers for the redirects and the type from the `Response` as it is.

| member | description |
| :-- | :-- |
| `#isRedirected()` | The `redirected` of the response, or `false` if it was not received. |
| `#extractResponseType()` | The `type` of the response, or `null` if it was not received. |
