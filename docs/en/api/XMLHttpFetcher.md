# XMLHttpFetcher

HTTP fetcher that sends the request through `XMLHttpRequest`, and reports the upload and download progress through the `sink`. The response body is received as an array buffer, and a `Response` is built after the whole response has arrived.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `request`, the `config`, and an optional `requestClerk`, defaulting to the clerk of a new `XMLHttpRequest`. |
| `.get:XMLHttpRequestClerkCtor` | The clerk class of `XMLHttpRequest`. |
| `.get:HeadersParserCtor` | The class that parses the raw header text. |
| `.get:HttpParcelCtor` | Returns `XMLHttpParcel`. |
| `.createXMLHttpRequestClerk()` | Creates the clerk of `XMLHttpRequest`. |
| `.createHeadersParser()` | Creates a parser of the raw header text. |
| `.createRequestBody()` | Reads a `Request` body as a `Blob`, and as `null` for a method without a body. |
| `.isBodyRequiredMethod()` | Whether a request method sends a body. |
| `.isNullBodyStatus()` | Whether a status is of a response without a body. |
| `#receiveResponse()` | Sends the request, notifies the `sink` of the progress, and resolves to the `Response` that was built. Rejects with the reason of the signal where the signal aborted the request, and with an error named `NetworkError` where the network failed. |
| `#setupRequestClerk()` | Sets the request on the clerk: the method, the URL, the response type, the credentials and the headers. |
| `#shouldSendCredentials()` | Whether the credentials mode of the request is `include`. |
| `#buildClerkSink()` | Builds the sink that the clerk notifies of the events. |
| `#createResponse()` | Creates a `Response` from what the clerk received. |
| `#extractResponseBody()` | The response body, or `null` for a response without a body. |
| `#resolveResponseUrl()` | The URL of the response that `XMLHttpRequest` reports. |
| `#invokeSend()` | Sends the request through the clerk. |

An instance holds one clerk, so that it fetches once. The timeout is counted by the abort signal, and `XMLHttpRequest#timeout` is not used.

`XMLHttpRequest` sends same-origin cookies even where the credentials mode of the request is `omit`. A launcher that sends such a request returns `FetchHttpFetcher` from `.get:HttpFetcherCtor`.
