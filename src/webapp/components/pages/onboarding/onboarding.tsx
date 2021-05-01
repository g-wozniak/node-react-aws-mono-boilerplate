import * as React from 'react'
import { Link } from 'react-router-dom'
import { Button, Dropdown, Grid, Input, Transition, TransitionGroup } from 'semantic-ui-react'

import { appRoutes } from '@webapp/config/routes'
import Forms from '@webapp/config/forms'

import { RouteProps } from '@webapp/intf/Common'

import PageOnboardingEmail from './onboarding_email'
import PageOnboardingEmailCode from './onboarding_email_code'
import PageOnboardingPhone from './onboarding_phone'


const formId = Forms.onboarding

const PageOnboarding = (props: RouteProps): JSX.Element => {
  
  return (
    <header className="app__header">
      <Grid container={true} verticalAlign="middle">
        <Grid.Column computer={16}>
          <h2>Registration (onboarding)</h2>
          <p>Create a new user account as a recruiter or candidate.</p>
          <p>Already registered? <Link to={appRoutes.signIn.uri}>Sign in</Link></p>
        </Grid.Column>
        <Grid.Column computer={16}>
          <PageOnboardingEmail step={1} formId={formId} />
          <PageOnboardingEmailCode step={2} formId={formId} />
          <PageOnboardingPhone step={3} formId={formId} />
          <PageOnboardingPhone step={4} formId={formId} />
        </Grid.Column>
      </Grid>
    </header>
  )
}

export default PageOnboarding
