/**
 * Properties shared by SERVER & CORE only. Nothing used by a webapp here.
 */


/**
 * LogLevels
 * @description Log levels used by logger in the app used by the logger service
 */
export enum LogLevels {
  error = 'error',
  warning = 'warning',
  info = 'info'
}

/**
 * LogTypes
 * @description Types of logs used by logger in the app used by the logger service
 */
export enum LogTypes {
  error = 'error',
  warning = 'warning',
  info = 'info'
}

/**
 * LogCategories
 * @description Categories of execution used for more detailed logging used by the logger service
 */
export enum LogCategories {
  request = 'request',
  response = 'response',
  startup = 'startup',
  database = 'database',
  custom = 'custom'
}
