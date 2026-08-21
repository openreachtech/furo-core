# BaseRenchanRestfulApiCapsule

Extends `BaseRestfulApiCapsule` for Renchan backends, unwrapping the `content` / `error` response envelope.

| member | description |
| :-- | :-- |
| `#get:content` | The `content` field of the response envelope, or `null`. |
| `#get:error` | The `error` field of the response envelope, or `null`. |
| `#hasResultContent()` | Whether the envelope carried content. |
| `#hasResultError()` | Whether the envelope carried an error. |

Every member of [BaseRestfulApiCapsule](./BaseRestfulApiCapsule.md) is inherited.
