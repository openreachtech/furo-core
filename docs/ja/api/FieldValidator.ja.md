# FieldValidator

1 つのフィールドに紐づく 1 つの検証ルールです。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`{ field, ok, message }` を受け取ります。 |
| `#accepts()` | このバリデータが指定されたフィールドを対象とするかどうか。 |
| `#rejects()` | `#accepts()` の否定。 |
| `#isValid()` | `variables` ハッシュ全体を参照しつつ、`target` の値へルールを適用します。 |
| `#isInvalid()` | `#isValid()` の否定。 |
| `#getMessage()` | ルールを満たさなかった場合に報告されるメッセージ。未設定の場合は `null`。 |
