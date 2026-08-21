# ValueHashValidator

フィールドルールに基づいて値ハッシュを検証し、同一の結果を 4 つのビューとして報告します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`valueHash` と `rules` の配列を受け取り、各ルールを `FieldValidator` へ変換します。 |
| `#generateValidationHash()` | フィールド名をキーとする `{ valid, invalid, messages, message }` を返します。 |
| `#isValid()` | すべてのルールを満たしたかどうか。 |
| `#isInvalid()` | `#isValid()` の否定。 |

`valid` と `invalid` はフィールド名を真偽値に、`messages` は失敗したすべてのルールのメッセージに、`message` は最初に失敗したルールのメッセージに対応づけます。
