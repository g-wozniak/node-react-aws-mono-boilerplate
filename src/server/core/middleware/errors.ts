import { NextFunction, Request, Response } from 'express'
import { ServerLocals } from '@intf/Server'
import { ApiResponse } from '@intf/Common'

import ApiError from '../errors/api'

export default (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const state = <ServerLocals>req.app.locals
  const { logger } = state.services

  logger.error({
    message: err.message,
    stack: err.stack
  })

  if (err instanceof ApiError) {

    const errorResponse = err.getResponse()

    const r: ApiResponse = {
      message: errorResponse.message
    }

    if (errorResponse.data) {
      r.data = errorResponse.data
    }

    res.status(errorResponse['code']).json(r)
  } else {
    res.status(500).json({})
  }
}