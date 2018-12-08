// const router = require('koa-router')()
//
//
// router.get('/', async (ctx, next) => {
//   await ctx.render('index', {
//     title: 'Hello Koa 2!'
//   })
// })
//
// router.get('/string', async (ctx, next) => {
//   ctx.body = 'koa2 string'
// })
//
// router.get('/json', async (ctx, next) => {
//   ctx.body = {
//     title: 'koa2 json'
//   }
// })
//
// module.exports = router

'use strict'

const Router = require('koa-router')
const Users = require('../app/controllers/users')
const App = require('../app/controllers/app')


module.exports = function() {
    var router = new Router({
        prefix: '/api'
    })

    // user
    router.post('/u/signup', App.hasBody, Users.signup)
    router.post('/u/update', App.hasBody, App.hasToken, Users.update)

    // DB Interface test
    router.get('/test/user/users', Users.users)
    router.post('/test/user/add', Users.addUser)
    router.post('/test/user/delete', Users.deleteUser)

    return router
}
