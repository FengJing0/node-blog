const { exec, escape } = require('../db/mysql')
const xss = require('xss')

const getList = async (author, keyword) => {
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

  return await exec(sql)
}

const getDetail = async id => {
  id = escape(id)
  const sql = `select id,title,content,createtime,author from blogs where id=${id};`
  const rows = await exec(sql)
  return rows[0]
}

const newBlog = async (blogData = {}) => {
  let { title, content, author } = blogData
  const createtime = +new Date()
  title = escape(xss(title))
  content = escape(xss(content))
  author = escape(author)
  const sql = `insert into blogs (title,content,createtime,author) values (${title},${content},'${createtime}',${author});`

  const insertData = await exec(sql)

  return { id: insertData.insertId }
}

const updateBlog = async (id, blogData = {}) => {
  const { title, content } = blogData
  id = escape(id)
  title = escape(xss(title))
  content = escape(xss(content))
  const sql = `update blogs set title=${title},content=${content} where id=${id};`

  const updateData = await exec(sql)
  return updateData.affectedRows > 0
}

const delBlog = async (id, author) => {
  id = escape(id)
  author = escape(author)
  const sql = `delete from blogs where id=${id} and author=${author};`

  const delData = await exec(sql)
  return delData.affectedRows > 0
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}