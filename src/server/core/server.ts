const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const http = require('http')
const expressStaticGzip = require('express-static-gzip')

import { MongoCollections, ServerApp, ServerArgs, ServerLocals } from '@intf/Server'
import { MongoClient } from '@intf/Core'

import core, { mongoConnect, LoggerService, MongoService, EmailService } from '.'
import { LogCategories } from '../properties'
import { color } from '../utils'
import { MongoNameCollection } from '../api/collections/name'



// Web application compression settings
const gzipOptions = {
  enableBrotli: true,
  customCompressions: [{
      encodingName: 'deflate',
      fileExtension: 'zz'
  }],
  orderPreference: ['br']
}

/**
 * Server
 * @description This function does not launch the application server. It returns `listen` method.
 * @param {ServerConfig} config environment configuration of the server
 * @param {ApiController[]} controllers array of controllers
 * @returns {Opine} Application server
 */
const server = async ({ config, controllers, callback }: ServerArgs): Promise<ServerApp> => {

  if (!config) {
    throw new Error('Server configuration not found!')
  }


  let interval

  const app = express()

  const httpServer = http.createServer(app)

  const io = require('socket.io')(httpServer)

  const { errors, correlation, logTraffic } = core.middleware

  const { logger, mongo } = config.services

  /* Logger service */
  const _logger = new LoggerService(logger.types, logger.format)

  /* MongoDB service */
  let mongoClient: MongoClient
  let _mongo: MongoService

  try {
    mongoClient = await mongoConnect(mongo.connectionString)
    _mongo = new MongoService(mongoClient, _logger)
    if (mongo.purgeAllOnStart) {
      await _mongo.dropAll()
    }
  } catch (err) {
    throw new Error(err)
  }

  const readyToUseCollections: MongoCollections = {
    name: new MongoNameCollection(_mongo)
  }

  /* Email service */
  const emailConfig = config.services.email
  const _email = new EmailService(emailConfig.apiKey, emailConfig.sender)

  app.use(express.json())

  app.use(express.urlencoded({ extended: false }))

  app.use(helmet())

  app.use(cors())

  app.use(correlation)

  app.use(logTraffic)

  // app.use(language)

  // app.use(authentication)

  const webAppCompression = config.webapp.compression

  const webAppPath = path.resolve(config.distDir, 'webapp')

  const webAppIndexPath = webAppPath + '/index.html'

  if (!fs.existsSync(webAppIndexPath)) {
    const message = `Web application cannot be found at ${webAppIndexPath}. Are you sure it's traspiled?`
    _logger.error({ message })
    throw new Error(message)
  }

  const publicDir = path.resolve(config.distDir, 'public')
  const webAppDir = `${webAppPath}/app`
  const stylesDir = `${publicDir}/styles`
  const assetsDir = `${publicDir}/assets`

  app.use('/app', !webAppCompression
    ? express.static(webAppDir)
    : expressStaticGzip(webAppDir, gzipOptions))

  app.use('/assets', !webAppCompression
    ? express.static(assetsDir)
    : expressStaticGzip(assetsDir, gzipOptions))

  app.use('/styles', !webAppCompression
    ? express.static(stylesDir)
    : expressStaticGzip(stylesDir, gzipOptions))


  const routes: string[] = []
  controllers.forEach((controller) => {
    try {
      const { route, handler } = controller
      app.route(route.uri)[route.method.toLowerCase()](handler)
      routes.push(`         → ${color('magenta', route.uri)} (${color('white', route.method)})\n`)
    } catch (e) {
      const message = `Route initialisation failed: ${controller.route.uri}`
      _logger.error({ message, stack: e.stack })
      throw new Error(message)
    }
  })


  /*
  io.on('connection', (socket) => {
    console.log('New client connected')
    if (interval) {
      clearInterval(interval)
    }
    interval = setInterval(() => getApiAndEmit(socket), 100)
    socket.on('disconnect', () => {
      console.log('Client disconnected')
      clearInterval(interval)
    })
  })
  
  const getApiAndEmit = socket => {
    const response = new Date()
    // Emitting a new message. Will be consumed by the client
    socket.emit('FromAPI', response)
  }
  */

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(webAppIndexPath)
  })
  
  app.use(errors)

  app.locals = {
    environment: config.environment,
    services: {
      logger: _logger,
      email: _email
    },
    collections: readyToUseCollections,
    ip: ''
  } as ServerLocals

  //     email: new EmailService(config.email.apiKey, config.email.senderEmail, config.email.senderName)

  const listener = httpServer.listen(config.port, () => {
    _logger.info({
      category: LogCategories.startup,
      message: `\n
  ${color('yellow', 'Server is listening on port:')} ${color('green', config.port.toString())}\n
  ${color('red', '[ WEBAPP ]')}\n
    Compression:
      ${color('white', webAppCompression.toString())}\n
    Index location:
      ${color('white', webAppIndexPath)}\n
    Static mappings:
      → application directory:
          ${color('white', webAppDir)} to ${color('magenta', '/app')}\n
      → assets directory:
          ${color('white', assetsDir)} to ${color('magenta', '/assets')}\n
      → styles directory:
          ${color('white', stylesDir)} to ${color('magenta', '/styles')}\n
  ${color('red', '[ SERVER ]')}\n
    Logger:
      Logs format: ${color('white', logger.format)}\n
    Email:
      Sender: ${color('white', `${emailConfig.sender.name} (${emailConfig.sender.email})`)}\n      
    Mongo:
      Connection: ${color('white', mongo.connectionString.substring(0, 36))}...
      Purge collections on startup: ${mongo.purgeAllOnStart ? color('red', 'yes') : color('green', 'no')}
      Routes:
${routes.toString().replace(/\,/,'')}
`
    })
    if (callback) {
      callback()
    }
  })

  return {
    server: listener,
    collections: readyToUseCollections,
    connectors: {
      mongo: mongoClient
    }
  }
}

export default server
