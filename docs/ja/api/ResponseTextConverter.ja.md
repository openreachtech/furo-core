# ResponseTextConverter

HTTP パーセルのボディをテキストへデコードするコンバーターです。レスポンスの `Content-Type` が宣言する文字コード（`charset=Shift_JIS` や `charset="utf-8"` など）でデコードし、宣言がない場合や `TextDecoder` が知らない文字コードの場合は UTF-8 を使います。

| member | description |
| :-- | :-- |
| `.create()` | ファクトリメソッド。変換対象の `responseParcel` を受け取ります。 |
| `.get:DEFAULT_CHARSET` | レスポンスが文字コードを宣言しない場合に使う文字コード。`utf-8` です。 |
| `.get:TextDecoderCtor` | `TextDecoder` クラス。 |
| `.createTextDecoder()` | 文字コードの `TextDecoder` を生成します。未知の文字コードなら UTF-8 に戻します。 |
| `#extractCharset()` | レスポンスの `Content-Type` が宣言する文字コード。なければ UTF-8。 |
| `#toText()` | パーセルの配列バッファをテキストへデコードします。レスポンスを受信していない場合は `null` へ解決します。 |

`BaseHttpParcel#toText()` と `BaseHttpParcel#toJson()` はこれを通して読むので、UTF-8 以外の文字コードのボディが文字化けしません。
