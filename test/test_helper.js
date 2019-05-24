const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { DB } = require('../src/config')

let mongoServer

before(async () => {
  try {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getConnectionString()
    await mongoose.connect(mongoUri, DB.options)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})

after(() => {
  mongoose.disconnect()
  mongoServer.stop()
})
