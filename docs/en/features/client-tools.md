# HTTP Client Tools

The GraphQL and RESTful API clients are assembled from smaller tools, each usable on its own.

| class | responsibility |
| :-- | :-- |
| `ProgressHttpFetcher` | Performs a `Request` over `XMLHttpRequest`, reporting upload and download progress. |
| `HeadersParser` | Parses raw header text into entries or a `Headers` instance. |
| `PathnameBuilder` | Interpolates `[name]` placeholders in a pathname template. |
| `BaseResponseBodyParser` | Base class for turning a `Response` body into a value. |
| `JsonResponseBodyParser` | Parses a response body as JSON. |

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
