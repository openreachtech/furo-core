# HTTP Client Tools

The GraphQL and RESTful API clients are assembled from smaller tools, each usable on its own.

| class | responsibility |
| :-- | :-- |
| `HeadersParser` | Parses raw header text into entries or a `Headers` instance. |
| `PathnameBuilder` | Interpolates `[name]` placeholders in a pathname template. |
| `BaseResponseBodyParser` | Base class for turning a `Response` body into a value. |
| `JsonResponseBodyParser` | Parses a response body as JSON. |
| `BaseRequestBodyConverter` | Base class for converting a request body into what a `Request` sends. |
| `FormDataRequestBodyConverter` | Converts a request body into `FormData`. |
| `JsonRequestBodyConverter` | Converts a request body into JSON text. |

## HTTP fetchers

`fetch()` cannot report upload progress, so the launchers use `XMLHttpFetcher` by default, which runs the request through `XMLHttpRequest`. A launcher chooses its fetcher through `.get:HttpFetcherCtor`, and a subclass may return `FetchHttpFetcher` instead to send the request through `fetch()`.

| class | description |
| :-- | :-- |
| `BaseHttpFetcher` | Base class that owns the flow: it starts the timer that aborts the request, receives the response and always returns an HTTP parcel. |
| `XMLHttpFetcher` | Sends the request through `XMLHttpRequest`, and reports the upload and download progress through the `sink`. |
| `FetchHttpFetcher` | Sends the request through `fetch()`, which keeps the `Response` as it is, so that its body can be read as a stream. It reports no progress. |
| `BaseHttpParcel` | What a fetcher returns. It carries the request, the config, and either the response or the error of the fetcher. |

A fetcher is disposable: it takes the `request` and a `config` once, and fetches once. The `config` holds only what a `Request` cannot express: `timeoutMilliseconds` (`0` for no limit), and `optionHash` for `FetchHttpFetcher`.

```javascript
import {
  XMLHttpFetcher,
} from '@openreachtech/furo'

const httpParcel = await XMLHttpFetcher.create({
  request: new Request('https://example.com/upload', {
    method: 'POST',
    body: formData,
  }),
  config: {
    timeoutMilliseconds: 30000,
  },
})
  .fetchResponse({
    sink: {
      onUploadProgress ({ request, progressEvent }) {
        console.log(progressEvent.loaded / progressEvent.total)
      },
      onDownloadProgress ({ request, progressEvent }) {
        console.log(progressEvent.loaded / progressEvent.total)
      },
    },
  })

if (httpParcel.hasTimeoutError()) {
  // ...
}

const result = await httpParcel.toJson()
```

A fetcher never rejects. A failure comes back as a parcel that carries no response, and `#hasNetworkError()`, `#hasTimeoutError()`, `#hasAbortError()` and `#hasUnknownError()` tell which. The request is aborted by its own `signal`, or by `timeoutMilliseconds`, whichever comes first. An abort through the `signal` is reported as an abort whatever its reason is, and `FetchHttpFetcher` counts the timeout until the whole body has been received, so a body that stalls is a timeout too.

The timeout is counted by `AbortTimer`, which stops once the response is received, so the parcel stays readable after the timeout window. `#toText()` and `#toJson()` of the parcel decode the body through `ResponseTextConverter`, with the charset that the `Content-Type` of the response declares, and with UTF-8 where it declares none.

The body of `XMLHttpFetcher` goes out as a `Blob` read from the `Request`, and every header of the `Request` is forwarded, `Content-Type` included. A `FormData` body therefore keeps its multipart boundary, and a JSON body reaches the server as `application/json`.

## Parsing headers

`HeadersParser` reads the raw header text a server or a tool prints, one `Key: value` pair per line.

```javascript
import {
  HeadersParser,
} from '@openreachtech/furo'

const headersParser = HeadersParser.create({
  haystack: `
    Content-Type: application/json
    x-alpha-token: alpha-token-value
  `,
})

const headerEntries = headersParser.parseHeaderEntries()
// [['Content-Type', 'application/json'], ['x-alpha-token', 'alpha-token-value']]

const headers = headersParser.createHeaders()
```

## Building a pathname

`PathnameBuilder` fills `[name]` placeholders, which is how a RESTful payload turns path parameters into a URL. A key with no matching value becomes an empty string.

```javascript
import {
  PathnameBuilder,
} from '@openreachtech/furo'

const pathname = PathnameBuilder.create({
  templatePathname: '/curriculums/[id]/chapters/[chapterId]',
})
  .buildPathname({
    valueHash: {
      id: 10001,
      chapterId: 20001,
    },
  })
// '/curriculums/10001/chapters/20001'
```

## Parsing a response body

`JsonResponseBodyParser` is the default parser for the RESTful API launcher. Extend `BaseResponseBodyParser` to accept another content type. A parser holds the `responseParcel`, and reads the body through it, so that the parcel stays readable for the capsule.

```javascript
import {
  BaseResponseBodyParser,
} from '@openreachtech/furo'

export default class TextResponseBodyParser extends BaseResponseBodyParser {
  /** @override */
  async parseBody () {
    return this.responseParcel.toText()
  }
}
```

Point a launcher at it through `ResponseBodyParser`. See [RESTful API Client](./restful-api-client.md).

## Converting a request body

`FormDataRequestBodyConverter` is the default converter for the RESTful API payload. Extend `BaseRequestBodyConverter` to send another content type. `.collectHeaderEntries()` returns the headers that content type requires.

```javascript
import {
  BaseRequestBodyConverter,
} from '@openreachtech/furo'

export default class UrlEncodedRequestBodyConverter extends BaseRequestBodyConverter {
  /** @override */
  convertBody () {
    return new URLSearchParams(this.body)
      .toString()
  }

  /** @override */
  static collectHeaderEntries () {
    return [
      ['content-type', 'application/x-www-form-urlencoded'],
    ]
  }
}
```

Point a payload at it through `RequestBodyConverterCtor`. See [RESTful API Client](./restful-api-client.md).

### Customizing the FormData

Extend `FormDataRequestBodyConverter` to customize the `FormData` it builds. Override `static createFormDataInstance()` to seed the `FormData`, or `appendBodyTo()` to change how the body is appended.

```javascript
import {
  FormDataRequestBodyConverter,
} from '@openreachtech/furo'

export default class SignedFormDataRequestBodyConverter extends FormDataRequestBodyConverter {
  /** @override */
  static createFormDataInstance () {
    const formDataHub = super.createFormDataInstance()

    formDataHub.append('client', 'web')

    return formDataHub
  }
}
```

An array value of the body is appended as one part per element under the same key, in order.
