# FetchHttpFetcher

HTTP fetcher that sends the request through `fetch()`. The response is kept as the `Response` it received, so that its body can be read as a stream. It reports no progress.

| member | description |
| :-- | :-- |
| `.get:HttpParcelCtor` | Returns `FetchHttpParcel`. |
| `.get:fetch` | The fetch function used for the request. |
| `#receiveResponse()` | Sends a clone of the request through `fetch()`, with the option hash that holds the abort signal, and resolves once the whole body has been received. A timeout during the download rejects here, so it is reported as a timeout. |
| `#awaitBody()` | Awaits the whole body, through a clone, so that the body of the response stays unread. |
| `#resolveResponseUrl()` | The URL of the response, as `fetch()` reports it. |
| `#buildOptionHash()` | Builds the option hash of `fetch()` from `config.optionHash` and the signal. The signal always wins. |
| `#invokeFetch()` | Calls `.get:fetch` with the request and the option hash. |
| `#createHttpParcelByUnnamedFailure()` | A failure that no name tells is a network failure. |

The `config` takes `optionHash`, which is a `RequestInit` without `signal`, for what a `Request` cannot express, such as `keepalive`, `cache` or `priority`.
