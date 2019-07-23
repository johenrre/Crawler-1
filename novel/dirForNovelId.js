const { cachedUrl, log } = require('../utils/index')
const { headers } = require('./headers')
const cheerio = require('cheerio')

function novel() {
  this.title = ''
  this.url = ''
}

const novelFromBody = body => {
  // cheerio.load 用字符串作为参数返回一个可以查询的特殊对象
  const options = {
    decodeEntities: false
  }
  const e = cheerio.load(body, options)
  const divs = e('.feed-item-hook')
}

const dirForNovelId = novelId => {
  const url = 'https://www.xbiquge.cc/book/' + novelId + '/'
  const options = {
    url: url,
    encoding: null,
    headers: headers
  }

  cachedUrl(options, function(error, response, body) {
    if (error === null && response.statusCode == 200) {
      const answers = novelFromBody(body)

      // // 引入自己写的模块文件
      // // ./ 表示当前目录
      // const utils = require('./utils')
      // const path = 'zhihu.answers' + number + '.txt'
      // utils.saveJSON(path, answers)
    } else {
      log('*** ERROR 请求失败 ', error)
    }
  })
}

module.exports = dirForNovelId
