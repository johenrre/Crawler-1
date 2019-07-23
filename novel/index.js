'use strict'
// 如果没有这一行, 就没办法使用一些 let const 这样的特性

// const request = require('request')
// const cheerio = require('cheerio')
// const { headers } = require('./headers')
const dirForNovelId = require('./dirForNovelId')

const __main = function() {
  const novelId = '24276'
  // 获取目录
  dirForNovelId(novelId)
  // 根据目录url获取网页
  // 从网页过滤出小说
  // 保存小说
}

// 程序开始的主函数
__main()
