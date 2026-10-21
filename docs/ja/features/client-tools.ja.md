# HTTP クライアントツール

GraphQL クライアントと RESTful API クライアントは、より小さなツールを組み合わせて構成されており、各ツールは単体でも使用できます。

| class | responsibility |
| :-- | :-- |
| `ProgressHttpFetcher` | `Request` を `XMLHttpRequest` 経由で実行し、アップロード・ダウンロードの進捗を通知します。 |
| `HeadersParser` | 生のヘッダーテキストをエントリまたは `Headers` インスタンスへパースします。 |
| `PathnameBuilder` | パス名テンプレート内の `[name]` プレースホルダーを補間します。 |
| `BaseResponseBodyParser` | `Response` のボディを値へ変換するための基底クラスです。 |
| `JsonResponseBodyParser` | レスポンスボディを JSON としてパースします。 |
| `BaseRequestBodyConverter` | リクエストボディを `Request` が送信する形へ変換するための基底クラスです。 |
| `FormDataRequestBodyConverter` | リクエストボディを `FormData` へ変換します。 |
| `JsonRequestBodyConverter` | リクエストボディを JSON テキストへ変換します。 |

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

ボディは `Request` から読み取った `Blob` として送信され、`Content-Type` を含む `Request` のすべてのヘッダーが転送されます。そのため `FormData` のボディはマルチパートの境界文字列を保持し、JSON ボディは `application/json` としてサーバーへ届きます。

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

## リクエストボディの変換

`FormDataRequestBodyConverter` は RESTful API ペイロードの既定のコンバーターです。別のコンテンツタイプを送信する場合は `BaseRequestBodyConverter` を継承してください。`.collectHeaderEntries()` はそのコンテンツタイプが必要とするヘッダーを返します。

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

ペイロードからは `RequestBodyConverter` を通じて指定します。[RESTful API クライアント](./restful-api-client.ja.md) を参照してください。

### FormData のカスタマイズ

構築される `FormData` をカスタマイズするには `FormDataRequestBodyConverter` を継承します。`FormData` に初期値を入れるには `static createFormDataInstance()` を、ボディの追加方法を変えるには `appendBodyTo()` をオーバーライドします。

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

ボディの配列の値は、同じキーで要素ごとに 1 つのパートとして、順番どおりに追加されます。
