# ResponseTextConverter

Converter that decodes the body of an HTTP parcel into text. It decodes with the charset that the `Content-Type` of the response declares, such as `charset=Shift_JIS` or `charset="utf-8"`, and with UTF-8 where it declares none or declares one that `TextDecoder` does not know.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `responseParcel` to convert. |
| `.get:DEFAULT_CHARSET` | The charset used where the response declares none: `utf-8`. |
| `.get:TextDecoderCtor` | The `TextDecoder` class. |
| `.createTextDecoder()` | Creates a `TextDecoder` of a charset, falling back to UTF-8 where the charset is unknown. |
| `#extractCharset()` | The charset that the `Content-Type` of the response declares, or UTF-8. |
| `#toText()` | Decodes the array buffer of the parcel into text, or resolves `null` where the response was not received. |

`BaseHttpParcel#toText()` and `BaseHttpParcel#toJson()` read through it, so that a body in a charset other than UTF-8 is not garbled.
