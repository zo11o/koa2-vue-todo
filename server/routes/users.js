const router = require('koa-router')()
const UserController = require('../controller/users/index.js');
router.prefix('/users')

router.get('/',UserController.index)

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
