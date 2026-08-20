# BaseRenchanRestfulApiPayload

Renchan バックエンド向けに `BaseRestfulApiPayload` を拡張し、セッションストレージから読み出したアクセストークンを付与します。

| member | description |
| :-- | :-- |
| `.get:ACCESS_TOKEN_HEADER_KEY` | アクセストークンを送信するヘッダーキー。オーバーライドが必須です。 |
| `.get:ACCESS_TOKEN_STORAGE_KEY` | アクセストークンを読み出すセッションストレージのキー。オーバーライドが必須です。 |
| `.loadAccessToken()` | セッションストレージからアクセストークンを読み出します。 |
| `.collectBasedHeadersOptions()` | 継承したヘッダーオプションにアクセストークンヘッダーを追加します。 |

[BaseRestfulApiPayload](./BaseRestfulApiPayload.ja.md) のすべてのメンバーを継承します。
