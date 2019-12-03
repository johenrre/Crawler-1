const log = require('./log')
const fs = require('fs')
const pathLib = require('path')

/**
 * 读取路径信息
 * @param {string} path 路径
 */
function getStat (path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false)
      } else {
        resolve(stats)
      }
    })
  })
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir (dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
async function dirExists (dir) {
  let isExists = await getStat(dir)
  //如果该路径且不是文件，返回true
  if (isExists && isExists.isDirectory()) {
    return true
  } else if (isExists) {
    //如果该路径存在但是文件，返回false
    return false
  }
  //如果该路径不存在
  let tempDir = pathLib.parse(dir).dir //拿到上级路径
  //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  let status = await dirExists(tempDir)
  let mkdirStatus
  if (status) {
    mkdirStatus = await mkdir(dir)
  }
  return mkdirStatus
}

/**
 *  根据path写入数据，如果目录没找到，会去创建
 */
const writeToFile = async function (path, data) {
  const d = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
  const dir = path
    .split('/')
    .slice(0, -1)
    .join('/')

  await dirExists(dir)
  fs.writeFile(path, d, function (error) {
    if (!error) {
      // log('--- 写入成功', path)
    } else {
      log('*** 写入失败', path)
    }
  })
}

module.exports = writeToFile
