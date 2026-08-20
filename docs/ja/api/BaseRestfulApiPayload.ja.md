# BaseRestfulApiPayload

エンドポイント 1 つ分の HTTP メソッドとパス名を宣言し、送信する `Request` を構築します。エンドポイントごとに継承します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。`query`・`body`・`pathParameterHash`・fetch の `options` を受け取ります。 |
| `.createWithFormValueHash()` | `<form>` の値ハッシュからリクエストの各部を構築するファクトリメソッド。 |
| `.get:method` | HTTP メソッド。オーバーライドが必須です。 |
| `.get:pathname` | パス名。`[name]` のセグメントはパスパラメータになります。オーバーライドが必須です。 |
| `.get:prefixPathname` | すべてのパス名の先頭に付与されるプレフィックス（`/v1` など）。 |
| `.get:asGetMethod` | メソッドを `GET` に固定した派生ペイロードコンストラクタ。 |
| `.get:asPostMethod` | メソッドを `POST` に固定した派生ペイロードコンストラクタ。 |
| `.get:queryRequiredFields` | パラメータが妥当であるために必須となるクエリフィールド。 |
| `.get:bodyRequiredFields` | パラメータが妥当であるために必須となるボディフィールド。 |
| `.get:pathParameterRequiredFields` | パラメータが妥当であるために必須となるパスパラメータ。 |
| `.generateRequestParameterHash()` | 値ハッシュをリクエストの各部へ変換します。フォームのフィールドをエンドポイントへ対応づけるためにオーバーライドします。 |
| `.collectBasedHeadersOptions()` | すべてのリクエストにマージされるヘッダーハッシュ。 |
| `.collectBasedFetchOptions()` | すべてのリクエストにマージされる fetch オプションハッシュ。 |
| `.isBodyRequiredMethod()` | 宣言されたメソッドがリクエストボディを送信するかどうか。 |
| `#createFetchRequest()` | このペイロードに対応する `Request` を構築します。 |
| `#isValidAllParameterHash()` | 必須フィールドがすべて存在するかどうか。 |
| `#isInvalidAllParameterHash()` | `#isValidAllParameterHash()` の否定。 |

`.get:asGetMethod` と `.get:asPostMethod` はモジュールスコープのプールにキャッシュされたコンストラクタを返すため、繰り返しアクセスしても同一のクラスが得られます。
