/**
 * @type {{
 *   [key: string]: RestfulApiType.METHOD
 * }}
 */
export const RESTFUL_API_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
  TRACE: 'TRACE',
  CONNECT: 'CONNECT',
}

/**
 * @type {{
 *   [key: string]: RestfulApiType.BODY_FORMAT
 * }}
 */
export const RESTFUL_API_BODY_FORMAT = {
  FORM_DATA: 'FORM_DATA',
  JSON: 'JSON',
}
