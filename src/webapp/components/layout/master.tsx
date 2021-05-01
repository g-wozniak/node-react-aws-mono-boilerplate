import * as React from 'react'
import { Grid } from 'semantic-ui-react'
import LayoutHeader from './header'

export interface Props {
  children?: any
}

const MasterLayout = (props: Props): JSX.Element => {
  return (
    <div className="app">
      <LayoutHeader />
      <main>
        {props.children}
      </main>
      <footer>
        <Grid container={true}>

        </Grid>
      </footer>
    </div>
  )
}

export default MasterLayout
