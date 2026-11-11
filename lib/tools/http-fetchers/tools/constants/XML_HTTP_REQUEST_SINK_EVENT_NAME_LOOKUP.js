/**
 * Lookup of the event name of `XMLHttpRequest` from the member of the sink that is notified of the event.
 *
 * @type {{
 *   [memberName: string]: string
 *   onLoadStart: string
 *   onDownloadProgress: string
 *   onLoad: string
 *   onAbort: string
 *   onError: string
 *   onTimeout: string
 *   onLoadEnd: string
 *   onReadyStateChange: string
 * }}
 */
export const XML_HTTP_REQUEST_SINK_EVENT_NAME_LOOKUP = {
  onLoadStart: 'loadstart',
  onDownloadProgress: 'progress',
  onLoad: 'load',
  onAbort: 'abort',
  onError: 'error',
  onTimeout: 'timeout',
  onLoadEnd: 'loadend',
  onReadyStateChange: 'readystatechange',
}
