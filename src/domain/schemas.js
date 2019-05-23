const { loginSchema, userSchema } = require('./users/schema')

module.exports = app => {
  app.schemas = {
    user: userSchema,
    login: loginSchema
  }
}
