import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Transition } from 'semantic-ui-react'
import { ReducersState } from '@webapp/intf/Common'

import * as formActions from '@webapp/redux/forms/actions'
import { isReadyToDisplay } from '@webapp/helpers/forms'
interface Props {
  formId: string
  step: number
}

const PageOnboardingPhone = (props: Props): JSX.Element => {
  const { formId, step } = props
  const form = useSelector((state: ReducersState) => state.r_forms[formId])
  const { inputs } = useSelector((state: ReducersState) => state.r_locale)
  const dispatch = useDispatch()
  return (
    <Transition
      animation="fly left"
      onHide={() => dispatch(formActions.onFormInTransition(formId, false))}
      duration="600"
      visible={isReadyToDisplay(form, step)}
    >
      <section>
        <Input
          className="input--text"
          name="phone"
          placeholder={inputs.phone._}
          value={form.inputs.phone}
          onChange={(e, data) => dispatch(formActions.onFormInputChange(formId, data))}
        />
        <Button onClick={() => dispatch(formActions.onFormStepChange(formId, step - 1))}>Prev step</Button>
      </section>
    </Transition>
  )
}

export default PageOnboardingPhone
