const { exec, escape} = require('../db/mysql')
const xss=require('xss')

const getList = (author, keyword) => {
  let sql = `select id,title,content,createtime,author from blogs where 1=1 `

  if (author) {
    author = escape(author)
    sql += `and author=${author} `
  }

  if (keyword) {
    keyword = escape(keyword)
    sql += `and title like '%'${keyword}'%' `
  }

  sql += 'order by createtime desc;'

  return exec(sql)
}

const getDetail = id => {
  id = escape(id)
  const sql = `select id,title,content,createtime,author from blogs where id=${id};`
  return exec(sql).then(rows => rows[0])
}

const newBlog = (blogData = {}) => {
  let { title, content, author } = blogData
  const createtime = +new Date()
  title = escape(xss(title))
  content = escape(xss(content))
  author = escape(author)
  const sql = `insert into blogs (title,content,createtime,author) values (${title},${content},'${createtime}',${author});`

  return exec(sql).then(insertData => ({ id: insertData.insertId }))
}

const updateBlog = (id, blogData = {}) => {
  const { title, content } = blogData
  id = escape(id)
  title = escape(xss(title))
  content = escape(xss(content))
  const sql = `update blogs set title=${title},content=${content} where id=${id};`

  return exec(sql).then(updateData => updateData.affectedRows > 0)
}

const delBlog = (id, author) => {
  id = escape(id)
  author = escape(author)
  const sql = `delete from blogs where id=${id} and author=${author};`

  return exec(sql).then(delData => delData.affectedRows > 0)
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}