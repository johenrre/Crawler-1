'use strict'
// 如果没有这一行, 就没办法使用一些 let const 这样的特性

const request = require('request')
const cheerio = require('cheerio')
const { headers } = require('./headers')

// 定义一个类来保存回答的信息
// 这里只定义了 4 个要保存的数据
// 分别是  问题 作者 内容 链接
function Answer() {
  this.question = ''
  this.author = ''
  this.content = ''
  this.link = ''
}

const log = function() {
  console.log.apply(console, arguments)
}

const answerFromDiv = function(div) {
  // 这个函数来从一个回答 div 里面读取回答信息
  const a = new Answer()
  // 使用 cheerio.load 函数来返回一个可以查询的特殊对象
  // 使用这个 options 才能使用 html() 函数来获取带回车的文本信息
  const options = {
    decodeEntities: false
  }
  const e = cheerio.load(div, options)
  // 然后就可以使用 querySelector 语法来获取信息了
  // .text() 获取文本信息

  a.question = e('.question_link').text()

  a.content = e('.zm-item-rich-text').html()

  a.author = e('.zm-item-rich-text').attr('data-author-name')

  a.link = 'https://zhihu.com' + e('.zm-item-rich-text').attr('data-entry-url')

  //log('answerFromDiv a.author = ', a.link)
  // a.author = e('.author-link-line > .author-link').text()
  // // 如果用 text() 则会获取不到回车
  // a.content = e('.zm-editable-content').html()
  // //
  // a.link = 'https://zhihu.com' + e('.answer-date-link').attr('href')
  // a.numberOfComments = e('.toggle-comment').text()
  // log('***  ', a.content)
  return a
}

const answersFromBody = function(body) {
  // cheerio.load 用字符串作为参数返回一个可以查询的特殊对象
  const options = {
    decodeEntities: false
  }
  const e = cheerio.load(body, options)
  // 查询对象的查询语法和 DOM API 中的 querySelector 一样
  const divs = e('.feed-item-hook')
  //log('answersFromBody divs', divs)

  // let element = divs[0]
  // const div = e(element).html()
  // const m = answerFromDiv(div)
  //
  const answers = []
  // answers.push(m)
  for (let i = 0; i < divs.length; i++) {
    let element = divs[i]
    // 获取 div 的元素并且用 movieFromDiv 解析
    // 然后加入 movies 数组中
    const div = e(element).html()
    const m = answerFromDiv(div)
    answers.push(m)
  }
  return answers
}

const writeToFile = function(path, data) {
  const d = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
  const fs = require('fs')
  fs.writeFile(path, d, function(error) {
    if (!error) {
      log('--- 写入成功', path)
    } else {
      log('*** 写入失败', path)
    }
  })
}

const cachedUrl = function(options, callback) {
  const fs = require('fs')
  // 先生成对应的文件
  const path = options.url
    .split('/')
    .join('-')
    .split(':')
    .join('-')
  // 先尝试去硬盘中读取这个 url 对应的文件
  fs.readFile(path, function(err, data) {
    if (err != null) {
      // 读取这个文件失败
      // 读不到的话说明是第一次请求，那么就使用 request
      request(options, function(error, response, body) {
        // 下载好了之后，保存到本地文件
        // TODO, 应该下载成功之后再保存
        writeToFile(path, body)
        callback(error, response, body)
      })
    } else {
      log('读取到缓存的页面', path)
      // 读取到，说明已经下载过了，我们讲直接读取硬盘上的文件
      const response = {
        statusCode: 200
      }
      callback(null, response, data)
    }
  })
}

const __main = function(number) {
  // 这是主函数
  // 知乎答案
  const url = 'https://www.zhihu.com/topic/19550901/top-answers?page=' + number
  // request 从一个 url 下载数据并调用回调函数
  // 根据 伪装登录爬虫设置图例 替换 cookie 和 useragent 中的内容
  // 这里 useragent 我已经替换好了, 替换上你自己的 cookie 就好了
  const options = {
    url: url,
    headers: headers
  }
  cachedUrl(options, function(error, response, body) {
    // 回调函数的三个参数分别是  错误, 响应, 响应数据
    // 检查请求是否成功, statusCode 200 是成功的代码
    if (error === null && response.statusCode == 200) {
      const answers = answersFromBody(body)

      // 引入自己写的模块文件
      // ./ 表示当前目录
      const utils = require('./utils')
      const path = 'zhihu.answers' + number + '.txt'
      utils.saveJSON(path, answers)
    } else {
      log('*** ERROR 请求失败 ', error)
    }
  })
}

// 程序开始的主函数

// var i = 2
// setInterval(function() {
//     __main(i++)
// }, 2000)

const getUrl = (api, params) => {
  const p = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  return api + '?' + p
}

const main = () => {
  const api = 'https://www.zhihu.com/api/v4/members/xiao-jing-mo/answers'
  const params = {
    include:
      'data%5B*%5D.is_normal%2Cadmin_closed_comment%2Creward_info%2Cis_collapsed%2Cannotation_action%2Cannotation_detail%2Ccollapse_reason%2Ccollapsed_by%2Csuggest_edit%2Ccomment_count%2Ccan_comment%2Ccontent%2Cvoteup_count%2Creshipment_settings%2Ccomment_permission%2Cmark_infos%2Ccreated_time%2Cupdated_time%2Creview_info%2Cquestion%2Cexcerpt%2Cis_labeled%2Clabel_info%2Crelationship.is_authorized%2Cvoting%2Cis_author%2Cis_thanked%2Cis_nothelp%2Cis_recognized%3Bdata%5B*%5D.author.badge%5B%3F(type%3Dbest_answerer)%5D.topics',
    offset: 20,
    limit: 20,
    sort_by: 'created'
  }
  const url = getUrl(api, params)
  const options = {
    url: url,
    headers: headers
  }
  request(options, (error, response, body) => {
    if (error === null && response.statusCode == 200) {
      const d = JSON.parse(body)
      // writeToFile('log.json', d)
    } else {
      log('*** ERROR 请求失败 ', error)
    }
  })
}

main()
