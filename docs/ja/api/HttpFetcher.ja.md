# HttpFetcher

`Request` をリクエストクラーク経由で送信し、その `Response` へ解決します。リクエストの運び方はクラークのクラスが決めます。[XMLHttpRequestClerk](./XMLHttpRequestClerk.ja.md) は進捗を通知し、[FetchRequestClerk](./FetchRequestClerk.ja.md) は `fetch()` を使います。ランチャーの `createHttpFetcher()` はこのクラスのインスタンスを返します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。任意の `RequestClerkCtor` を受け取ります。既定値は `XMLHttpRequestClerk` です。すべてのクラークへ渡す任意の `config`（`timeout`・`responseType`・`withCredentials`）も受け取ります。 |
| `#fetchRequest()` | `request`・`config`・任意の `sink` でクラークを生成し、クラークが組み立てる `Response` へ解決します。 |

フェッチャーはリクエストの状態を持たないため、1 つのインスタンスで任意の数のリクエストを処理できます。

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

ランチャーから使うには `createHttpFetcher()` をオーバーライドします。

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
