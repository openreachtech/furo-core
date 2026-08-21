# BaseRestfulApiPayload

Declares the HTTP method and pathname of one endpoint, and builds the `Request` sent for it. Extend one per endpoint.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes `query`, `body`, `pathParameterHash` and fetch `options`. |
| `.createWithFormValueHash()` | Factory method building the request parts from a `<form>` value hash. |
| `.get:method` | The HTTP method. Must be overridden. |
| `.get:pathname` | The pathname, where a `[name]` segment is a path parameter. Must be overridden. |
| `.get:prefixPathname` | A prefix prepended to every pathname, such as `/v1`. |
| `.get:asGetMethod` | A derived payload constructor with the method fixed to `GET`. |
| `.get:asPostMethod` | A derived payload constructor with the method fixed to `POST`. |
| `.get:queryRequiredFields` | Query fields that must be present for the parameters to be valid. |
| `.get:bodyRequiredFields` | Body fields that must be present for the parameters to be valid. |
| `.get:pathParameterRequiredFields` | Path parameters that must be present for the parameters to be valid. |
| `.generateRequestParameterHash()` | Converts a value hash into the request parts. Override to map form fields onto an endpoint. |
| `.collectBasedHeadersOptions()` | Header hashes merged into every request. |
| `.collectBasedFetchOptions()` | Fetch option hashes merged into every request. |
| `.isBodyRequiredMethod()` | Whether the declared method sends a request body. |
| `#createFetchRequest()` | Builds the `Request` for this payload. |
| `#isValidAllParameterHash()` | Whether every required field is present. |
| `#isInvalidAllParameterHash()` | Negation of `#isValidAllParameterHash()`. |

`.get:asGetMethod` and `.get:asPostMethod` return constructors cached in a module-scope pool, so repeated access yields the same class.
