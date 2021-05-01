import Joi from 'joi'

import { FormsState } from '../redux/forms/reducer'
import { LocaleState } from '../redux/locale/reducer'
import { RequestsState } from '../redux/requests/reducer'

import { AppRoute } from './Routes'

export interface KeyAny {
  [key: string]: any
}

export interface KeyString {
  [key: string]: string
}

export interface KeyJoy {
  [schemaId: string]: Joi.Schema
}

export interface ReducersState {
  r_requests: RequestsState
  r_forms: FormsState
  r_locale: LocaleState
}

export interface RouteProps {
  route: AppRoute
}
export interface Validation {
  key: string
  message: string
}

