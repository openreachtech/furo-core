/**
 * Lookup of the event name of the upload of `XMLHttpRequest` from the member of the sink that is notified of the event.
 *
 * @type {{
 *   [memberName: string]: string
 *   onUploadLoadStart: string
 *   onUploadProgress: string
 *   onUploadLoad: string
 *   onUploadAbort: string
 *   onUploadError: string
 *   onUploadTimeout: string
 *   onUploadLoadEnd: string
 * }}
 */
export const XML_HTTP_REQUEST_UPLOAD_SINK_EVENT_NAME_LOOKUP = {
  onUploadLoadStart: 'loadstart',
  onUploadProgress: 'progress',
  onUploadLoad: 'load',
  onUploadAbort: 'abort',
  onUploadError: 'error',
  onUploadTimeout: 'timeout',
  onUploadLoadEnd: 'loadend',
}
