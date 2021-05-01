require('module-alias/register')

import server from './server/core/server'

import config from './config'
import { controllers } from './server/api'

import { EnvironmentVariables, ServerApp } from '@intf/Server'

const env: EnvironmentVariables = {
  NODE_ENV: process.env.NODE_ENV,
  DIST_DIR: process.env.DIST_DIR,
  PORT: process.env.PORT,
  MONGO_DB_CONNECTION: process.env.MONGO_DB_CONNECTION,
  LOG_FORMAT: process.env.LOG_FORMAT,
  EMAIL_SENDGRID_API_KEY: process.env.EMAIL_SENDGRID_API_KEY,
  EMAIL_SENDER_ADDRESS: process.env.EMAIL_SENDER_ADDRESS
}

const events = ['SIGINT', 'SIGTERM', 'exit']

server({
  config: config(env),
  controllers
})
  .then((app: ServerApp) => {
    events.forEach((e: string) => {
      process.on(e, () => {
        app.server && app.server.close()
        app.connectors.mongo.stop()
        console.info(`\nHandling signal '${e}' ...\n`)
        process.exit()
      })
    })
})
