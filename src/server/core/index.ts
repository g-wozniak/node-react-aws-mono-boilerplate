import correlationMiddleware from './middleware/correlation'
import errorsMiddleware from './middleware/errors'
import logTrafficMiddleware from './middleware/logTraffic'

export { default as LoggerService } from './services/logger'
export { default as EmailService } from './services/email'
export { default as MongoService }  from './services/mongo/mongo'
export { default as MongoCollection } from './services/mongo/collections'
export { default as ApiError } from './errors/api'

export {
  connect as mongoConnect, 
} from './connectors/mongo'

export {
  connectionStringFromConfig as mongoConnectionStringFromConfig,
  connectionStringFromVariable as mongoConnectionStringFromVariable
} from './connectors/mongo'

export default {
  middleware: {
    correlation: correlationMiddleware,
    errors: errorsMiddleware,
    logTraffic: logTrafficMiddleware
  }
}


