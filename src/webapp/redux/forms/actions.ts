import { KeyAny } from '@webapp/intf/Common'
import ActionTypes from '../actionTypes'

export interface FormInputChangeAction {
  type: ActionTypes
  formId: string
  data: KeyAny
}
export interface FormStepChangeAction {
  type: ActionTypes
  formId: string
  noTransition: boolean
  step: number
}

export interface FormInTransitionAction {
  type: ActionTypes
  formId: string
  transition: boolean
}

export const onFormInputChange = (formId: string, data: KeyAny): FormInputChangeAction => {
  return {
    type: ActionTypes.onFormInputChange,
    formId,
    data
  }
}

export const onFormStepChange = (formId: string, step: number, noTransition?: boolean): FormStepChangeAction => {
  return {
    type: ActionTypes.onFormStepChange,
    formId,
    noTransition: noTransition || false,
    step
  }
}

export const onFormInTransition = (formId: string, transition: boolean): FormInTransitionAction => {
  return {
    type: ActionTypes.onFormInTransition,
    formId,
    transition
  }
}
