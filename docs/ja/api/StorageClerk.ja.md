# StorageClerk

`localStorage` と `sessionStorage` を単一のインターフェースでラップし、モジュールが扱うストレージをグローバル参照ではなく注入された選択肢にします。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`Storage` インターフェースを満たす任意のオブジェクトを受け取ります。 |
| `.createAsLocal()` | `window.localStorage` を基盤とするファクトリメソッド。 |
| `.createAsSession()` | `window.sessionStorage` を基盤とするファクトリメソッド。 |
| `#get()` | キーに対応する値。存在しない場合は `null`。 |
| `#set()` | キーに値を保存します。クラーク自身を返すため、メソッドチェーンが可能です。 |
| `#remove()` | キーに対応する値を削除します。クラーク自身を返すため、メソッドチェーンが可能です。 |
| `#clearAll()` | すべての値を削除します。クラーク自身を返すため、メソッドチェーンが可能です。 |

値は基盤となる Web Storage API と同様に文字列として保存されます。構造化された値は保存前にシリアライズしてください。
