# BaseFormElementClerk

`<form>` 要素を値ハッシュとして読み取り、クラスに宣言したルールでそのハッシュを検証します。フォームごとに継承し、`.get:rules` をオーバーライドしてください。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。読み取り対象の `formElement` を受け取ります。 |
| `.get:rules` | 検証ルール。1 ルール 1 エントリです。既定値は空配列です。 |
| `#get:controlElements` | フォームのすべてのコントロール要素。 |
| `#extractValueHash()` | フォームを値ハッシュとして読み取ります。`a[b]` 形式の名前からはネストしたハッシュを構築します。 |
| `#generateValidationHash()` | 抽出した値ハッシュを検証し、`valid`・`invalid`・`messages`・`message` のビューを返します。 |
| `#isValid()` | すべてのルールを満たしたかどうか。 |
| `#isInvalid()` | `#isValid()` の否定。 |

ルールは `{ field, ok, message }` の形式です。`ok` は第 1 引数にそのフィールドの値、第 2 引数に値ハッシュ全体を受け取ります。
