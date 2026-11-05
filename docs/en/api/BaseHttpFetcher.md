# BaseHttpFetcher

Base class for sending a `Request` and resolving to its `Response`. `ProgressHttpFetcher` and `FetchHttpFetcher` extend it, and `createHttpFetcher()` of a launcher returns one of its subclasses.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes an optional `timeout` in milliseconds, defaulting to `0`, which waits without limit. |
| `#fetchRequest()` | Sends the `request` and resolves to a `Response`. Takes an optional `sink` for progress. Must be overridden. |
