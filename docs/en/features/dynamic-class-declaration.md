# Dynamic Class Declaration

These tools declare subclasses at run time, and cache them so that asking twice yields the same class. The RESTful API client uses them to provide `asGetMethod` and `asPostMethod` without a hand-written subclass per HTTP method.

| class | responsibility |
| :-- | :-- |
| `AnonymousClassNameAssigner` | Derives a subclass carrying a given name. |
| `DerivedClassNameGenerator` | Composes a derived class name from a prefix. |
| `DynamicDerivedCtorPool` | Caches derived constructors by name. |
| `BaseDerivedCtorRegistry` | Combines the three into a single `#obtainCtor()`. |
| `RestMethodRestfulApiPayloadDerivedCtorRegistry` | The registry the RESTful API payload uses. |

## Naming an anonymous class

A class expression reports an empty `name`. `AnonymousClassNameAssigner` derives a subclass that carries a name, which is useful when a dynamically declared class has to be identifiable in a stack trace or a log.

```javascript
import {
  AnonymousClassNameAssigner,
} from '@openreachtech/furo'

const AlphaCtor = AnonymousClassNameAssigner.create({
  AnonymousCtor: class {},
})
  .assignClassName({
    name: 'AlphaClass',
  })

console.log(AlphaCtor.name) // 'AlphaClass'
```

The result is a subclass of the constructor passed in, so the original stays untouched.

This tool stands on its own — the registry below does not apply it, so the constructors it hands back are anonymous.

## Composing a derived name

`DerivedClassNameGenerator` inserts a prefix after a fixed leading prefix, which keeps a `Base` prefix in front while marking what the subclass specializes.

```javascript
import {
  DerivedClassNameGenerator,
} from '@openreachtech/furo'

const className = DerivedClassNameGenerator.create({
  className: 'BaseRestfulApiPayload',
  fixedPrefix: 'Base',
})
  .generateClassName({
    prefix: 'Get',
  })
// 'BaseGetRestfulApiPayload'
```

## Caching derived constructors

`DynamicDerivedCtorPool` is a cache keyed by name. Registering a name already held leaves the pool unchanged, so the first registration wins.

The backing `Map` defaults to one shared at module scope, so the cache spans every pool instance in the process. Pass an explicit `pool` to keep a cache to yourself.

```javascript
import {
  DynamicDerivedCtorPool,
} from '@openreachtech/furo'

const ctorPool = DynamicDerivedCtorPool.create({
  pool: new Map(),
})

ctorPool.registerCtor({
  name: 'AlphaClass',
  Ctor: AlphaCtor,
})

ctorPool.containsCtor({ name: 'AlphaClass' }) // true
ctorPool.retrieveCtor({ name: 'AlphaClass' }) // AlphaCtor
ctorPool.retrieveCtor({ name: 'BetaClass' }) // null
```

## A registry of your own

`BaseDerivedCtorRegistry` puts the three together. `#obtainCtor()` returns the cached constructor when the generated name is already held, and otherwise declares, registers and returns it. Extend it, and override `#generatePrefix()` to say what the subclass specializes and `#declareCtor()` to say how it differs.

```javascript
import {
  BaseDerivedCtorRegistry,
} from '@openreachtech/furo'

export default class RestMethodDerivedCtorRegistry extends BaseDerivedCtorRegistry {
  /** @override */
  generatePrefix () {
    return this.method
  }

  /** @override */
  declareCtor () {
    const { method } = this

    return class extends this.SuperCtor {
      /** @override */
      static get method () {
        return method
      }
    }
  }
}
```

`create()` takes the `SuperCtor` to derive from, an optional shared `pool`, and a `fixedPrefix` that defaults to `'Base'`.

Because the pool is keyed by the generated name and backed by a module-scope cache, two calls asking for the same specialization return the identical class, so `BaseAlphaRestfulApiPayload.asGetMethod === BaseAlphaRestfulApiPayload.asGetMethod` holds. The generated name is the cache key rather than a name assigned to the class, so the returned constructor reports an empty `name`. See [RESTful API Client](./restful-api-client.md).
