const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path');
const fs = require('fs')
// const index = require('./routes/index')
// const users = require('./routes/users')
const mongoose = require('mongoose')

// error handler
onerror(app)

/**
 * mongoose连接数据库
 * @type {[type]}
 */
// mongoose.Promise = require('bluebird')
// mongoose.connect(db)
mongoose.Promise = require('bluebird')
//新版本使用 createConnection 替代 connect
mongoose.createConnection("mongodb://localhost:27017/koa2", {useNewUrlParser:true}, function(err){

    if(err){

        console.log('Connection Error:' + err)

    }else{

        console.log('Connection success!')

    }
})

/**
 * 获取数据库表对应的js对象所在的路径
 * @type {[type]}
 */
const models_path = path.join(__dirname, '/app/models')
console.log(models_path)
/**
 * 以递归的形式，读取models文件夹下的js模型文件，并require
 * @param  {[type]} modelPath [description]
 * @return {[type]}           [description]
 */
var walk = function(modelPath) {
    fs
        .readdirSync(modelPath)
        .forEach(function(file) {
            var filePath = path.join(modelPath, '/' + file)
            var stat = fs.statSync(filePath)
            console.log(stat)
            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(filePath)
                }
            }
            else if (stat.isDirectory()) {
                walk(filePath)
                console.log(filePath)
            }
        })
}
walk(models_path)



// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
//配置静态目录
// app.use(require('koa-static')(__dirname + '/public'))

//配置静态目录
app.use(require('koa-static')(__dirname + '/views'));


app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
const router = require('./routes')()

app
    .use(router.routes(),router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
