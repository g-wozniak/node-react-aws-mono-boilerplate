import { Request, Response, NextFunction } from 'express'
import { ApiController, ServerLocals } from '@intf/Server'

import routes, { Routes } from '../../../routes'
import ApiError from '../../core/errors/api'

const nameController: ApiController = {
  route: routes[Routes.Name],
  handler: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { collections } = req.app.locals as ServerLocals
    const { name, surname } = req.body

    const _id = await collections.name.insert({
      name,
      surname
    })

    if (!_id) {
      return next(new ApiError(500, 'Database error'))
    }

    return res.status(200).json({
      data: {
        _id
      }
    })
  }
}

export default nameController