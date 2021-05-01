import enGB from '../locale/en-GB'
import plPL from '../locale/pl-PL'

export enum Translations {
  english = 'en-GB',
  polish = 'pl-PL'
}

const translations = {}
translations[Translations.english] = enGB
translations[Translations.polish] = plPL

export default translations
