# XMLHttpRequestClerk

Clerk that wraps an `XMLHttpRequest`. Every property assignment of the request goes through it, and a method that sets something returns the clerk itself, so that the calls chain.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes an optional `xmlHttpRequest`, defaulting to a new one. |
| `.get:XMLHttpRequestCtor` | The `XMLHttpRequest` class. |
| `.get:requestSinkEventNameLookup` | The event names of a request sink, by the key of the sink. |
| `.get:uploadSinkEventNameLookup` | The event names of an upload sink, by the key of the sink. |
| `.createXMLHttpRequest()` | Creates an `XMLHttpRequest`. |
| `#get:status` | The status of the response. |
| `#get:statusText` | The status text of the response. |
| `#get:response` | The body of the response. |
| `#get:responseUrl` | The URL of the response, after the redirects. |
| `#extractAllResponseHeadersText()` | The raw text of the response headers. |
| `#openRequest()` | Opens the request, as an asynchronous one. |
| `#setResponseType()` | Sets the response type. |
| `#setTimeoutMilliseconds()` | Sets the timeout. |
| `#setWithCredentials()` | Sets whether the request carries credentials to a cross-site server. |
| `#setRequestHeaders()` | Sets every header of a `Headers`. |
| `#addEventListener()` | Adds a listener of an event of the request. |
| `#addUploadEventListener()` | Adds a listener of an event of the upload. |
| `#addSink()` | Adds the request sink and the upload sink at once. |
| `#addRequestSink()` | Adds a sink of the events of the request. |
| `#addUploadSink()` | Adds a sink of the events of the upload. |
| `#sendRequest()` | Sends the request with a body. |
| `#abortRequest()` | Aborts the request. |

A sink is a hash of listeners keyed by the name of the member, such as `onLoad`, `onError`, `onAbort`, `onDownloadProgress` and `onUploadProgress`. Each member is added as a listener as it is, so that it must not depend on `this`.
