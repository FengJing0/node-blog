const express = require('express')
const router = express.Router();

const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/login', (req, res, next) => {
  const { username, password } = req.body
  const result = login(username, password)
  result.then(data => {
    if (data.username) {
      req.session.username = data.username
      req.session.realname = data.realname

      res.json(new SuccessModel())
      return
    }
    res.json(new ErrorModel('登陆失败'))
  })
})

module.exports = router