# BaseHttpFetcher

Base class of the HTTP fetchers. It owns the flow of a fetch: it builds the signal that aborts the request, lets a subclass receive the response, and always returns an HTTP parcel. Extend it per transport.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `request` and the `config`. |
| `.get:AbortSignalCtor` | The `AbortSignal` class used to build the signal. |
| `.get:HttpParcelCtor` | The HTTP parcel class a fetcher returns. Must be overridden. |
| `.createHttpParcel()` | Creates an HTTP parcel of `.get:HttpParcelCtor`. |
| `#get:timeoutMilliseconds` | Milliseconds to wait for the response, from the `config`. `0` for no limit. |
| `#fetchResponse()` | Fetches the response and resolves to an HTTP parcel. It never rejects. |
| `#createAbortSignal()` | Creates the signal that aborts the request, by the signal of the request and by the timeout. |
| `#receiveResponse()` | Receives the response. Must be overridden. Rejects with the reason where the response cannot be received. |
| `#createHttpParcelByResponse()` | Creates an HTTP parcel of the received response. |
| `#resolveResponseUrl()` | Resolves the URL of the response after the redirects. Must be overridden. |
| `#createHttpParcelByFailure()` | Creates an HTTP parcel of a failure, by the name of the error: `TimeoutError`, `AbortError` or `NetworkError`. |
| `#createHttpParcelByUnnamedFailure()` | Creates an HTTP parcel of a failure that no name tells. Defaults to an unknown error. |
| `#createHttpParcelAsNetworkError()` | Creates an HTTP parcel of a network failure. |
| `#createHttpParcelAsTimeoutError()` | Creates an HTTP parcel of a timed out request. |
| `#createHttpParcelAsAbortError()` | Creates an HTTP parcel of an aborted request. |
| `#createHttpParcelAsError()` | Creates an HTTP parcel of an unknown error. |

A fetcher is disposable: it takes the `request` and the `config` once, and fetches once. The `config` holds what a `Request` cannot express, which is `timeoutMilliseconds`; each subclass adds its own.
