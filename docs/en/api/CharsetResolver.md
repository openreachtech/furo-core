# CharsetResolver

Resolves the charset that the `Content-Type` header declares, such as `charset=Shift_JIS` or `charset="utf-8"`, from the header hash of an HTTP parcel. It resolves the default charset where the header is missing, declares no charset, or declares an empty one.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `headerHash`, a `Record<string, string>` whose names are in lower case, or `null`. |
| `.get:DEFAULT_CHARSET` | The charset used where the headers declare none: `utf-8`. |
| `#resolveCharset()` | The declared charset without the spaces around it, or `.get:DEFAULT_CHARSET`. |
| `#extractDeclaredCharset()` | The charset that a `Content-Type` declares, trimmed, or `null` where it declares none. |

`ResponseTextConverter` resolves the charset through it, with `BaseHttpParcel#get:headerHash`.
