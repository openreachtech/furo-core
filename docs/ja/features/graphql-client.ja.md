# GraphQL クライアント

GraphQL クライアントは、オペレーションごとに継承する 3 つのクラスで構成されます。

| class | responsibility |
| :-- | :-- |
| `BaseGraphqlPayload` | クエリドキュメントとリクエスト変数を保持し、`Request` を構築します。 |
| `BaseGraphqlCapsule` | レスポンスをラップし、コンテンツとエラーのどちらを保持しているかを判定します。 |
| `BaseGraphqlLauncher` | ペイロードとカプセルを結び付け、リクエストを送信します。 |

サブスクリプションでは、これに対応する `BaseSubscriptionGraphqlPayload`・`BaseSubscriptionGraphqlCapsule`・`BaseGraphqlSubscriber` を、共有の `SubscriptionConnector` 上で使用します。

## オペレーションの宣言

`graphqlConfig` をオーバーライドしてランチャーにエンドポイントを与えます。アプリケーションごとに基底クラスを 1 つ宣言すると、エンドポイントを一箇所に集約できます。

```javascript
import {
  BaseGraphqlLauncher,
} from '@openreachtech/furo'

export default class BaseAlphaGraphqlLauncher extends BaseGraphqlLauncher {
  /** @override */
  static get graphqlConfig () {
    return {
      ENDPOINT_URL: 'https://example.com/graphql',
      WEBSOCKET_URL: 'wss://example.com/graphql',
    }
  }
}
```

ペイロードはクエリドキュメントを保持します。

```javascript
import {
  BaseGraphqlPayload,
} from '@openreachtech/furo'

export default class CurriculumsQueryGraphqlPayload extends BaseGraphqlPayload {
  /** @override */
  static get document () {
    return /* GraphQL */ `
      query CurriculumsQuery ($input: CurriculumsSearchInput!) {
        curriculums (input: $input) {
          curriculums {
            id
            title
          }
        }
      }
    `
  }
}
```

カプセルは空のままでも構いませんし、名前付きゲッターでレスポンスの構造を公開することもできます。

```javascript
import {
  BaseGraphqlCapsule,
} from '@openreachtech/furo'

export default class CurriculumsQueryGraphqlCapsule extends BaseGraphqlCapsule {
  get curriculums () {
    const content = this.extractContent()

    return content
      ?.curriculums
      ?.curriculums
      ?? []
  }
}
```

ランチャーが両者を結び付けます。

```javascript
export default class CurriculumsQueryGraphqlLauncher extends BaseAlphaGraphqlLauncher {
  /** @override */
  static get Payload () {
    return CurriculumsQueryGraphqlPayload
  }

  /** @override */
  static get Capsule () {
    return CurriculumsQueryGraphqlCapsule
  }
}
```

## リクエストの送信

```javascript
const payload = CurriculumsQueryGraphqlLauncher.createPayload({
  variables: {
    input: {
      limit: 5,
      offset: 0,
    },
  },
})

const launcher = CurriculumsQueryGraphqlLauncher.create()

const capsule = await launcher.launchRequest({
  payload,
})

if (capsule.hasError()) {
  console.error(capsule.getErrorMessage())
} else {
  console.log(capsule.curriculums)
}
```

`launchRequest()` は常にカプセルへ解決し、リクエストが失敗しても例外を投げません。どの結果を保持しているかはカプセルに問い合わせます。

| method | true when |
| :-- | :-- |
| `#isPending()` | リクエスト完了前のプレースホルダーとして生成されたカプセルである。 |
| `#hasContent()` | レスポンスがデータを保持している。 |
| `#hasError()` | 以下のいずれかのエラー条件が成立している。 |
| `#hasInvalidVariablesError()` | 変数がペイロード自身の検査に失敗し、リクエストが送信されなかった。 |
| `#hasNetworkError()` | リクエストがサーバーに到達しなかった。 |
| `#hasJsonParseError()` | レスポンスボディが妥当な JSON ではなかった。 |
| `#hasQueryError()` | サーバーが GraphQL エラーを返した。 |

## フック

`launchRequest()` は 4 つのフックを受け取ります。`beforeRequest` が真値を返すとリクエストは中止され、返されるカプセルはレスポンスではなく中止を報告します。

```javascript
const capsule = await launcher.launchRequest({
  payload,
  hooks: {
    async beforeRequest (payload) {
      showLoading()

      return false
    },
    async afterRequest (capsule) {
      hideLoading()
    },
    onUploadProgress ({ request, progressEvent }) {
      console.log(progressEvent.loaded / progressEvent.total)
    },
    onDownloadProgress ({ request, progressEvent }) {
      console.log(progressEvent.loaded / progressEvent.total)
    },
  },
})
```

## フォームからの変数構築

値が `<form>` に由来する場合、`createPayloadWithFormValueHash()` がフォームの値ハッシュを（`File` 値も含めて）変数へ正規化します。

```javascript
const payload = UploadImageMutationGraphqlLauncher.createPayloadWithFormValueHash({
  valueHash: formElementClerk.extractValueHash(),
})
```

`File` 値は変数から切り出され、GraphQL multipart request specification に従って multipart リクエストとして送信されます。値ハッシュの生成については [フォーム要素クラーク](./form-element-clerk.ja.md) を参照してください。

## サブスクリプション

サブスクライバーは 1 つの `SubscriptionConnector` をオペレーション間で共有するため、単一の WebSocket がすべてのサブスクリプションを担います。

```javascript
import {
  SubscriptionConnector,
} from '@openreachtech/furo'

const connector = SubscriptionConnector.create({
  config: {
    WEBSOCKET_URL: 'wss://example.com/graphql',
  },
})
  .addLifecycleListener({
    eventName: 'connected',
    handler: socket => {
      console.log('connected', socket)
    },
  })
```

ライフサイクルイベントは `connecting`・`opened`・`connected`・`message`・`closed`・`error`・`ping`・`pong` です。

```javascript
const subscriber = OnObserveChatStatesGraphqlSubscriber.create({
  connector,
})

const payload = OnObserveChatStatesGraphqlSubscriber.createPayload({
  variables: {
    input: {
      chatRoomId: 10001,
    },
  },
})

subscriber.subscribe({
  payload,
  hooks: {
    onPublish (capsule) {
      console.log(capsule.extractContent())
    },
    onDisconnected ({ payload, error }) {
      console.error(error)
    },
    onTerminate ({ payload }) {
      console.log('terminated')
    },
  },
})

// 後で
subscriber.unsubscribe()
```

同じサブスクライバーで再度 `subscribe()` を呼ぶと、直前のサブスクリプションは先に解除され、新しいものに置き換わります。
