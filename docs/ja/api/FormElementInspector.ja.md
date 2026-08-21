# FormElementInspector

`<form>` 要素を値ハッシュとして読み取ります。各コントロールを自然な JavaScript の値へ解決し、無効化されたコントロールは読み飛ばします。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。読み取り対象の `formElement` を受け取ります。 |
| `#extractValueHash()` | フォームを値ハッシュとして読み取ります。`a[b]` 形式の名前からはネストしたハッシュを構築します。 |
