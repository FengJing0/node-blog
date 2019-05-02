const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const loginCheck = req => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('尚未登陆'))
  }
  
}

const handleBlogRouter = (req, res) => {
  const { method, path, query } = req
  const { id } = query

  if (method === 'GET' && path === '/api/blog/list') {
    let author = query.author || ''
    const keyword = query.keyword || ''

    if (query.isadmin) {
      const loginCheckResult = loginCheck(req)
      if (loginCheckResult) {
        return loginCheckResult
      }
      author = res.session.username
    }
    
    const result = getList(author, keyword)
    return result.then(listData => new SuccessModel(listData))
  }

  if (method === 'GET' && path === '/api/blog/detail') {
    const result = getDetail(id)

    return result.then(data => new SuccessModel(data))
  }

  if (method === 'POST' && path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }
    
    req.body.author = res.session.username

    const result = newBlog(req.body)
    return result.then(data => new SuccessModel(data))
  }

  if (method === 'POST' && path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }
    const result = updateBlog(id, req.body)
    return result.then(val => val ? new SuccessModel() : new ErrorModel('更新博客失败'))
  }

  if (method === 'POST' && path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }
    req.body.author = res.session.username
    const result = delBlog(id, author)
    return result.then(val => val ? new SuccessModel() : new ErrorModel('删除博客失败'))
  }

}

module.exports = handleBlogRouter