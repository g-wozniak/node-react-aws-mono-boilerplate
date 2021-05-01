import { Request, Response, NextFunction } from 'express'
import { ApiController } from '@intf/Server'

import routes, { Routes } from '../../../routes'

const healthzController: ApiController = {
  route: routes[Routes.Healthz],
  handler: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.status(200).send(new Date().toISOString())
  }
}

export default healthzController
