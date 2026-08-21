# API

クラスメンバーは以下の表記に従って記述します。

| notation | members |
| :-- | :-- |
| `#instanceProperty` | instance property |
| `#instanceMethod()` | instance method |
| `#get:instanceGetter` | instance getter |
| `#set:instanceSetter` | instance setter |
| `.staticProperty` | static property |
| `.staticMethod()` | static method |
| `.get:staticGetter` | static getter |
| `.set:staticSetter` | static setter |

## GraphQL クライアント

| class | description |
| :-- | :-- |
| [BaseGraphqlPayload](./BaseGraphqlPayload.ja.md) | クエリドキュメントと変数を保持し、`Request` を構築します。 |
| [BaseGraphqlCapsule](./BaseGraphqlCapsule.ja.md) | レスポンスをラップし、どの結果を保持しているかを判定します。 |
| [BaseGraphqlLauncher](./BaseGraphqlLauncher.ja.md) | ペイロードとカプセルを結び付け、リクエストを送信します。 |
| [BaseSubscriptionGraphqlPayload](./BaseSubscriptionGraphqlPayload.ja.md) | サブスクリプションのドキュメントと変数を保持します。 |
| [BaseSubscriptionGraphqlCapsule](./BaseSubscriptionGraphqlCapsule.ja.md) | publish されたサブスクリプションメッセージ 1 件をラップします。 |
| [BaseGraphqlSubscriber](./BaseGraphqlSubscriber.ja.md) | 共有コネクタ経由でペイロードをサブスクライブします。 |
| [SubscriptionConnector](./SubscriptionConnector.ja.md) | サブスクリプションが共有する WebSocket 接続を保持します。 |

## RESTful API クライアント

| class | description |
| :-- | :-- |
| [BaseRestfulApiPayload](./BaseRestfulApiPayload.ja.md) | エンドポイントのメソッドとパス名を宣言し、`Request` を構築します。 |
| [BaseRestfulApiCapsule](./BaseRestfulApiCapsule.ja.md) | レスポンスをラップし、どの結果を保持しているかを判定します。 |
| [BaseRestfulApiLauncher](./BaseRestfulApiLauncher.ja.md) | ペイロードとカプセルを結び付け、リクエストを送信します。 |
| [BaseRenchanRestfulApiPayload](./BaseRenchanRestfulApiPayload.ja.md) | Renchan バックエンド向けにアクセストークンヘッダーを付与します。 |
| [BaseRenchanRestfulApiCapsule](./BaseRenchanRestfulApiCapsule.ja.md) | Renchan の `content` / `error` エンベロープを展開します。 |
| [BaseRenchanRestfulApiLauncher](./BaseRenchanRestfulApiLauncher.ja.md) | Renchan バックエンド向けの基底ランチャーです。 |

`RESTFUL_API_METHOD` もエクスポートされています。これは HTTP メソッド名 `GET`・`POST`・`PUT`・`PATCH`・`DELETE`・`HEAD`・`OPTIONS`・`TRACE`・`CONNECT` のハッシュです。

## フォーム要素クラーク

| class | description |
| :-- | :-- |
| [BaseFormElementClerk](./BaseFormElementClerk.ja.md) | フォームの値を抽出し、検証します。 |
| [BaseLegacyFormElementClerk](./BaseLegacyFormElementClerk.ja.md) | 既存コードのために残されている旧世代のクラークです。 |
| [FormElementInspector](./FormElementInspector.ja.md) | `<form>` を値ハッシュとして読み取ります。 |
| [FormControlElementInspector](./FormControlElementInspector.ja.md) | コントロール 1 つを読み取り、その型を解決します。 |
| [ValueHashValidator](./ValueHashValidator.ja.md) | フィールドルールに基づいて値ハッシュを検証します。 |
| [FieldValidator](./FieldValidator.ja.md) | 1 つのフィールドに紐づく 1 つのルールです。 |
| [HashBuilder](./HashBuilder.ja.md) | フラットな `a[b][c]` キーからネストしたハッシュを構築します。 |
| [UploadingPropertyPathBuilder](./UploadingPropertyPathBuilder.ja.md) | multipart リクエスト向けに `File` 値を特定します。 |
| [DomInflator](./DomInflator.ja.md) | HTML 文字列を要素へ展開します。 |

## ストレージクラーク

| class | description |
| :-- | :-- |
| [StorageClerk](./StorageClerk.ja.md) | `localStorage` と `sessionStorage` を単一のインターフェースでラップします。 |

## IndexedDB クライアント

| class | description |
| :-- | :-- |
| [BaseDatabase](./BaseDatabase.ja.md) | データベースに名前を与え、そのマイグレーションを指し示します。 |
| [BaseDatabaseMigration](./BaseDatabaseMigration.ja.md) | オブジェクトストアとそのインデックスを宣言します。 |
| [BaseStore](./BaseStore.ja.md) | オブジェクトストア 1 つを読み書きします。 |
| [IndexedDbClient](./IndexedDbClient.ja.md) | 開かれた接続を保持し、トランザクションを提供します。 |

## HTTP クライアントツール

| class | description |
| :-- | :-- |
| [ProgressHttpFetcher](./ProgressHttpFetcher.ja.md) | `Request` を実行し、アップロード・ダウンロードの進捗を通知します。 |
| [HeadersParser](./HeadersParser.ja.md) | 生のヘッダーテキストをエントリまたは `Headers` へパースします。 |
| [PathnameBuilder](./PathnameBuilder.ja.md) | パス名内の `[name]` プレースホルダーを補間します。 |
| [BaseResponseBodyParser](./BaseResponseBodyParser.ja.md) | レスポンスボディをパースするための基底クラスです。 |
| [JsonResponseBodyParser](./JsonResponseBodyParser.ja.md) | レスポンスボディを JSON としてパースします。 |

## 動的クラス宣言

| class | description |
| :-- | :-- |
| [AnonymousClassNameAssigner](./AnonymousClassNameAssigner.ja.md) | 指定した名前を持つサブクラスを派生させます。 |
| [DerivedClassNameGenerator](./DerivedClassNameGenerator.ja.md) | プレフィックスから派生クラス名を構成します。 |
| [DynamicDerivedCtorPool](./DynamicDerivedCtorPool.ja.md) | 派生コンストラクタを名前でキャッシュします。 |
| [BaseDerivedCtorRegistry](./BaseDerivedCtorRegistry.ja.md) | 上記 3 つを単一の `#obtainCtor()` にまとめます。 |
| [RestMethodRestfulApiPayloadDerivedCtorRegistry](./RestMethodRestfulApiPayloadDerivedCtorRegistry.ja.md) | RESTful API ペイロードが使用するレジストリです。 |
