import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic'

interface LocaleInput {
  l: string
  err: string
  _: string
}

export interface Message {
  h: string
  b: string
  i: SemanticICONS
}

export interface Locale {
  inputs: {
    [name: string]: LocaleInput
  }
  links: {
    home: string
    signIn: string
    onboarding: string
  },
  messages: {
    errors: {
      [messageKey: string]: Message
    }
    success: {
      [messageKey: string]: Message
    }
  }
}