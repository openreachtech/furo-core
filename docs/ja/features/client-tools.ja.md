# HTTP クライアントツール

GraphQL クライアントと RESTful API クライアントは、より小さなツールを組み合わせて構成されており、各ツールは単体でも使用できます。

| class | responsibility |
| :-- | :-- |
| `ProgressHttpFetcher` | `Request` を `XMLHttpRequest` 経由で実行し、アップロード・ダウンロードの進捗を通知します。 |
| `HeadersParser` | 生のヘッダーテキストをエントリまたは `Headers` インスタンスへパースします。 |
| `PathnameBuilder` | パス名テンプレート内の `[name]` プレースホルダーを補間します。 |
| `BaseResponseBodyParser` | `Response` のボディを値へ変換するための基底クラスです。 |
| `JsonResponseBodyParser` | レスポンスボディを JSON としてパースします。 |

## 進捗を通知する fetch

`fetch()` はアップロードの進捗を通知できないため、ランチャーは `ProgressHttpFetcher` を使用します。これはリクエストを `XMLHttpRequest` 経由で実行し、`Response` へ解決します。

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

返される Promise は、リクエストが中断・失敗・タイムアウトした場合に `TypeError` で reject します。これは `fetch()` が同じ状況を報告する方法に揃えたものです。

## ヘッダーのパース

`HeadersParser` は、サーバーやツールが出力する生のヘッダーテキストを、1 行に `Key: value` の組として読み取ります。

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

## パス名の構築

`PathnameBuilder` は `[name]` のプレースホルダーを埋めます。RESTful ペイロードがパスパラメータを URL に変換する仕組みです。対応する値がないキーは空文字列になります。

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

## レスポンスボディのパース

`JsonResponseBodyParser` は RESTful API ランチャーの既定のパーサーです。別のコンテンツタイプを扱う場合は `BaseResponseBodyParser` を継承してください。

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

ランチャーからは `ResponseBodyParser` を通じて指定します。[RESTful API クライアント](./restful-api-client.ja.md) を参照してください。
