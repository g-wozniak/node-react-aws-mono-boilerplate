import * as sendgrid from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'

import { EmailService } from '../../../server/core'

const dummyApiKey = 'SG.sendgrid:12345'

const sender = {
  email: 'test@email.com',
  name: 'St Nicolas'
}

const message = {
  subject: 'test',
  html: 'xxx'
}

const emailSent: ClientResponse = {
  statusCode: 200,
  body: {},
  headers: {}
}

describe('→ Service: email', () => {

  it('→ instantiate with Sendgrid API key (dummy)', () =>  {
    expect(() => new EmailService(dummyApiKey, sender)).not.toThrowError()
  })

  describe('→ preparing e-mail', () => {

    let ems: EmailService
    beforeEach(() => ems = new EmailService(dummyApiKey, sender))

    it('→ replaces custom variables in the e-mail', () => {
      ems.prepare({
        subject: 'subject',
        html: 'This is some text with $var1 and $var2'
      }, {
        var1: 'test',
        var2: 'xxx'
      })
      expect(ems.getEmailHtml()).toEqual('This is some text with test and xxx')
    })

    it('→ replaces sender details in the e-mail', () => {
      ems.prepare({
        subject: 'subject',
        html: 'This is sent by $senderName from $senderEmail'
      })
      expect(ems.getEmailHtml()).toEqual(`This is sent by ${sender.name} from ${sender.email}`)
    })

  })

  describe('→ sending e-mail', () => {
    
    it('→ throws an error if email has not been prepared before sending', () => {
      const email = new EmailService(dummyApiKey, sender)
      expect(email.send('greg@woz.com')).rejects.toThrow('Email message not found')
    })

    it('→ prepares the message and sends e-mail', async () => {
      const spy = jest.spyOn(sendgrid, 'send').mockResolvedValue([emailSent, {}])
      const email = new EmailService(dummyApiKey, sender)
      email.prepare(message)
      const result = await email.send('greg@woz.com')
      expect(result).toEqual([emailSent, {}])
      spy.mockRestore()
    })

    it('→ returns error caused by Sengrid API', async () => {
      // Error is reflected as returned by real sendgrid.send()
      const spy = jest.spyOn(sendgrid, 'send').mockImplementation(() => { throw new Error('Unauthorized') })
      const email = new EmailService(dummyApiKey, sender)
      email.prepare(message)
      expect(email.send('greg@woz.com')).rejects.toThrow('Unauthorized')
      spy.mockRestore()
    })

    it.todo('→ sends e-mail with attachments')
  })

})