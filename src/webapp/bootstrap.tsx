import { createStore, combineReducers, applyMiddleware, compose, Store } from 'redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import thunk from 'redux-thunk'

import r_requests from './redux/requests/reducer'
import r_forms from './redux/forms/reducer'
import r_locale from './redux/locale/reducer'

import RouteWrapper from './components/shared/route/route'
import { appRoutes } from './config/routes'


const getReduxStore = (): Store => {
  const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose
  const reducers = {
    r_requests,
    r_forms,
    r_locale
  }
  return createStore(combineReducers(reducers), composeEnhancers(applyMiddleware(thunk)))
}

class App extends React.Component<unknown, never> {

  public render(): JSX.Element {
    
    return (
      <Provider store={getReduxStore()}>
        <BrowserRouter>
          <Switch>
            {
              Object.keys(appRoutes).map((key: string) => {
                const route = appRoutes[key]
                return (
                  <Route
                    key={`route-${key}`}
                    path={route.uri}
                    exact={route.exact}
                    component={() => <RouteWrapper {...route} />}
                  />
                )
              })
            }
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app') as HTMLElement
)