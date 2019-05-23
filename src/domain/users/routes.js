const Router = require('koa-router')
const ctrl = require('./controller')
const { getAuth } = require('../../lib/helpers')

const router = new Router()

router.get('/users', getAuth(), ctrl.list)
router.post('/users', ctrl.register)
router.put('/users', getAuth(), ctrl.update)
router.post('/login', ctrl.login)

module.exports = router.routes()
