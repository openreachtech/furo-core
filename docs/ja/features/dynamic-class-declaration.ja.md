# 動的クラス宣言

これらのツールは実行時にサブクラスを宣言し、それをキャッシュすることで、2 度目以降は同一のクラスを返します。RESTful API クライアントはこれを利用し、HTTP メソッドごとの手書きサブクラスなしで `asGetMethod` と `asPostMethod` を提供しています。

| class | responsibility |
| :-- | :-- |
| `AnonymousClassNameAssigner` | 指定した名前を持つサブクラスを派生させます。 |
| `DerivedClassNameGenerator` | プレフィックスから派生クラス名を構成します。 |
| `DynamicDerivedCtorPool` | 派生コンストラクタを名前でキャッシュします。 |
| `BaseDerivedCtorRegistry` | 上記 3 つを単一の `#obtainCtor()` にまとめます。 |
| `RestMethodRestfulApiPayloadDerivedCtorRegistry` | RESTful API ペイロードが使用するレジストリです。 |

## 無名クラスへの命名

クラス式の `name` は空文字列になります。`AnonymousClassNameAssigner` は名前を持つサブクラスを派生させるため、動的に宣言したクラスをスタックトレースやログ上で識別したい場合に有用です。

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

結果は渡したコンストラクタのサブクラスであり、元のコンストラクタは変更されません。

このツールは単体で完結しています。後述のレジストリはこれを適用しないため、レジストリが返すコンストラクタは無名のままです。

## 派生名の構成

`DerivedClassNameGenerator` は、固定の先頭プレフィックスの後ろにプレフィックスを挿入します。これにより `Base` を先頭に保ちつつ、サブクラスが何を特化したのかを名前で示せます。

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

## 派生コンストラクタのキャッシュ

`DynamicDerivedCtorPool` は名前をキーとするキャッシュです。既に保持している名前を登録してもプールは変化しないため、最初の登録が優先されます。

内部の `Map` は既定でモジュールスコープの共有インスタンスとなるため、キャッシュはプロセス内のすべてのプールインスタンスにまたがります。キャッシュを自分の範囲に閉じたい場合は `pool` を明示的に渡してください。

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

## 独自のレジストリ

`BaseDerivedCtorRegistry` は上記 3 つをまとめます。`#obtainCtor()` は、生成された名前が既に保持されていればキャッシュ済みのコンストラクタを返し、そうでなければ宣言・登録して返します。これを継承し、サブクラスが何を特化するのかを `#generatePrefix()` で、どのように異なるのかを `#declareCtor()` で表現してください。

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

`create()` は派生元の `SuperCtor`、任意の共有 `pool`、既定値 `'Base'` の `fixedPrefix` を受け取ります。

プールは生成された名前をキーとし、モジュールスコープのキャッシュに支えられているため、同じ特化を求める 2 回の呼び出しは同一のクラスを返します。したがって `BaseAlphaRestfulApiPayload.asGetMethod === BaseAlphaRestfulApiPayload.asGetMethod` が成立します。生成された名前はクラスに割り当てられた名前ではなくキャッシュキーであるため、返されるコンストラクタの `name` は空文字列になります。[RESTful API クライアント](./restful-api-client.ja.md) を参照してください。
