import * as _ from 'lodash'

import ActionTypes from '../actionTypes'
import { FormInputChangeAction, FormInTransitionAction, FormStepChangeAction } from './actions'
import { FormDetails } from '@webapp/intf/Forms'
import Forms from '@webapp/config/forms'

export type ReducerFunc = (state: FormsState, action: any) => FormsState

export interface FormsState {
  [formId: string]: FormDetails
}

const initialState: FormsState = {}

// Defaulting forms
Object.keys(Forms).forEach((formId: string) => initialState[formId] = {
  step: 1,
  transition: false,
  inputs: {}
})

export default (state: FormsState, action: any): FormsState => {
  state = !state ? initialState : _.cloneDeep(state)

  switch (action.type) {

    // When input element has changed
    case ActionTypes.onFormInputChange: {
      const { formId, data } = action as FormInputChangeAction
      const { name, value } = data
      state[formId].inputs[name] = value
      return state
    }

    // When input element has changed
    case ActionTypes.onFormStepChange: {
      const { formId, step, noTransition } = action as FormStepChangeAction
      state[formId].step = step
      state[formId].transition = !noTransition
      return state
    }

    // When input element has changed
    case ActionTypes.onFormInTransition: {
      const { formId, transition } = action as FormInTransitionAction
      state[formId].transition = transition
      return state
    }

    default:
      return state
  }
}
