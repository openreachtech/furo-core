# FetchHttpParcel

`fetch()` が返したレスポンスの HTTP パーセルです。リダイレクトと種類は、`Response` の値をそのまま返します。

| member | description |
| :-- | :-- |
| `#awaitBody()` | `fetch()` はヘッダーの受信で解決するので、ボディの複製を `WritableStream` に流し切ります。複製は保持しません。ダウンロード中の失敗で reject します。 |
| `#isRedirected()` | レスポンスの `redirected`。受信していない場合は `false`。 |
| `#extractResponseType()` | レスポンスの `type`。受信していない場合は `null`。 |
