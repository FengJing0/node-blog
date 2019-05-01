const env = process.env.NODE_ENV

let MYSQL_CONF

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'Fj/20100314--',
    port: '3306',
    database:'node-blog'
  }
}

if (env === 'production') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'Fj/20100314--',
    port: '3306',
    database: 'node-blog'
  }
}

module.exports = {
  MYSQL_CONF
}