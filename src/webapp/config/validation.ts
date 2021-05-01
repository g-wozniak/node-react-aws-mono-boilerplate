import * as Joi from 'joi'
import { KeyJoy } from '@webapp/intf/Common'

const requests: KeyJoy = {}

requests.signUpEmail = Joi.object({
  email: Joi.string().email({ tlds: { allow: false }})
})

requests.name = Joi.object({
  name: Joi
    .string()
    .required(),
  surname: Joi
    .string()
    .required()
})


export default requests