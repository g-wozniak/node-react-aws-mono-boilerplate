import * as mongoose from 'mongoose'
import { Schema } from 'mongoose'


import { simulator } from '../../core/services/mongo/simulator'
import { mongoConnectionStringFromVariable, mongoConnectionStringFromConfig, mongoConnect, MongoService, LoggerService } from '../../core'
import { DatabaseSimulator, MongoClient } from '@intf/Core'

/*
  MongoDB service
  Testing the service behaviour and connector
*/

const logger = new LoggerService([])

export const schema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true
  },
  name: {
    type: String,
    required: false
  }
}, { versionKey: false, collection: 'tests' })


describe('→ Service: Mongo', () => {

  describe('→ MongoService', () => {

    let dbh: DatabaseSimulator
    let cli: MongoClient

    beforeEach(async () => {
      dbh = await simulator()
      cli = await mongoConnect(dbh.connectionString)  
    })

    afterEach(async () => {
      await dbh.stop()
      await cli.stop()
    })

    it('→ returns a client', async () => {
      const service = new MongoService(cli, logger)
      const _cli = service.client()
      expect(_cli).toHaveProperty('mongoose')
      expect(_cli).toHaveProperty('stop')
    })

    it('→ inserts an element', async () => {
      const service = new MongoService(cli, logger)
      const res = await service.insert('test', schema, { name: 'Greg' })
      expect(res).toHaveProperty('_id')
    })

    it('→ finds a single element', async () => {
      const service = new MongoService(cli, logger)
      const res1 = await service.insert('test', schema, { name: 'Greg' })
      const res2 = await service.findOne('test', schema, { _id: res1?._id })
      expect(res2).toHaveProperty('_id')
      expect(res2?._id).toEqual(res1?._id)
    })

    it('→ wrapper returns `null` if element not found', async () => {
      const service = new MongoService(cli, logger)
      await service.insert('test', schema, { name: 'Greg' })
      const res2 = await service.findOne('test', schema, { _id: 'abcdefg' })
      expect(res2).toEqual(null)
    })

    it('→ drops all the data', async () => {
      let res
      const service = new MongoService(cli, logger)
      res = await service.insert('test', schema, { name: 'Greg' })
      await service.dropAll()
      res = await service.findOne('test', schema, { _id: res?._id })
      expect(res).toEqual(null)
    })

  })

  it.todo('→ Mongo simulator')

  describe('→ MongoClient (connector)', () => {

    it('→ returns the connection string from config', () => {
      const conn = {
        hostname: 'localhost',
        port: 27111,
        database: 'random_database_name',
        timeout: 10000
      }
      expect(mongoConnectionStringFromConfig(conn)).toEqual(`mongodb://${conn.hostname}:${conn.port}/${conn.database}?connectTimeoutMS=10000&socketTimeoutMS=10000&keepAlive=true`)
    })

    it('→ returns the connection string from variable', () => {
      expect(mongoConnectionStringFromVariable('localhost:27111/random_database_name'))
        .toEqual('mongodb://localhost:27111/random_database_name')
    })

    it('→ connects to the database', async () => {
      const spy = jest.spyOn(mongoose, 'connect').mockImplementation(() => ({} as any))
      const client = await mongoConnect('xxx')
      expect(client).toHaveProperty('mongoose')
      expect(client).toHaveProperty('stop')
      expect(client.stop).toBeInstanceOf(Function)
      spy.mockRestore()
    })

    it('→ stops the database', async () => {
      const stub = jest.fn()
      const spy = jest.spyOn(mongoose, 'connect').mockImplementation(() => ({
        connections: [
          jest.fn(),
          jest.fn()
        ],
        disconnect: stub
      } as any))
      const client = await mongoConnect('xxx')
      await client.stop()
      expect(stub).toHaveBeenCalled()
      spy.mockRestore()
    })

    it('→ error upon connecting to the database', async () => {
      const spy = jest.spyOn(mongoose, 'connect').mockRejectedValue('Unexpected mongoose error')
      let e
      try {
        await mongoConnect('xxx')
      } catch (err) {
        e = err
      }
      expect(e.message).toEqual('[mongo.connector] Database connection error')
      spy.mockRestore()
    })
  })

})
