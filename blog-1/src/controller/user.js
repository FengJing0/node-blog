const { exec, escape} = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = (username, password) => {
  password = genPassword(password)

  
  username = escape(username)
  password = escape(password)


  const sql = `select username,realname from users where username=${username} and password=${password};`
  return exec(sql).then(rows=>rows[0]||{})
}

module.exports = {
  login
}