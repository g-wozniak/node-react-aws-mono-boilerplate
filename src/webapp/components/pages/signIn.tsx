import * as React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Grid, Input } from 'semantic-ui-react'
import { appRoutes } from '@webapp/config/routes'

import { RouteProps } from '@webapp/intf/Common'

const PageSignIn = (props: RouteProps): JSX.Element => {
  // const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=777wopq1ybsyqw&redirect_uri=http://localhost:3000/auth&state=${ID()}&scope=r_basicprofile`
  return (
    <header className="app__header">
      <Grid container={true} verticalAlign="middle">
        <Grid.Column computer={10}>
          <h2>Sign in</h2>
          <p>If you already have a user account, type your credentials to log in.</p>
          <p>Not registered yet? <Link to={appRoutes.onboarding.uri}>Sign up</Link></p>
          Login form
        </Grid.Column>
      </Grid>
    </header>
  )
}

export default PageSignIn
