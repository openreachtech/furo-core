# AnonymousClassNameAssigner

Derives a subclass that carries a given name, since a class expression reports an empty `name`.

| member | description |
| :-- | :-- |
| `.create()` | Factory method. Takes the `AnonymousCtor` to derive from. |
| `#assignClassName()` | Returns a subclass whose `name` is the given `name`. The original constructor is untouched. |
