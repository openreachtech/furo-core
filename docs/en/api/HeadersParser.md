# HeadersParser

Parses raw header text, one `Key: value` pair per line, into entries or a `Headers` instance.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `haystack` text to parse. |
| `#parseHeaderEntries()` | Returns the parsed `[key, value]` entries, skipping blank lines. |
| `#createHeaders()` | Returns the parsed entries as a `Headers` instance. |
