const jwt = require('koa-jwt')

const {
  JWT: { key, debug, secret }
} = require('../config')

module.exports = jwt({ key, debug, secret })
