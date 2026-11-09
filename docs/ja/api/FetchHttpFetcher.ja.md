# FetchHttpFetcher

`fetch()` 経由でリクエストを送信する HTTP フェッチャーです。レスポンスは受信した `Response` のまま保持するので、ボディをストリームとして読めます。進捗は通知しません。

| member | description |
| :-- | :-- |
| `.get:HttpParcelCtor` | `FetchHttpParcel` を返します。 |
| `.get:fetch` | リクエストに使用される fetch 関数。 |
| `#receiveResponse()` | 中断用のシグナルを持つオプションハッシュとともに、リクエストの複製を `fetch()` で送信し、ボディをすべて受信してから解決します。ダウンロード中のタイムアウトはここで reject するので、タイムアウトとして報告されます。 |
| `#awaitBody()` | 複製を通してボディをすべて待ちます。レスポンスのボディは未読のままです。 |
| `#resolveResponseUrl()` | `fetch()` が報告するレスポンスの URL。 |
| `#buildOptionHash()` | `config.optionHash` とシグナルから `fetch()` のオプションハッシュを組み立てます。シグナルが常に優先されます。 |
| `#invokeFetch()` | リクエストとオプションハッシュで `.get:fetch` を呼び出します。 |
| `#createHttpParcelByUnnamedFailure()` | 名前では分からない失敗は、通信失敗として扱います。 |

`config` は `optionHash` を受け取ります。これは `signal` を除いた `RequestInit` で、`keepalive`、`cache`、`priority` など、`Request` では表せないものを渡します。
