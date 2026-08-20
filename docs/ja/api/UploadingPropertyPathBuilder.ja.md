# UploadingPropertyPathBuilder

変数ハッシュ内の `File` 値を特定し、GraphQL multipart リクエストに必要なパスマップを生成します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。走査対象の `value` を受け取ります。 |
| `.buildNodes()` | 値を走査してパスノードへ変換します。 |
| `.isNodeValue()` | 値が走査上のリーフとして扱われるかどうか。 |
| `#generateUploadingPathMap()` | multipart リクエストの `map` フィールド。各ファイルパートと変数パスを対応づけます。 |
| `#generateUploadingEntries()` | `FormData` ボディへ追加されるファイルパート。 |
| `#extractUploadingNodes()` | `File` 値を保持するパスノード。 |
