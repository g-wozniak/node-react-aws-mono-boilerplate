/**
 * Only COMMON properties here. 
 * Reusable between Core/Server and Web Application and other componentts
*/


/**
 * Environments
 * @description Supported runtime environments
 */
export enum Environments {
  LocalTesting = 'local_testing',
  Local = 'local',
  Production = 'production'
}

/**
 * RequestMethods
 * @description: Request types supported in the whole system
 */
export enum RequestMethods {
  'GET' = 'get',
  'POST' = 'post',
  'DELETE' = 'delete',
  'PATCH' = 'patch'
}

/**
 * Headers
 * @description Custom headers available and processed in the application
 */
export enum Headers {
  xCorrelation = 'x-correlation'
}
