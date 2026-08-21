# フォーム要素クラーク

フォーム要素クラークは、`<form>` 要素をプレーンな値ハッシュとして読み取り、そのハッシュをクラスに宣言したルールで検証します。

| class | responsibility |
| :-- | :-- |
| `BaseFormElementClerk` | フォームの値を抽出し、検証します。フォームごとに継承します。 |
| `FormElementInspector` | `<form>` を値ハッシュとして読み取ります。 |
| `FormControlElementInspector` | コントロール 1 つを読み取り、その型を解決します。 |
| `ValueHashValidator` | フィールドルールに基づいて値ハッシュを検証します。 |
| `FieldValidator` | 1 つのフィールドに紐づく 1 つのルールです。 |
| `HashBuilder` | フラットな `a[b][c]` 形式のキーからネストしたハッシュを構築します。 |
| `DomInflator` | HTML 文字列を要素へ展開します。 |

## クラークの宣言

`rules` をオーバーライドし、1 検証あたり 1 エントリを記述します。同じフィールドを対象とするルールを複数並べることもでき、それぞれが独自のメッセージを持ちます。

```javascript
import {
  BaseFormElementClerk,
} from '@openreachtech/furo'

export default class SignUpFormElementClerk extends BaseFormElementClerk {
  /** @override */
  static get rules () {
    return [
      {
        ok: (it, valueHash) => it,
        field: 'username',
        message: 'username must be set',
      },
      {
        ok: (it, valueHash) => /^\w+$/u.test(it),
        field: 'username',
        message: 'username must be alphanumeric',
      },
      {
        ok: (it, valueHash) =>
          !it || it === valueHash.password,
        field: 'password-confirmation',
        message: 'passwords do not match',
      },
    ]
  }
}
```

`ok` 関数は第 1 引数にそのフィールド自身の値、第 2 引数に値ハッシュ全体を受け取ります。パスワード確認のように 2 つのフィールドを比較するルールは、この仕組みで実現できます。

## 抽出と検証

```javascript
const formElement = document.getElementById('sign-up-form')

const formElementClerk = SignUpFormElementClerk.create({
  formElement,
})

const valueHash = formElementClerk.extractValueHash()
// { username: 'AlphaUser', password: '...', ... }

if (formElementClerk.isInvalid()) {
  const validationHash = formElementClerk.generateValidationHash()

  console.log(validationHash.message.username)
}
```

`#generateValidationHash()` は同一の結果を 4 つのビューとして返します。

| key | value |
| :-- | :-- |
| `valid` | フィールド名 → そのフィールドのすべてのルールを満たした場合に `true`。 |
| `invalid` | フィールド名 → いずれかのルールを満たさなかった場合に `true`。 |
| `messages` | フィールド名 → 満たさなかったすべてのルールのメッセージ。 |
| `message` | フィールド名 → 最初に満たさなかったルールのメッセージ。 |

`#isValid()` と `#isInvalid()` は、これを単一の真偽値にまとめます。

## コントロールの型

`FormElementInspector` は各コントロールを自然な JavaScript の値へ解決します。`type="number"` は数値、`type="file"` は `File`、複数選択やチェックボックスグループは配列、ラジオグループはチェックされた要素の値になります。無効化されたコントロールは読み飛ばされます。

ネストした名前はネストしたハッシュを構築するため、`name="user[address][city]"` は `valueHash.user.address.city` として読み出せます。この組み立ては `HashBuilder` が担っており、単体でも使用できます。

```javascript
import {
  HashBuilder,
} from '@openreachtech/furo'

const valueHash = HashBuilder.create()
  .setValues({
    values: [
      ['user[name]', 'Alpha'],
      ['user[address][city]', 'Tokyo'],
    ],
  })
  .buildHash()
// { user: { name: 'Alpha', address: { city: 'Tokyo' } } }
```

## リクエストへの受け渡し

抽出した値ハッシュはそのままペイロードのファクトリへ渡せるため、フォーム送信のために手書きのマッピング処理を用意する必要はありません。

```javascript
const payload = SignUpMutationGraphqlLauncher.createPayloadWithFormValueHash({
  valueHash: formElementClerk.extractValueHash(),
})
```

[GraphQL クライアント](./graphql-client.ja.md) および [RESTful API クライアント](./restful-api-client.ja.md) を参照してください。

## 旧世代のクラーク

`BaseLegacyFormElementClerk` は既存コードのために残されている以前の実装です。`FormElementInspector` に委譲せずコントロール要素を直接読み取り、ネストしたハッシュを構築しません。新規コードでは `BaseFormElementClerk` を使用してください。

## HTML の展開

`DomInflator` は HTML 文字列を要素の配列へ変換します。コンテナへ `innerHTML` を代入した場合に残るラッパー要素は生じません。

```javascript
import {
  DomInflator,
} from '@openreachtech/furo'

const elements = DomInflator.create({
  html: '<li>Alpha</li><li>Beta</li>',
})
  .inflateElements()
// [<li>Alpha</li>, <li>Beta</li>]
```
