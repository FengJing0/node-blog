const crypto = require('crypto')

const SECRET_KEY = 'QFlo_+4392#*'

function md5(content) {
  let md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex')
}

function genPassword(password) {
  return md5(`password=${password}&key=${SECRET_KEY}`)
}

module.exports = {
  genPassword
}