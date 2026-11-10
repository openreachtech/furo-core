# ResponseTextConverter

Converter that decodes the body of an HTTP parcel into text. It decodes with the charset that `CharsetResolver` resolves from the headers of the response, and with UTF-8 where `TextDecoder` does not know that charset.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `responseParcel` to convert. |
| `.get:DEFAULT_CHARSET` | The charset used where `TextDecoder` does not know the resolved one. It is `CharsetResolver.DEFAULT_CHARSET`. |
| `.get:CharsetResolverCtor` | The `CharsetResolver` class. |
| `.createCharsetResolver()` | Creates a `CharsetResolver` of `.get:CharsetResolverCtor` with a `headerHash`. |
| `.get:TextDecoderCtor` | The `TextDecoder` class. |
| `.createTextDecoder()` | Creates a `TextDecoder` of a charset, falling back to UTF-8 where the charset is unknown. |
| `#resolveCharset()` | Resolves the charset through `CharsetResolver`, with the header hash that `BaseHttpParcel#extractHeaderHash()` returns. |
| `#toText()` | Decodes the array buffer of the parcel into text, or resolves `null` where the response was not received. |

`BaseHttpParcel#toText()` and `BaseHttpParcel#toJson()` read through it, so that a body in a charset other than UTF-8 is not garbled.
