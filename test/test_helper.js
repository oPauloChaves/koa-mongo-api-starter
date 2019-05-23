const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer
const opts = { useCreateIndex: true, useNewUrlParser: true }

before(done => {
  mongoServer = new MongoMemoryServer()
  mongoServer
    .getConnectionString()
    .then(mongoUri => {
      return mongoose.connect(mongoUri, opts, err => {
        if (err) done(err)
      })
    })
    .then(() => done())
})

after(() => {
  mongoose.disconnect()
  mongoServer.stop()
})
