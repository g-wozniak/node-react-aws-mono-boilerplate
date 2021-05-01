import * as React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

interface WithBrowserRouterProps {
  uri?: string
  children: any
}

export const WithBrowserRouter = (props: WithBrowserRouterProps): JSX.Element => {
  return (
    <BrowserRouter>
      <Route path={props.uri || '/'} component={() => props.children} />
    </BrowserRouter>
  )
}