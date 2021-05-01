import * as mongoose from 'mongoose'
import { Mongoose, ConnectOptions } from 'mongoose'

import { MongoConfig, MongoClient } from '@intf/Core'

const _options: ConnectOptions = {
  useFindAndModify: false,
  useNewUrlParser: true,
  keepAlive: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 20000
}

export const connectionStringFromConfig = ({ hostname, port, database, timeout }: MongoConfig): string => {
  const conn = `${hostname}:${port}`
  const params = `connectTimeoutMS=${timeout}&socketTimeoutMS=${timeout}&keepAlive=true`
  return `mongodb://${conn}/${database}?${params}`
}

export const connectionStringFromVariable = (conn: string): string => {
  return `mongodb://${conn}`
}

export const connect = async (connectionString: string, options?: ConnectOptions): Promise<MongoClient> => {

  let _mongoose: Mongoose

  async function stop(mongoose: Mongoose): Promise<void> {
    if (mongoose.connections && mongoose.connections.length > 0) {
      await mongoose.disconnect()
    }
  }

  try {
    // console.info(`Connecting to: ${connectionString}`)
    _mongoose = await mongoose.connect(connectionString, options || _options)
  } catch (e) {
    throw new Error('[mongo.connector] Database connection error')
  }
  return {
    mongoose: _mongoose,
    stop: () => stop(_mongoose)
  }
}
