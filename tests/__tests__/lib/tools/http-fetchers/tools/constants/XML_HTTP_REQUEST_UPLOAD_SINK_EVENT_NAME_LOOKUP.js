import { XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP } from '../../../../../../../lib/tools/http-fetchers/tools/constants/XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP.js'

describe('XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP', () => {
  describe('named export', () => {
    describe('as XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP', () => {
      describe('when imported', () => {
        test('should map each member of the sink to the event name of the upload of XMLHttpRequest', () => {
          const expected = {
            onUploadLoadStart: 'loadstart',
            onUploadProgress: 'progress',
            onUploadLoad: 'load',
            onUploadAbort: 'abort',
            onUploadError: 'error',
            onUploadTimeout: 'timeout',
            onUploadLoadEnd: 'loadend',
          }

          const received = XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP

          expect(received)
            .toStrictEqual(expected)
        })
      })
    })
  })
})
