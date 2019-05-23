const debug = require('debug')('app:mongoose')
const mongoose = require('mongoose')
const config = require('../config')

module.exports = app => {
  if (process.env.NODE_ENV !== 'test') {
    mongoose
      .connect(config.mongoURI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        reconnectTries: 30
      })
      .then(conn => {
        debug(`MongoDB connected on ${config.env.env} mode`)
      })
      .catch(err => {
        console.error(err)
        process.exit(1)
      })
  }

  return function(ctx, next) {
    return next()
  }
}
