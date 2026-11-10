# FetchHttpParcel

HTTP parcel of the response that `fetch()` returned. It answers for the redirects and the type from the `Response` as it is.

| member | description |
| :-- | :-- |
| `#awaitBody()` | Drains a clone of the body into a `WritableStream`, because `fetch()` resolves at the headers. Keeps no copy. A failure during the download rejects here. |
| `#isRedirected()` | The `redirected` of the response, or `false` if it was not received. |
| `#extractResponseType()` | The `type` of the response, or `null` if it was not received. |
