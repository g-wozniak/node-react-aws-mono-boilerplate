import { AccessTypes, Lifecycle } from '@webapp/properties'
import { ApiRoute } from '@intf/Common'
import { KeyAny, Validation } from './Common'

// List of all routes within web application
export interface WebAppRoutes {
  [routeId: string]: WebAppRoute
}

// Web application route that goes to React Router, step before becomes AppRoute
export interface WebAppRoute extends AppRoute {
  component: any
}

// Application route that goes to the webapp as props
export interface AppRoute {
  name: string
  description?: string
  exact: boolean
  uri: string
  access: AccessTypes
}

// Api request from React app to the Api
export interface ApiRequest extends ApiRoute {
  reqId: string
  validation?: Validation[]
  payload?: KeyAny
  headers?: KeyAny
  options?: {
    displayIfSuccessful?: boolean
  }
}

// Response that comes back from the API endpoints
export interface ApiResponse {
  status: number
  data?: KeyAny
  message?: string
}

// Api Response extra properties
export interface ApiPropsFromHeaders {
  token?: string
}

// Request object to support the full cycle
export interface RequestDetails {
  req?: ApiRequest // request to the api
  res?: ApiResponse // response from the api
  lifecycle: Lifecycle // front-end lifecycle
}
