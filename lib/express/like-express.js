const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
  constructor () {
    this.routers = {
      all: [],
      get: [],
      post: []
    }
  }

  register (path) {
    const info = {}
    if (typeof path === 'string') {
      info.path = path
      info.stack = slice.call(arguments, 1)
    } else if (typeof path === 'function') {
      info.path = '/'
      info.stack = slice.call(arguments, 0)
    }
    return info
  }

  use () {
    const info = this.register.apply(this, arguments)
    this.routers.all.push(info)
  }

  get () {
    const info = this.register.apply(this, arguments)
    this.routers.get.push(info)
  }

  post () {
    const info = this.register.apply(this, arguments)
    this.routers.post.push(info)
  }

  match (url, method) {
    let stack = []

    if (url === '/favicon.ico') {
      return stack
    }

    let curRoutes = []
    curRoutes = curRoutes.concat(this.routers.all)
    curRoutes = curRoutes.concat(this.routers[method])

    curRoutes.forEach(routerInfo => {
      if (url.indexOf(routerInfo.path) === 0) {
        stack = stack.concat(routerInfo.stack)
      }
    })

    return stack
  }

  handle (req, res, stack) {
    const next = () => {
      const middleware = stack.shift()

      if (middleware) {
        middleware(req, res, next)
      } else {
        res.end()
      }
    }
    next()
  }

  callback () {
    return (req, res) => {
      res.json = data => {
        res.setHeader('Content-type', 'application/json')
        res.end(JSON.stringify(data))
      }

      const url = req.url
      const method = req.method.toLowerCase()

      const resultList = this.match(url, method)
      this.handle(req, res, resultList)
    }
  }

  listen (...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

module.exports = () => new LikeExpress()