import { Document, FilterQuery, Schema } from 'mongoose' 

import Logger from '../logger'
import { KeyAny } from '@intf/Common'
import { MongoClient, MongoDataResultsWrapper } from '@intf/Core'


export default class MongoService {

  private _client: MongoClient

  private _logger: Logger

  constructor(mongoose: MongoClient, logger: Logger) {
    this._client = mongoose
    this._logger = logger
  }

  public async dropAll(): Promise<void> {
    return await this._client.mongoose.connection.dropDatabase()
  }

  public async findOne(schemaName: string, schema: Schema, query: FilterQuery<Document>): Promise<MongoDataResultsWrapper> {
    const _m = this._client.mongoose.model<Document>(schemaName, schema)
    return await this.wrapper(async () => {
      const result = await _m.findOne(query)
      return result || null
    })
  }

  public async insert(schemaName: string, schema: Schema, data: KeyAny): Promise<MongoDataResultsWrapper> {
    return await this.wrapper(async () => {
      const _m = this._client.mongoose.model<Document>(schemaName, schema)
      const model = new _m(data)
      return await model.save()
    })
  }

  public client(): MongoClient {
    return this._client
  }

  /**
   * wrapper
   * @description Mongoose returns data in `bson` format. The wrapper helps supporting error handling and converts bson to JSON to help avoid sad suprise during data display and processing
   */
  private async wrapper(fn: () => Promise<Document | null>): MongoDataResultsWrapper {
    let result: KeyAny | null
    try {
      const json = JSON.parse(JSON.stringify(await fn()))
      result = json
    } catch (err) {
      this._logger.error({
        message: err.message,
        stack: err.stack
      })
      result = null
    }
    return result
  }

}
