import { MongoService } from '../..'

class MongoCollection {

  protected service: MongoService

  constructor(mongoService: MongoService) {
    this.service = mongoService
  }
}

export default MongoCollection
