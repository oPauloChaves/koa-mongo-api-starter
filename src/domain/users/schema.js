const yup = require('yup')

const userSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required()
      .email()
      .lowercase()
      .trim(),

    password: yup.string().when('$validatePassword', {
      is: true,
      then: yup
        .string()
        .required()
        .min(8)
        .max(30)
    }),

    name: yup
      .string()
      .required()
      .max(40)
      .default('')
      .trim()
  })
  .noUnknown()

const loginSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required()
      .email()
      .lowercase()
      .trim(),

    password: yup
      .string()
      .required()
      .trim()
  })
  .noUnknown()

module.exports = {
  userSchema,
  loginSchema
}
