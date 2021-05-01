const request = require('supertest')
import * as uuid from 'uuid'
import { System } from '@intf/Server'
import system, { closeAll } from '../../core/system'
import { Headers } from '../../../properties'

jest.mock('uuid')

/*
  Application server startup tests.
  Verify if the server behaves as expected.
*/

describe('→ Server middleware', () => {

  describe('→ correlation', () => {

    let app: System

    afterEach(async () => app && await closeAll(app))

    it('→ returns correlation header', async () => {
      const spy = jest.spyOn(uuid, 'v4').mockReturnValue('1234')
      app = await system()
      await request(app.server)
        .get('/test')
        .expect(200)
        .then((resp) => {
          expect(resp.headers).toHaveProperty([Headers.xCorrelation])
          expect(resp.headers[Headers.xCorrelation]).toEqual('1234')
        })
      spy.mockReset()
    })

  })

})
