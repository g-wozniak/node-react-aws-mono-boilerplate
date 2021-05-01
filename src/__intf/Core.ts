import { Mongoose } from 'mongoose'
import { KeyAny } from './Common'

import { LogCategories } from '../server/properties'

/**
 * MongoDataResultsWrapper
 * @description a wrapper (adapter) to unify operation responses on collections
 */
export type MongoDataResultsWrapper = Promise<KeyAny | null>

/**
 * MongoClient (connector)
 * @description exposes MongoDB connection used by the service to operate on the database and gives a way to stop it
 */
export type MongoClient = {
  mongoose: Mongoose,
  stop(): Promise<void>
}

/**
 * MongoConfig (connector)
 * @description defines basic configuration for MongoClient allowing for more friendly input rather than a connection string
 */
export interface MongoConfig {
  database: string
  hostname: string
  port: number
  timeout: number
}

/**
 * DatabaseSimulator
 * @description any database simulator initialisation result
 */
export interface DatabaseSimulator {
  connectionString: string
  stop: () => Promise<void>
}

// TODO: komentarze

export interface LogTypeInfo {
  message: string
  category?: LogCategories
  body?: any
}

export interface LogTypeWarning {
  message: string
}

export interface LogTypeError {
  message: string
  stack?: any
}

export interface Log {
  type: string
  date: string
  correlation: string
  message: string
  category?: string
  body?: any
  stack?: any
}