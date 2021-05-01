import * as _ from 'lodash'
const reachable = require('is-port-reachable')
const request = require('supertest')
import { Response } from 'supertest'

import { System, ApiController } from '@intf/Server'
import { ApiError } from '../../core'
import system, { closeAll } from '../../core/system'
import { RequestMethods } from '../../../properties'



/*
  Application server startup tests.
  Verify if the server behaves as expected.
*/

const msg = 'This is a message'

const controller: ApiController = {
  route: {
    method: RequestMethods.GET,
    uri: '/api/test',
    auth: false
  },
  handler: (req, res, next) => {
    next(new ApiError(500, msg))
  }
}

describe('→ Server', () => {

  let app: System

  afterEach(async () => {
    app && await closeAll(app)
  })

  describe('→ run', () => {
    it('→ under a custom port', async () => {
      const port = 3131
      app = await system({ config: { port } })
      const status = reachable(port, { host: `localhost:${port}` })
      expect(status).toBeTruthy()
    })

    it('→ links the React app by default', async () => {
      app = await system()
      await request(app.server)
        .get('/')
        .expect(200)
        .then(async (resp: Response) => {
          expect(resp.text).toContain('/app/app.js')
        })
    })

    it('→ redirects top level URIs to the web application', async () => {
      app = await system()
      await request(app.server)
        .get('/somedummypath')
        .expect(200)
        .then(async (resp: Response) => {
          expect(resp.text).toContain('/app/app.js')
        })
    })

    it('→ does not redirects /api/* URIs', async () => {
      app = await system()
      await request(app.server)
        .get('/api/somedummypath')
        .expect(404)
    })
  })

  describe('→ error', () => {

    afterEach(async () => {
      app && await closeAll(app)
    })

    it('→ API call returns a custom error in the right format', async () => {
      app = await system({ controllers: [controller] })

      await request(app.server)
        .get(controller.route.uri)
        .expect(500)
        .then(async (resp: Response) => {
          expect(resp.body).toEqual({ message: msg })
        })
    })
  
    it('→ API call returns a custom error with data', async () => {
      const _controller = _.cloneDeep(controller)
      _controller.handler = (req, res, next) => {
        next(new ApiError(400, msg, { test: 123 }))
      }
  
      app = await system({ controllers: [_controller] })
  
      await request(app.server)
        .get(_controller.route.uri)
        .expect(400)
        .then(async (resp: Response) => {
          expect(resp.body).toEqual({
            message: msg,
            data: { test: 123 }
          })
        })
    })

  })

})