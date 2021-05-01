/**
 * Only COMMON interfaces here. 
 * Reusable between Core/Server and Web Application and other componentts
 */

import { RequestMethods } from '../properties'

/**
 * ApiRoute
 * @description: Api route definition, mainly for web application but also reusab
 */
export interface ApiRoute {
  method: RequestMethods
  uri: string
  auth: boolean // Can be later refactored to `authService`
  description?: string
}

/**
 * ApiRoutes
 * @description List of api routes
 */
export interface ApiRoutes {
  [routeId: string]: ApiRoute
}

/**
 * ApiResponse
 * @description Common format of the Api JSON response
 */
export interface ApiResponse {
  data?: KeyAny
  message?: string
}


/**
 * KeyAny
 * @description Generic interface
 */
export interface KeyAny {
  [key: string]: any
}

/**
 * KeyString
 * @description Generic interface
 */
export interface KeyString {
  [key: string]: string
}

/** Colors
 * @description Colors used in the terminal
 */

export type Colors = 'white' | 'yellow' | 'magenta' | 'red' | 'green' | 'gray' | 'black&yellow'