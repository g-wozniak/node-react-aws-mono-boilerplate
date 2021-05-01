import { Validation } from '@webapp/intf/Common'
import Joi from 'joi'

// Validation adapter between Joi response and our apps
export const flatten = (errors: Joi.ValidationErrorItem[]): Validation[] => {
  return errors.map((error: Joi.ValidationErrorItem) => {
    return {
      key: error.context && error.context.key || '?',
      message: error.message
    }
  })
}

export const isValid = (key: string, errors: Validation[] = []): boolean => {
  return errors.find((error: Validation) => error.key === key) ? false : true
}
