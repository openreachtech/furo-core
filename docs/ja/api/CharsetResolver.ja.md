# CharsetResolver

HTTP パーセルのヘッダーハッシュから、`Content-Type` ヘッダーが宣言する文字コード（`charset=Shift_JIS` や `charset="utf-8"` など）を解決します。ヘッダーがない場合、文字コードの宣言がない場合、宣言が空の場合は既定の文字コードを返します。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。名前が小文字の `Record<string, string>`、または `null` の `headerHash` を受け取ります。 |
| `.get:DEFAULT_CHARSET` | ヘッダーが文字コードを宣言しない場合に使う文字コード。`utf-8` です。 |
| `#resolveCharset()` | 前後の空白を除いた宣言の文字コード。なければ `.get:DEFAULT_CHARSET`。 |
| `#extractDeclaredCharset()` | `Content-Type` が宣言する文字コードを、前後の空白を除いて返します。宣言がなければ `null`。 |

`ResponseTextConverter` は `BaseHttpParcel#extractHeaderHash()` の結果を渡して、これで文字コードを解決します。
