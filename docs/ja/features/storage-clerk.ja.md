# ストレージクラーク

`StorageClerk` は `localStorage` と `sessionStorage` を 1 つの小さなインターフェースでラップします。これにより、モジュールが扱うストレージはグローバル参照ではなく注入された選択肢になります。

## クラークの生成

```javascript
import {
  StorageClerk,
} from '@openreachtech/furo'

const localStorageClerk = StorageClerk.createAsLocal()
const sessionStorageClerk = StorageClerk.createAsSession()
```

`create()` は `Storage` インターフェースを満たす任意のオブジェクトを受け取ります。これがテスト時にクラークを差し替えやすくしている理由です。

```javascript
const alphaClerk = StorageClerk.create({
  storage: window.localStorage,
})
```

## 読み書き

```javascript
const storageClerk = StorageClerk.createAsLocal()

storageClerk.set('accessToken', 'alpha-token-value')

const accessToken = storageClerk.get('accessToken') // 'alpha-token-value'

storageClerk.remove('accessToken')

storageClerk.clearAll()
```

`#get()` は存在しないキーに対して `null` を返します。`#set()`・`#remove()`・`#clearAll()` はクラーク自身を返すため、メソッドチェーンが可能です。

```javascript
StorageClerk.createAsLocal()
  .set('accessToken', 'alpha-token-value')
  .set('refreshToken', 'beta-token-value')
```

値は基盤となる Web Storage API と全く同様に文字列として保存されます。構造化された値は保存前に自分でシリアライズしてください。

## リクエストへのトークン付与

よく使われるのは、ペイロードのヘッダーフックでトークンを読み出し、すべてのリクエストに付与する形です。

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

`BaseRenchanRestfulApiPayload` は `ACCESS_TOKEN_HEADER_KEY` と `ACCESS_TOKEN_STORAGE_KEY` のゲッターに基づき、既にこの処理を行っています。ただし読み出し先は **セッション** ストレージであり、上記の例のローカルストレージとは異なる点に注意してください。
