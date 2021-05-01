import * as _ from 'lodash'

import { ApiResponse, RequestDetails } from '@webapp/intf/Routes'
import { Lifecycle } from '@webapp/properties'

import ActionTypes from '../actionTypes'
import { RequestInvalidAction, RequestResetAction, RequestTriggerAction, ResponseAction, ResponseErrorAction } from './actions'
import { Routes } from '../../../routes'

export type ReducerFunc = (state: RequestsState, action: any) => RequestsState

export interface RequestsState {
  [name: string]: RequestDetails
}

const initialState: RequestsState = {}
Object.keys(Routes).forEach((routeName: string) => initialState[routeName] = { lifecycle: Lifecycle.Idle })


export default (state: RequestsState, action: any): RequestsState => {
  state = !state ? initialState : _.cloneDeep(state)

  switch (action.type) {

    // When a request is triggered
    case ActionTypes.onRequestTrigger: {
      const { req } = action as RequestTriggerAction
      state[req.reqId] = {
        ...state[req.reqId],
        req,
        lifecycle: Lifecycle.Triggered
      }
      return state
    }

    // When a request is invalid (validation did not pass)
    case ActionTypes.onRequestInvalid: {
      const { req } = action as RequestInvalidAction
      state[req.reqId] = {
        ...state[req.reqId],
        req,
        lifecycle: Lifecycle.Invalid
      }
      return state
    }

    // When a request is resetting its status
    case ActionTypes.onRequestReset: {
      const { reqId } = action as RequestResetAction
      reqId.forEach((key: string) => state[key] = initialState[key])
      return state
    }

    // When a response is successful from the server side
    case ActionTypes.onResponseSuccessful: {
      const { reqId, res, extra } = action as ResponseAction

      if (extra.token) {
        console.log('TODO: Add token to local storage')
      }

      const _res: ApiResponse = {
        status: res.status
      }

      if (res.data && res.data.data) {
        _res.data = res.data.data
      }

      if (res.data && res.data.message) {
        _res.message = res.data.message
      }

      state[reqId] = {
        ...state[reqId],
        lifecycle: Lifecycle.Completed,
        res: _res
      }
      return state
    }

    // When the response is errorous from the backend side
    case ActionTypes.onResponseError: {
      const { reqId, res } = action as ResponseErrorAction
      
      const _res: ApiResponse = {
        status: 401
      }

      if (res) {
        if (res.status) {
          _res.status = res.status
        }

        if (res.data && res.data.data) {
          _res.data = res.data
        }
  
        if (res.data && res.data.message) {
          _res.message = res.data.message
        }  
      }

      state[reqId] = {
        ...state[reqId],
        lifecycle: Lifecycle.Completed,
        res: _res
      }
      return state
    }

    default:
      // Process all completed requests
      // const x = Object.values(state).filter((req: RequestDetails) => req.lifecycle === Lifecycle.Completed)
      // console.log(x)
      return state
  }
}
