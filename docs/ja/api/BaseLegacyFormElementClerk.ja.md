# BaseLegacyFormElementClerk

既存コードのために残されている旧世代のフォーム要素クラークです。`FormElementInspector` に委譲せずコントロール要素を直接読み取り、ネストしたハッシュを構築しません。新規コードでは `BaseFormElementClerk` を使用してください。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。読み取り対象の `formElement` を受け取ります。 |
| `.get:rules` | 検証ルール。1 ルール 1 エントリです。 |
| `#get:controlElements` | フォームのすべてのコントロール要素。 |
| `#extractValueHash()` | フォームをフラットな値ハッシュとして読み取ります。 |
| `#generateValidationHash()` | 抽出した値ハッシュを検証します。 |
| `#isValid()` | すべてのルールを満たしたかどうか。 |
| `#isInvalid()` | `#isValid()` の否定。 |
