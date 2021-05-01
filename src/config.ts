import { EnvironmentVariables, ServerConfig } from '@intf/Server'
import { Environments } from './properties'
import { LogTypes } from './server/properties'

import { mongoConnectionStringFromConfig, mongoConnectionStringFromVariable } from './server/core'


const config = (env: EnvironmentVariables): ServerConfig | undefined => ([
  {
    environment: Environments.Local,
    port: 3000,
    distDir: './dist',
    services: {
      logger: {
        types: [
          LogTypes.error,
          LogTypes.info,
          LogTypes.warning
        ],
        format: 'console'
      },
      mongo: {
        connectionString: mongoConnectionStringFromConfig({
          database: '<db name>',
          hostname: 'localhost',
          port: 27017,
          timeout: 10000
        }),
        purgeAllOnStart: true
      },
      email: {
        apiKey: '<dev api key>',
        sender: {
          email: '<email address>',
          name: '<sender name>'
        }
      },
    },
    webapp: {
      compression: false
    }
  },
  {
    environment: Environments.Production,
    port: Number(env.PORT) || 80,
    distDir: env.DIST_DIR,
    services: {
      logger: {
        types: [
          LogTypes.error,
          LogTypes.info,
          LogTypes.warning
        ],
        format: env.LOG_FORMAT || 'cloudwatch'
      },
      mongo: {
        connectionString: mongoConnectionStringFromVariable(<string>env.MONGO_DB_CONNECTION),
        purgeAllOnStart: false // to be removed before go-live
      },
      email: {
        apiKey: env.EMAIL_SENDGRID_API_KEY,
        sender: {
          email: env.EMAIL_SENDER_ADDRESS || '<email address>',
          name: '<sender name>'
        }
      }
    },
    webapp: {
      compression: true
    }
  }
] as ServerConfig[]).find((c) => c.environment === env.NODE_ENV)

export default config