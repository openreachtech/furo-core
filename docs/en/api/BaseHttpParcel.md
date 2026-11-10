# BaseHttpParcel

What a fetcher returns. It carries the request, the config, the URL of the response, and either the response or the error of the fetcher that kept the response from being received.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `request` and the `config`, and optionally `response`, `responseUrl` and `fetcherError`. |
| `.createAsError()` | Factory method for an error, which no response comes with. Takes an optional `fetcherError`, defaulting to the unknown error. |
| `.createAsNetworkError()` | Factory method for a network failure. |
| `.createAsTimeoutError()` | Factory method for a timed out request. |
| `.createAsAbortError()` | Factory method for an aborted request. |
| `.get:HTTP_FETCHER_ERROR` | The errors of the fetcher: `NETWORK`, `TIMEOUT`, `ABORT` and `UNKNOWN`. |
| `.get:ResponseTextConverterCtor` | The `ResponseTextConverter` class that decodes the body into text. |
| `.createResponseTextConverter()` | Creates a `ResponseTextConverter` of `.get:ResponseTextConverterCtor` for a parcel. |
| `#get:requestUrl` | The URL of the request. |
| `#get:status` | The status code of the response, or `null` if it was not received. |
| `#get:statusText` | The status text of the response, or `null` if it was not received. |
| `#get:headerHash` | The headers of the response as a `Record<string, string>` whose names are in lower case, or `null` if it was not received. |
| `#get:ok` | Whether the status is in the range of 200 to 299. |
| `#hasError()` | Whether the response was not received because of an error. |
| `#hasNetworkError()` | Whether the response was not received because of a network failure. |
| `#hasTimeoutError()` | Whether the response was not received because the request timed out. |
| `#hasAbortError()` | Whether the response was not received because the request was aborted. |
| `#hasUnknownError()` | Whether the response was not received for an unknown reason. |
| `#toJson()` | Reads the body as JSON, by parsing `#toText()`. Answers `null` where the body is not JSON. |
| `#parseJson()` | Parses the text as JSON, and answers `null` where it is not JSON. |
| `#cloneResponse()` | A clone of the response, so that the body can be read again. |
| `#toText()` | Reads the body as text, decoded with the charset that the `Content-Type` of the response declares, and with UTF-8 where it declares none. |
| `#toArrayBuffer()` | Reads the body as an array buffer. |
| `#toBlob()` | Reads the body as a `Blob`. |
| `#isRedirected()` | Whether the response is the result of a redirect. Must be overridden. |
| `#extractResponseType()` | The type of the response. Must be overridden. |

A member that reads the response answers `null` where the response was not received. A body read through `#toJson()`, `#toText()`, `#toArrayBuffer()` or `#toBlob()` is read from a clone, so that the parcel can be read again.
