process.env.NODE_ENV = process.env.NODE_ENV || 'development'

require('dotenv-flow').config({ path: './.env' })

const Debug = require('debug')
const Koa = require('koa')
const responseTime = require('koa-response-time')
const helmet = require('koa-helmet')
const logger = require('koa-logger')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')

const app = (module.exports = new Koa())

const config = require('./config')
const errors = require('./middleware/errors')
const pagerMiddleware = require('./middleware/pager')
const db = require('./middleware/database')

const routes = require('./routes')
const debug = Debug('app:server')

require('./domain/schemas')(app)

if (!config.IS_TEST) {
  app.use(logger())
  app.use(responseTime())
  app.use(helmet())
}

app.use(errors)
app.use(db(app))
app.use(cors(config.CORS))
app.use(bodyParser())
app.use(pagerMiddleware)
app.use(routes.routes())
app.use(routes.allowedMethods())

app.on('error', onError)

const { PORT } = config

if (!module.parent) {
  app.listen(PORT, () => {
    debug(`Server running on port ${PORT} in ${config.NODE_ENV} mode`)
  })
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT

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
