import * as _ from 'lodash'
import * as sendgrid from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'
import { KeyString } from '@intf/Common'
import { mergeToText } from '../../../utils'
interface IEmailService {
  send(emailTo: string): Promise<ClientResponse | any>
  prepare(email: Email, props: KeyString): void
  getEmailHtml(): string
}

interface SendGridEmailAttachment {
  content: any
  filename: string
  type: string
  disposition: string
}

interface SendGridEmailSettings {
  from: string
  fromname: string
  subject: string
  html: string,
  attachments?: SendGridEmailAttachment[]
}

interface Email {
  subject: string
  html: string
}

interface EmailRawAttachment {
  filename: string
  type: string
  content: any
}

interface EmailSender {
  email: string
  name: string
}



class EmailService implements IEmailService {

  private _apiKey: string

  private _sender: EmailSender

  private _email: SendGridEmailSettings

  constructor(apiKey: string, sender: EmailSender) {
    this._apiKey = apiKey
    this._sender = sender
  }

  public prepare(email: Email, props: KeyString = {}, attachments?: EmailRawAttachment[]): void {
    this._email = {
      from: this._sender.email,
      fromname: this._sender.name,
      subject: email.subject,
      html: mergeToText(email.html, {
        ...props,
        senderEmail: this._sender.email,
        senderName: this._sender.name
      })
    }
    if (attachments && attachments.length > 0) {
      this._email.attachments = attachments.map((file: EmailRawAttachment) => {
        return {
          content: file.content,
          filename: file.filename,
          type: file.type,
          disposition: 'attachment'
        }
      })
    }
  }

  public getEmailHtml(): string {
    return this._email.html
  }

  public async send(emailTo: string): Promise<ClientResponse | any> {
    let result = {}
    sendgrid.setApiKey(this._apiKey)

    if (!this._email) {
      throw new Error('Email message not found')
    }

    result = await sendgrid.send({
      to: emailTo,
      ...this._email
    })

    return result
  }

}

export default EmailService
