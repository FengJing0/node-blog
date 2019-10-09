var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { ErrorModel } = require('./model/resModel')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const blogRouter = require('./routes/blog')
const userRouter = require('./routes/user')

var app = express();

// 日志
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  app.use(logger('dev'));
} else {
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }));
}

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// session
const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'WJVLjsi8h3_!_+.4f',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

// 路由
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(new ErrorModel(err.toString()));
});

module.exports = app;
