# HttpFetcher

Sends a `Request` through a request clerk and resolves to its `Response`. The clerk class decides how the request travels: [XMLHttpRequestClerk](./XMLHttpRequestClerk.md) reports progress, [FetchRequestClerk](./FetchRequestClerk.md) goes through `fetch()`. `createHttpFetcher()` of a launcher returns one.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes an optional `RequestClerkCtor`, defaulting to `XMLHttpRequestClerk`, and an optional `config` (`timeout`, `responseType`, `withCredentials`) that every clerk receives. |
| `#fetchRequest()` | Creates a clerk for the `request` with the `config` and the optional `sink`, and resolves to the `Response` the clerk builds. |

The fetcher holds no state of a request, so one instance serves any number of requests.

```javascript
import {
  FetchRequestClerk,
  HttpFetcher,
} from '@openreachtech/furo'

const response = await HttpFetcher.create({
  RequestClerkCtor: FetchRequestClerk,
  config: {
    timeout: 15000,
  },
})
  .fetchRequest({
    request: new Request('https://example.com/start'),
  })
```

To use it from a launcher, override `createHttpFetcher()`.

```javascript
import {
  BaseRestfulApiLauncher,
  FetchRequestClerk,
  HttpFetcher,
} from '@openreachtech/furo'

export default class PublicRestfulApiLauncher extends BaseRestfulApiLauncher {
  /** @override */
  static createHttpFetcher () {
    return HttpFetcher.create({
      RequestClerkCtor: FetchRequestClerk,
      config: {
        timeout: 15000,
      },
    })
  }
}
```
