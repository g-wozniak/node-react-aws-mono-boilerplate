const request = require('supertest')
import { Response } from 'supertest'
import { ClientResponse } from '@sendgrid/client/src/response'
import * as sendgrid from '@sendgrid/mail'

import { ApiController, ServerLocals, System } from '@intf/Server'
import system, { closeAll } from '../../core/system'
import { Environments, RequestMethods } from '../../../properties'


/*
  Server locals a.k.a. "locals" in the api controller
*/

const route = {
  method: RequestMethods.GET,
  uri: '/api/test',
  auth: false
}

describe('→ Server locals', () => {

  let app: System

  afterEach(async () => {
    app && await closeAll(app)
  })
  it('→ enironment name is accessible in the handler', async () => {
    const environment = Environments.Local

    const c: ApiController = {
      route,
      handler: (req, res) => {
        const { environment } = req.app.locals as ServerLocals
        res.send(environment)
      }
    }
    app = await system({
      config: {
        environment
      },
      controllers: [c]
    })
    await request(app.server)
      .get(route.uri)
      .expect(200)
      .then((r: Response) => expect(r.text).toEqual(environment))
  })

  it('→ ip address is accessible in the handler', async () => {
    const c: ApiController = {
      route,
      handler: (req, res) => {
        const { ip } = req.app.locals as ServerLocals
        res.send(ip)
      }
    }
    app = await system({ controllers: [c] })
    await request(app.server)
      .get(route.uri)
      .expect(200)
      .then((r: Response) => expect(r.text).toBeDefined())
  })

  it('→ logger is accessible in the handler', async () => {
    const c: ApiController = {
      route,
      handler: (req, res) => {
        const locals = req.app.locals as ServerLocals
        const logger =  locals.services.logger
        logger.info({ message: '123' })
        res.status(200).send()
      }
    }

    app = await system({ controllers: [c] })
    await request(app.server)
      .get(route.uri)
      .expect(200)
  })

  it('→ collections are accessible in the handler', async () => {
    const c: ApiController = {
      route,
      handler: (req, res) => {
        const { collections } = req.app.locals as ServerLocals
        res.status(collections.hasOwnProperty('name') ? 200 : 500).send()
      }
    }
    app = await system({ controllers: [c] })
    await request(app.server)
      .get(route.uri)
      .expect(200)
  })

  it('→ email service is accessible in the handler', async () => {
    const emailSent: ClientResponse = {
      statusCode: 200,
      body: {},
      headers: {}
    }

    const spy = jest.spyOn(sendgrid, 'send').mockResolvedValue([emailSent, {}])
    const c: ApiController = {
      route,
      handler: async (req, res) => {
        const { services } = req.app.locals as ServerLocals
        const email = services.email
        email.prepare({
          subject: 'subject',
          html: 'content'
        })
        const results = await email.send('test@test.com')
        res.status(200).json(results)
      }
    }
    app = await system({ controllers: [c] })
    await request(app.server)
      .get(route.uri)
      .expect(200)
      .then(r => {
        expect(r.body).toEqual([emailSent, {}])
      })
    spy.mockRestore()
  })
})
