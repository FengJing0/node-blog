const qs = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

const getPostData = req => {

  return new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chuck => {
      postData += chuck.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
}

const serverHandle = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  const { url } = req
  req.path = url.split('?')[0]

  // 解析query
  req.query = qs.parse(url.split('?')[1])

  // 处理postData
  getPostData(req).then(postData => {
    req.body = postData

    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        res.end(JSON.stringify(blogData))
      })
      return
    }

    const userData = handleUserRouter(req, res)
    if (userData) {
      userData.then(userData => {
        res.end(JSON.stringify(userData))
      })
      return
    }

    res.writeHeader(404, { 'Content-Type': 'text/plain' })
    res.write('404 Not Found')
    res.end()
  })
}

module.exports = serverHandle
