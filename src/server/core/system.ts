import * as _ from 'lodash'
import { EventEmitter } from 'events'
const path = require('path')

import { ServerConfig, System, SystemArgs } from '@intf/Server'

import { controllers } from '../api'
import { simulator as mongoServer } from '../core/services/mongo/simulator'
import server from './server'
import { Environments } from '../../properties'

const emServerReady = new EventEmitter()
const waitForCallback = async (): Promise<any> => {
  return new Promise((resolve: any) => {
    emServerReady.once('httpServerListening', resolve)
  })
}

const systemCallback = (): void => {
  emServerReady.emit('httpServerListening')
}

export const closeAll = async (app: System): Promise<void> => {
  await app.running.mongoServer.stop()
  await app.running.mongoConnector.stop()
  app.server.close()
}

export default async (args: SystemArgs = {}): Promise<System> => {

  let config: ServerConfig = {
    environment: Environments.LocalTesting,
    port: args.config?.port || _.random(10000, 19999),
    distDir: path.resolve(__dirname, '..', '..', '..', 'dist'),
    services: {
      logger: {
        types: [],
        format: 'cloudwatch'
      },
      mongo: {
        connectionString: '',
        purgeAllOnStart: true
      },
      email: {
        apiKey: 'SG.dummyapikey',
        sender: {
          email: 'notify@simply.careers',
          name: 'Team simply.careers (testing)'
        }
      }
    },
    webapp: {
      compression: false
    }
  }

  /*
      email: {
      apiKey: 'SG.nonexistentasshouldbemocked',
      senderEmail: 'testing@simply.careers',
      senderName: 'Simply Careers testing'
    },
   */

  if (args.config) {
    config = _.extend(config, args.config)
  }

  const _controllers = args.controllers || controllers

  const dbh = await mongoServer()

  config.services.mongo.connectionString = dbh.connectionString

  const app = await server({
    config,
    controllers: _controllers,
    callback: systemCallback
  })

  await waitForCallback()

  return {
    server: app.server,
    collections: app.collections,
    port: config.port,
    running: {
      mongoServer: dbh,
      mongoConnector: app.connectors.mongo
    }
  }
}
