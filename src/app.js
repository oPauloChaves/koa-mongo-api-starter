require('dotenv').config()

const Debug = require('debug')
const config = require('./config')
const Koa = require('koa')

const app = (module.exports = new Koa())

const responseTime = require('koa-response-time')
const helmet = require('koa-helmet')
const logger = require('koa-logger')
const cors = require('kcors')
const bodyParser = require('koa-bodyparser')

const jwt = require('./middleware/jwt')
const errors = require('./middleware/errors')
const pagerMiddleware = require('./middleware/pager')
const db = require('./middleware/database')

const routes = require('./routes')
const debug = Debug('app:server')

require('./domain/schemas')(app)

if (!config.env.isTest) {
  app.use(responseTime())
  app.use(helmet())
}

app.use(logger())

app.use(errors)
app.use(db(app))
app.use(cors(config.cors))
app.use(jwt)
app.use(bodyParser(config.bodyParser))

app.use(pagerMiddleware)

app.use(routes.routes())
app.use(routes.allowedMethods())

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

app.on('error', onError)

const { port } = config.server

if (!module.parent) {
  app.listen(port, () => {
    debug(`Server running on port ${port} in ${process.env.NODE_ENV} mode`)
  })
}
