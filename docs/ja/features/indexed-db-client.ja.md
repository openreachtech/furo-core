# IndexedDB クライアント

IndexedDB は 4 つのクラスでラップされており、データベースを一度宣言すれば、以降は Promise を返すメソッドで利用できます。

| class | responsibility |
| :-- | :-- |
| `BaseDatabase` | データベースに名前を与え、そのマイグレーションを指し示します。データベースごとに継承します。 |
| `BaseDatabaseMigration` | オブジェクトストアとそのインデックスを宣言します。 |
| `BaseStore` | オブジェクトストア 1 つを読み書きします。ストアごとに継承します。 |
| `IndexedDbClient` | 開かれた接続を保持し、トランザクションを提供します。 |

## データベースの宣言

マイグレーションは、すべてのオブジェクトストアとそのプライマリキー、インデックスを宣言します。

```javascript
import {
  BaseDatabaseMigration,
} from '@openreachtech/furo'

export default class ChatDatabaseMigration extends BaseDatabaseMigration {
  /** @override */
  generateObjectStoreArgs () {
    return [
      {
        storeName: 'messages',
        primaryKeyPath: 'id',
        indexArgs: [
          {
            indexName: 'roomId',
            indexKeyPath: [
              'roomId',
              'postedAt',
            ],
            indexOptions: {
              unique: false,
            },
          },
        ],
      },
    ]
  }
}
```

ストアのサブクラスは、読み書き対象のオブジェクトストア名を宣言します。

```javascript
import {
  BaseStore,
} from '@openreachtech/furo'

export default class MessagesStore extends BaseStore {
  /** @override */
  static get storeName () {
    return 'messages'
  }
}
```

データベースが両者を結び付け、各ストアをゲッターとして公開します。

```javascript
import {
  BaseDatabase,
} from '@openreachtech/furo'

export default class ChatDatabase extends BaseDatabase {
  /** @override */
  static get dbName () {
    return 'chat'
  }

  /** @override */
  static get MigrationCtor () {
    return ChatDatabaseMigration
  }

  get messagesStore () {
    return MessagesStore.create({
      dbClient: this.dbClient,
    })
  }
}
```

`dbVersion` の既定値は `1` です。マイグレーションを変更した際に上げると、ブラウザがアップグレードを実行します。

## オープンと利用

オープンは非同期であるため、非同期のファクトリを使用します。

```javascript
const chatDatabase = await ChatDatabase.createAsync()

const messages = await chatDatabase.messagesStore
  .findAll()

const alphaMessage = await chatDatabase.messagesStore
  .findByKey({
    key: 10001,
  })
```

各ストアのゲッターは新しいトランザクションを開始するため、保持した参照を await をまたいで再利用しないでください。

## 検索

`#findAll()` は任意の `IDBKeyRange` と件数上限を受け取ります。

```javascript
const recentMessages = await chatDatabase.messagesStore
  .findAll({
    count: 50,
  })
```

`#findByIndex()` は名前付きインデックスをカーソルで走査し、既定では新しいものから順に取得します。

```javascript
const roomMessages = await chatDatabase.messagesStore
  .findByIndex({
    indexName: 'roomId',
    value: 10001,
    direction: 'prev',
    limit: 20,
  })
```

`direction` は `IDBCursorDirection` の値を受け取り、`limit` の既定値は `Infinity` です。

## 書き込み

```javascript
await chatDatabase.messagesStore
  .save({
    value: {
      id: 10001,
      roomId: 20001,
      content: 'Hello.',
    },
  })

await chatDatabase.messagesStore
  .bulkSave({
    values: [
      { id: 10002, roomId: 20001, content: 'Alpha' },
      { id: 10003, roomId: 20001, content: 'Beta' },
    ],
  })
```

`#save()` は書き込みに失敗した場合、reject せず `null` へ解決します。書き込みの失敗が問題となる場合は戻り値を確認してください。
