# HeadersParser

1 行に `Key: value` の組が並ぶ生のヘッダーテキストを、エントリまたは `Headers` インスタンスへパースします。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。パース対象のテキスト `haystack` を受け取ります。 |
| `#parseHeaderEntries()` | パースした `[key, value]` のエントリを返します。空行は読み飛ばします。 |
| `#createHeaders()` | パースしたエントリを `Headers` インスタンスとして返します。 |
