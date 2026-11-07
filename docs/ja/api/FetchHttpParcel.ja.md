# FetchHttpParcel

`fetch()` が返したレスポンスの HTTP パーセルです。リダイレクトと種類は、`Response` の値をそのまま返します。

| member | description |
| :-- | :-- |
| `#isRedirected()` | レスポンスの `redirected`。受信していない場合は `false`。 |
| `#extractResponseType()` | レスポンスの `type`。受信していない場合は `null`。 |
