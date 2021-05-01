import { WebAppRoutes } from '@webapp/intf/Routes'

import PageSignIn from '../components/pages/signIn'
import PageOnboarding from '../components/pages/onboarding/onboarding'
import PageDashboard from '../components/pages/dashboard'

import { AccessTypes } from '../properties'


export const appRoutes: WebAppRoutes = {
  home: {
    name: 'app',
    description: 'Application dashboard',
    uri: '/',
    exact: true,
    access: AccessTypes.User,
    component: PageDashboard
  },
  signIn: {
    name: 'signIn',
    description: 'User sign in',
    uri: '/signIn',
    exact: true,
    access: AccessTypes.Anonymous,
    component: PageSignIn
  },
  onboarding: {
    name: 'onboarding',
    description: 'Registering a new candidate or recruiter',
    uri: '/onboarding',
    exact: false,
    access: AccessTypes.Anonymous,
    component: PageOnboarding
  }
}
