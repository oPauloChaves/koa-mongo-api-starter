const config = require('./config')
const http = require('http')
const Koa = require('koa')
const mongoose = require('mongoose')

const app = new Koa()

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

app.server = require('http-shutdown')(http.createServer(app.callback()))

app.shutDown = function shutDown() {
  let err

  console.log('Shutdown')

  if (this.server.listening) {
    this.server.shutdown(error => {
      if (error) {
        console.error(error)
        err = error
      }

      mongoose.connection.close(function() {
        console.log(
          'Mongoose default connection disconnected through app shutdown'
        )
        process.exit(err ? 1 : 0)
      })
    })
  }
}

module.exports = app
