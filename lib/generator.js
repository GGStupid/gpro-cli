const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const rm = require('rimraf').sync

module.exports = function (metadata = {}, src, dest = '/Users/gg_stupid/personProjects/pro-cli/test') {
  if (!src) {
    return Promise.reject(new Error(`无效的source:${src}`))
  }
  return new Promise((resolve, reject) => {
    Metalsmith(process.cwd())
      .metadata(metadata)
      .source(src)
      .destination(dest)
      .clean(false)
      .use((files, metalsmith, done) => {
        console.log('-------', metalsmith)
        const meta = metalsmith.metadata()
        Object.keys(files).forEach(fileName => {
          if (fileName === 'package.json') {
            const t = files[fileName].contents.toString()
            files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
          }
        })
        done()
      }).build(err => {
        rm(src)
        err ? reject(err) : resolve('generator success')
      })
  })
}
