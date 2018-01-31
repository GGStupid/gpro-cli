const download = require('download-git-repo')
const path = require('path')

module.exports = function (opts) {
  opts = path.join(opts || '.', '.download-temp')
  return new Promise(function (resolve, reject) {
    download('https://github.com:GGStupid/react-webpack#master', opts, { clone: true }, err => {
      if (err) {
        reject(err)
      } else {
        resolve('success')
      }
    })
  })
}