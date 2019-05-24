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

if (!config.IS_TEST) {
  app.use(logger())
  app.use(responseTime())
  app.use(helmet())
}

app.use(errors.errorHandler)
app.use(db(app))
app.use(cors(config.CORS))
app.use(bodyParser())
app.use(pagerMiddleware)
app.use(routes.routes())
app.use(routes.allowedMethods())
// app.on('error', errors.onError)

if (!module.parent) {
  app.listen(config.PORT, () => {
    debug(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`)
  })
}
