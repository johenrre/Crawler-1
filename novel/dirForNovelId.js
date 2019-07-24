const { cachedUrl, log, saveJSON, zhDigit2Arabic } = require('../utils/index')
const { headers } = require('./headers')
const cheerio = require('cheerio')
const pathLib = require('path')
const fs = require('fs')
const request = require('request')
const iconv = require('iconv-lite')

function Chapter() {
  this.title = ''
  this.url = ''
  this.origetitle = ''
}

// 笔趣网地址
const baseUrl = 'https://www.xbiquge.cc/book/'

let NovelId = ''

const chapterFromDiv = div => {
  const a = new Chapter()
  const options = {
    decodeEntities: false
  }
  const e = cheerio.load(div, options)
  const t = e('a').text()
  const href = e('a').attr('href')

  if (!t || !href) {
    return null
  }

  if (
    t.indexOf('第') == -1 ||
    t.indexOf('章') == -1 ||
    t.indexOf('敬请期待') != -1
  ) {
    log('无效章节', t)
    return null
  }

  a.origetitle = t

  a.title = zhDigit2Arabic(t.split(' ')[0].slice(1, -1)) + t.split(' ')[1]

  a.url = baseUrl + NovelId + '/' + href

  return a
}

const novelFromBody = body => {
  // cheerio.load 用字符串作为参数返回一个可以查询的特殊对象
  const options = {
    decodeEntities: false
  }
  const e = cheerio.load(body, options)
  const divs = e('dd')

  const chapters = []
  // console.log('test', divs)
  for (let i = 0; i < divs.length; i++) {
    let element = divs[i]
    // 获取 div 的元素并且用 movieFromDiv 解析
    // 然后加入 movies 数组中
    const div = e(element).html()
    const m = chapterFromDiv(div)
    m && chapters.push(m)
  }
  return chapters
}

const dirForNovelId = (novelId, callback) => {
  NovelId = novelId
  const url = baseUrl + novelId + '/'
  const options = {
    url: url,
    encoding: null,
    headers: headers
  }
  const path = pathLib.join(__dirname, `./${novelId}novelDir.txt`)

  request(options, function(error, response, body) {
    //进行解码
    const bufs = iconv.decode(body, 'GBK')
    //转为utf8
    const data = bufs.toString('utf8')
    if (error === null && response.statusCode == 200) {
      const chapters = novelFromBody(data)
      saveJSON(path, chapters)
      callback(chapters)
    } else {
      log('*** ERROR 请求失败 ', error)
    }
  })
}

module.exports = dirForNovelId
