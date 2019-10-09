const express = require('./like-express')

const app = express()

app.use((req, res, next) => {
  console.log('start')
  next()
})

const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()
}

app.use((req, res, next) => {
  console.log('cookie...')
  res.setHeader('Set-Cookie', `userId=abc123; path=/; httpOnly; expires=${getCookieExpires()}`)
  // req.cookie = {
  //   userId: 'abc123'
  // }
  next()
})

app.use('/api', (req, res, next) => {
  console.log('api...')
  next()
})

app.get('/api', (req, res, next) => {
  console.log('get api...')
  next()
})

function loginCheck (req, res, next) {
  setTimeout(() => {
    console.log('login...');
    next()
  }, 1000);
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
  console.log('get /api/get-cookie...')
  res.json({
    errno: 0,
    data: req.headers.cookie
  })
  next()
})

app.listen(8010, () => {
  console.log('server is running on port 8010');
})