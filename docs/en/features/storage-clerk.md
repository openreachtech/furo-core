# Storage Clerk

`StorageClerk` wraps `localStorage` and `sessionStorage` behind one small interface, so the storage a module talks to becomes an injected choice rather than a global reference.

## Creating a clerk

```javascript
import {
  StorageClerk,
} from '@openreachtech/furo'

const localStorageClerk = StorageClerk.createAsLocal()
const sessionStorageClerk = StorageClerk.createAsSession()
```

`create()` accepts any object satisfying the `Storage` interface, which is what makes the clerk straightforward to stand in for during tests.

```javascript
const alphaClerk = StorageClerk.create({
  storage: window.localStorage,
})
```

## Reading and writing

```javascript
const storageClerk = StorageClerk.createAsLocal()

storageClerk.set('accessToken', 'alpha-token-value')

const accessToken = storageClerk.get('accessToken') // 'alpha-token-value'

storageClerk.remove('accessToken')

storageClerk.clearAll()
```

`#get()` returns `null` for a missing key. `#set()`, `#remove()` and `#clearAll()` return the clerk itself, so calls chain.

```javascript
StorageClerk.createAsLocal()
  .set('accessToken', 'alpha-token-value')
  .set('refreshToken', 'beta-token-value')
```

Values are stored as strings, exactly as the underlying Web Storage API does — serialize structured values yourself before storing them.

## Attaching a token to requests

A common use is reading a token in a payload's header hook, so every request carries it.

```javascript
import {
  BaseGraphqlPayload,
  StorageClerk,
} from '@openreachtech/furo'

export default class BaseAlphaGraphqlPayload extends BaseGraphqlPayload {
  /** @override */
  static collectBasedHeadersOptions () {
    const basedOptions = super.collectBasedHeadersOptions()

    const accessToken = StorageClerk.createAsLocal()
      .get('accessToken')

    if (!accessToken) {
      return basedOptions
    }

    return [
      ...basedOptions,

      {
        'x-renchan-access-token': accessToken,
      },
    ]
  }
}
```

`BaseRenchanRestfulApiPayload` already does this, driven by its `ACCESS_TOKEN_HEADER_KEY` and `ACCESS_TOKEN_STORAGE_KEY` getters. Note that it reads **session** storage, whereas the example above reads local storage.
