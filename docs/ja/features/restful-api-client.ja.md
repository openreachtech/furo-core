# RESTful API クライアント

RESTful API クライアントは、GraphQL クライアントと同じ 3 クラス構成です。

| class | responsibility |
| :-- | :-- |
| `BaseRestfulApiPayload` | HTTP メソッドとパス名を宣言し、`Request` を構築します。 |
| `BaseRestfulApiCapsule` | レスポンスをラップし、エラーを保持しているかを判定します。 |
| `BaseRestfulApiLauncher` | ペイロードとカプセルを結び付け、リクエストを送信します。 |

`BaseRenchanRestfulApiPayload`・`BaseRenchanRestfulApiCapsule`・`BaseRenchanRestfulApiLauncher` は、これらを Renchan バックエンド向けに拡張し、アクセストークンヘッダーと `content` / `error` のレスポンスエンベロープを追加します。

ペイロードは `query`・`body`・`pathParameterHash` を受け取ります。これらはペイロードが URL とボディへ組み立てる、リクエストの 3 つの構成要素です。

## エンドポイントの宣言

`restfulApiConfig` をオーバーライドしてランチャーにベース URL を与えます。

```javascript
import {
  BaseRestfulApiLauncher,
} from '@openreachtech/furo'

export default class BaseAlphaRestfulApiLauncher extends BaseRestfulApiLauncher {
  /** @override */
  static get restfulApiConfig () {
    return {
      BASE_URL: 'https://example.com',
    }
  }
}
```

ペイロードはメソッドとパス名を宣言します。パス名内の `[name]` セグメントはパスパラメータとなり、リクエストのパスパラメータハッシュから埋められます。

```javascript
import {
  BaseRestfulApiPayload,
  RESTFUL_API_METHOD,
} from '@openreachtech/furo'

export default class CurriculumGetRestfulApiPayload extends BaseRestfulApiPayload {
  /** @override */
  static get method () {
    return RESTFUL_API_METHOD.GET
  }

  /** @override */
  static get pathname () {
    return '/curriculums/[id]'
  }
}
```

`RESTFUL_API_METHOD` は `GET`・`POST`・`PUT`・`PATCH`・`DELETE`・`HEAD`・`OPTIONS`・`TRACE`・`CONNECT` を保持します。

すべてのエンドポイントが `/v1` のような共通のプレフィックス配下にある場合は、共有の基底ペイロードで `prefixPathname` をオーバーライドしてください。

## JSON ボディの送信

ペイロードは既定でボディを `FormData` として送信します。JSON として送信するには `RequestBodyConverter` をオーバーライドします。

```javascript
import {
  BaseRestfulApiPayload,
  JsonRequestBodyConverter,
  RESTFUL_API_METHOD,
} from '@openreachtech/furo'

export default class CurriculumPostRestfulApiPayload extends BaseRestfulApiPayload {
  /** @override */
  static get method () {
    return RESTFUL_API_METHOD.POST
  }

  /** @override */
  static get pathname () {
    return '/curriculums'
  }

  /** @override */
  static get RequestBodyConverter () {
    return JsonRequestBodyConverter
  }
}
```

ボディは `application/json` としてサーバーへ届き、アップロードとダウンロードの進捗も引き続き通知されます。ペイロードがヘッダーで指定した `Content-Type` はそのまま保持されます。`GET` のようにボディを持たないメソッドには `Content-Type` が付きません。GraphQL クライアントは引き続き `multipart/form-data` を送信します。

## FormData ボディのカスタマイズ

ペイロードが送信する `FormData` をカスタマイズするには、`FormDataRequestBodyConverter` を継承し、そのサブクラスを `RequestBodyConverter` から返します。サブクラスでは `static createFormDataInstance()` または `appendBodyTo()` をオーバーライドします。[クライアントツール](./client-tools.ja.md) を参照してください。

```javascript
import {
  BaseRestfulApiPayload,
  FormDataRequestBodyConverter,
  RESTFUL_API_METHOD,
} from '@openreachtech/furo'

class SignedFormDataRequestBodyConverter extends FormDataRequestBodyConverter {
  /** @override */
  static createFormDataInstance () {
    const formDataHub = super.createFormDataInstance()

    formDataHub.append('client', 'web')

    return formDataHub
  }
}

export default class CurriculumPostRestfulApiPayload extends BaseRestfulApiPayload {
  /** @override */
  static get method () {
    return RESTFUL_API_METHOD.POST
  }

  /** @override */
  static get pathname () {
    return '/curriculums'
  }

  /** @override */
  static get RequestBodyConverter () {
    return SignedFormDataRequestBodyConverter
  }
}
```

ボディの配列の値は、同じキーで要素ごとに 1 つのパートとして追加されるため、`{ tags: ['alpha', 'beta'] }` は `tags` のパートを 2 つ送信します。

## Renchan バックエンド

`BaseRenchanRestfulApiPayload` は **セッションストレージ** からアクセストークンを読み出し、ヘッダーとして送信します。どちらのキーも abstract であるため、共有の基底ペイロードで宣言する必要があります。

```javascript
import {
  BaseRenchanRestfulApiPayload,
} from '@openreachtech/furo'

export default class BaseAlphaRenchanRestfulApiPayload extends BaseRenchanRestfulApiPayload {
  /** @override */
  static get ACCESS_TOKEN_HEADER_KEY () {
    return 'x-renchan-access-token'
  }

  /** @override */
  static get ACCESS_TOKEN_STORAGE_KEY () {
    return 'access_token'
  }

  /** @override */
  static get prefixPathname () {
    return '/v1'
  }
}
```

`BaseRenchanRestfulApiCapsule` は Renchan のレスポンスエンベロープを展開して `#content` と `#error` を公開し、ボディがアプリケーションレベルのエラーを保持している場合に `#hasResultError()` で報告します。

## リクエストの送信

```javascript
const payload = CurriculumGetRestfulApiLauncher.createPayload({
  pathParameterHash: {
    id: 10001,
  },
  query: {
    limit: 5,
  },
})

const launcher = CurriculumGetRestfulApiLauncher.create()

const capsule = await launcher.launchRequest({
  payload,
})

if (capsule.hasError()) {
  console.error(capsule.getErrorMessage())
}
```

GraphQL と同様に、`launchRequest()` は例外を投げずカプセルへ解決します。

| method | true when |
| :-- | :-- |
| `#isPending()` | リクエスト完了前のプレースホルダーとして生成されたカプセルである。 |
| `#hasError()` | 以下のいずれかのエラー条件が成立している。 |
| `#hasInvalidParameterHashError()` | パラメータがペイロード自身の検査に失敗し、リクエストが送信されなかった。 |
| `#hasNetworkError()` | リクエストがサーバーに到達しなかった。 |
| `#hasResponseBodyParseError()` | レスポンスボディをパースできなかった。 |
| `#hasStatusCodeError()` | レスポンスが 4xx または 5xx のステータスを返した。 |
| `#hasResultError()` | パースされたボディがアプリケーションレベルのエラーを報告した。 |

`#statusCode`・`#statusText`・`#requestMethod` がレスポンスのメタデータを公開します。

フックは GraphQL ランチャーと同じ 4 つ（`beforeRequest`・`afterRequest`・`onUploadProgress`・`onDownloadProgress`）で、`beforeRequest` が真値を返すとリクエストは中止されます。

## レスポンスボディのパース

ランチャーは `ResponseBodyParser` を通じてレスポンスをパースし、その既定値は `JsonResponseBodyParser` です。別のコンテンツタイプを扱う場合はオーバーライドしてください。

```javascript
export default class CsvGetRestfulApiLauncher extends BaseAlphaRestfulApiLauncher {
  /** @override */
  static get ResponseBodyParser () {
    return CsvResponseBodyParser
  }
}
```

パーサーの書き方は [HTTP クライアントツール](./client-tools.ja.md) を参照してください。

## サブクラスを作らずにメソッドを宣言する

独自の振る舞いを必要としないエンドポイントでは、`asGetMethod` と `asPostMethod` がメソッドを設定済みの派生ペイロードコンストラクタを返すため、明示的なサブクラスは不要です。

```javascript
const AlphaPayloadCtor = BaseAlphaRestfulApiPayload.asGetMethod
```

派生コンストラクタはモジュールスコープのプールにキャッシュされるため、繰り返しアクセスしても同一のクラスが得られます。[動的クラス宣言](./dynamic-class-declaration.ja.md) を参照してください。
