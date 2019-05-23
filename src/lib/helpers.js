const jwt = require('jsonwebtoken')
const koaJWT = require('koa-jwt')
const { jwtSecret, jwtOptions, env } = require('../config')

module.exports = {
  generateToken(user) {
    const { id, email } = user
    const token = jwt.sign({ id, email }, jwtSecret, jwtOptions)
    return token
  },

  /**
   * Returns a middleware function which decodes and validates a token
   * and attach the user object to `ctx.state`
   */
  getAuth() {
    const auth = koaJWT({ secret: jwtSecret, debug: !env.isProd })
    return auth
  }
}
