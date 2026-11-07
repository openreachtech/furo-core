import { XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP } from '../../../../../../../lib/tools/http-fetchers/tools/constants/XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP.js'

describe('XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP', () => {
  describe('named export', () => {
    describe('as XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP', () => {
      describe('when imported', () => {
        test('should map each member of the sink to the event name of XMLHttpRequest', () => {
          const expected = {
            onLoadStart: 'loadstart',
            onDownloadProgress: 'progress',
            onLoad: 'load',
            onAbort: 'abort',
            onError: 'error',
            onTimeout: 'timeout',
            onLoadEnd: 'loadend',
            onReadyStateChange: 'readystatechange',
          }

          const received = XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP

          expect(received)
            .toStrictEqual(expected)
        })
      })
    })
  })
})
