# HTTP Client Tools

The GraphQL and RESTful API clients are assembled from smaller tools, each usable on its own.

| class | responsibility |
| :-- | :-- |
| `ProgressHttpFetcher` | Performs a `Request` over `XMLHttpRequest`, reporting upload and download progress. |
| `HeadersParser` | Parses raw header text into entries or a `Headers` instance. |
| `PathnameBuilder` | Interpolates `[name]` placeholders in a pathname template. |
| `BaseResponseBodyParser` | Base class for turning a `Response` body into a value. |
| `JsonResponseBodyParser` | Parses a response body as JSON. |
| `BaseRequestBodyConverter` | Base class for converting a request body into what a `Request` sends. |
| `FormDataRequestBodyConverter` | Converts a request body into `FormData`. |
| `JsonRequestBodyConverter` | Converts a request body into JSON text. |

## Progress-reporting fetch

`fetch()` cannot report upload progress, so the launchers use `ProgressHttpFetcher`, which runs the request through `XMLHttpRequest` and resolves to a `Response`.

```javascript
import {
  ProgressHttpFetcher,
} from '@openreachtech/furo'

const response = await ProgressHttpFetcher.create()
  .fetchRequest({
    request: new Request('https://example.com/upload', {
      method: 'POST',
      body: formData,
    }),
    sink: {
      onUploadProgress ({ request, progressEvent }) {
        console.log(progressEvent.loaded / progressEvent.total)
      },
      onDownloadProgress ({ request, progressEvent }) {
        console.log(progressEvent.loaded / progressEvent.total)
      },
    },
  })
```

The body goes out as a `Blob` read from the `Request`, and every header of the `Request` is forwarded, `Content-Type` included. A `FormData` body therefore keeps its multipart boundary, and a JSON body reaches the server as `application/json`.

The returned promise rejects with a `TypeError` when the request is aborted, fails, or times out — matching how `fetch()` reports the same conditions.

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

`JsonResponseBodyParser` is the default parser for the RESTful API launcher. Extend `BaseResponseBodyParser` to accept another content type.

```javascript
import {
  BaseResponseBodyParser,
} from '@openreachtech/furo'

export default class TextResponseBodyParser extends BaseResponseBodyParser {
  /** @override */
  async parseBody () {
    return this.response.text()
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

Point a payload at it through `RequestBodyConverter`. See [RESTful API Client](./restful-api-client.md).
