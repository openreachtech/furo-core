# FetchHttpFetcher

[BaseHttpFetcher](./BaseHttpFetcher.ja.md) を継承します。`Request` を `fetch()` で実行し、その `Response` へ解決します。リクエストは作られたまま送られるため、`credentials`・`mode`・`cache`・`redirect` はすべて守られます。同一オリジンの cookie を付けずに送る（`credentials: 'omit'`）必要があるときに使います。`ProgressHttpFetcher` ではこれができません。

| member | description |
| :-- | :-- |
| `.create()` | 継承したファクトリメソッド。任意の `timeout`（ミリ秒）を受け取ります。既定値は `0` で、無制限に待ちます。 |
| `#fetchRequest()` | `request` を送信し、`fetch()` の `Response` へ解決します。 |

`#fetchRequest()` は `fetch()` と同じように reject します。失敗したリクエストは `TypeError`、リクエスト自身の `signal` で中断されたものはその `signal` の理由（既定では `AbortError`）、`timeout` を過ぎたものは `TimeoutError` で reject します。

`AbortSignal.any()` と `AbortSignal.timeout()` が必要です。主要ブラウザはすべて 2024 年 3 月から対応しています。

アップロード・ダウンロードの進捗は通知せず、`sink` は無視します。ランチャーから使うには `createHttpFetcher()` をオーバーライドします。

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
