# FormControlElementInspector

フォームコントロール 1 つを値として読み取り、その型を解決します。`type="number"` は数値、`type="file"` は `File`、複数選択やチェックボックスグループは配列、ラジオグループはチェックされた要素の値になります。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。読み取り対象の `control` を受け取ります。 |
| `#extractFormControlValue()` | コントロールを値として読み取ります。無効化されている場合は `null` を返します。 |

後方互換のため `FormControlElementClerk` としてもエクスポートされています。どちらの名前も本クラスを指します。
