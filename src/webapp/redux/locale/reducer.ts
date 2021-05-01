import * as _ from 'lodash'
import { Locale } from '@webapp/intf/Locale'

import translations, { Translations } from '@webapp/config/translations'

import ActionTypes from '../actionTypes'
import { LocaleSetTranslationAction } from './actions'

export type ReducerFunc = (state: LocaleState, action: any) => LocaleState
export type LocaleState = Locale

const initialState: LocaleState = {
  ...translations[Translations.english]
}



export default (state: LocaleState, action: any): LocaleState => {
  state = !state ? initialState : state

  switch (action.type) {

    // When translation has been set
    case ActionTypes.onLocaleSetTranslation: {
      const { translation } = action as LocaleSetTranslationAction
      state = translations[translation]
      return state
    }

    default:
      return state
  }
}
