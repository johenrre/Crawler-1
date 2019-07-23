const nzhcn = require('chinese2num')

function zhDigit2Arabic(digit) {
  return nzhcn(digit)
}

module.exports = zhDigit2Arabic
