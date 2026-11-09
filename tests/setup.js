// To apply fetch API polyfill for Jest
import 'whatwg-fetch'

// To apply TextDecoder for Jest, because jsdom does not provide it.
import { TextDecoder as NodeTextDecoder } from 'node:util'

globalThis.TextDecoder = NodeTextDecoder
