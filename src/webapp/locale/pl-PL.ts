import { Locale } from '@webapp/intf/Locale'

export default {
  inputs: {
    email: {
      l: 'Adres e-mail',
      err: '',
      _: 'Wpisz swoj e-mail...'
    },
    phone: {
      l: 'Numer telefonu',
      err: '',
      _: '+00.000000000'
    },
    code: {
      l: '',
      err: '',
      _: ''
    }
  },
  links: {
    home: 'Strona główna',
    signIn: 'Logowanie',
    onboarding: 'Rejestracja'
  },
  messages: {
    errors: {},
    success: {}
  }
} as Locale