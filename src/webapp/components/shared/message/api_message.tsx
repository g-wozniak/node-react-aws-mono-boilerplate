import * as React from 'react'
import { Message as SemanticMessage, Transition } from 'semantic-ui-react'

import { RequestDetails } from '@webapp/intf/Routes'
import { Message } from '@webapp/intf/Locale'
import { KeyAny, Validation } from '@webapp/intf/Common'

import { isRequestCompleted, isRequestInvalid } from '@webapp/helpers/request'

export interface IProps {
  request: RequestDetails
  messages: KeyAny
}

const ApiMessage = (props: IProps): JSX.Element | null => {
  const req = props.request
  const messages = props.messages
  let display = false
  let messageProps: KeyAny = {}

  if (req.res && isRequestCompleted(req)) {
    if (req.res.status !== 200 && req.res.message) {
      const messageKey = req.res.message
      display = true
      const message = messages.errors.hasOwnProperty(messageKey)
        ? messages.errors[messageKey] as Message
        : messages.errors.unknownError

      // Semantic component props
      messageProps = {
        header: message.h,
        content: message.b,
        icon: message.i || 'x',
        error: true
      }
    } else if (req.res.status === 200 && req.res.message) {
      display = true
      const messageKey = req.res.message
      const message = messages.success.hasOwnProperty(messageKey)
        ? messages.success[messageKey] as Message
        : messages.success.unknownSuccess

      messageProps = {
        header: message.h,
        content: message.b,
        icon: message.i || 'x',
        success: true
      }
    } else if (req.res.status !== 200 && !req.res.message) {
      console.error('Error message key not provided in the response')
    }
  }

  if (isRequestInvalid(req)) {

    if (!req.req || !req.req.validation) {
      console.error('Validation errors not listed in the request')
    } else {
      display = true
      const message = messages.errors.validationError
  
      messageProps = {
        header: message.h,
        content: message.b,
        icon: message.i,
        list: req.req.validation.map((error: Validation, index: number) => <li key={`err_list_${index}_${error.key}`}>{error.message}</li>),
        error: true
      }
    }
  }

  return (
    <Transition visible={display} animation="fade" duration={600}>
      <SemanticMessage
        visible={display}
        {...messageProps}
      />
    </Transition>
  )

}

export default ApiMessage
