# BaseRenchanRestfulApiPayload

Extends `BaseRestfulApiPayload` for Renchan backends, attaching an access token read from session storage.

| member | description |
| :-- | :-- |
| `.get:ACCESS_TOKEN_HEADER_KEY` | The header key the access token is sent under. Must be overridden. |
| `.get:ACCESS_TOKEN_STORAGE_KEY` | The session storage key the access token is read from. Must be overridden. |
| `.loadAccessToken()` | Reads the access token from session storage. |
| `.collectBasedHeadersOptions()` | Adds the access token header to the inherited header options. |

Every member of [BaseRestfulApiPayload](./BaseRestfulApiPayload.md) is inherited.
