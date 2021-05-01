import { Request, Response, NextFunction } from 'express'
import { Server } from 'http'

import { ApiRoute } from './Common'
import { DatabaseSimulator, MongoClient } from './Core'

import { EmailService, LoggerService } from '../server/core'

import { LogTypes } from '../server/properties'
import { MongoNameCollection } from '../server/api/collections/name'


/**
 * ServerRouteHandler
 * @description Arguments taken by the server application upon startup
 */
export type ServerRouteHandler = (req: Request, res: Response, next: NextFunction) => void

/**
 * ApiController
 * @description API controller definition that binds URL path, route and handler together
 * @returns {ApiRoute} route
 * @returns {ServerRouteHandler} handler
 */
 export interface ApiController {
  route: ApiRoute
  handler: ServerRouteHandler
}


/**
 * EnvironmentVariables
 * @description List of variables that can be predefined upon startup
 */
export interface EnvironmentVariables {
  NODE_ENV: string | undefined
  DIST_DIR: string | undefined
  PORT: string | undefined
  MONGO_DB_CONNECTION: string | undefined
  LOG_FORMAT: string | undefined
  EMAIL_SENDGRID_API_KEY: string | undefined
  EMAIL_SENDER_ADDRESS: string | undefined
}

/**
 * ServerArgs
 * @description Arguments taken by the server application upon startup
 */
 export interface ServerArgs {
  controllers: ApiController[]
  config: ServerConfig | undefined
  callback?: () => void
}

/**
 * SystemArgs
 * @description Arguments taken by the system to be passed to the server upon startup
 */
 export interface SystemArgs {
  controllers?: ApiController[]
  config?: Partial<ServerConfig>
  callback?: () => void
}


/**
 * ServerApp
 * @description What's returned by application server
 */
 export interface ServerApp {
  server: Server
  collections: MongoCollections
  connectors: {
    mongo: MongoClient
  }
}

/**
 * System
 * @description What's returned by server simulator (system) to the tests
 */
export interface System {
  server: Server
  collections: MongoCollections
  port: number
  running: {
    mongoServer: DatabaseSimulator
    mongoConnector: MongoClient 
  }
}

/**
 * MongoCollectionsList
 * @describe List of collections already initialised with the service injected.
 */
 export interface MongoCollections {
  name: MongoNameCollection
}


/**
 * ServerLocals
 * @description Dependencies available for reuse in handlers
 */
 export interface ServerLocals {
  environment: string
  collections: MongoCollections
  services: {
    logger: LoggerService
    email: EmailService
  }
  ip: string
}

/**
 * ServerConfig
 * @description Required server configuration needed for initialisation
 */
 export interface ServerConfig {
  environment: string
  port: number
  distDir: string
  services: {
    logger: {
      types: LogTypes[]
      format: string
    },
    mongo: {
      connectionString: string
      purgeAllOnStart: boolean
    },
    email: {
      apiKey: string
      sender: {
        email: string
        name: string
      }
    }
  },
  webapp: {
    compression: boolean
  }
}


/*

export interface ServerArgs {
  port: string | number
  config: ServerConfig
  endpoints: ApiEndpoints
  collections: (service: MongoService) => Collections
  callback?: () => void
}

export interface ServerApp {
  server: Server
  collections: Collections // You can make it more generic if it bothers you tight coupling
  mongoConnector: MongoConnector
}
export interface SystemArgs {
  port?: string | number
  config?: SystemConfig
  endpoints?: ApiEndpoints
  prefill?: SystemDataPrefill
}

export interface SystemDataPrefill {}

export interface SystemConfig {
  environment?: string
  logging?: {
    types: LogTypes[]
    format: string
  },
  distDir?: string
  webapp?: {
    compression: boolean
  }
}


export interface ServerConfig extends SystemConfig {
  environment: string
  logging: {
    types: LogTypes[]
    format: string
  },
  email: {
    apiKey: string
    senderEmail: string
    senderName: string
  }
  mongo: string
  purgeData?: boolean
}

export interface ServerLocals {
  logger: Logger
  email: EmailService
  collections: Collections
}

*/