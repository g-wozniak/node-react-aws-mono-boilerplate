import { Locale } from '../__intf/Locale'

export default {
  inputs: {
    email: {
      l: 'E-mail address',
      err: '',
      _: 'Type your e-mail...'
    },
    phone: {
      l: 'Phone number',
      err: '',
      _: '+00.000000000'
    },
    email_code: {
      l: 'Code from e-mail',
      err: '',
      _: 'Type the code'
    }
  },
  links: {
    home: 'Home page',
    signIn: 'Login',
    onboarding: 'Registration'
  },
  messages: {
    errors: {
      unknownError: {
        h: 'Unknown error',
        b: 'Previous operation returned an error',
        i: 'x'
      },
      validationError: {
        h: 'Validation error',
        b: 'Correct the highlighted fields and try again',
        i: 'x'
      }
    },
    success: {
      unknownSuccess: {
        h: 'Success',
        b: 'Operation was successful',
        i: 'check'
      }
    }
  }
} as Locale