const express = require('express')
const router = express.Router();

const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const loginCheck = require('../middleware/loginCheck')

router.get('/list', (req, res, next) => {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''

  if (req.query.isadmin) {
    if (!req.session.username) {
      res.json(new ErrorModel('未登录'))
      return
    }
    author = req.session.username
  }

  const result = getList(author, keyword)
  result.then(listData => res.json(new SuccessModel(listData)))
})

router.get('/detail', (req, res, next) => {
  const { id } = req.query
  const result = getDetail(id)

  result.then(data => res.json(new SuccessModel(data)))
})

router.post('/new', loginCheck, (req, res, next) => {
  req.body.author = req.session.username
  const result = newBlog(req.body)
  result.then(data => res.json(new SuccessModel(data)))
})

router.post('/update', loginCheck, (req, res, next) => {
  const result = updateBlog(req.body.id, req.body)
  result.then(val => res.json(val ? new SuccessModel() : new ErrorModel('更新博客失败')))
})

router.post('/del', loginCheck, (req, res, next) => {
  author = req.session.username
  const result = delBlog(req.body.id, author)
  result.then(val => res.json(val ? new SuccessModel() : new ErrorModel('删除博客失败')))
})

module.exports = router