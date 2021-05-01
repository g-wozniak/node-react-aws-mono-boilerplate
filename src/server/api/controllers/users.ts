import { Request, Response, NextFunction } from 'express'
import { ApiController } from '@intf/Server'

import routes, { Routes } from '../../../routes'

const usersController: ApiController = {
  route: routes[Routes.UserAccessEmailCode],
  handler: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.status(200).send(new Date().toISOString())
  }
}

export default usersController
