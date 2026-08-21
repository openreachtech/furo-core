# GraphQL Client

The GraphQL client is built from three classes you extend per operation.

| class | responsibility |
| :-- | :-- |
| `BaseGraphqlPayload` | Holds the query document and the request variables, and builds the `Request`. |
| `BaseGraphqlCapsule` | Wraps the response, and answers whether it holds content or an error. |
| `BaseGraphqlLauncher` | Binds a payload to a capsule, and launches the request. |

Subscriptions use the parallel trio `BaseSubscriptionGraphqlPayload`, `BaseSubscriptionGraphqlCapsule` and `BaseGraphqlSubscriber`, over a shared `SubscriptionConnector`.

## Declaring an operation

Give the launcher an endpoint by overriding `graphqlConfig`. Declaring one base class per application keeps the endpoint in a single place.

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

The payload carries the query document.

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

The capsule may stay empty, or expose the response shape through named getters.

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

The launcher binds the two together.

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

## Launching a request

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

`launchRequest()` always resolves to a capsule — it does not throw on a failed request. Ask the capsule which outcome it holds.

| method | true when |
| :-- | :-- |
| `#isPending()` | The capsule was created as a placeholder before the request finished. |
| `#hasContent()` | The response carried data. |
| `#hasError()` | Any of the error conditions below hold. |
| `#hasInvalidVariablesError()` | The variables failed the payload's own check, so no request was sent. |
| `#hasNetworkError()` | The request never reached the server. |
| `#hasJsonParseError()` | The response body was not valid JSON. |
| `#hasQueryError()` | The server answered with GraphQL errors. |

## Hooks

`launchRequest()` accepts four hooks. Returning a truthy value from `beforeRequest` aborts the request, and the returned capsule reports the abort instead of a response.

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

## Building variables from a form

When the values come from a `<form>`, `createPayloadWithFormValueHash()` normalizes the form's value hash — including `File` values — into variables.

```javascript
const payload = UploadImageMutationGraphqlLauncher.createPayloadWithFormValueHash({
  valueHash: formElementClerk.extractValueHash(),
})
```

File values are lifted out of the variables and sent as a multipart request, following the GraphQL multipart request specification. See [Form Element Clerk](./form-element-clerk.md) for producing the value hash.

## Subscriptions

A subscriber shares one `SubscriptionConnector` across operations, so a single WebSocket carries every subscription.

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

The lifecycle events are `connecting`, `opened`, `connected`, `message`, `closed`, `error`, `ping` and `pong`.

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

// later
subscriber.unsubscribe()
```

Calling `subscribe()` again on the same subscriber replaces the previous subscription; the old one is unsubscribed first.
