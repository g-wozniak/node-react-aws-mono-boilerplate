import { Translations } from '@webapp/config/translations'
import ActionTypes from '../actionTypes'

export interface LocaleSetTranslationAction {
  type: ActionTypes
  translation: string
}

export const onLocaleSetTranslation = (translation: Translations): LocaleSetTranslationAction => {
  return {
    type: ActionTypes.onLocaleSetTranslation,
    translation
  }
}
