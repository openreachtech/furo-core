/**
 * Errors that kept the response from being received.
 *
 * @enum {symbol}
 */
export const HTTP_FETCHER_ERROR = {
  NETWORK: Symbol('network'),
  TIMEOUT: Symbol('timeout'),
  ABORT: Symbol('abort'),
  UNKNOWN: Symbol('unknown'),
}
