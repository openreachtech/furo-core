# BaseRequestClerk

`Request` を送信し、その `Response` を組み立てるための基底クラスです。クラークは 1 つのリクエストを担当し、`request`・`config`・`sink` を保持します。すべてのサブクラスが同じ入力を受け取り、同じ `#buildResponse()` でレスポンスを組み立てます。`XMLHttpRequestClerk` と `FetchRequestClerk` がこれを継承します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`request`、任意の `config`、任意の `sink` を受け取ります。 |
| `.validateResponseType()` | `responseType` が `''`・`'text'`・`'blob'`・`'arraybuffer'`（`Response` がボディとしてそのまま受け取れる型）以外なら `TypeError` を投げます。 |
| `.resolveWithCredentials()` | `withCredentials` の既定値を解決します。リクエストの `credentials` が `'include'` のとき `true` です。 |
| `.buildNetworkError()` | すべてのサブクラスが reject に使う `TypeError`（`Network request aborted`・`failed`・`timed out`）を組み立てます。元のエラーは `cause` に入ります。 |
| `#buildResponse()` | リクエストを送信し、その `Response` へ解決します。オーバーライドが必須です。 |

`config` は `timeout`（ミリ秒、既定値 `0` で無制限に待ちます）、`responseType`（既定値 `''`。`''`・`'text'`・`'blob'`・`'arraybuffer'` のいずれか）、`withCredentials`（既定値は `.resolveWithCredentials()`）を受け取ります。`config` で省略された値は `.create()` が補い、コンストラクタは既定値を適用しません。

`sink` は `onUploadProgress` と `onDownloadProgress` を受け取ります。進捗を通知できないクラークはこれを読み取りません。
