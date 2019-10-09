const fs = require('fs')
const path = require('path')
const readline = require('readline')

const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log')

const readStream = fs.createReadStream(fileName)

const rl = readline.createInterface({
  input: readStream
})

let chromeNum = 0
let num = 0

rl.on('line', lineData => {
  if (!lineData) return

  sum++
  const arr = lineData.split('--')
  if (arr[2] && arr[2].indexOf('Chrom') > 0) {
    chromeNum++
  }
})

rl.on('close', () => {
  console.log(chromeNum / num);

})