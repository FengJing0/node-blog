const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {
  const { method, path, query } = req
  const { id } = query

  if (method === 'GET' && path === '/api/blog/list') {
    const author = query.author || ''
    const keyword = query.keyword || ''
    // const listData = getList(author, keyword)

    // return new SuccessModel(listData)
    const result = getList(author, keyword)
    return result.then(listData => new SuccessModel(listData))
  }

  if (method === 'GET' && path === '/api/blog/detail') {
    const result = getDetail(id)

    return result.then(data => new SuccessModel(data))
  }

  if (method === 'POST' && path === '/api/blog/new') {
    const author = 'zhangsan'
    req.body.author = author

    const result = newBlog(req.body)
    return result.then(data => new SuccessModel(data))
  }

  if (method === 'POST' && path === '/api/blog/update') {
    const result = updateBlog(id, req.body)
    return result.then(val => val ? new SuccessModel() : new ErrorModel('更新博客失败'))
  }

  if (method === 'POST' && path === '/api/blog/del') {
    const author = 'zhangsan'
    const result = delBlog(id, author)
    return result.then(val => val ? new SuccessModel() : new ErrorModel('删除博客失败'))
  }

}

module.exports = handleBlogRouter