const path = require('path')

const ROOT = path.resolve(__dirname, '../../')
const SRC_DIR = path.resolve(__dirname, '../')

const {
  NODE_ENV = 'development',
  PORT = 3000,
  JWT_SECRET = 's3cr3t',
  JWT_EXPIRES_IN = '7d',
  MONGODB_URI = 'mongodb://127.0.0.1:27017/finances',
  DEBUG
} = process.env

module.exports = {
  ROOT,
  SRC_DIR,
  NODE_ENV,
  DEBUG,

  IS_PROD: NODE_ENV === 'production',
  IS_DEV: NODE_ENV === 'development',
  IS_TEST: NODE_ENV === 'test',

  PORT,

  DB: {
    uri: MONGODB_URI,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      reconnectTries: 30
    }
  },

  CORS: {
    origin: '*',
    exposeHeaders: ['Authorization'],
    credentials: true,
    allowHeaders: ['Authorization', 'Content-Type'],
    keepHeadersOnError: true
  },

  JWT: {
    secret: JWT_SECRET,
    key: 'user',
    debug: !this.IS_PROD,
    options: {
      expiresIn: JWT_EXPIRES_IN
    }
  },

  PAGER: {
    limit: 10
  }
}
