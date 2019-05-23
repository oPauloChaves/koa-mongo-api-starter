const mongoose = require('mongoose')
const config = require('../config')

mongoose.Promise = global.Promise

module.exports = app => {
  mongoose
    .connect(config.mongoURI, {
      useMongoClient: true,
      socketTimeoutMS: 0,
      keepAlive: true,
      reconnectTries: 15
    })
    .then(conn => {
      console.log(`MongoDB connected on ${config.env.env} mode`)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })

  return async function(ctx, next) {
    return next()
  }
}
