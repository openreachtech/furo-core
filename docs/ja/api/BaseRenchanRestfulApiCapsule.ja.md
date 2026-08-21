# BaseRenchanRestfulApiCapsule

Renchan バックエンド向けに `BaseRestfulApiCapsule` を拡張し、`content` / `error` のレスポンスエンベロープを展開します。

| member | description |
| :-- | :-- |
| `#get:content` | レスポンスエンベロープの `content` フィールド。存在しない場合は `null`。 |
| `#get:error` | レスポンスエンベロープの `error` フィールド。存在しない場合は `null`。 |
| `#hasResultContent()` | エンベロープがコンテンツを保持しているかどうか。 |
| `#hasResultError()` | エンベロープがエラーを保持しているかどうか。 |

[BaseRestfulApiCapsule](./BaseRestfulApiCapsule.ja.md) のすべてのメンバーを継承します。
