# DomInflator

Inflates an HTML string into an array of elements, without the wrapper element that assigning to `innerHTML` on a container would leave behind.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `html` to inflate. |
| `.get:htmlDocument` | The document the template element is created in. |
| `#inflateElements()` | Returns the inflated elements as an array. |
