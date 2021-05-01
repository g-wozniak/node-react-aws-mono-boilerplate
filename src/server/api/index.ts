
import { ApiController } from '@intf/Server'

import nameController from './controllers/name'
import healthzController from './controllers/healthz'
import usersController from './controllers/users'


/**
 * List of Api controllers
 */
export const controllers = [
  nameController,
  healthzController,
  usersController
] as ApiController[]

