import { Request, Response, NextFunction } from 'express'
import { ServerLocals } from '@intf/Server'
import { LogCategories } from '../../properties'

const getProcessingTimeInMS = (time: any): string => {
  return `${(time[0] * 1000 + time[1] / 1e6).toFixed(2)}ms`
}

const excludedFromLogging = [
  '/_next',
  '/styles',
  '/app/',
  '/favicon',
  '/healthz',
  '/assets'
]

export default (req: Request, res: Response, next: NextFunction): void => {
  const state = <ServerLocals>req.app.locals
  const { logger } = state.services

  const [oldEnd] = [res.end]
  const chunks: Buffer[] = []
  const _hrtime = process.hrtime()

  // Request logging
  const blacklisted = excludedFromLogging.find((item: string) => req.url.indexOf(item) > -1)

  if (req.url && !blacklisted) {
    logger.info({
      category: LogCategories.request,
      message: `to ${req.url} via ${req.method}`,
      body: req.body
    })

    // Response logging
    // tslint:disable-next-line:only-arrow-functions
    res.end = function(chunk: any): void {
      if (chunk) {
        chunks.push(Buffer.from(chunk))
      }
      const body = Buffer.concat(chunks).toString('utf8')
      const eventTime = getProcessingTimeInMS(process.hrtime(_hrtime))
      logger.info({
        category: LogCategories.response,
        message: `${req.url} responsed in ${eventTime}`,
        body
      })
      oldEnd.apply(res, arguments)
    }
  }

  next()
}