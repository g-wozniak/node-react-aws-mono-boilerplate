import * as React from 'react'
import MetaTags from 'react-meta-tags'
import * as _ from 'lodash'

import { WebAppRoute } from '../../../__intf/Routes'
import MasterLayout from '../../layout/master'


const RouteWrapper = (props: WebAppRoute): JSX.Element => {
  // const locale = useSelector((state: Reducers) => state.r_app.locale)
  const Component = props.component
  const _props: WebAppRoute = _.clone(props)
  delete _props.component

  const ComponentToBeRendered = <Component route={_props} />
  return (
    <>
      <MasterLayout {...props}>{ComponentToBeRendered}</MasterLayout>
    </>
  )
}

export default RouteWrapper
