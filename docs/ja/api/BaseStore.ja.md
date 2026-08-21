# BaseStore

IndexedDB のオブジェクトストア 1 つを、Promise を返すメソッドで読み書きします。ストアごとに継承し、`.get:storeName` をオーバーライドしてください。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。ストアが読み書きに用いる `dbClient` を受け取ります。 |
| `.get:storeName` | オブジェクトストア名。オーバーライドが必須です。 |
| `#get:objectStore` | 新しいトランザクションを介して取得した、基盤となるオブジェクトストア。 |
| `#findAll()` | すべてのレコード。任意で `IDBKeyRange` の `query` と `count` による上限で絞り込めます。 |
| `#findByKey()` | プライマリ `key` に対応するレコード。 |
| `#findByIndex()` | 名前付きインデックスを走査して得られるレコード。`indexName`・`value`・既定値 `'prev'` の `direction`・既定値 `Infinity` の `limit` を受け取ります。 |
| `#save()` | `value` を 1 件書き込みます。任意で明示的な `key` を指定できます。 |
| `#bulkSave()` | `values` の配列を書き込みます。 |

`#get:objectStore` はアクセスごとに新しいトランザクションを開始するため、保持した参照を await をまたいで再利用しないでください。`#save()` は書き込みに失敗した場合、reject せず `null` へ解決します。
