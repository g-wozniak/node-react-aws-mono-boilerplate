import { Request, Response, NextFunction } from 'express'
import { v4 as uuid } from 'uuid'

import { ServerLocals } from '@intf/Server'

import { Headers } from '../../../properties'

export default (req: Request, res: Response, next: NextFunction): void => {
  const state = <ServerLocals>req.app.locals
  const { logger } = state.services
  const correlation = uuid()
  logger.correlation = correlation
  req.app.locals.services.logger = logger
  req.app.locals.ip = res && res.req ? res.req.socket.remoteAddress : '0.0.0.0'
  res.header(Headers.xCorrelation, correlation)
  next()
}