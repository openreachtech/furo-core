# XMLHttpParcel

HTTP parcel of the response built from `XMLHttpRequest`. The response was built after `XMLHttpRequest` received it, so it knows nothing of the redirects and the type; this parcel answers for them from the URL that `XMLHttpRequest` reports.

| member | description |
| :-- | :-- |
| `#isRedirected()` | Whether the URL of the response differs from the URL of the request, both without the fragment. `false` if the response was not received. |
| `#extractResponseType()` | `basic` for a response of the same origin as the page, and `cors` for any other, including every response on a page of an opaque origin. `null` if the response was not received. |
