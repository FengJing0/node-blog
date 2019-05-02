const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const {set}=require('../db/redis')

const handleUserRouter = (req, res) => {
  const { method, path, session } = req

  if (method === 'POST' && path === '/api/user/login') {
    const { username, password } = req.body
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {
        req.session.username = data.username
        req.session.realname = data.realname

        set(req.sessionId,req.session)

        return new SuccessModel()
      }
      return new ErrorModel('登陆失败')
    })
  }

  if (method === 'GET' && path === '/api/user/login-test') {
    if (session.username) {
      return Promise.resolve(new SuccessModel({
        session
      }))
    }
    return Promise.resolve(new ErrorModel('尚未登陆'))
  }

}

module.exports = handleUserRouter