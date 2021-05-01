import { RequestDetails } from '@webapp/intf/Routes'
import { KeyAny } from '@webapp/intf/Common'

import { Lifecycle } from '@webapp/properties'

export const getResponseData = (request: RequestDetails | undefined): KeyAny | undefined => {
  return request && request.res && request.res.data ? request.res.data : undefined
}

export const isRequestTriggered = (request: RequestDetails): boolean => {
  return request.lifecycle === Lifecycle.Triggered
}

export const isRequestSuccessful = (request: RequestDetails | undefined): boolean => {
  return request && request.lifecycle === Lifecycle.Completed
    && request.res && request.res.status === 200
      ? true
      : false
}

export const isRequestNowSuccessful = (request: RequestDetails | undefined, prevRequest: RequestDetails | undefined): boolean => {
  return isRequestSuccessful(request) && !isRequestSuccessful(prevRequest)
}

export const isRequestFailed = (request: RequestDetails | undefined): boolean => {
  return request && request.lifecycle === Lifecycle.Completed
    && request.res && request.res.status !== 200
      ? true
      : false
}

export const isRequestCompleted = (request: RequestDetails | undefined): boolean => {
  return request && request.lifecycle === Lifecycle.Completed
    ? true
    : false
}

export const isRequestNowCompleted = (request: RequestDetails | undefined, prevRequest: RequestDetails | undefined): boolean => {
  return isRequestCompleted(request) && !isRequestCompleted(prevRequest)
    ? true
    : false
}

export const isRequestProcessed = (request: RequestDetails | undefined): boolean => {
  return request && request.lifecycle === Lifecycle.Processed
    ? true
    : false
}

export const isRequestInvalid = (request: RequestDetails | undefined): boolean => {
  return request && request.lifecycle === Lifecycle.Invalid
    ? true
    : false
}

export const isRequestIdle = (request: RequestDetails | undefined): boolean => {
  return request && request.lifecycle === Lifecycle.Idle
    ? true
    : false
}
