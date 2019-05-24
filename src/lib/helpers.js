const jwt = require('jsonwebtoken')
const { JWT } = require('../config')

module.exports = {
  generateToken(user) {
    const { id, email } = user
    return jwt.sign({ id, email }, JWT.secret, JWT.options)
  }
}
