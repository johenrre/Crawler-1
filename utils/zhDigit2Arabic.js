const nzhcn = require('chinese2num')

/**
 * 中文数字转阿拉伯数字
 * @param {digit} 中文数字
 */
function zhDigit2Arabic (digit) {
  return nzhcn(digit)
}

module.exports = zhDigit2Arabic
