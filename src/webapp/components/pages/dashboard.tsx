import * as React from 'react'
import { Dispatch, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Grid } from 'semantic-ui-react'
import socketIOClient from 'socket.io-client'

import { ReducersState, RouteProps } from '@webapp/intf/Common'
import { ApiRequest } from '@webapp/intf/Routes'

import { appRoutes } from '@webapp/config/routes'
import { onRequest } from '@webapp/redux/requests/actions'
import { getResponseData, isRequestCompleted, isRequestInvalid, isRequestProcessed, isRequestTriggered } from '@webapp/helpers/request'

import apiRoutes, { Routes } from '../../../routes'
import { onLocaleSetTranslation } from '@webapp/redux/locale/actions'
import { Translations } from '@webapp/config/translations'

const onNameRequest = (dispatch: Dispatch<any>, name: string, surname: string): void => {
  const reqId = Routes.Name
  dispatch(onRequest({
    ...apiRoutes[reqId],
    reqId,
    payload: { name, surname },
  } as ApiRequest))
}

const App = (props: RouteProps): JSX.Element => {
  const { r_requests } = useSelector((state: ReducersState) => state)
  const { links } = useSelector((state: ReducersState) => state.r_locale)
  const dispatch = useDispatch()
  let status = 'idle'
  let data

  const [response, setResponse] = useState('')
/*
  useEffect(() => {
    const socket = socketIOClient('http://localhost:3000')
    socket.on('FromAPI', data => {
      setResponse(data)
    })
    return () => socket.disconnect() as any
  }, [])
  */

  const nameRequest = r_requests[Routes.Name]
  
  if (isRequestTriggered(nameRequest)) {
    status = 'triggered...'
  }

  if (isRequestCompleted(nameRequest)) {
    status = 'completed...'
    data = getResponseData(nameRequest)
  }

  if (isRequestProcessed(nameRequest)) {
    status = 'processed...'
  }
  if (isRequestInvalid(nameRequest)) {
    status = 'invalid...'
  }

  return (
    <header className="app__header">
      <Grid container={true} verticalAlign="middle">
        <Grid.Column computer={8}>
          <div>
            <Link to={appRoutes.onboarding.uri}>{links.onboarding}</Link>
          </div>
          <div>
            <Link to={appRoutes.signIn.uri}>{links.signIn}</Link>
          </div>
        </Grid.Column>
        <Grid.Column computer={8}>
          <Button onClick={() => onNameRequest(dispatch, 'Grzegorz', 'Wozniak')}>Example request to /api/name</Button>
          <p>This is some change to the code</p>
          <p>Request lifecycle: {status}</p>
          <p>Response: {JSON.stringify(data)}</p>
        </Grid.Column>
        <Grid.Column computer={8}>
          <Button onClick={() => dispatch(onLocaleSetTranslation(Translations.polish))}>Zmien na polski</Button>
          <Button onClick={() => dispatch(onLocaleSetTranslation(Translations.english))}>Change to English</Button>
        </Grid.Column>
      </Grid>
    </header>
  )
}

export default App
