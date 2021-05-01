import { ObjectId } from 'bson'
import { Schema, Document, FilterQuery } from 'mongoose'
import { MongoDataResultsWrapper } from '@intf/Core'

import { MongoService, MongoCollection } from '../../core'
interface NameItem {
  name: string
  surname: string
}

interface NameSchema extends Document {
  _id: ObjectId
  name: string
  surname: string
}

export const schema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: false
  }
}, { versionKey: false, collection: 'names' })


export class MongoNameCollection extends MongoCollection {
  constructor(service: MongoService) {
    super(service)
  }

  public async insert(item: NameItem): MongoDataResultsWrapper {
    return this.service.insert('name', schema, item)
  }

  public async findOne(query: FilterQuery<NameSchema>): MongoDataResultsWrapper {
    return this.service.findOne('name', schema, query)
  }
}
