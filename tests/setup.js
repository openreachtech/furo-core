// To apply fetch API polyfill for Jest
import 'whatwg-fetch'

// To apply TextDecoder for Jest, because jsdom does not provide it.
import { TextDecoder as NodeTextDecoder } from 'node:util'

globalThis.TextDecoder = NodeTextDecoder

// To apply WritableStream for Jest, because jsdom does not provide it.
import { WritableStream as NodeWritableStream } from 'node:stream/web'

globalThis.WritableStream = NodeWritableStream
