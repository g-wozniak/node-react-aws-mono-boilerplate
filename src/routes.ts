import { ApiRoutes } from '@intf/Common'
import { RequestMethods } from './properties'

export enum Routes {
  Name = 'Name',
  UserAccessEmailCode = 'UserAccessEmailCode',
  Healthz = 'Healthz'
}

const routes: ApiRoutes = {}
routes[Routes.Name] = {
  uri: '/api/name',
  description: 'Dummy example endpoint inserting name',
  auth: false,
  method: RequestMethods.POST
}

routes[Routes.Healthz] = {
  uri: '/healthz',
  description: 'Healthcheck endpoint for AWS ECS',
  auth: false,
  method: RequestMethods.GET
}

routes[Routes.UserAccessEmailCode] = {
  uri: '/users/access/email',
  description: 'Sends e-mail confirmation code',
  auth: false,
  method: RequestMethods.POST
}

export default routes

