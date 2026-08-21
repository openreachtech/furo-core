# IndexedDB Client

IndexedDB is wrapped in four classes, so a database is declared once and then used through promise-returning methods.

| class | responsibility |
| :-- | :-- |
| `BaseDatabase` | Names the database and points to its migration. Extend one per database. |
| `BaseDatabaseMigration` | Declares the object stores and their indexes. |
| `BaseStore` | Reads and writes one object store. Extend one per store. |
| `IndexedDbClient` | Owns the opened connection and hands out transactions. |

## Declaring a database

The migration declares every object store, its primary key, and its indexes.

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

A store subclass names the object store it reads.

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

The database ties them together, and exposes each store as a getter.

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

`dbVersion` defaults to `1`. Raise it when the migration changes, so the browser runs the upgrade.

## Opening and using

Opening is asynchronous, so use the async factory.

```javascript
const chatDatabase = await ChatDatabase.createAsync()

const messages = await chatDatabase.messagesStore
  .findAll()

const alphaMessage = await chatDatabase.messagesStore
  .findByKey({
    key: 10001,
  })
```

Each store getter starts a fresh transaction, so a stored reference should not be reused across awaits.

## Querying

`#findAll()` takes an optional `IDBKeyRange` and a count limit.

```javascript
const recentMessages = await chatDatabase.messagesStore
  .findAll({
    count: 50,
  })
```

`#findByIndex()` walks a named index with a cursor, newest first by default.

```javascript
const roomMessages = await chatDatabase.messagesStore
  .findByIndex({
    indexName: 'roomId',
    value: 10001,
    direction: 'prev',
    limit: 20,
  })
```

`direction` accepts the `IDBCursorDirection` values, and `limit` defaults to `Infinity`.

## Writing

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

`#save()` resolves to `null` rather than rejecting when the write fails, so check the result when a failed write matters.
