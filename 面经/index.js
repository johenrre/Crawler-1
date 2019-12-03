const request = require('request')
const cheerio = require('cheerio')
const { headers } = require('./headers')
const { writeToFile, saveJSON } = require('../utils')

const log = function () {
  console.log.apply(console, arguments)
}

const cachedUrl = function (options, callback) {
  const fs = require('fs')
  // 先生成对应的文件
  const path = './cache/' + options.url
    .split('/')
    .join('-')
    .split(':')
    .join('-') + '.html'
  // 先尝试去硬盘中读取这个 url 对应的文件
  fs.readFile(path, function (err, data) {
    if (err != null) {
      // 读取这个文件失败
      // 读不到的话说明是第一次请求，那么就使用 request
      request(options, function (error, response, body) {
        // 下载好了之后，保存到本地文件
        writeToFile(path, body)
        callback(error, response, body, path)
      })
    } else {
      // log('读取到缓存的页面', path)
      // 读取到，说明已经下载过了，我们讲直接读取硬盘上的文件
      const response = {
        statusCode: 200
      }
      callback(null, response, data, path)
    }
  })
}

/**
 * @param type  后端 / 前端 / 其他
 */
const articleNode = {
  type: '',
  fileName: '',
  id: '',
  title: '',
  isLin: '',
}

const articleFromBody = (body, fileName, id) => {
  const options = {
    decodeEntities: false
  }
  const article = Object.assign({}, articleNode)
  const e = cheerio.load(body, options)
  const title = e('.gua-title').text()
  const comments = e('#id-block-comment')
  let isLin = false
  comments.children().each(function (i, elem) {
    const commentName = e('.gua-avatar', elem).next().text()
    if (commentName.indexOf('lin') !== -1) {
      isLin = true
    }
  })

  article.type = title.indexOf('前端') !== -1 ? '前端' : title.indexOf('后端') !== -1 ? '后端' : '其他'
  article.fileName = fileName
  article.id = id
  article.title = title
  article.isLin = isLin
  article.url = 'https://www.kuaibiancheng.com/topics/' + id

  return article
}


const main = () => {
  const baseUrl = 'https://www.kuaibiancheng.com/topics/'
  // const id = '600'
  const articleList = []


  for (let i = 1000; i < 1147; i++) {
    let id = i
    const url = baseUrl + id
    const options = {
      url: url,
      headers: headers
    }

    cachedUrl(options, (error, response, body, path) => {
      if (error === null && response.statusCode == 200) {
        const article = articleFromBody(body, path, id)
        articleList.push(article)
        if (id == 1146) {
          saveJSON('test', articleList)
        }
        // log('成功缓存')
      } else {
        log('*** ERROR 请求失败 ', error)
      }
    })
  }
}


main()