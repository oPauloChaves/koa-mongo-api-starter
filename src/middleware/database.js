const debug = require('debug')('app:mongoose')
const mongoose = require('mongoose')
const { NODE_ENV, DB } = require('../config')

module.exports = app => {
  if (NODE_ENV !== 'test') {
    mongoose
      .connect(DB.uri, DB.options)
      .then(conn => {
        debug(`MongoDB connected on ${NODE_ENV} mode`)
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
