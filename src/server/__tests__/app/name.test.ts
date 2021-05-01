const request = require('supertest')
import { Response } from 'supertest'
import { System } from '../../../__intf/Server'
import system, { closeAll } from '../../core/system'


/*
  Application server startup tests.
  Verify if the server behaves as expected.
*/


describe('→ Name controller', () => {

  let app: System

  beforeEach(async () => {
    app = await system()
  })

  afterEach(async () => {
    app && await closeAll(app)
  })

  it('→ inserting `name` is successful', async () => {
    await request(app.server)
      .post('/api/name')
      .send({
        name: 'Greg',
        surname: 'Woz'
      })
      .expect(200)
      .then(async () => {
        const res = await app.collections.name.findOne({ name: 'Greg' })
        expect(res).toBeDefined()
      })
  })


  it('→ throws an error if _id is undefined', async () => {
    const spy = jest.spyOn(app.collections.name, 'insert').mockResolvedValue(null)
    await request(app.server)
      .post('/api/name')
      .send({
        name: 'Greg',
        surname: 'Woz'
      })
      .expect(500)
      .then((resp: Response) => {
        expect(resp.body).toEqual({
          message: 'Database error'
        })
      })
    spy.mockRestore()
  })

})
