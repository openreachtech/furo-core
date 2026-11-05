# FetchHttpFetcher

Extends [BaseHttpFetcher](./BaseHttpFetcher.md). Performs a `Request` through `fetch()` and resolves to its `Response`. The request goes out as built, so its `credentials`, `mode`, `cache`, and `redirect` all hold. Use it when a request must leave same-origin cookies behind (`credentials: 'omit'`), which `ProgressHttpFetcher` cannot do.

| member | description |
| :-- | :-- |
| `.create()` | Inherited factory method. Takes an optional `timeout` in milliseconds, defaulting to `0`, which waits without limit. |
| `#fetchRequest()` | Sends the `request` and resolves to the `Response` of `fetch()`. |

`#fetchRequest()` rejects as `fetch()` does. A failed request rejects with a `TypeError`, a request aborted through its own `signal` with the reason of that signal (an `AbortError` by default), and a request past the `timeout` with a `TimeoutError`.

It needs `AbortSignal.any()` and `AbortSignal.timeout()`, which every major browser ships since March 2024.

It reports no upload or download progress, and it ignores a `sink`. To use it from a launcher, override `createHttpFetcher()`.

```javascript
import {
  BaseRestfulApiLauncher,
  FetchHttpFetcher,
} from '@openreachtech/furo'

export default class PublicRestfulApiLauncher extends BaseRestfulApiLauncher {
  /** @override */
  static createHttpFetcher () {
    return FetchHttpFetcher.create({
      timeout: 15000,
    })
  }
}
```
