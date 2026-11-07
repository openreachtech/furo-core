# XMLHttpParcel

`XMLHttpRequest` から組み立てたレスポンスの HTTP パーセルです。レスポンスは `XMLHttpRequest` が受信した後に組み立てたもので、リダイレクトと種類を知りません。このパーセルは、`XMLHttpRequest` が報告する URL からそれらを答えます。

| member | description |
| :-- | :-- |
| `#isRedirected()` | レスポンスの URL がリクエストの URL と異なるかどうか（どちらもフラグメントを除く）。受信していない場合は `false`。 |
| `#extractResponseType()` | ページと同じオリジンのレスポンスは `basic`、それ以外は `cors`。受信していない場合は `null`。 |
