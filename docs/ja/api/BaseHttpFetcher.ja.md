# BaseHttpFetcher

`Request` を送信し、その `Response` へ解決するための基底クラスです。`ProgressHttpFetcher` と `FetchHttpFetcher` がこれを継承し、ランチャーの `createHttpFetcher()` はそのサブクラスを返します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。任意の `timeout`（ミリ秒）を受け取ります。既定値は `0` で、無制限に待ちます。 |
| `#fetchRequest()` | `request` を送信し、`Response` へ解決します。進捗用の任意の `sink` を受け取ります。オーバーライドが必須です。 |
