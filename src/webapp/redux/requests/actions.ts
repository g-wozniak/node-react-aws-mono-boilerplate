import { ApiPropsFromHeaders, ApiRequest } from '@webapp/intf/Routes'
import { KeyAny, ReducersState, Validation } from '@webapp/intf/Common'
import { Headers, RequestMethods } from '@webapp/properties'

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

import schemas from '@webapp/config/validation'
import { flatten } from '../../helpers/validator'
import ActionTypes from '../actionTypes'

export interface RequestResetAction {
  type: ActionTypes
  reqId: string[]
}

export interface RequestTriggerAction {
  type: ActionTypes
  req: ApiRequest
}

export type RequestInvalidAction = RequestTriggerAction

export interface ResponseAction {
  type: ActionTypes
  reqId: string
  res: AxiosResponse
  extra: ApiPropsFromHeaders
}

export interface ResponseErrorAction {
  type: ActionTypes
  reqId: string
  res: AxiosResponse
}

export const onRequestReset = (reqId: string[]): RequestResetAction => {
  return {
    type: ActionTypes.onRequestReset,
    reqId
  }
}

export const onRequestTrigger = (req: ApiRequest): RequestTriggerAction => {
  return {
    type: ActionTypes.onRequestTrigger,
    req
  }
}

export const onRequestInvalid = (req: ApiRequest): RequestInvalidAction => {
  return {
    type: ActionTypes.onRequestInvalid,
    req
  }
}

export const onResponseSuccessful = (reqId: string, res: AxiosResponse, extra: ApiPropsFromHeaders): ResponseAction => {
  return {
    type: ActionTypes.onResponseSuccessful,
    reqId,
    res,
    extra
  }
}

export const onResponseError = (reqId: string, res: AxiosResponse): ResponseErrorAction => {
  return {
    type: ActionTypes.onResponseError,
    reqId,
    res
  }
}

const onRequestValidate = (reqId: string, payload?: KeyAny): Validation[] => {
  if (schemas.hasOwnProperty(reqId)) {
    const validation = schemas[reqId].validate(payload)
    if (validation.error) {
      return flatten(validation.error.details)
    }
  }
  return []
}

export const onRequest = (req: ApiRequest) => {
  const reqId = req.reqId
  return (dispatch: any, getState: () => ReducersState) => {
    let requestCall: any
    let headers = {}

    const xhr = axios.create({
      baseURL: '',
      responseType: 'json',
      timeout: 30000
    })

    // Validate the request with Joi
    req.validation = onRequestValidate(reqId, req.payload)

    if (req.validation.length === 0) {

      // Request passed validation
      dispatch(onRequestTrigger(req))

      if (req.auth) {
        console.log('TODO: Take token from local storage')
        headers[Headers.Authorization] = 'Bearer 1234'
      }

      if (req.headers) {
        headers = { ...headers, ...req.headers }
      }

      const options: AxiosRequestConfig = { headers }

      // Send the actual request to the API
      switch (req.method) {
        case RequestMethods.DELETE: {
          requestCall = () => xhr.delete(req.uri, options)
          break
        }
        case RequestMethods.PATCH: {
          requestCall = () => xhr.patch(req.uri, req.payload, options)
          break
        }
        case RequestMethods.POST: {
          requestCall = () => xhr.post(req.uri, req.payload, options)
          break
        }
        case RequestMethods.GET:
        default:
          requestCall = () => xhr.get(req.uri, options)
      }

      requestCall()
        .then((response: AxiosResponse) => {
          const token = response.headers[Headers.Authorization]
          dispatch(onResponseSuccessful(reqId, response, { token }))
        }).catch((error: any) => {
          const err = ((error as AxiosError).isAxiosError !== undefined)
            ? error.response
            : undefined
          dispatch(onResponseError(reqId, err))
        })
      } else {
        // Request did not pass validation
        dispatch(onRequestInvalid(req))
      }
    }
  }