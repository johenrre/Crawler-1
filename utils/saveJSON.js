/**
 * 这个函数用来把一个保存了所有对象的数组保存到文件中
 * @param {路径} path 
 * @param {对象} object 
 * @param {提示信息} message 
 */
const saveJSON = function (path, object, message = '') {
  // 这个函数用来把一个保存了所有对象的数组保存到文件中
  const fs = require('fs')
  const s = JSON.stringify(object, null, 2)
  fs.writeFile(path, s, function (error) {
    if (error !== null) {
      console.log(`*** ${message}写入文件错误`, error)
    } else {
      console.log(`--- ${message}保存成功`)
    }
  })
}
/*
通过 exports 制作自己的模块
*/
module.exports = saveJSON
