# API

Class members are written with the following notation.

| notation | members |
| :-- | :-- |
| `#instanceProperty` | instance property |
| `#instanceMethod()` | instance method |
| `#get:instanceGetter` | instance getter |
| `#set:instanceSetter` | instance setter |
| `.staticProperty` | static property |
| `.staticMethod()` | static method |
| `.get:staticGetter` | static getter |
| `.set:staticSetter` | static setter |

## GraphQL Client

| class | description |
| :-- | :-- |
| [BaseGraphqlPayload](./BaseGraphqlPayload.md) | Holds a query document and its variables, and builds the `Request`. |
| [BaseGraphqlCapsule](./BaseGraphqlCapsule.md) | Wraps a response, and answers which outcome it holds. |
| [BaseGraphqlLauncher](./BaseGraphqlLauncher.md) | Binds a payload to a capsule, and launches the request. |
| [BaseSubscriptionGraphqlPayload](./BaseSubscriptionGraphqlPayload.md) | Holds a subscription document and its variables. |
| [BaseSubscriptionGraphqlCapsule](./BaseSubscriptionGraphqlCapsule.md) | Wraps one published subscription message. |
| [BaseGraphqlSubscriber](./BaseGraphqlSubscriber.md) | Subscribes a payload over a shared connector. |
| [SubscriptionConnector](./SubscriptionConnector.md) | Owns the WebSocket connection that subscriptions share. |

## RESTful API Client

| class | description |
| :-- | :-- |
| [BaseRestfulApiPayload](./BaseRestfulApiPayload.md) | Declares an endpoint's method and pathname, and builds the `Request`. |
| [BaseRestfulApiCapsule](./BaseRestfulApiCapsule.md) | Wraps a response, and answers which outcome it holds. |
| [BaseRestfulApiLauncher](./BaseRestfulApiLauncher.md) | Binds a payload to a capsule, and launches the request. |
| [BaseRenchanRestfulApiPayload](./BaseRenchanRestfulApiPayload.md) | Adds an access-token header for Renchan backends. |
| [BaseRenchanRestfulApiCapsule](./BaseRenchanRestfulApiCapsule.md) | Unwraps the Renchan `content` / `error` envelope. |
| [BaseRenchanRestfulApiLauncher](./BaseRenchanRestfulApiLauncher.md) | Base launcher for Renchan backends. |

`RESTFUL_API_METHOD` is also exported: a hash of the HTTP method names `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`, `TRACE` and `CONNECT`.

## Form Element Clerk

| class | description |
| :-- | :-- |
| [BaseFormElementClerk](./BaseFormElementClerk.md) | Extracts and validates a form's values. |
| [BaseLegacyFormElementClerk](./BaseLegacyFormElementClerk.md) | The earlier clerk, kept for existing code. |
| [FormElementInspector](./FormElementInspector.md) | Reads a `<form>` into a value hash. |
| [FormControlElementInspector](./FormControlElementInspector.md) | Reads a single control, resolving its type. |
| [ValueHashValidator](./ValueHashValidator.md) | Validates a value hash against field rules. |
| [FieldValidator](./FieldValidator.md) | One rule bound to one field. |
| [HashBuilder](./HashBuilder.md) | Builds a nested hash from flat `a[b][c]` keys. |
| [UploadingPropertyPathBuilder](./UploadingPropertyPathBuilder.md) | Locates `File` values for a multipart request. |
| [DomInflator](./DomInflator.md) | Inflates an HTML string into elements. |

## Storage Clerk

| class | description |
| :-- | :-- |
| [StorageClerk](./StorageClerk.md) | Wraps `localStorage` and `sessionStorage` behind one interface. |

## IndexedDB Client

| class | description |
| :-- | :-- |
| [BaseDatabase](./BaseDatabase.md) | Names a database and points to its migration. |
| [BaseDatabaseMigration](./BaseDatabaseMigration.md) | Declares the object stores and their indexes. |
| [BaseStore](./BaseStore.md) | Reads and writes one object store. |
| [IndexedDbClient](./IndexedDbClient.md) | Owns the opened connection and hands out transactions. |

## HTTP Client Tools

| class | description |
| :-- | :-- |
| [BaseHttpFetcher](./BaseHttpFetcher.md) | Base class of the HTTP fetchers, which owns the flow of a fetch. |
| [XMLHttpFetcher](./XMLHttpFetcher.md) | Fetches over `XMLHttpRequest`, reporting upload and download progress. |
| [FetchHttpFetcher](./FetchHttpFetcher.md) | Fetches over `fetch()`, keeping the `Response` as it is. |
| [XMLHttpRequestClerk](./XMLHttpRequestClerk.md) | Wraps an `XMLHttpRequest`, so that its calls chain. |
| [AbortTimer](./AbortTimer.md) | Aborts a request when the timeout elapses, and can be cleared. |
| [ResponseTextConverter](./ResponseTextConverter.md) | Decodes a response body into text with the charset that the response declares. |
| [BaseHttpParcel](./BaseHttpParcel.md) | What a fetcher returns: the response, or the error that kept it from being received. |
| [XMLHttpParcel](./XMLHttpParcel.md) | HTTP parcel of a response built from `XMLHttpRequest`. |
| [FetchHttpParcel](./FetchHttpParcel.md) | HTTP parcel of a response that `fetch()` returned. |
| [HeadersParser](./HeadersParser.md) | Parses raw header text into entries or a `Headers`. |
| [PathnameBuilder](./PathnameBuilder.md) | Interpolates `[name]` placeholders in a pathname. |
| [BaseResponseBodyParser](./BaseResponseBodyParser.md) | Base class for parsing the body of an HTTP parcel. |
| [JsonResponseBodyParser](./JsonResponseBodyParser.md) | Parses the body of an HTTP parcel as JSON. |
| [BaseRequestBodyConverter](./BaseRequestBodyConverter.md) | Base class for converting a request body. |
| [FormDataRequestBodyConverter](./FormDataRequestBodyConverter.md) | Converts a request body into `FormData`. |
| [JsonRequestBodyConverter](./JsonRequestBodyConverter.md) | Converts a request body into JSON text. |

## Dynamic Class Declaration

| class | description |
| :-- | :-- |
| [AnonymousClassNameAssigner](./AnonymousClassNameAssigner.md) | Derives a subclass carrying a given name. |
| [DerivedClassNameGenerator](./DerivedClassNameGenerator.md) | Composes a derived class name from a prefix. |
| [DynamicDerivedCtorPool](./DynamicDerivedCtorPool.md) | Caches derived constructors by name. |
| [BaseDerivedCtorRegistry](./BaseDerivedCtorRegistry.md) | Combines the three into a single `#obtainCtor()`. |
| [RestMethodRestfulApiPayloadDerivedCtorRegistry](./RestMethodRestfulApiPayloadDerivedCtorRegistry.md) | The registry the RESTful API payload uses. |
