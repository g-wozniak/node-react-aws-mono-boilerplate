import * as React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Image } from 'semantic-ui-react'

const LayoutHeader = (): JSX.Element => {
  return (
    <header className="app__header">
      <Grid container={true}>
        <Grid.Column computer={4}>
          <Link to="/">
            <Image src="/assets/logo.png" alt="simply.careers" fluid={true} />
          </Link>
        </Grid.Column>
      </Grid>
    </header>
  )
}

export default LayoutHeader
