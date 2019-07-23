'use strict'
// 如果没有这一行, 就没办法使用一些 let const 这样的特性

const cheerio = require('cheerio')
const { log, cachedUrl, writeToFile } = require('../utils/index')
const dirForNovelId = require('./dirForNovelId')
const { headers } = require('./headers')
const pathLib = require('path')
// const fs = require('fs')

const novelFromBody = body => {
  const options = {
    decodeEntities: false
  }
  const e = cheerio.load(body, options)
  const divs = e('#content')

  return divs.text()
}

const __main = function() {
  const novelId = '24276'
  // 获取目录
  dirForNovelId(novelId, dirs => {
    for (let i = 813; i < dirs.length; i++) {
      const t = dirs[i]
      const options = {
        url: t.url,
        encoding: null,
        headers: headers
      }
      // 根据目录url获取网页
      cachedUrl(options, function(error, response, body) {
        if (error === null && response.statusCode == 200) {
          // 从网页过滤出小说
          const path = pathLib.join(
            __dirname,
            `./novelData/${novelId}/${t.title}.txt`
          )

          // fs.exists(path)
          const novel = novelFromBody(body).slice(42)
          // 保存小说
          writeToFile(path, novel)
        } else {
          log('*** ERROR 请求失败 ', error)
        }
      })
    }
  })
}

// 程序开始的主函数
__main()
