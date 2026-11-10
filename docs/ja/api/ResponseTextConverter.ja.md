# ResponseTextConverter

HTTP パーセルのボディをテキストへデコードするコンバーターです。`CharsetResolver` がレスポンスのヘッダーから解決した文字コードでデコードし、`TextDecoder` が知らない文字コードの場合は UTF-8 を使います。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。変換対象の `responseParcel` を受け取ります。 |
| `.get:DEFAULT_CHARSET` | 解決した文字コードを `TextDecoder` が知らない場合に使う文字コード。`CharsetResolver.DEFAULT_CHARSET` です。 |
| `.get:CharsetResolverCtor` | `CharsetResolver` クラス。 |
| `.createCharsetResolver()` | `headerHash` を渡して、`.get:CharsetResolverCtor` の `CharsetResolver` を生成します。 |
| `.get:TextDecoderCtor` | `TextDecoder` クラス。 |
| `.createTextDecoder()` | 文字コードの `TextDecoder` を生成します。未知の文字コードなら UTF-8 に戻します。 |
| `#resolveCharset()` | パーセルの `headerHash` を渡し、`CharsetResolver` で文字コードを解決します。 |
| `#toText()` | パーセルの配列バッファをテキストへデコードします。レスポンスを受信していない場合は `null` へ解決します。 |

`BaseHttpParcel#toText()` と `BaseHttpParcel#toJson()` はこれを通して読むので、UTF-8 以外の文字コードのボディが文字化けしません。
