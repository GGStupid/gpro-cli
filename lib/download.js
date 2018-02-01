const download = require('download-git-repo')
const path = require('path')
const ora = require('ora')

module.exports = function (opts) {
  opts = path.join(opts || '.', '.download-temp')
  return new Promise(function (resolve, reject) {
    const spinner = ora('正在下载项目模板……')
    spinner.start()
    download('https://github.com:GGStupid/react-webpack#master', opts, { clone: true }, err => {
      if (err) {
        spinner.fail('下载失败')
        reject(err)
      } else {
        spinner.succeed('下载成功')
        resolve('success')
      }
    })
  })
}