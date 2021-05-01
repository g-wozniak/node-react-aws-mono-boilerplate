import * as React from 'react'
import { useEffect } from 'react'
import { Dispatch } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Transition } from 'semantic-ui-react'
import { ReducersState } from '@webapp/intf/Common'
import { ApiRequest } from '@webapp/intf/Routes'

import * as formActions from '@webapp/redux/forms/actions'
import { onRequest } from '@webapp/redux/requests/actions'
import { isReadyToDisplay } from '@webapp/helpers/forms'
import { useMountEffect, usePrevious } from '@webapp/components/hooks'
import { isRequestNowSuccessful } from '@webapp/helpers/request'

import ApiMessage from '../../shared/message/api_message'

import apiRoutes, { Routes } from '../../../../routes'


interface Props {
  formId: string
  step: number
}

const onEmailCodeRequest = (dispatch: Dispatch<any>, email: string): void => {
  const reqId = Routes.UserAccessEmailCode
  dispatch(onRequest({
    ...apiRoutes[reqId],
    reqId,
    payload: { email },
  } as ApiRequest))
}

const PageOnboardingEmail = (props: Props): JSX.Element => {
  const { formId, step } = props
  const requests = useSelector((state: ReducersState) => state.r_requests)
  const form = useSelector((state: ReducersState) => state.r_forms[formId])
  const { inputs, messages } = useSelector((state: ReducersState) => state.r_locale)
  const dispatch = useDispatch()

  useMountEffect(() => {
    dispatch(formActions.onFormInputChange(formId, { name: 'email', value: 'gwozniak@simply.careers' }))
  })

  const emailCodeReqPrev = usePrevious(requests[Routes.UserAccessEmailCode])
  const emailCodeReq = requests[Routes.UserAccessEmailCode]

  useEffect(() => {
    if (isRequestNowSuccessful(emailCodeReq, emailCodeReqPrev)) {
      dispatch(formActions.onFormStepChange(formId, 2))
    }
  })



  return (
    <Transition
      animation="fly right"
      onHide={() => dispatch(formActions.onFormInTransition(formId, false))}
      duration="600"
      visible={isReadyToDisplay(form, step)}
    >
      <section>
        <div>
          <Input
            className="input--text"
            name="email"
            placeholder={inputs.email._}
            value={form.inputs.email || ''}
            onChange={(e, data) => dispatch(formActions.onFormInputChange(formId, data))}
          />
          <Button onClick={() => onEmailCodeRequest(dispatch, form.inputs.email)}>Submit</Button>
          <ApiMessage request={emailCodeReq} messages={messages} />
        </div>
      </section>
    </Transition>
  )
}

export default PageOnboardingEmail
