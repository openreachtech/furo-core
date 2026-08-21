# RESTful API Client

The RESTful API client mirrors the GraphQL client's three-class shape.

| class | responsibility |
| :-- | :-- |
| `BaseRestfulApiPayload` | Declares the HTTP method and pathname, and builds the `Request`. |
| `BaseRestfulApiCapsule` | Wraps the response, and answers whether it holds an error. |
| `BaseRestfulApiLauncher` | Binds a payload to a capsule, and launches the request. |

`BaseRenchanRestfulApiPayload`, `BaseRenchanRestfulApiCapsule` and `BaseRenchanRestfulApiLauncher` extend these for Renchan backends, adding an access-token header and the `content` / `error` response envelope.

A payload takes `query`, `body` and `pathParameterHash` — the three parts of a request the payload assembles into a URL and a body.

## Declaring an endpoint

Give the launcher a base URL by overriding `restfulApiConfig`.

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

The payload declares the method and the pathname. A `[name]` segment in the pathname is a path parameter, filled from the request's path parameter hash.

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

`RESTFUL_API_METHOD` carries `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`, `TRACE` and `CONNECT`.

Override `prefixPathname` on a shared base payload when every endpoint sits under a common prefix such as `/v1`.

## Renchan backends

`BaseRenchanRestfulApiPayload` reads an access token from **session storage** and sends it as a header. Both keys are abstract, so a shared base payload must declare them.

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

`BaseRenchanRestfulApiCapsule` unwraps the Renchan response envelope, exposing `#content` and `#error`, and reporting `#hasResultError()` when the body carries an application-level error.

## Launching a request

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

As with GraphQL, `launchRequest()` resolves to a capsule rather than throwing.

| method | true when |
| :-- | :-- |
| `#isPending()` | The capsule was created as a placeholder before the request finished. |
| `#hasError()` | Any of the error conditions below hold. |
| `#hasInvalidParameterHashError()` | The parameters failed the payload's own check, so no request was sent. |
| `#hasNetworkError()` | The request never reached the server. |
| `#hasResponseBodyParseError()` | The response body could not be parsed. |
| `#hasStatusCodeError()` | The response carried a 4xx or 5xx status. |
| `#hasResultError()` | The parsed body reported an application-level error. |

`#statusCode`, `#statusText` and `#requestMethod` expose the response metadata.

The hooks are the same four as the GraphQL launcher — `beforeRequest`, `afterRequest`, `onUploadProgress` and `onDownloadProgress` — with a truthy `beforeRequest` aborting the request.

## Response body parsing

The launcher parses the response through `ResponseBodyParser`, which defaults to `JsonResponseBodyParser`. Override it to accept another content type.

```javascript
export default class CsvGetRestfulApiLauncher extends BaseAlphaRestfulApiLauncher {
  /** @override */
  static get ResponseBodyParser () {
    return CsvResponseBodyParser
  }
}
```

See [HTTP Client Tools](./client-tools.md) for writing a parser.

## Declaring a method without a subclass

For endpoints that need no behavior of their own, `asGetMethod` and `asPostMethod` return a derived payload constructor with the method already set, so no explicit subclass is needed.

```javascript
const AlphaPayloadCtor = BaseAlphaRestfulApiPayload.asGetMethod
```

The derived constructors are cached in a module-scope pool, so repeated access returns the same class. See [Dynamic Class Declaration](./dynamic-class-declaration.md).
