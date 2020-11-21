import * as Joi from 'joi'

export default Joi.object({
  login: Joi.string()
    .alphanum()
    .min(5)
    .max(10)
    .required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{5,15}$/)
    .required(),
  age: Joi.number()
    .integer()
    .min(4)
    .max(130)
    .required()
})
