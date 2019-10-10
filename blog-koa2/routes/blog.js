const router = require('koa-router')()

const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''

  if (ctx.query.isadmin) {
    if (!ctx.session.username) {
      ctx.body = new ErrorModel('未登录')
      return
    }
    author = ctx.session.username
  }

  const listData = await getList(author, keyword)

  ctx.body = new SuccessModel(listData)
})

router.get('/detail', async (ctx, next) => {
  const { id } = ctx.query
  const data = await getDetail(id)
  ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async (ctx, next) => {
  const body = ctx.request.body
  body.author = ctx.session.username
  const data = await newBlog(body)
  ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async (ctx, next) => {
  const val = await updateBlog(ctx.request.body.id, ctx.request.body)
  ctx.body = val ? new SuccessModel() : new ErrorModel('更新博客失败')
})

router.post('/del', loginCheck, async (ctx, next) => {
  author = ctx.session.username
  const val = await delBlog(ctx.request.body.id, author)
  ctx.body = val ? new SuccessModel() : new ErrorModel('删除博客失败')
})

module.exports = router
