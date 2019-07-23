const writeToFile = require('./writeToFile')
const log = require('./log')

const cachedUrl = (options, callback) => {
  const fs = require('fs')
  const request = require('request')
  // 解决路基问题
  const pathLib = require('path')
  // 处理编码格式问题
  const iconv = require('iconv-lite')

  const url = options.url
    .split('/')
    .join('-')
    .split(':')
    .join('-')
  const path = pathLib.join(__dirname, `../cache/${url}`)
  fs.readFile(path, function(err, data) {
    if (err != null) {
      request(options, function(error, response, body) {
        //进行解码
        const bufs = iconv.decode(body, 'GBK')
        //转为utf8
        const b = bufs.toString('utf8')
        writeToFile(path, b)
        callback(error, response, b)
      })
    } else {
      log('读取到缓存的页面', path)
      const response = {
        statusCode: 200
      }
      callback(null, response, data)
    }
  })
}

module.exports = cachedUrl
