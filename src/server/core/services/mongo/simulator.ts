import MongoMemoryServer from 'mongodb-memory-server-core'
import * as _ from 'lodash'
import { DatabaseSimulator } from '@intf/Core'

/**
 * MongoDB memory server
 * @description Simulator of the MongoDB server without need to dockerize it, used for automation tests
 */

interface MongoSimulatorStart {
  conn: string
  dbh: MongoMemoryServer
}


export const simulator = async (): Promise<DatabaseSimulator> => {

  async function stop(dbh: MongoMemoryServer): Promise<void> {
    if (dbh && dbh.stop) {
      dbh.stop()
    }
  }

  async function startMemoryServer(): Promise<MongoMemoryServer> {
    return new MongoMemoryServer({ instance: {
      port: _.random(20000, 44000)
    }})
  }

  async function start(): Promise<MongoSimulatorStart> {
    let conn: string
    let dbh: MongoMemoryServer
    try {
      dbh = await startMemoryServer()
      conn = await dbh.getUri()
    } catch (err) {
      throw new Error('Memory server simulator has not started')
    }
    return { conn, dbh }
  }

  const result = await start()

  return {
    connectionString: result.conn,
    stop: () => stop(result.dbh)
  }
}

